import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '../components/SEO';
import Unicon from '../components/Unicon';
import { WHATSAPP_BASE, WHATSAPP_LINKS } from '../constants/links';
import { REGIONS, PACKAGE_LABELS, findArea, formatBRL, pricePerSession } from '../data/laserPricing';

const STEP_LABELS = ['Localização', 'Áreas', 'Pacotes', 'Resumo'];

const fadeStep = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: { duration: 0.35, ease: 'easeOut' },
};

// ---------------------------------------------------------------------------
// Indicador de seleção — vira um "check" tipo verificado quando ativo
// ---------------------------------------------------------------------------
const SelectionMark = ({ selected, size = 20 }) => (
    <div
        className={`shrink-0 rounded-full border flex items-center justify-center transition-all duration-200 ${
            selected ? 'bg-natu-brown border-natu-brown' : 'border-natu-brown/20'
        }`}
        style={{ width: size, height: size }}
    >
        {selected && <Unicon name="check" size={Math.round(size * 0.55)} className="text-white" strokeWidth={3} />}
    </div>
);

// ---------------------------------------------------------------------------
// Barra de progresso
// ---------------------------------------------------------------------------
const ProgressBar = ({ step }) => (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-10 sm:mb-14">
        {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
                <div key={label} className="flex items-center gap-1.5 sm:gap-3">
                    <div className="flex flex-col items-center gap-1.5">
                        <div
                            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                                active ? 'bg-natu-brown scale-125' : done ? 'bg-natu-brown/60' : 'bg-natu-brown/15'
                            }`}
                        />
                        <span
                            className={`hidden sm:block text-[10px] font-sans uppercase tracking-widest transition-colors ${
                                active ? 'text-natu-brown font-semibold' : 'text-natu-brown/40'
                            }`}
                        >
                            {label}
                        </span>
                    </div>
                    {n < STEP_LABELS.length && (
                        <div className={`w-6 sm:w-12 h-px ${done ? 'bg-natu-brown/40' : 'bg-natu-brown/10'}`} />
                    )}
                </div>
            );
        })}
    </div>
);

// ---------------------------------------------------------------------------
// Etapa 1 — Localização
// ---------------------------------------------------------------------------
const StepLocation = ({ unit, setUnit, onNext }) => (
    <motion.div {...fadeStep} className="max-w-2xl mx-auto text-center">
        <h2 className="font-sans font-semibold tracking-tight text-2xl sm:text-3xl text-natu-brown mb-2">Onde você deseja realizar seu tratamento?</h2>
        <p className="text-sm text-natu-brown/60 mb-10">Escolha a unidade mais próxima de você.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
                { id: 'Taguatinga', desc: 'Qne 01 Lote 17/20 Loja 02' },
                { id: 'Planaltina', desc: 'Módulo C lote 2 loja 3/4' },
            ].map((u) => (
                <button
                    key={u.id}
                    type="button"
                    onClick={() => { setUnit(u.id); onNext(); }}
                    className={`group relative p-6 rounded-md border text-left transition-all duration-300 ${
                        unit === u.id
                            ? 'border-natu-brown bg-natu-brown/5 shadow-md'
                            : 'border-natu-brown/10 bg-white hover:border-natu-brown/30 hover:shadow-sm'
                    }`}
                >
                    <div className="flex items-center gap-2 mb-1.5">
                        <Unicon name="map-marker" size={16} className="text-natu-pink" />
                        <span className="font-sans font-semibold text-natu-brown">{u.id}</span>
                    </div>
                    <p className="text-xs text-natu-brown/50">{u.desc}</p>
                </button>
            ))}
        </div>

        <a
            href={WHATSAPP_LINKS.GENERAL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-natu-brown/50 underline decoration-natu-brown/20 underline-offset-4 hover:text-natu-brown transition-colors"
        >
            Não sabe qual unidade escolher? Falar com a equipe
        </a>
    </motion.div>
);

// ---------------------------------------------------------------------------
// Etapa 2 — Áreas
// ---------------------------------------------------------------------------
const StepAreas = ({ selectedAreaIds, toggleArea, justAdded, onBack, onNext }) => (
    <motion.div {...fadeStep} className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="font-sans font-semibold tracking-tight text-2xl sm:text-3xl text-natu-brown mb-2">Escolha as áreas que deseja tratar</h2>
            <p className="text-sm text-natu-brown/60">Selecione uma ou mais áreas. Você pode combinar quantas quiser.</p>
        </div>

        <div className="space-y-8 mb-8">
            {REGIONS.map((region) => (
                <div key={region.id}>
                    <div className="flex items-center gap-2 mb-3">
                        <Unicon name={region.icon} size={16} className="text-natu-pink" />
                        <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-natu-brown/70">
                            {region.label}
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {region.areas.map((area) => {
                            const selected = selectedAreaIds.includes(area.id);
                            return (
                                <motion.button
                                    key={area.id}
                                    type="button"
                                    onClick={() => toggleArea(area.id)}
                                    animate={justAdded === area.id ? { scale: [1, 1.06, 1] } : {}}
                                    transition={{ duration: 0.4 }}
                                    className={`relative p-4 rounded-md border text-left transition-all duration-300 ${
                                        selected
                                            ? 'border-natu-brown bg-natu-brown/5 shadow-sm'
                                            : 'border-natu-brown/10 bg-white hover:border-natu-brown/25'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="text-sm font-sans font-medium text-natu-brown leading-snug">
                                            {area.label}
                                        </span>
                                        <SelectionMark selected={selected} size={18} />
                                    </div>
                                    <span className="text-[11px] text-natu-brown/40 mt-1 block">{area.duration} · sessão</span>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>

        <div className="sticky bottom-24 sm:bottom-6 flex items-center justify-between gap-3 bg-white/90 backdrop-blur rounded-md border border-natu-brown/10 px-4 py-3 shadow-lg">
            <button type="button" onClick={onBack} className="text-xs font-sans text-natu-brown/60 hover:text-natu-brown flex items-center gap-1.5 shrink-0">
                <Unicon name="arrow-left" size={14} /> Voltar
            </button>
            <span className="text-xs font-sans text-natu-brown/70 text-center">
                {selectedAreaIds.length === 0
                    ? 'Nenhuma área selecionada'
                    : `${selectedAreaIds.length} ${selectedAreaIds.length === 1 ? 'área selecionada' : 'áreas selecionadas'}`}
            </span>
            <button
                type="button"
                onClick={onNext}
                disabled={selectedAreaIds.length === 0}
                className="shrink-0 bg-natu-brown text-white text-xs font-sans font-bold uppercase tracking-widest px-5 py-2.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-natu-brown/90 transition-colors"
            >
                Continuar
            </button>
        </div>
    </motion.div>
);

// ---------------------------------------------------------------------------
// Etapa 3 — Pacotes
// ---------------------------------------------------------------------------
const StepPackages = ({ selectedAreas, packages, setPackageForArea, allChosen, onBack, onNext }) => (
    <motion.div {...fadeStep} className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="font-sans font-semibold tracking-tight text-2xl sm:text-3xl text-natu-brown mb-2">Monte o pacote de cada área</h2>
            <p className="text-sm text-natu-brown/60">Escolha entre sessão avulsa ou um pacote com desconto por sessão.</p>
        </div>

        <div className="space-y-6 mb-8">
            {selectedAreas.map((area) => (
                <div key={area.id} className="rounded-md border border-natu-brown/10 bg-white p-5">
                    <h3 className="font-sans font-semibold text-natu-brown mb-4">{area.label}</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                        {['avulsa', 'cinco', 'dez'].map((pkgId) => {
                            const selected = packages[area.id] === pkgId;
                            const perSession = pricePerSession(area, pkgId);
                            return (
                                <button
                                    key={pkgId}
                                    type="button"
                                    onClick={() => setPackageForArea(area.id, pkgId)}
                                    className={`relative p-4 rounded-md border text-left transition-all duration-300 ${
                                        selected
                                            ? 'border-natu-brown bg-natu-brown/5 shadow-sm'
                                            : 'border-natu-brown/10 hover:border-natu-brown/25'
                                    }`}
                                >
                                    {pkgId === 'dez' && (
                                        <span className="absolute -top-2 right-3 bg-[#B8925A] text-white text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                                            Protocolo completo
                                        </span>
                                    )}
                                    <span className="block text-xs font-sans font-semibold uppercase tracking-wide text-natu-brown/70 mb-1">
                                        {PACKAGE_LABELS[pkgId]}
                                    </span>
                                    <span className="block text-lg font-sans font-bold text-natu-brown">
                                        {formatBRL(area.prices[pkgId])}
                                    </span>
                                    {pkgId !== 'avulsa' && (
                                        <span className="block text-[11px] text-natu-brown/45 mt-0.5">
                                            {formatBRL(perSession)} por sessão
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>

        <div className="sticky bottom-24 sm:bottom-6 flex flex-col items-center gap-2 bg-white/90 backdrop-blur rounded-md border border-natu-brown/10 px-4 py-3 shadow-lg">
            {!allChosen && (
                <span className="text-[11px] text-natu-brown/50">Escolha um pacote para cada área antes de continuar.</span>
            )}
            <div className="w-full flex items-center justify-between gap-3">
                <button type="button" onClick={onBack} className="text-xs font-sans text-natu-brown/60 hover:text-natu-brown flex items-center gap-1.5">
                    <Unicon name="arrow-left" size={14} /> Voltar
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!allChosen}
                    className="bg-natu-brown text-white text-xs font-sans font-bold uppercase tracking-widest px-5 py-2.5 rounded-md disabled:opacity-30 disabled:cursor-not-allowed hover:bg-natu-brown/90 transition-colors"
                >
                    Ver resumo
                </button>
            </div>
        </div>
    </motion.div>
);

// ---------------------------------------------------------------------------
// Etapa 4 — Resumo (CTA vai direto pro WhatsApp, sem captura de lead)
// ---------------------------------------------------------------------------
const StepSummary = ({ selectedAreas, packages, total, onRemove, onChangePackage, onAddMore, onBack, onOpenWhatsApp }) => (
    <motion.div {...fadeStep} className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="font-sans font-semibold tracking-tight text-2xl sm:text-3xl text-natu-brown mb-2">Seu tratamento</h2>
            <p className="text-sm text-natu-brown/60">
                Você selecionou {selectedAreas.length} {selectedAreas.length === 1 ? 'área' : 'áreas'}
            </p>
        </div>

        {selectedAreas.length === 0 && (
            <div className="rounded-md border border-dashed border-natu-brown/20 bg-white p-6 text-center mb-6">
                <p className="text-sm text-natu-brown/50">Nenhuma área selecionada ainda.</p>
            </div>
        )}

        {selectedAreas.length > 0 && (
            <div className="rounded-md border border-natu-brown/10 bg-white overflow-hidden mb-4">
                {selectedAreas.map((area, i) => (
                    <div
                        key={area.id}
                        className={`flex items-center justify-between gap-3 p-4 ${i !== 0 ? 'border-t border-natu-brown/8' : ''}`}
                    >
                        <div>
                            <p className="font-sans font-medium text-natu-brown text-sm">{area.label}</p>
                            <p className="text-xs text-natu-brown/45">{PACKAGE_LABELS[packages[area.id]]}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <span className="font-sans font-semibold text-natu-brown text-sm">
                                {formatBRL(area.prices[packages[area.id]])}
                            </span>
                            <button
                                type="button"
                                onClick={() => onChangePackage(area.id)}
                                aria-label={`Alterar pacote de ${area.label}`}
                                className="text-natu-brown/40 hover:text-natu-brown transition-colors"
                            >
                                <Unicon name="edit" size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => onRemove(area.id)}
                                aria-label={`Remover ${area.label}`}
                                className="text-natu-brown/40 hover:text-red-500 transition-colors"
                            >
                                <Unicon name="trash" size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between p-4 bg-natu-brown/5 border-t border-natu-brown/10">
                    <span className="font-sans font-bold uppercase tracking-widest text-xs text-natu-brown/70">Total</span>
                    <span className="font-sans text-xl text-natu-brown font-bold">{formatBRL(total)}</span>
                </div>
            </div>
        )}

        <button
            type="button"
            onClick={onAddMore}
            className="w-full text-xs font-sans font-semibold text-natu-brown/70 hover:text-natu-brown border border-dashed border-natu-brown/20 rounded-md py-3 mb-6 flex items-center justify-center gap-1.5 transition-colors"
        >
            <Unicon name="plus" size={14} /> Adicionar outra área
        </button>

        <p className="text-[11px] text-natu-brown/40 text-center leading-relaxed mb-8">
            Os resultados e a quantidade de sessões podem variar de acordo com características individuais.
            A equipe Natuclinic poderá orientar você sobre o protocolo mais adequado.
        </p>

        <div className="flex items-center justify-between gap-3">
            <button type="button" onClick={onBack} className="text-xs font-sans text-natu-brown/60 hover:text-natu-brown flex items-center gap-1.5">
                <Unicon name="arrow-left" size={14} /> Voltar
            </button>
            <button
                type="button"
                onClick={onOpenWhatsApp}
                disabled={selectedAreas.length === 0}
                className="bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-sans font-bold uppercase tracking-widest px-6 py-3 rounded-md transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
                <Unicon name="whatsapp" size={15} /> Falar com a Natuclinic
            </button>
        </div>
    </motion.div>
);

// ---------------------------------------------------------------------------
// Página principal
// ---------------------------------------------------------------------------
const DepilacaoLaser = () => {
    const [step, setStep] = useState(1);
    const [unit, setUnit] = useState(null);
    const [selectedAreaIds, setSelectedAreaIds] = useState([]);
    const [packages, setPackages] = useState({});
    const [justAdded, setJustAdded] = useState(null);

    const goTo = (n) => {
        setStep(n);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleArea = (id) => {
        setSelectedAreaIds((prev) => {
            if (prev.includes(id)) {
                setPackages((p) => {
                    const next = { ...p };
                    delete next[id];
                    return next;
                });
                return prev.filter((x) => x !== id);
            }
            setJustAdded(id);
            setTimeout(() => setJustAdded(null), 500);
            return [...prev, id];
        });
    };

    const removeArea = (id) => {
        setSelectedAreaIds((prev) => prev.filter((x) => x !== id));
        setPackages((p) => {
            const next = { ...p };
            delete next[id];
            return next;
        });
    };

    const setPackageForArea = (areaId, pkgId) => setPackages((p) => ({ ...p, [areaId]: pkgId }));

    const selectedAreas = useMemo(() => selectedAreaIds.map(findArea).filter(Boolean), [selectedAreaIds]);
    const allChosen = selectedAreas.length > 0 && selectedAreas.every((a) => packages[a.id]);

    const total = useMemo(
        () => selectedAreas.reduce((sum, area) => sum + (packages[area.id] ? area.prices[packages[area.id]] : 0), 0),
        [selectedAreas, packages]
    );

    const handleOpenWhatsApp = () => {
        if (selectedAreas.length === 0) return;

        const lines = selectedAreas
            .map((area) => `• ${area.label} - ${PACKAGE_LABELS[packages[area.id]]} - ${formatBRL(area.prices[packages[area.id]])}`)
            .join('\n');

        const message = [
            'Olá, Natuclinic! Fiz uma simulação de Depilação a Laser pelo site e gostaria de continuar meu atendimento.',
            '',
            `Unidade: ${unit || 'A definir'}`,
            '',
            'Áreas escolhidas:',
            lines,
            '',
            `Total da simulação: ${formatBRL(total)}`,
            '',
            'Gostaria de saber mais sobre o tratamento e verificar a disponibilidade para agendamento.',
        ].join('\n');

        window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-natu-ivory">
            <SEO
                title="Simulador de Depilação a Laser"
                description="Monte seu tratamento de depilação a laser na Natuclinic: escolha as áreas, o pacote de sessões e veja o investimento na hora."
                url="https://www.natuclinic.com.br/depilacao-a-laser"
                canonical="https://www.natuclinic.com.br/depilacao-a-laser"
            />

            <section className="pt-32 sm:pt-40 pb-24 px-4 sm:px-6">
                <div className="text-center mb-12">
                    <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-natu-pink mb-3">
                        Depilação a Laser
                    </p>
                    <h1 className="font-sans font-bold tracking-tight text-3xl sm:text-5xl text-natu-brown mb-4">
                        Simule seu tratamento
                    </h1>
                    <p className="text-sm sm:text-base text-natu-brown/60 max-w-xl mx-auto">
                        Escolha as áreas que deseja tratar, monte seu pacote e veja seu investimento em poucos cliques.
                    </p>
                </div>

                <ProgressBar step={step} />

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <StepLocation key="s1" unit={unit} setUnit={setUnit} onNext={() => goTo(2)} />
                    )}
                    {step === 2 && (
                        <StepAreas
                            key="s2"
                            selectedAreaIds={selectedAreaIds}
                            toggleArea={toggleArea}
                            justAdded={justAdded}
                            onBack={() => goTo(1)}
                            onNext={() => goTo(3)}
                        />
                    )}
                    {step === 3 && (
                        <StepPackages
                            key="s3"
                            selectedAreas={selectedAreas}
                            packages={packages}
                            setPackageForArea={setPackageForArea}
                            allChosen={allChosen}
                            onBack={() => goTo(2)}
                            onNext={() => goTo(4)}
                        />
                    )}
                    {step === 4 && (
                        <StepSummary
                            key="s4"
                            selectedAreas={selectedAreas}
                            packages={packages}
                            total={total}
                            onRemove={removeArea}
                            onChangePackage={() => goTo(3)}
                            onAddMore={() => goTo(2)}
                            onBack={() => goTo(3)}
                            onOpenWhatsApp={handleOpenWhatsApp}
                        />
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default DepilacaoLaser;
