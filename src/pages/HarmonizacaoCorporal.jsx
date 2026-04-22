import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { motion, useScroll, useTransform } from "framer-motion";
import { WHATSAPP_LINKS } from '../constants/links';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoFeedbacks from '../components/VideoFeedbacks';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const Fade = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
        className={className}
    >
        {children}
    </motion.div>
);

const FaqItem = ({ question, answer, delay = 0 }) => {
    const [open, setOpen] = useState(false);
    return (
        <Fade delay={delay}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left py-6 flex items-start justify-between gap-4 group"
            >
                <span className="font-bold text-sm md:text-base text-[#2D1B14] leading-snug">{question}</span>
                <span className={`shrink-0 w-6 h-6 rounded-full border border-[#C5A059]/40 flex items-center justify-center transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
                    <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                        <path d="M6 1v10M1 6h10" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </span>
            </button>
            {open && (
                <p className="text-[#2D1B14]/60 text-sm leading-relaxed pb-6">{answer}</p>
            )}
        </Fade>
    );
};

const HarmonizacaoCorporal = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({ name: '', phone: '' });

    const queixaSectionRef = useRef(null);
    const queixaBgRef = useRef(null);

    useEffect(() => {
        document.title = "Harmonização Corporal | Natuclinic";
        window.scrollTo(0, 0);

        // GSAP Parallax Animation
        let ctx = gsap.context(() => {
            if (queixaBgRef.current && queixaSectionRef.current) {
                gsap.fromTo(queixaBgRef.current,
                    { y: "-20%" },
                    {
                        y: "20%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: queixaSectionRef.current,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    const handleWhatsApp = () => {
        const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre a Harmonização Corporal.`);
        window.open(`${WHATSAPP_LINKS.GENERAL || 'https://wa.me/5561992551867'}&text=${message}`, '_blank');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
            setStatus({ type: 'error', message: 'Preencha nome e WhatsApp.' });
            return;
        }
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const { error } = await supabase.from('leads').insert([{
                name: formData.name,
                phone: formData.phone,
                source: 'Landing_Harmone_BEE',
                email: 'nao@informado.com'
            }]);
            if (error) throw error;
            setStatus({ type: 'success', message: 'Enviado. Redirecionando para o WhatsApp...' });
            setTimeout(() => {
                handleWhatsApp();
                setFormData({ name: '', phone: '' });
                setStatus({ type: '', message: '' });
            }, 1000);
        } catch {
            setStatus({ type: 'error', message: 'Erro ao processar. Tente pelo WhatsApp.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white text-[#2D1B14] font-sans overflow-x-hidden harmonizacao-page">
            <SEO
                title="Harmone Bee® — Harmonização Corporal em 90 Dias"
                description="O protocolo Harmone Bee® une nutrição ortomolecular, procedimentos estéticos e acompanhamento intensivo para transformar seu corpo em 90 dias. Natuclinic, Brasília."
                url="https://natuclinic.com.br/procedimentos/harmonizacao-corporal"
                keywords="harmonização corporal, harmone bee, protocolo emagrecimento, nutrição ortomolecular, estética corporal Brasília, natuclinic"
                image="/og-harmonizacao-corporal.jpg"
            />

            {/* Hero */}
            <section className="relative min-h-[calc(100vh-128px)] mt-32 flex flex-col justify-end overflow-hidden pb-12 md:pb-20">
                {/* Background Image - No effects as requested */}
                <div className="absolute inset-0 -z-10 overflow-hidden bg-[#2D1B14]">
                    <img
                        src="/bg-woman-01.svg"
                        alt=""
                        className="w-full h-full object-cover object-[70%_15%] md:object-[95%_15%] opacity-90"
                    />
                    {/* Gradient Overlay for Text Contrast - Mobile: Bottom to Top | Desktop: Left to Right */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D1B14]/100 via-[#2D1B14]/40 to-transparent md:bg-gradient-to-r" />
                </div>

                <div className="relative w-full desktop-container pt-72 grid grid-cols-1 md:grid-cols-[45%_55%]">
                    {/* Free Space on the right */}
                    <div className="hidden md:block order-last"></div>

                    {/* Content on the left / Centered on mobile */}
                    <div className="flex flex-col justify-center items-center text-center md:items-start md:text-left relative order-first">

                        <Fade delay={0.1} className="mix-blend-difference w-full">
                            <h1 className="text-3xl md:text-4xl font-normal leading-[1.1] tracking-tight mb-8 text-white max-w-4xl mx-auto md:mx-0 drop-shadow-2xl">
                                Sinta-se bem na sua própria pele com o <strong className="font-serif italic bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent inline-block">Harmone Bee®</strong>
                            </h1>
                            <p className="text-sm md:text-base text-white/70 max-w-xl mb-10 font-light leading-relaxed drop-shadow-lg">
                                Muito mais que estética: um caminho de <strong className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent inline-block whitespace-nowrap">90 dias</strong> para recuperar sua autoestima, energia e a alegria de se olhar no espelho novamente.
                            </p>
                        </Fade>
                        <Fade delay={0.2} className="w-full flex justify-center md:justify-start">
                            <div className="relative group mt-4">
                                {/* Path-Following Border Beam - Precisely Matched to Button Shape */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="beam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="transparent" />
                                            <stop offset="20%" stopColor="#E5C992" />
                                            <stop offset="50%" stopColor="white" />
                                            <stop offset="80%" stopColor="#E5C992" />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                    {/* Calculated Rect to account for stroke width and match pill shape */}
                                    <motion.rect
                                        x="2" y="2"
                                        width="calc(100% - 4px)"
                                        height="calc(100% - 4px)"
                                        rx="40" // Matching common pill height/2
                                        fill="none"
                                        stroke="url(#beam-grad)"
                                        strokeWidth="4"
                                        pathLength="1"
                                        strokeDasharray="0.15 1"
                                        animate={{ strokeDashoffset: [0, -1] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                                    />
                                    <motion.rect
                                        x="2" y="2"
                                        width="calc(100% - 4px)"
                                        height="calc(100% - 4px)"
                                        rx="40"
                                        fill="none"
                                        stroke="#E5C992"
                                        strokeWidth="10"
                                        pathLength="1"
                                        strokeDasharray="0.2 1"
                                        animate={{ strokeDashoffset: [0, -1] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="blur-2xl opacity-70"
                                    />
                                </svg>

                                <button
                                    onClick={handleWhatsApp}
                                    className="natu-button relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#C5A059] to-[#E5C992] text-[#2D1B14] hover:brightness-110 transition-all duration-300 border-none shadow-2xl z-10"
                                >
                                    <span className="natu-button__icon-wrapper bg-[#2D1B14] text-white">
                                        <svg viewBox="0 0 14 15" fill="none" className="natu-button__icon-svg" width="10"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                        <svg viewBox="0 0 14 15" fill="none" width="10" className="natu-button__icon-svg natu-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                    </span>
                                    <span className="font-bold text-sm md:text-base">Quero saber mais</span>
                                </button>
                            </div>
                        </Fade>

                    </div>
                </div>
            </section>

            {/* O Protocolo */}
            <section className="bg-[#2D1B14] text-white py-24 md:py-36 noise-bg overflow-hidden">
                <div className="desktop-container grid md:grid-cols-[3fr_2fr] gap-16 md:gap-0 items-center">
                    <div className="min-w-0 w-full text-center md:text-left flex flex-col items-center md:items-start order-last md:order-last">
                        <Fade className="w-full">
                            <h2 className="w-full text-2xl md:text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent">
                                Um cuidado que caminha com você
                            </h2>
                        </Fade>
                        <Fade delay={0.15} className="w-full">
                            <p className="w-full text-white/70 text-sm md:text-base leading-relaxed mt-4 mb-12">
                                Aqui, você não é apenas um número. Nossa equipe de <strong className="text-white">nutricionistas, biomédicas e massoterapeuta</strong> está aqui para ouvir sua história e entender seu momento. Criamos um plano que faz sentido para a sua vida hoje, respeitando o seu tempo e o seu corpo.<br /><br />
                                Estamos <strong className="text-white">juntas nessa jornada</strong>, do primeiro ao nonagésimo dia.
                            </p>
                        </Fade>
                        <Fade delay={0.25} className="w-full flex justify-center md:justify-start">
                            <div className="relative group mt-8">
                                {/* Path-Following Border Beam - Precisely Matched to Button Shape */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                                    <defs>
                                        <linearGradient id="beam-grad-protocol" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="transparent" />
                                            <stop offset="20%" stopColor="#E5C992" />
                                            <stop offset="50%" stopColor="white" />
                                            <stop offset="80%" stopColor="#E5C992" />
                                            <stop offset="100%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                    <motion.rect
                                        x="2" y="2"
                                        width="calc(100% - 4px)"
                                        height="calc(100% - 4px)"
                                        rx="40"
                                        fill="none"
                                        stroke="url(#beam-grad-protocol)"
                                        strokeWidth="4"
                                        pathLength="1"
                                        strokeDasharray="0.15 1"
                                        animate={{ strokeDashoffset: [0, -1] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
                                    />
                                    <motion.rect
                                        x="2" y="2"
                                        width="calc(100% - 4px)"
                                        height="calc(100% - 4px)"
                                        rx="40"
                                        fill="none"
                                        stroke="#E5C992"
                                        strokeWidth="10"
                                        pathLength="1"
                                        strokeDasharray="0.2 1"
                                        animate={{ strokeDashoffset: [0, -1] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                        className="blur-2xl opacity-70"
                                    />
                                </svg>

                                <button
                                    onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="natu-button relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#E5C992] text-[#2D1B14] hover:brightness-110 transition-all duration-300 border-none shadow-2xl z-10 rounded-full"
                                >
                                    <span className="natu-button__icon-wrapper bg-[#2D1B14] text-white">
                                        <svg viewBox="0 0 14 15" fill="none" className="natu-button__icon-svg" width="10"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                        <svg viewBox="0 0 14 15" fill="none" width="10" className="natu-button__icon-svg natu-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                    </span>
                                    <span className="font-bold text-sm md:text-base uppercase tracking-wider">Iniciar meu protocolo exclusivo</span>
                                </button>
                            </div>
                        </Fade>
                    </div>
                    <Fade delay={0.3} className="w-full flex justify-center md:justify-start items-center order-first md:order-first">
                        <motion.img
                            src="/before-after.svg"
                            alt="Before and After"
                            className="w-full max-w-[250px] md:max-w-[400px] h-auto drop-shadow-2xl"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        />
                    </Fade>
                </div>
            </section>

            {/* Vídeo */}
            <section className="bg-[#2D1B14] py-12 md:py-16 noise-bg">
                <div className="desktop-container">
                    <Fade>
                        <div className="relative w-full aspect-[9/16] md:aspect-video rounded-2xl overflow-hidden bg-black/30 border border-[#C5A059]/20">
                            {/* Substitua o src abaixo pela URL do seu vídeo */}
                            <video
                                src="https://natuclinic-api.fabriccioarts.workers.dev/images/instituto-1776882292978.mp4"
                                className="w-full h-full object-cover"
                                controls
                                playsInline
                                preload="metadata"
                            />
                        </div>
                    </Fade>
                </div>
            </section>



            {/* O que inclui */}
            <section className="bg-[#F9F7F5] text-[#2D1B14] py-24 md:py-36">
                <div className="desktop-container">
                    <Fade>
                        <p className="text-[10px] uppercase tracking-normal text-[#2D1B14]/30 mb-4 text-center">90 dias</p>
                        <h2 className="font-sans text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight mb-16 text-[#2D1B14] text-center">
                            Tudo que está <em className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent not-italic">incluído no protocolo</em>
                        </h2>
                    </Fade>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D1B14]/10">
                        {[
                            {
                                title: "Manejos alimentares",
                                desc: "Plano nutricional personalizado combinando nutrição tradicional e ortomolecular para o seu metabolismo."
                            },
                            {
                                title: "Detox corporal completo",
                                desc: "Protocolo de detoxificação para acelerar o desempenho do metabolismo e potencializar os resultados."
                            },
                            {
                                title: "Estética avançada",
                                desc: "Equipamentos de ponta aplicados de forma integrada ao seu protocolo nutricional."
                            },
                            {
                                title: "Suporte diário no WhatsApp",
                                desc: "Grupo exclusivo com as nutricionistas para trocas do dia a dia e acompanhamento contínuo."
                            },
                        ].map((item, i) => (
                            <Fade key={i} delay={i * 0.08}>
                                <div className="bg-[#F9F7F5] p-8 md:p-10 flex flex-col gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6A2E] flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 12 10" fill="none" width="12" height="10">
                                            <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-[#2D1B14] font-bold text-base md:text-lg">{item.title}</h3>
                                    <p className="text-[#2D1B14]/50 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </div>
            </section>

            {/* Passo a passo */}
            <section className="bg-[#2D1B14] py-24 md:py-36 noise-bg">
                <div className="desktop-container">
                    <Fade>
                        <p className="text-[10px] uppercase tracking-normal text-white/30 mb-4 text-center">Como funciona</p>
                        <h2 className="font-sans text-2xl md:text-3xl font-bold uppercase text-center mb-16 bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent">
                            Os 4 pilares do protocolo
                        </h2>
                    </Fade>
                    {(() => {
                        const steps = [
                            { num: "01", title: "Detox Corporal", desc: "Limpeza profunda do organismo para eliminar toxinas, desinflamar e preparar o corpo para absorver os nutrientes do protocolo." },
                            { num: "02", title: "Manejo Alimentar", desc: "Plano nutricional personalizado unindo nutrição tradicional e ortomolecular, respeitando seu biotipo e sua rotina." },
                            { num: "03", title: "Procedimentos Estéticos", desc: "Equipamentos de estética avançada aplicados de forma integrada ao protocolo para potencializar os resultados corporais." },
                            { num: "04", title: "Acompanhamento", desc: "Suporte contínuo com a equipe via grupo no WhatsApp, ajustes do protocolo e avaliações periódicas durante os 90 dias." },
                        ];

                        return (
                            <>
                                {/* Mobile: timeline vertical */}
                                <div className="flex md:hidden flex-col">
                                    {steps.map((step, i) => (
                                        <Fade key={i} delay={i * 0.1} className="flex gap-4">
                                            {/* Line + number */}
                                            <div className="flex flex-col items-center shrink-0 w-8">
                                                <span className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent font-bold text-[10px] tracking-widest leading-none py-1">{step.num}</span>
                                                <div className="flex-1 w-px bg-gradient-to-b from-[#C5A059]/60 to-[#C5A059]/10 mt-1" />
                                            </div>
                                            {/* Cards */}
                                            <div className="flex flex-col gap-2 pb-8 flex-1 min-w-0">
                                                <div className="rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8B6A2E] p-4">
                                                    <h3 className="text-[#2D1B14] font-bold text-sm leading-snug">{step.title}</h3>
                                                </div>
                                                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                                                    <p className="text-white/50 text-xs leading-relaxed">{step.desc}</p>
                                                </div>
                                            </div>
                                        </Fade>
                                    ))}
                                </div>

                                {/* Desktop: Kanban */}
                                <div className="hidden md:flex gap-2 items-stretch">
                                    {steps.map((step, i) => (
                                        <Fade key={i} delay={i * 0.12} className="flex-1 flex flex-col">
                                            {/* Column header */}
                                            <div className="border-b border-[#C5A059]/20 pb-3 mb-3">
                                                <span className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent font-bold text-[10px] tracking-[0.3em] uppercase">{step.num}</span>
                                            </div>
                                            {/* Card pushed down by step index */}
                                            <div style={{ paddingTop: `${i * 80}px` }} className="flex-1 flex flex-col gap-2">
                                                <div className="rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8B6A2E] p-4">
                                                    <h3 className="text-[#2D1B14] font-bold text-sm leading-snug">{step.title}</h3>
                                                </div>
                                                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                                                    <p className="text-white/50 text-xs leading-relaxed">{step.desc}</p>
                                                </div>
                                            </div>
                                        </Fade>
                                    ))}
                                </div>
                            </>
                        );
                    })()}
                </div>
            </section>

            {/* O que acontece */}
            <section className="bg-[#2D1B14] py-24 md:py-36 -mt-px overflow-hidden noise-bg">
                <div className="desktop-container w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        {/* Text */}
                        <div className="w-full text-center md:text-left flex flex-col items-center md:items-start md:sticky md:top-32">
                             <Fade>
                                <h2 className="text-xl md:text-2xl font-normal leading-tight tracking-tight bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent">
                                    Nós ouvimos você.<br />E vamos além da superfície.
                                </h2>
                            </Fade>
                            <Fade delay={0.15}>
                                <p className="text-white/70 text-sm md:text-base font-light leading-relaxed mt-4">
                                    O sobrepeso ou o inchaço são <strong className="text-white">mensagens do seu corpo</strong>. Quando tentamos resolver apenas o que aparece no espelho <strong className="text-white">sem tratar a causa</strong>, o cansaço volta e os resultados se perdem.
                                </p>
                                <p className="text-white/70 text-sm md:text-base font-light leading-relaxed mt-6">
                                    Aqui, nós buscamos a <strong className="text-white">raiz do problema</strong>: como estão seus nutrientes? Como está seu <strong className="text-white">intestino</strong>? Quando cuidamos do equilíbrio interno, o externo brilha <strong className="text-white">naturalmente</strong>.
                                </p>
                            </Fade>
                        </div>

                        {/* Polaroid Card */}
                        <Fade delay={0.2} className="flex justify-center md:justify-end">
                            <div className="rotate-[-4deg] bg-white p-3 pb-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-[260px] md:w-[320px]">
                                <img
                                    src="/bg-woman-02.svg"
                                    alt=""
                                    className="w-full h-[340px] md:h-[420px] object-cover object-[70%_center]"
                                />
                            </div>
                        </Fade>
                    </div>
                </div>
            </section>

            {/* O diferencial */}
            <section className="bg-[#F9F7F5] text-[#2D1B14] pt-24 md:pt-36 pb-12 md:pb-16">
                <div className="desktop-container mb-8">
                    <Fade>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-[#2D1B14]">
                            Resultados<br /> que impressionam.
                        </h2>
                    </Fade>
                </div>
                <VideoFeedbacks showTitle={false} bgColor="bg-transparent" pyClass="py-0" />
            </section>


            {/* Para quem é */}
            <section className="bg-[#F9F7F5] text-[#2D1B14] pt-12 md:pt-16 pb-24 md:pb-36">
                <div className="desktop-container">
                    <Fade>
                        <h2 className="font-sans text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight mb-16 text-center text-[#2D1B14]">
                            Para quem é o <em className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent not-italic">Harmone Bee®?</em>
                        </h2>
                    </Fade>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2D1B14]/10">
                        {[
                            {
                                title: "Você já sente que 'tentou de tudo'",
                                text: "Aqui o plano é feito para o seu corpo único, não para uma média genérica."
                            },
                            {
                                title: "Você busca um cuidado real",
                                text: "Nossa equipe não te deixa sozinha; estamos com você em cada pequeno passo."
                            },
                            {
                                title: "Você quer resultados que ficam",
                                text: "90 dias de cuidado intenso para que você nunca mais precise recomeçar do zero."
                            },
                            {
                                title: "Você quer ser sua melhor versão",
                                text: "Mais energia, mais leveza e o prazer de se sentir bem com o que vê no espelho."
                            },
                        ].map((item, i) => (
                            <Fade key={i} delay={i * 0.08}>
                                <div className="bg-[#F9F7F5] p-8 md:p-10 flex flex-col gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6A2E] flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 12 10" fill="none" width="12" height="10">
                                            <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-[#2D1B14] font-bold text-base md:text-lg">{item.title}</h3>
                                    <p className="text-[#2D1B14]/50 text-sm leading-relaxed">{item.text}</p>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quem é a profissional */}
            <section className="bg-[#2D1B14] py-24 md:py-36 noise-bg">
                <div className="desktop-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <Fade className="flex justify-center md:justify-start">
                            <div className="w-full max-w-[360px] aspect-[3/4] overflow-hidden">
                                <img
                                    src="/dra-debora.jpg"
                                    alt="Dra. Débora Meneses"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Fade>
                        <Fade delay={0.15} className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
                            <p className="text-[10px] uppercase tracking-normal text-white/30">A profissional por trás do método</p>
                            <h2 className="font-sans text-3xl md:text-5xl font-bold uppercase text-white leading-tight whitespace-nowrap">
                                Dra. Débora Meneses
                            </h2>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed">
                                A <strong className="text-white">Dra. Débora</strong> uniu a precisão da <strong className="text-white">Biomedicina Estética</strong> ao olhar da <strong className="text-white">Nutrição</strong> para criar o <strong className="text-white">Harmone Bee®</strong>. São 90 dias de um protocolo focado em tratar a causa real de cada queixa, e não apenas o que se vê no espelho.
                            </p>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed">
                                Aliamos tecnologia de ponta a um acompanhamento humano e suporte diário, garantindo que sua transformação seja uma mudança definitiva na sua saúde e autoestima.
                            </p>
                        </Fade>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="bg-[#F9F7F5] py-24 md:py-36">
                <div className="desktop-container">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 md:gap-24 items-start">
                        {/* Título fixo à esquerda no desktop */}
                        <Fade className="md:sticky md:top-32">
                            <p className="text-[10px] uppercase tracking-normal text-[#2D1B14]/30 mb-4">Dúvidas</p>
                            <h2 className="font-sans text-2xl md:text-4xl font-bold uppercase text-[#2D1B14] leading-tight">
                                Perguntas<br /><em className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent not-italic">frequentes</em>
                            </h2>
                        </Fade>
                        {/* Perguntas à direita */}
                        <div className="divide-y divide-[#2D1B14]/10">
                            {[
                                {
                                    q: "O protocolo funciona para qualquer tipo de corpo?",
                                    a: "Sim. O Harmone Bee® é totalmente personalizado para o seu biotipo, histórico de saúde e rotina. Não existe um roteiro genérico — cada protocolo é desenhado individualmente."
                                },
                                {
                                    q: "Preciso fazer dieta restritiva?",
                                    a: "Não. O manejo alimentar é pensado para se encaixar na sua realidade. O objetivo é criar hábitos sustentáveis, não uma dieta que você abandona em 2 semanas."
                                },
                                {
                                    q: "Quanto tempo leva para ver resultados?",
                                    a: "Os primeiros resultados costumam aparecer nas primeiras semanas com o detox e ajustes alimentares. A transformação mais significativa se consolida ao longo dos 90 dias."
                                },
                                {
                                    q: "O que está incluído nos 90 dias?",
                                    a: "Detox corporal, manejo alimentar personalizado, procedimentos estéticos com equipamentos avançados e suporte diário com a equipe via grupo no WhatsApp."
                                },
                                {
                                    q: "Preciso morar em Brasília?",
                                    a: "Os procedimentos estéticos são presenciais nas nossas unidades em Taguatinga e Planaltina. O acompanhamento nutricional pode ser feito de forma híbrida."
                                },
                                {
                                    q: "Como faço para iniciar o protocolo?",
                                    a: "Basta preencher o formulário abaixo ou entrar em contato pelo WhatsApp. Nossa equipe entra em contato para uma avaliação inicial e apresentação do protocolo."
                                },
                            ].map((item, i) => (
                                <FaqItem key={i} question={item.q} answer={item.a} delay={i * 0.05} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

{/* Formulário 50/50 */}

        </div>
    );
};

// Reusable BeforeAfter Component
const BeforeAfterSlider = ({ beforeImage, afterImage, altText }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef(null);

    const handleMove = (clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPosition((x / rect.width) * 100);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full cursor-ew-resize select-none overflow-hidden"
            onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        >
            <img src={afterImage} alt="Depois" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img src={beforeImage} alt="Antes" className="absolute inset-0 w-full h-full object-cover max-w-none" />
            </div>
            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl" style={{ left: `calc(${sliderPosition}% - 2px)` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl border border-black/5">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#2D1B14]"><path d="M17 8l4 4-4 4"></path><path d="M3 12h18"></path><path d="M7 16l-4-4 4-4"></path></svg>
                </div>
            </div>
            <div className="absolute bottom-6 left-6 bg-[#2D1B14]/80 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md">Antes</div>
            <div className="absolute bottom-6 right-6 bg-white/80 text-[#2D1B14] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md">Depois</div>
        </div>
    );
};

export default HarmonizacaoCorporal;
