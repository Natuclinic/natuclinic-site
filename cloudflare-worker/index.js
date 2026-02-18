export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS Headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        // Handle CORS Preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // GET /articles
        if (url.pathname === "/articles" && request.method === "GET") {
            try {
                const { results } = await env.DB.prepare(
                    "SELECT * FROM articles ORDER BY created_at DESC"
                ).all();
                return new Response(JSON.stringify(results), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
        }

        // POST /leads
        if (url.pathname === "/leads" && request.method === "POST") {
            try {
                const body = await request.json();
                const { name, email, phone, source } = body;

                if (!name || !email || !phone) {
                    return new Response(JSON.stringify({ error: "Missing fields" }), {
                        status: 400,
                        headers: { ...corsHeaders, "Content-Type": "application/json" }
                    });
                }

                await env.DB.prepare(
                    "INSERT INTO leads (name, email, phone, source) VALUES (?, ?, ?, ?)"
                )
                    .bind(name, email, phone, source || 'website')
                    .run();

                return new Response(JSON.stringify({ success: true }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
        }

        return new Response("Not Found", { status: 404, headers: corsHeaders });
    },
};
