/**
 * Centralized WhatsApp Link Configuration
 */

const PHONE_NUMBER = "5561992551867"; // Natuclinic Official Number

const WHATSAPP_BASE = `https://wa.me/${PHONE_NUMBER}`;

export const WHATSAPP_LINKS = {
    GENERAL: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre os procedimentos da Natuclinic.")}`,
    PROCEDURES: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Tenho interesse em realizar um procedimento na Natuclinic.")}`,
    GLUTEO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Vi o protocolo 'Glúteos dos Sonhos' e gostaria de mais informações.")}`,
    BLOG: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Li um artigo no blog e gostaria de tirar algumas dúvidas.")}`,
    AGENDAMENTO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de agendar uma avaliação na Natuclinic.")}`,
};

export const API_URLS = {
    BASE: import.meta.env.VITE_API_URL || "https://natuclinic-api.fabriccioarts.workers.dev",
};
