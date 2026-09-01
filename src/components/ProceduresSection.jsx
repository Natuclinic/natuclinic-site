import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Unicon from './Unicon';
import BlurText from './BlurText';
import { WHATSAPP_LINKS } from '../constants/links';

const ProcedureCard = ({ imageUrl, title, category, path, href, themeColor, description }) => {
    const isExternal = !!href;

    const Content = () => (
        <div
            className="relative block w-full h-full rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ease-in-out group-hover:scale-[1.02] isolation-isolate [transform:translate3d(0,0,0)] [backface-visibility:hidden] [perspective:1000px]"
            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
        >
            <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 [transform:translate3d(0,0,0)] [backface-visibility:hidden]"
            />
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(to top, hsl(var(--theme-color) / 0.95) 0%, hsl(var(--theme-color) / 0.4) 40%, transparent 80%)`,
                }}
            />
            <div className="relative flex flex-col justify-end h-full p-8 text-white">
                <span className="text-[9px] font-normal text-white/70 mb-1.5 font-sans md:hidden">
                    {category}
                </span>
                <h3 className="text-xl md:text-2xl font-sans font-bold leading-[0.95] tracking-tight text-balance">{title}</h3>
                {description && (
                    <p className="mt-3 text-white/80 text-xs md:text-sm font-light leading-relaxed line-clamp-2">
                        {description}
                    </p>
                )}
                <div className="mt-8 flex items-center justify-center bg-natu-ivory/20 md:bg-natu-ivory/10 md:backdrop-blur-md border border-white/20 rounded-lg px-5 py-4 transition-all duration-300 group-hover:bg-natu-ivory group-hover:text-natu-brown group-hover:border-natu-ivory">
                    <span className="text-sm font-semibold font-sans">Saber Mais</span>
                </div>
            </div>
        </div>
    );

    if (isExternal) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ "--theme-color": themeColor }}
                className="group w-full aspect-[4/5] cursor-pointer block no-underline"
            >
                <Content />
            </a>
        );
    }

    return (
        <Link
            to={path}
            style={{ "--theme-color": themeColor }}
            className="group w-full aspect-[4/5] cursor-pointer block no-underline"
        >
            <Content />
        </Link>
    );
};

const ProceduresSection = () => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false);
    const procedimentos = [
        { title: "Nutrição Ortomolecular", category: "Saúde Celular", imageUrl: "/medida-nutricao-ortomolecular.jpg", theme: "var(--theme-brown)", path: "/procedimentos/nutricao-ortomolecular", description: "Equilíbrio de dentro para fora focado na raiz metabólica." },
        { title: "Ninfoplastia Sem Cortes", category: "Estética Íntima", imageUrl: "/ninfoplastia.jpeg", theme: "var(--theme-brown)", path: "/blog/ninfoplastia-sem-cortes", description: "Rejuvenescimento íntimo e funcional sem necessidade de cirurgia." },
        { title: "Harmonização Corporal", category: "Estética Corporal", imageUrl: "/harmonizacao-corporal.jpg", theme: "var(--theme-brown)", path: "/procedimentos/harmonizacao-corporal", description: "Protocolos avançados para flacidez, gordura localizada e celulite." },
        { title: "Harmonização de Glúteos", category: "Estética Corporal", imageUrl: "/harmonizacao-de-gluteo.jpg", theme: "var(--theme-brown)", path: "/gluteo-dos-sonhos", description: "Aumento de volume, projeção e firmeza de forma natural." },
        { title: "Harmonização Facial", category: "Estética Facial", imageUrl: "/harmonizacao-facial.jpg", theme: "var(--theme-brown)", path: "/blog/preenchimento-com-acido-hialuronico-como-funciona-quanto-dura-e-como-escolher-com-seguranca", description: "Realce a beleza dos seus traços com naturalidade e segurança." },
        { title: "Terapia Injetável", category: "Soroterapia e Nutrição", imageUrl: "/images/soroterapia-terapia-injetavel-vitaminas-e-aminoacidos.png?v=new", theme: "var(--theme-brown)", path: "/procedimentos/soroterapia", description: "Reposição inteligente de nutrientes para máxima absorção." },
        { title: "Reabilitação Intestinal e Saúde Digestiva", category: "Saúde Intestinal", imageUrl: "/tratamento-reabilitação-intestinal-ortomolecular.jpg", theme: "var(--theme-brown)", path: "/procedimentos/nutricao-ortomolecular", description: "Desintoxicação profunda, reequilíbrio da microbiota e eliminação de toxinas." },
        { title: "Bioressonância Quântica e Avaliação Celular", category: "Diagnóstico Integrativo", imageUrl: "/bioressonancia-quantica-novo.jpeg", theme: "var(--theme-brown)", href: WHATSAPP_LINKS.MSG_BIORESSONANCIA, description: "Mapeamento bioenergético preciso de desequilíbrios, toxinas e carências em tempo real." },
        { title: "Suplementação Personalizada e Nutrição Ortomolecular", category: "Nutrição Celular", imageUrl: "/medida-nutricao-ortomolecular.jpg", theme: "var(--theme-brown)", href: WHATSAPP_LINKS.MSG_SUPLEMENTACAO, description: "Formulação sob medida de vitaminas, minerais e fitoterápicos de alta pureza." },
        { title: "Saúde da Mulher e Ginecologia Integrativa", category: "Saúde da Mulher", imageUrl: "/images/saude-da-mulher-bg.jpg", theme: "var(--theme-brown)", href: WHATSAPP_LINKS.MSG_SAUDE_MULHER, description: "Cuidado íntimo, equilíbrio hormonal e estética feminina sem cortes." },
        { title: "HIPRO: Derretimento Facial", category: "Tratamento de Sustentação", imageUrl: "/instituto-natuclinic-hipro-em-brasilia.png", theme: "var(--theme-brown)", path: "/procedimentos/hipro", description: "Ultrassom focado para tratar flacidez, pálpebra caída e bochecha de buldogue sem cortes." },
        { title: "Endolaser", category: "Contorno Corporal", imageUrl: "/images/blog-images/Blog-image-endolaser.jpg", theme: "var(--theme-brown)", path: "/blog/endolaser", description: "Tratamento a laser para flacidez e contorno corporal sem cirurgia." },
    ];

    return (
        <section className="pt-16 md:pt-20 pb-4 md:pb-6 bg-natu-ivory" id="procedimentos-section">
            <div className="desktop-container">
                <div className="mb-12 md:mb-16 flex flex-col items-start text-left">
                    <span className="text-natu-brown/60 font-medium text-[10px] uppercase tracking-wider">Estética e Nutrição Ortomolecular</span>
                    <div className="mt-4 mb-6 max-w-3xl">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-natu-brown leading-[0.95]">
                            Nutrição Ortomolecular <br className="hidden lg:block" />
                            e Estética em Brasília
                        </h2>
                    </div>
                    <Link
                        to="/procedimentos"
                        className="text-[10px] font-bold border-b border-natu-brown pb-1 hover:opacity-50 transition-all text-natu-brown no-underline"
                    >
                        Ver todos protocolos
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(showAll ? procedimentos : procedimentos.slice(0, 6)).map((p, i) => (
                        <ProcedureCard
                            key={i}
                            title={p.title}
                            category={p.category}
                            imageUrl={p.imageUrl}
                            themeColor={p.theme}
                            path={p.path}
                            href={p.href}
                            description={p.description}
                        />
                    ))}
                </div>

                {procedimentos.length > 6 && (
                    <div className="mt-12 flex justify-center">
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-natu-brown to-[#6f3b28] text-white font-sans text-sm md:text-base font-semibold px-8 py-4 rounded-full hover:from-natu-pink hover:to-natu-pink transition-all duration-300"
                        >
                            {showAll ? "Ver menos procedimentos" : "Ver todos os procedimentos"}
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}>
                                <path d="M6 9l6 6 6-6"/>
                            </svg>
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};



export default ProceduresSection;
export { ProcedureCard };

