export const config = { runtime: 'edge' };

const BOT_AGENTS = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver|twitterbot|linkedinbot|whatsapp|telegrambot|applebot/i;

function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Converte markdown para texto legível por crawlers
function mdToText(md) {
    if (!md) return '';
    return md
        .replace(/```[\s\S]*?```/g, '')
        .replace(/#{1,6}\s+(.+)/gm, '$1')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

export default async function handler(request) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = BOT_AGENTS.test(userAgent);

    // Extrai slug do path original (/blog/:slug)
    const pathParts = url.pathname.split('/').filter(Boolean);
    const slug = pathParts[1]; // /blog/:slug

    // Usuário normal → serve SPA normalmente
    if (!isBot || !slug) {
        const spa = await fetch(`${url.origin}/`, {
            headers: { 'user-agent': 'internal-spa-passthrough' }
        });
        return new Response(spa.body, {
            status: spa.status,
            headers: { 'content-type': 'text/html; charset=utf-8' }
        });
    }

    try {
        // Busca artigos da API Cloudflare
        const apiRes = await fetch('https://natuclinic-api.fabriccioarts.workers.dev/articles');
        const articles = await apiRes.json();

        const normalized = slug.toLowerCase().replace(/\/$/, '');
        const article = articles.find(a => {
            const aId = String(a.id || '').toLowerCase().replace(/\/$/, '');
            const aSlug = String(a.slug || '').toLowerCase().replace(/\/$/, '');
            return aId === normalized || aSlug === normalized;
        });

        // Artigo não encontrado → serve SPA
        if (!article) {
            const spa = await fetch(`${url.origin}/`);
            return new Response(spa.body, {
                headers: { 'content-type': 'text/html; charset=utf-8' }
            });
        }

        const title = esc(article.title);
        const description = esc(article.meta_description || article.excerpt || '');
        const image = article.image?.startsWith('http')
            ? article.image
            : `https://natuclinic.com.br${article.image || '/og-default.jpg'}`;
        const canonicalUrl = `https://natuclinic.com.br/blog/${article.slug || article.id}`;
        const keywords = esc(article.meta_keywords || '');
        const author = esc(article.author_name || 'Equipe Natuclinic');
        const date = esc(article.date || '');

        // Converte markdown em parágrafos para os crawlers
        const paragraphs = mdToText(article.content)
            .split('\n')
            .filter(l => l.trim())
            .map(l => `<p>${esc(l)}</p>`)
            .join('\n');

        const jsonLd = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.meta_description || article.excerpt,
            image,
            datePublished: article.date,
            author: { '@type': 'Person', name: article.author_name || 'Equipe Natuclinic' },
            publisher: {
                '@type': 'Organization',
                name: 'Natuclinic',
                url: 'https://natuclinic.com.br',
                logo: { '@type': 'ImageObject', url: 'https://natuclinic.com.br/logo-natuclinic.png' }
            },
            url: canonicalUrl,
            mainEntityOfPage: canonicalUrl
        });

        const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Natuclinic</title>
  <meta name="description" content="${description}" />
  ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title} | Natuclinic" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="Natuclinic - Clínica de Estética em Brasília" />
  <meta property="og:locale" content="pt_BR" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <header>
    <a href="https://natuclinic.com.br">Natuclinic — Estética e Nutrição Ortomolecular em Brasília</a>
  </header>
  <main>
    <article>
      <h1>${title}</h1>
      ${article.excerpt ? `<p><strong>${esc(article.excerpt)}</strong></p>` : ''}
      <p>Por ${author} · ${date}</p>
      ${paragraphs}
    </article>
    <nav>
      <a href="https://natuclinic.com.br/blog">← Voltar ao Blog</a>
    </nav>
  </main>
</body>
</html>`;

        return new Response(html, {
            headers: {
                'content-type': 'text/html; charset=utf-8',
                'cache-control': 'public, s-maxage=3600, stale-while-revalidate=86400'
            }
        });

    } catch {
        const spa = await fetch(`${url.origin}/`);
        return new Response(spa.body, {
            headers: { 'content-type': 'text/html; charset=utf-8' }
        });
    }
}
