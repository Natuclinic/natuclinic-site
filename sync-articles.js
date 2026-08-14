import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// --- CONFIGURATION ---
const API_URL = 'https://natuclinic-api.fabriccioarts.workers.dev/articles';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'articles.jsx');
const CREDENTIALS_PATH = path.join(__dirname, 'google-credentials.json');
const PROPERTY_ID = '524622435';

async function fetchGA4Views() {
    console.log("📊 Buscando visualizações no Google Analytics 4...");
    try {
        if (!fs.existsSync(CREDENTIALS_PATH)) {
            console.warn("⚠️ Arquivo google-credentials.json não encontrado. Ignorando GA4.");
            return {};
        }

        const analyticsDataClient = new BetaAnalyticsDataClient({
            keyFilename: CREDENTIALS_PATH,
        });

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${PROPERTY_ID}`,
            dateRanges: [
                {
                    startDate: '30daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [
                {
                    name: 'pagePath',
                },
            ],
            metrics: [
                {
                    name: 'screenPageViews',
                },
            ],
        });

        const viewsMap = {};
        
        response.rows.forEach(row => {
            const pagePath = row.dimensionValues[0].value;
            const views = parseInt(row.metricValues[0].value, 10);
            
            if (pagePath.startsWith('/blog/')) {
                const slug = pagePath.replace('/blog/', '').replace(/\/$/, '');
                if (slug) {
                    viewsMap[slug] = (viewsMap[slug] || 0) + views;
                }
            }
        });

        console.log(`✅ Visualizações carregadas para ${Object.keys(viewsMap).length} artigos no GA4.`);
        return viewsMap;
    } catch (err) {
        console.error("❌ Erro ao buscar dados do GA4:", err.message);
        return {};
    }
}

async function sync() {
    console.log("🚀 Iniciando sincronização de artigos do Cloudflare D1...");

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        let articles = await response.json();

        console.log(`✅ ${articles.length} artigos encontrados.`);

        // Fetch GA4 Views
        const viewsMap = await fetchGA4Views();

        // Merge views into articles
        articles = articles.map(article => {
            const slug = article.slug || article.id;
            return {
                ...article,
                views: viewsMap[slug] || 0
            };
        });

        // Prepare the file content
        const fileContent = `
import React from 'react';

// ARQUIVO GERADO AUTOMATICAMENTE - NÃO EDITE DIRETAMENTE
// Este arquivo serve como fallback de alta performance e SEO para a Vercel.
// Sincronizado em: ${new Date().toLocaleString('pt-BR')}

export const articles = ${JSON.stringify(articles, null, 4)};
`;

        fs.writeFileSync(OUTPUT_FILE, fileContent);
        console.log(`✨ Sincronização concluída! Arquivo atualizado: ${OUTPUT_FILE}`);

    } catch (err) {
        console.error("❌ Erro durante a sincronização:", err.message);
    }
}

sync();
