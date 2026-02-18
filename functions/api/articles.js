// Cloudflare Pages Function: GET /api/articles
export async function onRequest(context) {
    const { env } = context;

    // DB is the binding name you'll set in Cloudflare Dashboard for D1
    try {
        const { results } = await env.DB.prepare(
            "SELECT * FROM articles ORDER BY created_at DESC"
        ).all();

        return new Response(JSON.stringify(results), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
