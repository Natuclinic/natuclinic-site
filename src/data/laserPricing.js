// Tabela de preços — Depilação a Laser
// Fonte da verdade dos valores. Não recalcular preços de pacote a partir de outro valor;
// o valor por sessão exibido é só uma referência visual (pacote / número de sessões).

export const REGIONS = [
    {
        id: 'rosto',
        label: 'Rosto',
        icon: 'star',
        areas: [
            { id: 'buco', label: 'Buço', duration: '10 min', prices: { avulsa: 49.99, cinco: 199.50, dez: 399.99 } },
            { id: 'linha-alba', label: 'Linha Alba', duration: '10 min', prices: { avulsa: 49.99, cinco: 174.99, dez: 349.99 } },
            { id: 'rosto-completo', label: 'Rosto completo', duration: '30 min', prices: { avulsa: 110.00, cinco: 499.99, dez: 999.99 } },
        ],
    },
    {
        id: 'intima',
        label: 'Íntima',
        icon: 'heart',
        areas: [
            { id: 'virilha-simples', label: 'Virilha simples', duration: '20 min', prices: { avulsa: 69.99, cinco: 324.99, dez: 649.99 } },
            { id: 'virilha-completa-perianal', label: 'Virilha completa + perianal', duration: '30 min', prices: { avulsa: 119.99, cinco: 449.99, dez: 899.99 } },
            { id: 'perianal', label: 'Perianal', duration: '15 min', prices: { avulsa: 59.99, cinco: 274.99, dez: 549.99 } },
        ],
    },
    {
        id: 'pernas',
        label: 'Pernas',
        icon: 'activity',
        areas: [
            { id: 'meia-perna', label: 'Meia perna', duration: '30 min', prices: { avulsa: 69.99, cinco: 309.99, dez: 619.99 } },
            { id: 'perna-completa', label: 'Perna completa', duration: '45 min', prices: { avulsa: 129.99, cinco: 549.99, dez: 1099.00 } },
        ],
    },
    {
        id: 'bracos',
        label: 'Braços',
        icon: 'activity',
        areas: [
            { id: 'meio-braco', label: 'Meio braço', duration: '20 min', prices: { avulsa: 59.99, cinco: 274.99, dez: 549.99 } },
            { id: 'braco-completo', label: 'Braço completo', duration: '30 min', prices: { avulsa: 89.99, cinco: 399.99, dez: 799.99 } },
        ],
    },
    {
        id: 'corpo',
        label: 'Corpo',
        icon: 'leaf',
        areas: [
            { id: 'gluteos', label: 'Glúteos', duration: '20 min', prices: { avulsa: 89.99, cinco: 399.99, dez: 799.99 } },
            { id: 'peito-barriga', label: 'Peito e barriga', duration: '30 min', prices: { avulsa: 99.99, cinco: 449.99, dez: 999.99 } },
            { id: 'costas', label: 'Costas', duration: '30 min', prices: { avulsa: 69.99, cinco: 299.99, dez: 599.99 } },
        ],
    },
    {
        id: 'axilas',
        label: 'Axilas',
        icon: 'zap',
        areas: [
            { id: 'axilas', label: 'Axilas', duration: '15 min', prices: { avulsa: 59.99, cinco: 274.99, dez: 549.99 } },
        ],
    },
];

export const PACKAGE_LABELS = {
    avulsa: 'Sessão avulsa',
    cinco: '5 sessões',
    dez: '10 sessões',
};

export const ALL_AREAS = REGIONS.flatMap((region) => region.areas.map((area) => ({ ...area, regionLabel: region.label })));

export function findArea(areaId) {
    return ALL_AREAS.find((area) => area.id === areaId);
}

export function formatBRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function pricePerSession(area, packageId) {
    const sessions = packageId === 'cinco' ? 5 : packageId === 'dez' ? 10 : 1;
    if (sessions === 1) return area.prices.avulsa;
    return area.prices[packageId] / sessions;
}
