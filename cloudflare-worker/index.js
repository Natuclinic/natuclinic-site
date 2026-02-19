export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS Headers
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-Custom-Auth",
            "Access-Control-Max-Age": "86400",
        };

        // Handle CORS Preflight for ALL routes
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // Health check / debug route
        if (url.pathname === "/health") {
            return new Response(JSON.stringify({
                status: "ok",
                r2: env.IMAGES ? "connected" : "NOT BOUND",
                db: env.DB ? "connected" : "NOT BOUND",
                timestamp: new Date().toISOString()
            }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }

        // Handle Article Routes
        if (url.pathname.startsWith("/articles")) {
            const pathParts = url.pathname.split('/');
            const articleId = pathParts[2]; // /articles/:id

            // GET /articles - List all
            if (request.method === "GET" && !articleId) {
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

            // POST /articles - Create new
            if (request.method === "POST") {
                try {
                    const a = await request.json();
                    await env.DB.prepare(
                        `INSERT INTO articles (id, title, category, date, image, excerpt, content, meta_description, meta_keywords, author_name, author_avatar, slug) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    ).bind(
                        a.id, a.title, a.category, a.date, a.image, a.excerpt, a.content,
                        a.meta_description, a.meta_keywords, a.author_name, a.author_avatar, a.slug || a.id
                    ).run();

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

            // PUT /articles/:id - Update existing
            if (request.method === "PUT" && articleId) {
                try {
                    const a = await request.json();
                    await env.DB.prepare(
                        `UPDATE articles SET 
                            title = ?, category = ?, date = ?, image = ?, excerpt = ?, 
                            content = ?, meta_description = ?, meta_keywords = ?, 
                            author_name = ?, author_avatar = ?
                         WHERE id = ?`
                    ).bind(
                        a.title, a.category, a.date, a.image, a.excerpt, a.content,
                        a.meta_description, a.meta_keywords, a.author_name, a.author_avatar,
                        articleId
                    ).run();

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

            // DELETE /articles/:id
            if (request.method === "DELETE" && articleId) {
                try {
                    await env.DB.prepare("DELETE FROM articles WHERE id = ?").bind(articleId).run();
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
        }

        // Image Upload to R2: POST /upload (multipart or raw body)
        if (url.pathname === "/upload" && request.method === "POST") {
            try {
                if (!env.IMAGES) throw new Error("R2 bucket (IMAGES) not bound!");

                const formData = await request.formData();
                const file = formData.get("file");

                if (!file) throw new Error("No file field in form data");

                const fileExt = file.name.split('.').pop() || 'jpg';
                const cleanName = file.name.split('.')[0]
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-');
                const filename = `${cleanName}-${Date.now()}.${fileExt}`;

                // Save to R2
                const arrayBuffer = await file.arrayBuffer();
                await env.IMAGES.put(filename, arrayBuffer, {
                    httpMetadata: { contentType: file.type || "application/octet-stream" }
                });

                const publicUrl = `${url.origin}/images/${filename}`;

                return new Response(JSON.stringify({
                    success: true,
                    url: publicUrl
                }), {
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: e.message }), {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" }
                });
            }
        }

        // Serve Images from R2: GET /images/:filename
        if (url.pathname.startsWith("/images/")) {
            try {
                const filename = url.pathname.split('/')[2];
                const object = await env.IMAGES.get(filename);

                if (object === null) {
                    return new Response("Image Not Found", { status: 404, headers: corsHeaders });
                }

                const headers = new Headers();
                object.writeHttpMetadata(headers);
                headers.set("etag", object.httpEtag);
                headers.append("Access-Control-Allow-Origin", "*");

                return new Response(object.body, {
                    headers,
                });
            } catch (e) {
                return new Response(e.message, { status: 500, headers: corsHeaders });
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
