/**
 * Centralized WhatsApp Link Configuration
 */

const PHONE_NUMBER = "5561982582150"; // Natuclinic Official Number
export const UNIT_PHONES = {
    TAGUATINGA: "(61) 3372-9962",
    PLANALTINA: "(61) 3388-6025",
    WHATSAPP: "(61) 98258-2150"
};

const WHATSAPP_BASE = `https://wa.me/${PHONE_NUMBER}`;

export const WHATSAPP_LINKS = {
    GENERAL: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Vim pelo site da Natuclinic e gostaria de mais informações.")}`,
    PROCEDURES: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Tenho interesse em realizar um procedimento na Natuclinic.")}`,
    GLUTEO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Vi o protocolo 'Glúteos dos Sonhos' e gostaria de mais informações.")}`,
    BLOG: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Li um artigo no blog e gostaria de tirar algumas dúvidas.")}`,
    AGENDAMENTO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de agendar uma avaliação na Natuclinic.")}`,

    // Novas mensagens personalizadas para a Home
    FLOAT: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Estou navegando no site e gostaria de falar com a equipe.")}`,
    RESULTS_CTA: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Vi os resultados incríveis no site e gostaria de agendar uma avaliação.")}`,
    QUIET_CTA: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de tirar algumas dúvidas e iniciar meu tratamento.")}`,

    // Mensagens por procedimento (para a Home / Procedures Section)
    MSG_NUTRICAO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre a Nutrição Ortomolecular na Natuclinic.")}`,
    MSG_NINFO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Tenho interesse na Ninfoescultura Sem Cortes. Como funciona?")}`,
    MSG_ENDOLASER: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de informações sobre o protocolo de Endolaser.")}`,
    MSG_FACIAL: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre a Harmonização Facial.")}`,
    MSG_CORPORAL: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Tenho interesse na Harmonização Corporal. Poderia me ajudar?")}`,

    // Tratamentos Adicionais
    MSG_EMAGRECIMENTO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre o programa de Emagrecimento Saudável.")}`,
    MSG_SOROTERAPIA: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Tenho interesse na Soroterapia (Soro da Beleza/Imunidade).")}`,
    MSG_OZONIO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de informações sobre os benefícios da Ozonioterapia.")}`,
    MSG_SUPLEMENTACAO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de uma avaliação para Suplementação Personalizada.")}`,
    MSG_SAUDE_MULHER: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de informações sobre os protocolos de Saúde da Mulher e Estética Íntima na Natuclinic.")}`,
    MSG_TRICOLOGIA: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de uma avaliação para Tricologia Capilar e Tratamento de Queda na Natuclinic.")}`,
    MSG_ALERGIAS: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de agendar uma avaliação para o Teste de Alergias e Intolerâncias Alimentares na Natuclinic.")}`,
    MSG_BIORESSONANCIA: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de informações sobre a Bioressonância Quântica e Análise Integrativa na Natuclinic.")}`,
    MSG_HIPRO: `${WHATSAPP_BASE}?text=${encodeURIComponent("Olá! Gostaria de saber mais sobre o ultrassom HIPRO e agendar uma avaliação.")}`,
};

export const API_URLS = {
    BASE: import.meta.env.VITE_API_URL || "https://natuclinic-api.fabriccioarts.workers.dev",
};
