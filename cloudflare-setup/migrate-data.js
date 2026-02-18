import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_FILE = path.join(__dirname, '..', 'src', 'data', 'articles.jsx');
const OUTPUT_FILE = path.join(__dirname, 'data-migration.sql');

function escapeSQL(str) {
    if (!str) return 'NULL';
    if (typeof str !== 'string') return str;
    return `'${str.replace(/'/g, "''")}'`;
}

console.log("🚀 Lendo dados de articles.jsx...");

const fileContent = fs.readFileSync(ARTICLES_FILE, 'utf-8');
// Extrai o JSON que está após "export const articles ="
const jsonMatch = fileContent.match(/export const articles = (\[[\s\S]*?\]);/);

if (!jsonMatch) {
    console.error("❌ Não foi possível encontrar os dados no arquivo articles.jsx");
    process.exit(1);
}

const articles = JSON.parse(jsonMatch[1]);
console.log(`✅ ${articles.length} artigos encontrados.`);


console.log("🚀 Gerando SQL de migração para Cloudflare D1...");

let sqlStatements = articles.map(a => {
    return `INSERT OR REPLACE INTO articles (id, title, category, date, image, excerpt, content, meta_description, meta_keywords, author_name, author_avatar, created_at, slug) 
    VALUES (
        ${escapeSQL(a.id)}, 
        ${escapeSQL(a.title)}, 
        ${escapeSQL(a.category)}, 
        ${escapeSQL(a.date)}, 
        ${escapeSQL(a.image)}, 
        ${escapeSQL(a.excerpt)}, 
        ${escapeSQL(a.content)}, 
        ${escapeSQL(a.meta_description)}, 
        ${escapeSQL(a.meta_keywords)}, 
        ${escapeSQL(a.author_name)}, 
        ${escapeSQL(a.author_avatar)}, 
        ${escapeSQL(a.created_at)},
        ${escapeSQL(a.slug || a.id)}
    );`;
});

fs.writeFileSync(OUTPUT_FILE, sqlStatements.join('\n'));
console.log(`✨ Arquivo gerado com sucesso: ${OUTPUT_FILE}`);
console.log("\nPróximos passos:");
console.log("1. Crie um banco D1 no Cloudflare.");
console.log("2. Execute o schema: npx wrangler d1 execute <NOME_DB> --file=./cloudflare-setup/schema.sql");
console.log("3. Importe os dados: npx wrangler d1 execute <NOME_DB> --file=./cloudflare-setup/data-migration.sql");
