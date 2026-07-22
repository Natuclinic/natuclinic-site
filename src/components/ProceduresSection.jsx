import { useNavigate, Link } from 'react-router-dom';
import Unicon from './Unicon';
import BlurText from './BlurText';
import { WHATSAPP_LINKS } from '../constants/links';

const ProcedureCard = ({ imageUrl, title, category, path, href, themeColor }) => {
    const isExternal = !!href;

    const Content = () => (
        <div
            className="relative block w-full h-full rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ease-in-out group-hover:scale-[1.02]"
        >
            <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover grayscale-[20%] transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:grayscale-0"
            />
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(to top, hsl(var(--theme-color) / 0.95) 0%, hsl(var(--theme-color) / 0.4) 40%, transparent 80%)`,
                }}
            />
            <div className="relative flex flex-col justify-end h-full p-8 text-white">
                <span className="text-[10px] font-bold text-white/70 mb-2 font-sans">
                    {category}
                </span>
                <h3 className="text-3xl font-serif leading-tight">{title}</h3>
                <div className="mt-8 flex items-center justify-between bg-natu-ivory/10 backdrop-blur-md border border-white/20 rounded-lg px-5 py-4 transition-all duration-300 group-hover:bg-natu-ivory/20 group-hover:border-white/40 flicker-fix">
                    <span className="text-[10px] font-bold font-sans">Saber Mais</span>
                    <Unicon name="arrow-right" className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
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
    const procedimentos = [
        { title: "Nutrição Ortomolecular", category: "Saúde Celular", imageUrl: "/emagrecimento-saudavel.jpg", theme: "var(--theme-brown)", path: "/procedimentos/nutricao-ortomolecular" },
        { title: "Ninfoplastia Sem Cortes", category: "Estética Íntima", imageUrl: "/ninfoplastia.jpeg", theme: "var(--theme-pink)", href: WHATSAPP_LINKS.MSG_NINFO },
        { title: "Harmonização Corporal", category: "Estética Corporal", imageUrl: "/harmonizacao-corporal.jpg", theme: "var(--theme-brown)", path: "/procedimentos/harmonizacao-corporal" },
        { title: "Harmonização de Glúteos", category: "Estética Corporal", imageUrl: "/harmonizacao-de-gluteo.jpg", theme: "var(--theme-pink)", path: "/gluteo-dos-sonhos" },
        { title: "Harmonização Facial", category: "Estética Facial", imageUrl: "/harmonizacao-facial.jpg", theme: "var(--theme-brown)", href: WHATSAPP_LINKS.MSG_FACIAL },
        { title: "Terapia Injetável", category: "Soroterapia & Nutrição", imageUrl: "/soroterapia-terapia-injetavel-vitaminas-e-aminoacidos.png?v=2", theme: "var(--theme-pink)", path: "/procedimentos/soroterapia" },
    ];

    return (
        <section className="pt-16 md:pt-20 pb-4 md:pb-6 bg-natu-ivory" id="procedimentos-section">
            <div className="desktop-container">
                <div className="mb-12 md:mb-16 flex flex-col items-start text-left">
                    <span className="text-natu-brown/60 font-medium text-[10px] uppercase tracking-wider">Estética e Nutrição Ortomolecular</span>
                    <div className="mt-4 mb-6 max-w-3xl">
                        <BlurText
                            text="Nutrição Ortomolecular e Estética em Brasília"
                            className="text-3xl md:text-5xl lg:text-6xl font-serif font-normal text-natu-brown leading-[1.05]"
                            delay={150}
                            animateBy="words"
                            direction="top"
                        />
                    </div>
                    <Link
                        to="/procedimentos"
                        className="text-[10px] font-bold border-b border-natu-brown pb-1 hover:opacity-50 transition-all text-natu-brown no-underline"
                    >
                        Ver todos protocolos
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {procedimentos.map((p, i) => (
                        <ProcedureCard
                            key={i}
                            title={p.title}
                            category={p.category}
                            imageUrl={p.imageUrl}
                            themeColor={p.theme}
                            path={p.path}
                            href={p.href}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

const BariátricaBanner = () => (
    <section className="bg-natu-ivory pt-2 pb-12 overflow-hidden">
        <div className="desktop-container">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto w-full">
                {/* Banner 1: Tricologia Capilar */}
                <a
                    href={WHATSAPP_LINKS.MSG_TRICOLOGIA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-row items-stretch rounded-2xl bg-natu-brown overflow-hidden no-underline transition-all duration-300 hover:brightness-110 min-h-[220px] md:min-h-[240px] w-full"
                >
                    {/* Background Image from Desktop */}
                    <img
                        src="/images/tricologia-capilar-bg.jpg"
                        alt="Tricologia Capilar"
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4C261A] via-[#4C261A]/80 to-transparent pointer-events-none" />

                    {/* Text side */}
                    <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 py-6 md:py-10 w-full md:w-[70%] text-white">
                        <span className="block text-[9px] md:text-[10px] font-bold tracking-[0.08em] md:tracking-[0.12em] text-white/70 font-sans mb-2 md:mb-4 uppercase">
                            TRICOLOGIA CAPILAR EM TAGUATINGA-DF / PLANALTINA-DF
                        </span>
                        <h3 className="font-sans font-black text-white text-xl md:text-3xl leading-tight tracking-tight mb-2 md:mb-3">
                            TRICOLOGIA CAPILAR &<br />SAÚDE DOS FIOS
                            <span className="text-natu-pink"> ·</span>
                        </h3>
                        <p className="font-sans font-light text-white/90 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 max-w-md">
                            Tratamento integrativo contra queda de cabelo, calvície e fortalecimento folicular de dentro para fora.
                        </p>
                        <div className="mt-2 md:mt-4 flex items-center justify-between bg-natu-brown/40 backdrop-blur-md border border-white/30 rounded-lg px-4 py-3 md:px-5 md:py-4 transition-all duration-300 group-hover:bg-natu-brown/60 group-hover:border-white/50 flicker-fix">
                            <span className="text-[9px] md:text-[10px] font-bold font-sans uppercase">Saber Mais</span>
                            <Unicon name="arrow-right" className="h-3.5 w-3.5 md:h-4 md:w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </a>

                {/* Banner 2: Saúde da Mulher */}
                <Link
                    to="/procedimentos/saude-da-mulher"
                    className="group relative flex flex-row items-stretch rounded-2xl bg-[#3D1E15] overflow-hidden no-underline transition-all duration-300 hover:brightness-110 min-h-[220px] md:min-h-[240px] w-full"
                >
                    {/* Background Image from Desktop */}
                    <img
                        src="/images/saude-da-mulher-bg.jpg"
                        alt="Saúde da Mulher"
                        className="absolute inset-0 w-full h-[calc(100%+400px)] object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-700 pointer-events-none -translate-y-[400px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3D1E15] via-[#3D1E15]/80 to-transparent pointer-events-none" />

                    {/* Text side */}
                    <div className="relative z-10 flex flex-col justify-center px-6 md:px-12 py-6 md:py-10 w-full md:w-[70%] text-white">
                        <span className="block text-[9px] md:text-[10px] font-bold tracking-[0.08em] md:tracking-[0.12em] text-white/70 font-sans mb-2 md:mb-4 uppercase">
                            SAÚDE DA MULHER EM TAGUATINGA-DF / PLANALTINA-DF
                        </span>
                        <h3 className="font-sans font-black text-white text-xl md:text-3xl leading-tight tracking-tight mb-2 md:mb-3">
                            SAÚDE DA MULHER &<br />GINECOLOGIA INTEGRATIVA
                            <span className="text-natu-pink"> ·</span>
                        </h3>
                        <p className="font-sans font-light text-white/90 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 max-w-md">
                            Cuidado íntimo, equilíbrio hormonal e estética feminina sem cortes com máxima privacidade.
                        </p>
                        <div className="mt-2 md:mt-4 flex items-center justify-between bg-[#3D1E15]/40 backdrop-blur-md border border-white/30 rounded-lg px-4 py-3 md:px-5 md:py-4 transition-all duration-300 group-hover:bg-[#3D1E15]/60 group-hover:border-white/50 flicker-fix">
                            <span className="text-[9px] md:text-[10px] font-bold font-sans uppercase">Saber Mais</span>
                            <Unicon name="arrow-right" className="h-3.5 w-3.5 md:h-4 md:w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    </section>
);

export default ProceduresSection;
export { ProcedureCard, BariátricaBanner };

