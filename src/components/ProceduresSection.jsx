import React from 'react';
import { useNavigate } from 'react-router-dom';
import Unicon from './Unicon';
import BlurText from './BlurText';

const ProcedureCard = ({ imageUrl, title, category, onClick, themeColor }) => {
    return (
        <div style={{ "--theme-color": themeColor }} className="group w-full aspect-[4/5] cursor-pointer" onClick={onClick}>
            <div
                className="relative block w-full h-full rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ease-in-out group-hover:scale-[1.02]"
            >
                <img
                    src={imageUrl}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover grayscale-[20%] transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:grayscale-0"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(to top, hsl(var(--theme-color) / 0.95) 0%, hsl(var(--theme-color) / 0.4) 40%, transparent 80%)`,
                    }}
                />
                <div className="relative flex flex-col justify-end h-full p-8 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mb-2 font-sans">
                        {category}
                    </span>
                    <h3 className="text-3xl font-serif leading-tight">{title}</h3>
                    <div className="mt-8 flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-5 py-4 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40 flicker-fix">
                        <span className="text-[10px] font-bold uppercase tracking-widest font-sans">Saber Mais</span>
                        <Unicon name="arrow-right" className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProceduresSection = () => {
    const navigate = useNavigate();
    const procedimentos = [
        { title: "Nutrição Ortomolecular", category: "Saúde Celular", imageUrl: "/soroterapia.jpg", theme: "var(--theme-brown)", id: "nutricao" },
        { title: "Ninfoplastia Sem Cortes", category: "Estética Íntima", imageUrl: "/ninfoplastia.jpeg", theme: "var(--theme-pink)", id: "ninfoplastia" },
        { title: "Endolaser", category: "Tecnologia Avançada", imageUrl: "/harmonizacao-corporal.jpg", theme: "var(--theme-brown)", id: "endolaser" },
        { title: "Harmonização de Glúteos", category: "Estética Corporal", imageUrl: "/harmonizacao-de-gluteo.jpg", theme: "var(--theme-pink)", id: "harmonizacao" },
        { title: "Harmonização Facial", category: "Estética Facial", imageUrl: "/harmonizacao-facial.jpg", theme: "var(--theme-brown)", id: "harmonizacao-facial" },
        { title: "Emagrecimento Saudável", category: "Nutrição Taguatinga", imageUrl: "/emagrecimento-saudavel.jpg", theme: "var(--theme-pink)", id: "emagrecimento" },
    ];

    const handleCardClick = (id, title) => {
        const phone = "5561992551867";
        const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre o procedimento de ${title}.`);
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <section className="py-16 md:py-20 bg-white" id="procedimentos-section">
            <div className="desktop-container">
                <div className="mb-12 md:mb-24 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6 md:gap-0">
                    <div>
                        <span className="text-natu-pink font-bold tracking-widest text-[10px] uppercase">Estética e Nutrição Ortomolecular</span>
                        <div className="mt-4">
                            <BlurText
                                text="Nutrição Ortomolecular e Estética em Brasília"
                                className="text-3xl md:text-5xl font-serif text-natu-brown italic text-balance"
                                delay={200}
                                animateBy="words"
                                direction="top"
                            />
                        </div>
                    </div>
                    <a
                        href="https://wa.me/5561992551867?text=Olá! Gostaria de conhecer todos os protocolos da Natuclinic."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] uppercase font-bold tracking-[0.2em] border-b border-natu-brown pb-1 hover:opacity-50 transition-all self-start text-natu-brown no-underline"
                    >
                        Ver Todos Protocolos
                    </a>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {procedimentos.map((p, i) => (
                        <ProcedureCard
                            key={i}
                            title={p.title}
                            category={p.category}
                            imageUrl={p.imageUrl}
                            themeColor={p.theme}
                            onClick={() => handleCardClick(p.id, p.title)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProceduresSection;
export { ProcedureCard };
