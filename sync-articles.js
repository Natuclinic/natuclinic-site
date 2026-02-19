import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---

const API_URL = 'https://natuclinic-api.fabriccioarts.workers.dev/articles';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'articles.jsx');

async function sync() {
    console.log("🚀 Iniciando sincronização de artigos do Cloudflare D1...");

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const articles = await response.json();

        console.log(`✅ ${articles.length} artigos encontrados.`);

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
