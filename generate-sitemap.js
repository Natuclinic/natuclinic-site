import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const DOMAIN = 'https://natuclinic.com.br';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = path.join(__dirname, 'src', 'data', 'articles.jsx');
const OUTPUT_FILE = path.join(__dirname, 'public', 'sitemap.xml');

// Static Routes
const staticRoutes = [
    '',
    '/procedimentos',
    '/procedimentos/ninfoplastia',
    '/procedimentos/endolaser',
    '/procedimentos/harmonizacao',
    '/procedimentos/harmonizacao-facial',
    '/blog',
    '/gluteo-dos-sonhos',
    '/politica-de-privacidade'
];

async function generateSitemap() {
    console.log("🗺️ Gerando sitemap.xml...");

    let urls = [...staticRoutes];

    try {
        // Read articles to add dynamic routes
        if (fs.existsSync(ARTICLES_PATH)) {
            // We use a simple regex to extract slugs since we can't easily import JSX/ESM here without extra setup
            const content = fs.readFileSync(ARTICLES_PATH, 'utf-8');
            const slugMatches = content.match(/"slug":\s*"([^"]+)"/g);

            if (slugMatches) {
                const slugs = slugMatches.map(m => m.match(/"slug":\s*"([^"]+)"/)[1]);
                slugs.forEach(slug => {
                    // Filtra slugs inválidos: internos, muito curtos, começando com traço, ou com caracteres especiais
                    const isValid = slug !== 'sidebar-ad-global'
                        && slug.length >= 5
                        && !slug.startsWith('-')
                        && /^[a-z0-9-]+$/.test(slug); // só letras minúsculas, números e traços
                    if (isValid) {
                        urls.push(`/blog/${slug}`);
                    }
                });
            }
        }

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `    <url>
        <loc>${DOMAIN}${url}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${url === '' ? 'daily' : 'weekly'}</changefreq>
        <priority>${url === '' ? '1.0' : (url.startsWith('/procedimentos') ? '0.9' : '0.7')}</priority>
    </url>`).join('\n')}
</urlset>`;

        fs.writeFileSync(OUTPUT_FILE, sitemap);
        console.log(`✅ Sitemap gerado com sucesso em: ${OUTPUT_FILE}`);
        console.log(`🔗 Total de URLs: ${urls.length}`);

    } catch (err) {
        console.error("❌ Erro ao gerar sitemap:", err.message);
    }
}

generateSitemap();
