import fs from 'fs';
import path from 'path';

// Define the base URL of the website
const BASE_URL = 'https://www.natuclinic.com.br';

// Define static routes
const staticRoutes = [
    '/',
    '/sobre',
    '/contato',
    '/blog',
    '/procedimentos',
    '/procedimentos/soroterapia',
    '/procedimentos/harmonizacao-corporal',
    '/procedimentos/harmonizacao',
    '/procedimentos/nutricao-ortomolecular',
    '/procedimentos/hipro',
    '/gluteo-dos-sonhos',
    '/politica-de-privacidade'
];

// Read articles.jsx to extract blog slugs
const articlesPath = path.join(process.cwd(), 'src', 'data', 'articles.jsx');
let articleSlugs = [];

try {
    const articlesContent = fs.readFileSync(articlesPath, 'utf8');
    // Simple regex to match "slug": "some-slug"
    const slugRegex = /"slug":\s*"([^"]+)"/g;
    let match;
    while ((match = slugRegex.exec(articlesContent)) !== null) {
        const slug = match[1];
        // Validate slug
        const isValid = slug !== 'sidebar-ad-global'
            && slug.length >= 5
            && !slug.startsWith('-')
            && /^[a-z0-9-]+$/.test(slug);
            
        if (isValid) {
            articleSlugs.push(slug);
        }
    }
} catch (error) {
    console.error('Error reading articles.jsx:', error);
}

// Generate XML content
const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static routes
staticRoutes.forEach(route => {
    // Determine priority
    let priority = '0.8';
    if (route === '/') priority = '1.0';
    if (route.startsWith('/procedimentos')) priority = '0.9';

    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${route}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;
    xml += `  </url>\n`;
});

// Add dynamic blog routes
articleSlugs.forEach(slug => {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/blog/${slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
});

xml += `</urlset>`;

// Write to public/sitemap.xml
const publicPath = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
}

const sitemapPath = path.join(publicPath, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`✅ Sitemap successfully generated at public/sitemap.xml`);
console.log(`Included ${staticRoutes.length} static routes and ${articleSlugs.length} blog articles.`);
