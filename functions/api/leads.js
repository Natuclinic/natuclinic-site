// Cloudflare Pages Function: POST /api/leads
export async function onRequestPost(context) {
    const { env, request } = context;

    try {
        const body = await request.json();
        const { name, email, phone, source } = body;

        if (!name || !email || !phone) {
            return new Response(JSON.stringify({ error: "Missing fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        await env.DB.prepare(
            "INSERT INTO leads (name, email, phone, source) VALUES (?, ?, ?, ?)"
        )
            .bind(name, email, phone, source || 'website')
            .run();

        return new Response(JSON.stringify({ success: true }), {
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

// Handle OPTIONS for CORS
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
