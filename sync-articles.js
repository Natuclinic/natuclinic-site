
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const SUPABASE_URL = 'https://dkjgskucppssvjvucmqy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRramdza3VjcHBzc3ZqdnVjbXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDA2NjAsImV4cCI6MjA3OTkxNjY2MH0.NqwEUwOdm2XZjPiDyfZnpB97CPWOP_yC1Z6coM4MVGo';
// ---------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, 'src', 'data', 'articles.jsx');

async function sync() {
    console.log("🚀 Iniciando sincronização de artigos do Supabase...");

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    try {
        const { data: articles, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

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
