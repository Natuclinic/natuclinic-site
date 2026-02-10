
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Use environment variables (make sure to set these in Vercel project settings)
    const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://dkjgskucppssvjvucmqy.supabase.co';
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRramdza3VjcHBzc3ZqdnVjbXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDA2NjAsImV4cCI6MjA3OTkxNjY2MH0.NqwEUwOdm2XZjPiDyfZnpB97CPWOP_yC1Z6coM4MVGo';

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Supabase credentials not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Fetch all articles
        const { data: articles, error } = await supabase
            .from('articles')
            .select('id, slug, updated_at, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

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
