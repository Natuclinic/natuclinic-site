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
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
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
                <h3 className="text-3xl font-sans font-bold leading-tight">{title}</h3>
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
        { title: "Nutrição Ortomolecular", category: "Saúde Celular", imageUrl: "/medida-nutricao-ortomolecular.jpg", theme: "var(--theme-brown)", path: "/procedimentos/nutricao-ortomolecular" },
        { title: "Ninfoplastia Sem Cortes", category: "Estética Íntima", imageUrl: "/ninfoplastia.jpeg", theme: "var(--theme-pink)", href: WHATSAPP_LINKS.MSG_NINFO },
        { title: "Harmonização Corporal", category: "Estética Corporal", imageUrl: "/harmonizacao-corporal.jpg", theme: "var(--theme-brown)", path: "/procedimentos/harmonizacao-corporal" },
        { title: "Harmonização de Glúteos", category: "Estética Corporal", imageUrl: "/harmonizacao-de-gluteo.jpg", theme: "var(--theme-pink)", path: "/gluteo-dos-sonhos" },
        { title: "Harmonização Facial", category: "Estética Facial", imageUrl: "/harmonizacao-facial.jpg", theme: "var(--theme-brown)", href: WHATSAPP_LINKS.MSG_FACIAL },
        { title: "Terapia Injetável", category: "Soroterapia e Nutrição", imageUrl: "/images/soroterapia-terapia-injetavel-vitaminas-e-aminoacidos.png?v=new", theme: "var(--theme-brown)", path: "/procedimentos/soroterapia" },
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
    <section className="bg-natu-ivory pt-10 md:pt-14 pb-8 md:pb-10 overflow-hidden">
        <div className="desktop-container-fluid">
            <div className="mb-8 md:mb-12 flex flex-col items-start">
                <span className="text-natu-brown/60 font-medium text-[10px] uppercase tracking-wider mb-3">Saúde Integrativa em Brasília</span>
                <h2 className="text-3xl md:text-4xl font-sans font-bold tracking-tight text-natu-brown leading-tight">
                    Programas de Cuidado Integrativo e Funcional
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 w-full">
                {/* Banner 1: Reabilitação Intestinal */}
                <Link
                    to="/procedimentos/nutricao-ortomolecular"
                    className="group relative flex flex-col justify-end rounded-xl bg-[#3D1E15] overflow-hidden no-underline transition-all duration-500 hover:scale-[1.02] aspect-[3/4] w-full border border-white/10"
                >
                    {/* Background Image */}
                    <img
                        src="/tratamento-reabilitação-intestinal-ortomolecular.jpg"
                        alt="Reabilitação Intestinal e Saúde Digestiva"
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-[#3D1E15] via-[#3D1E15]/90 via-40% to-transparent pointer-events-none" />

                    {/* Text Content */}
                    <div className="relative z-10 flex flex-col justify-end p-4 md:p-5 text-white h-full">
                        <span className="block text-[10px] sm:text-[11px] font-normal text-white/70 font-sans mb-1 md:hidden">
                            Saúde Intestinal em Taguatinga-DF / Planaltina-DF
                        </span>
                        <h3 className="font-sans font-bold text-white text-[1.35rem] leading-[1.15] md:text-xl lg:text-[1.05rem] lg:leading-snug mb-2">
                            Reabilitação Intestinal e<br />Saúde Digestiva
                        </h3>
                        <p className="font-sans font-light text-white/90 text-[13px] md:text-sm lg:text-xs leading-relaxed mb-4">
                            Desintoxicação profunda, reequilíbrio da microbiota e eliminação de toxinas para restaurar a vitalidade.
                        </p>
                        <div className="flex items-center justify-between bg-[#3D1E15]/40 backdrop-blur-md border border-white/30 rounded-lg px-3 py-2 transition-all duration-300 group-hover:bg-[#3D1E15]/60 group-hover:border-white/50 flicker-fix">
                            <span className="text-[11px] md:text-xs font-bold font-sans">Saber Mais</span>
                            <Unicon name="arrow-right" className="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </Link>

                {/* Banner 2: Bioressonância Quântica */}
                <a
                    href={WHATSAPP_LINKS.MSG_BIORESSONANCIA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col justify-end rounded-xl bg-[#2C140C] overflow-hidden no-underline transition-all duration-500 hover:scale-[1.02] aspect-[3/4] w-full border border-white/10"
                >
                    {/* Background Image */}
                    <img
                        src="/bioressonancia-quantica-novo.jpeg"
                        alt="Bioressonância Quântica"
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-[#2C140C] via-[#2C140C]/90 via-40% to-transparent pointer-events-none" />

                    {/* Text Content */}
                    <div className="relative z-10 flex flex-col justify-end p-4 md:p-5 text-white h-full">
                        <span className="block text-[10px] sm:text-[11px] font-normal text-white/70 font-sans mb-1 md:hidden">
                            Diagnóstico Integrativo em Taguatinga-DF / Planaltina-DF
                        </span>
                        <h3 className="font-sans font-bold text-white text-[1.35rem] leading-[1.15] md:text-xl lg:text-[1.05rem] lg:leading-snug mb-2">
                            Bioressonância Quântica e<br />Avaliação Celular
                        </h3>
                        <p className="font-sans font-light text-white/90 text-[13px] md:text-sm lg:text-xs leading-relaxed mb-4">
                            Mapeamento bioenergético preciso de desequilíbrios, toxinas e carências em tempo real.
                        </p>
                        <div className="flex items-center justify-between bg-[#2C140C]/40 backdrop-blur-md border border-white/30 rounded-lg px-3 py-2 transition-all duration-300 group-hover:bg-[#2C140C]/60 group-hover:border-white/50 flicker-fix">
                            <span className="text-[11px] md:text-xs font-bold font-sans">Saber Mais</span>
                            <Unicon name="arrow-right" className="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </a>

                {/* Banner 3: Suplementação Personalizada */}
                <a
                    href={WHATSAPP_LINKS.MSG_SUPLEMENTACAO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col justify-end rounded-xl bg-[#3D1E15] overflow-hidden no-underline transition-all duration-500 hover:scale-[1.02] aspect-[3/4] w-full border border-white/10"
                >
                    {/* Background Image */}
                    <img
                        src="/medida-nutricao-ortomolecular.jpg"
                        alt="Suplementação Personalizada Ortomolecular"
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-[#3D1E15] via-[#3D1E15]/90 via-40% to-transparent pointer-events-none" />

                    {/* Text Content */}
                    <div className="relative z-10 flex flex-col justify-end p-4 md:p-5 text-white h-full">
                        <span className="block text-[10px] sm:text-[11px] font-normal text-white/70 font-sans mb-1 md:hidden">
                            Nutrição Celular em Taguatinga-DF / Planaltina-DF
                        </span>
                        <h3 className="font-sans font-bold text-white text-[1.35rem] leading-[1.15] md:text-xl lg:text-[1.05rem] lg:leading-snug mb-2">
                            Suplementação Personalizada e<br />Nutrição Ortomolecular
                        </h3>
                        <p className="font-sans font-light text-white/90 text-[13px] md:text-sm lg:text-xs leading-relaxed mb-4">
                            Formulação sob medida de vitaminas, minerais e fitoterápicos de alta pureza para o seu organismo.
                        </p>
                        <div className="flex items-center justify-between bg-[#3D1E15]/40 backdrop-blur-md border border-white/30 rounded-lg px-3 py-2 transition-all duration-300 group-hover:bg-[#3D1E15]/60 group-hover:border-white/50 flicker-fix">
                            <span className="text-[11px] md:text-xs font-bold font-sans">Saber Mais</span>
                            <Unicon name="arrow-right" className="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </a>

                {/* Banner 4: Saúde da Mulher */}
                <Link
                    to="/procedimentos/saude-da-mulher"
                    className="group relative flex flex-col justify-end rounded-xl bg-[#4C261A] overflow-hidden no-underline transition-all duration-500 hover:scale-[1.02] aspect-[3/4] w-full border border-white/10"
                >
                    {/* Background Image */}
                    <img
                        src="/images/saude-da-mulher-bg.jpg"
                        alt="Saúde da Mulher"
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-[#4C261A] via-[#4C261A]/90 via-40% to-transparent pointer-events-none" />

                    {/* Text Content */}
                    <div className="relative z-10 flex flex-col justify-end p-4 md:p-5 text-white h-full">
                        <span className="block text-[10px] sm:text-[11px] font-normal text-white/70 font-sans mb-1 md:hidden">
                            Saúde da Mulher em Taguatinga-DF / Planaltina-DF
                        </span>
                        <h3 className="font-sans font-bold text-white text-[1.35rem] leading-[1.15] md:text-xl lg:text-[1.05rem] lg:leading-snug mb-2">
                            Saúde da Mulher e<br />Ginecologia Integrativa
                        </h3>
                        <p className="font-sans font-light text-white/90 text-[13px] md:text-sm lg:text-xs leading-relaxed mb-4">
                            Cuidado íntimo, equilíbrio hormonal e estética feminina sem cortes com máxima privacidade.
                        </p>
                        <div className="flex items-center justify-between bg-[#4C261A]/40 backdrop-blur-md border border-white/30 rounded-lg px-3 py-2 transition-all duration-300 group-hover:bg-[#4C261A]/60 group-hover:border-white/50 flicker-fix">
                            <span className="text-[11px] md:text-xs font-bold font-sans">Saber Mais</span>
                            <Unicon name="arrow-right" className="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    </section>
);

export default ProceduresSection;
export { ProcedureCard, BariátricaBanner };

