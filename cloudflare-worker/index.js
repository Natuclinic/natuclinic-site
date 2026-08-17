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
        // Delete Images from R2: DELETE /images/:filename
        if (url.pathname.startsWith("/images/")) {
            try {
                const filename = url.pathname.split('/')[2];
                if (!filename) throw new Error("Filename missing");

                if (request.method === "DELETE") {
                    if (!env.IMAGES) throw new Error("R2 bucket (IMAGES) not bound!");
                    await env.IMAGES.delete(filename);
                    return new Response(JSON.stringify({ success: true }), {
                        headers: { ...corsHeaders, "Content-Type": "application/json" }
                    });
                }

                // Default to GET
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
                return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
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

                // 1. Save to Database (D1)
                await env.DB.prepare(
                    "INSERT INTO leads (name, email, phone, source) VALUES (?, ?, ?, ?)"
                )
                    .bind(name, email, phone, source || 'website')
                    .run();

                // 2. Send Email Notification via Resend
                const lead = { name, email, phone, source: source || 'Home Site' };
                await sendEmailWithResend(lead, env);

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

        // GET /leads
        if (url.pathname === "/leads" && request.method === "GET") {
            try {
                const { results } = await env.DB.prepare(
                    "SELECT * FROM leads ORDER BY created_at DESC"
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

        // DELETE /leads/:id
        if (url.pathname.startsWith("/leads/") && request.method === "DELETE") {
            try {
                const leadId = url.pathname.split('/')[2];
                await env.DB.prepare("DELETE FROM leads WHERE id = ?").bind(leadId).run();
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

// Helper function to send email via Resend
async function sendEmailWithResend(lead, env) {
    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("RESEND_API_KEY não configurada. Email não enviado.");
        return;
    }

    const sourceLabels = {
        'newsletter_section': 'Newsletter — Home',
        'gluteo_landing_final_cta': 'Landing Glúteos dos Sonhos',
        'Landing_Harmone_BEE': 'Landing Harmonização Corporal',
        'website': 'Site',
    };
    const sourceLabel = sourceLabels[lead.source] || lead.source;
    const whatsappLink = `https://wa.me/${lead.phone.replace(/\D/g, '')}`;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Natuclinic Leads <onboarding@resend.dev>',
                to: ['marketingnatuclinic@gmail.com'],
                subject: `Novo lead: ${lead.name} — ${sourceLabel}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #fff; border: 1px solid #e8e2dc; border-radius: 12px; overflow: hidden;">
                        <div style="background: #4C261A; padding: 24px 32px;">
                            <p style="margin: 0; color: #FFC2C2; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;">Natuclinic</p>
                            <h1 style="margin: 6px 0 0; color: #fff; font-size: 20px;">Novo Lead Recebido</h1>
                        </div>
                        <div style="padding: 28px 32px;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 10px 0; color: #888; font-size: 13px; width: 100px;">Nome</td>
                                    <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px; font-weight: 600;">${lead.name}</td>
                                </tr>
                                <tr style="border-top: 1px solid #f0ebe5;">
                                    <td style="padding: 10px 0; color: #888; font-size: 13px;">WhatsApp</td>
                                    <td style="padding: 10px 0;">
                                        <a href="${whatsappLink}" style="color: #25D366; font-size: 14px; font-weight: 600; text-decoration: none;">${lead.phone} — Abrir conversa</a>
                                    </td>
                                </tr>
                                ${lead.email !== 'nao@informado.com' ? `
                                <tr style="border-top: 1px solid #f0ebe5;">
                                    <td style="padding: 10px 0; color: #888; font-size: 13px;">E-mail</td>
                                    <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${lead.email}</td>
                                </tr>` : ''}
                                <tr style="border-top: 1px solid #f0ebe5;">
                                    <td style="padding: 10px 0; color: #888; font-size: 13px;">Interesse</td>
                                    <td style="padding: 10px 0; color: #4C261A; font-size: 14px; font-weight: 600;">${sourceLabel}</td>
                                </tr>
                            </table>
                            <div style="background: #fdf8f5; border-left: 3px solid #FFC2C2; padding: 14px 16px; margin-top: 20px; border-radius: 0 6px 6px 0;">
                                <p style="margin: 0; font-size: 13px; color: #4C261A;">Entre em contato em até <strong>15 minutos</strong> para maximizar a chance de conversão.</p>
                            </div>
                        </div>
                        <div style="padding: 16px 32px; background: #faf7f5; border-top: 1px solid #e8e2dc;">
                            <p style="margin: 0; font-size: 11px; color: #bbb; text-align: center;">Notificação automática — Natuclinic CRM</p>
                        </div>
                    </div>
                `
            })
        });

        const data = await response.json();
        console.log("Resend Response:", data);
        return data;
    } catch (e) {
        console.error("Resend fetch error:", e);
    }
}
