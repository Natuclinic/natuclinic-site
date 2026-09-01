// Envio de leads para o CRM BioFlow (https://bio-flow-rose.vercel.app).
// Roda em paralelo com o POST para o worker Cloudflare (/leads) — o painel
// de leads atual continua recebendo normalmente; isto é uma cópia para o CRM.

import { getOrigem } from './leadTracking';

const CRM_URL = import.meta.env.VITE_CRM_URL || 'https://bio-flow-rose.vercel.app/api/leads';
const CRM_TOKEN = import.meta.env.VITE_CRM_TOKEN || '';

/**
 * Envia um lead para o CRM. Nunca lança — falha de rede é silenciosa para
 * não travar o redirecionamento do usuário para o WhatsApp.
 *
 * @param {{ name: string, phone: string, email?: string, source?: string }} lead
 * @returns {Promise<void>}
 */
export function sendLeadToCRM({ name, phone, email, source }) {
    if (!CRM_URL) return Promise.resolve();

    const payload = {
        id: Date.now().toString(),
        nome: name,
        telefone: phone,
        email: email || '',
        origem: getOrigem(),
        // qual formulário do site gerou o lead (não é a origem de mídia)
        formulario: source || '',
    };

    const headers = { 'Content-Type': 'application/json' };
    if (CRM_TOKEN) headers.Authorization = `Bearer ${CRM_TOKEN}`;

    return fetch(CRM_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        // sobrevive à navegação imediata para o WhatsApp
        keepalive: true,
    })
        .then(() => undefined)
        .catch(() => undefined);
}
