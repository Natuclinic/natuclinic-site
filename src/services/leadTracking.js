// Captura e persiste a atribuição de origem do lead (UTM).
// Os parâmetros UTM só existem na URL quando o visitante chega pelo anúncio.
// Como o site é uma SPA, ele navega para outras rotas antes de preencher o
// formulário e a URL perde os parâmetros. Por isso capturamos no primeiro
// carregamento e guardamos em sessionStorage para ler no momento do envio.

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const STORAGE_KEY = 'natu_lead_attribution';

// Chamado uma vez no carregamento da aplicação (App.jsx).
export function captureAttribution() {
    try {
        const params = new URLSearchParams(window.location.search);
        const found = {};
        UTM_KEYS.forEach((key) => {
            const value = params.get(key);
            if (value) found[key] = value;
        });

        // Só grava se esta visita trouxe algum UTM — nunca sobrescreve
        // uma atribuição anterior com valores vazios.
        if (Object.keys(found).length > 0) {
            found.landing_page = window.location.pathname;
            found.referrer = document.referrer || '';
            found.captured_at = new Date().toISOString();
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
        }
    } catch {
        // sessionStorage indisponível (aba privada, bloqueio) — ignora.
    }
}

export function getAttribution() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        // ignora
    }
    return {};
}

// "origem" no formato que o CRM (BioFlow) espera.
export function getOrigem() {
    const attribution = getAttribution();
    return attribution.utm_campaign || attribution.utm_source || 'Site Orgânico';
}
