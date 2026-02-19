

export default async function handler(req, res) {
    const API_URL = 'https://natuclinic-api.fabriccioarts.workers.dev/articles';

    try {
        // Fetch all articles from Cloudflare D1
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch articles from Cloudflare');
        const articles = await response.json();

        // Generate XML content
        const baseUrl = 'https://natuclinic.com.br'; // Adjust to your actual domain
        const staticPages = [
            '',
            '/procedimentos',
            '/procedimentos/ninfoplastia',
            '/procedimentos/endolaser',
            '/procedimentos/harmonizacao',
            '/procedimentos/harmonizacao-facial',
            '/blog',
            // Add other static routes as needed
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
                .map((page) => {
                    return `
            <url>
              <loc>${baseUrl}${page}</loc>
              <changefreq>weekly</changefreq>
              <priority>${page === '' ? 1.0 : 0.8}</priority>
            </url>
          `;
                })
                .join('')}
      ${articles
                .map((post) => {
                    const slug = post.slug || post.id;
                    const lastMod = post.updated_at || post.created_at || new Date().toISOString();
                    return `
            <url>
              <loc>${baseUrl}/blog/${slug}</loc>
              <lastmod>${new Date(lastMod).toISOString()}</lastmod>
              <changefreq>monthly</changefreq>
              <priority>0.7</priority>
            </url>
          `;
                })
                .join('')}
    </urlset>`;

        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate'); // Cache for 1 day
        res.status(200).send(sitemap);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate sitemap' });
    }
}
