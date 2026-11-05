// Origem dos contatos de WhatsApp que saem do site.
//
// Um link wa.me só leva o texto da mensagem até a conversa (UTMs são descartados).
// O CRM identifica a origem do lead procurando uma frase-gatilho na primeira mensagem
// (campanhas em Campanhas > Origem dos leads). A campanha "Site" usa "vim pelo site".
//
// O site tem dezenas de links de WhatsApp com mensagens diferentes, inclusive dentro
// dos artigos do blog (que vêm do banco). Em vez de editar um por um, este módulo
// acrescenta "(vim pelo site)" à mensagem de qualquer link de WhatsApp no momento
// do clique. Links que já trazem uma frase-gatilho (como a da página /bio) ficam como estão.

export const SITE_TRIGGER = 'vim pelo site';
const KNOWN_TRIGGERS = [SITE_TRIGGER, 'vim de:'];

function isWhatsAppHost(hostname) {
    return hostname === 'wa.me' || hostname === 'api.whatsapp.com' || hostname === 'web.whatsapp.com';
}

// Devolve o link com a frase-gatilho do site na mensagem (ou o mesmo link, se não for WhatsApp).
export function tagWhatsAppUrl(href) {
    try {
        const url = new URL(href, window.location.href);
        if (!isWhatsAppHost(url.hostname)) return href;

        const text = (url.searchParams.get('text') || '').trim();
        const lower = text.toLowerCase();
        if (KNOWN_TRIGGERS.some((t) => lower.includes(t))) return href;

        const tagged = text ? `${text} (${SITE_TRIGGER})` : 'Olá! Vim pelo site da Natuclinic.';
        const params = [];
        const phone = url.searchParams.get('phone');
        if (phone) params.push(`phone=${encodeURIComponent(phone)}`);
        params.push(`text=${encodeURIComponent(tagged)}`);
        return `${url.origin}${url.pathname}?${params.join('&')}`;
    } catch {
        return href;
    }
}

// Liga a marcação para todos os links de WhatsApp da página, inclusive os abertos
// por código com window.open (botão "Agendar" do menu, simuladores). Retorna a função que desliga.
export function installWhatsAppAttribution() {
    const onClick = (event) => {
        const link = event.target?.closest?.('a[href]');
        if (!link) return;
        const tagged = tagWhatsAppUrl(link.href);
        if (tagged !== link.href) link.setAttribute('href', tagged);
    };
    // Fase de captura: roda antes do navegador seguir o link (clique, toque e clique do meio).
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);

    const originalOpen = window.open;
    window.open = function openWithAttribution(url, ...rest) {
        const finalUrl = typeof url === 'string' ? tagWhatsAppUrl(url) : url;
        return originalOpen.call(window, finalUrl, ...rest);
    };

    return () => {
        document.removeEventListener('click', onClick, true);
        document.removeEventListener('auxclick', onClick, true);
        window.open = originalOpen;
    };
}
