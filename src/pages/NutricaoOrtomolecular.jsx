import React, { useState, useEffect, useRef } from 'react';
import ServiceLayout from '../components/ServiceLayout';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from "motion/react";
import Unicon from '../components/Unicon';
import { NatuButton } from '../components/Navbar';

gsap.registerPlugin(ScrollTrigger);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-natu-brown/20 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-start justify-between w-full text-left focus:outline-none group gap-4"
            >
                <h3 className="font-sans font-black uppercase text-lg md:text-xl text-natu-brown group-hover:text-natu-pink transition-colors leading-[1.2] flex-1" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                    {question}
                </h3>
                <span className={`text-natu-brown text-2xl transition-transform duration-300 font-sans leading-none shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 font-sans font-light text-gray-600 text-left pl-8 ${isOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                {answer}
            </div>
        </div>
    );
};

// Helper component for blur-in animation
const BlurFade = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className={`flicker-fix ${className}`}
    >
        {children}
    </motion.div>
);

const NutricaoOrtomolecular = ({ goBack }) => {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);
    const menuRef = useRef(null);
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const indicatorRef = useRef(null);
    const deckRef = useRef(null);
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);
    const card3Ref = useRef(null);
    const [symptomsIndex, setSymptomsIndex] = useState(0);
    const symptomsScrollRef = useRef(null);
    const progressRef = useRef(null);
    const journeyContainerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(bgRef.current, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            gsap.to(indicatorRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "20% top",
                    scrub: true
                },
                opacity: 0,
                y: -10
            });

            // Card Deck Stacking & Pinning Animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: deckRef.current,
                    start: "top top",
                    end: "+=1800", // Further increased for extra reading space
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });

            // Card 2: Less blur on entry, stays readable longer
            tl.fromTo(card2Ref.current,
                { y: 150, opacity: 0, filter: "blur(5px)", force3D: true },
                { y: 75, opacity: 1, filter: "blur(0px)", ease: "none" },
                0.1
            );

            // Card 3: Significant additional delay to isolate Card 2
            tl.fromTo(card3Ref.current,
                { y: 250, opacity: 0, filter: "blur(5px)", force3D: true },
                { y: 150, opacity: 1, filter: "blur(0px)", ease: "none" },
                1.2 // Increased delay (gap) to let Card 2 "breathe"
            );

            // Progress Bar Animation for Journey
            gsap.to(progressRef.current, {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: journeyContainerRef.current,
                    start: "top 80%", // Starts filling when top of card is at 80% of viewport
                    end: "bottom 60%", // Finishes when bottom is at 60%
                    scrub: 1
                }
            });

            // Prevent glitches by forcing a refresh calculation
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);

        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleWhatsApp = () => {
        window.open("https://wa.me/5561992551867?text=Olá! Gostaria de agendar uma consulta de Nutrição Ortomolecular na Natuclinic.", '_blank');
    };

    return (
        <ServiceLayout
            title="Nutrição Ortomolecular"
            goBack={goBack}
            hideHeader={true}
            whatsappMessage="Olá! Gostaria de agendar uma consulta de Nutrição Ortomolecular na Natuclinic."
        >
            {/* 1. Hero Section (Structure from Home) */}
            <section ref={containerRef} className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-white pt-12 md:pt-16">
                <div className="absolute inset-0 flex items-center justify-center p-0 md:p-8 z-0 pt-24 md:pt-32">
                    <div className="relative w-full h-full md:w-[95%] md:h-[85%] rounded-b-[2.5rem] md:rounded-[2.5rem] overflow-hidden">
                        <img
                            ref={bgRef}
                            src="/julimar-meneses-ortomolecular-nutricionista.jpg"
                            alt="Nutrição Ortomolecular na Natuclinic"
                            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none object-[70%_center] md:object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[5] transition-opacity duration-700 group-hover:opacity-90 md:hidden" />

                        {/* Content */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-end items-center md:items-start p-6 pb-10 md:p-20 md:pb-24">
                            <BlurFade delay={0.2}>
                                <span className="block text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-white/80 mb-3 font-sans">
                                    Ortomolecular em Brasília
                                </span>
                            </BlurFade>
                            <BlurFade delay={0.4}>
                                <h1 className="text-4xl md:text-7xl font-sans font-black text-white leading-[0.85] tracking-tighter text-center md:text-left max-w-4xl mx-auto md:mx-0 uppercase" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                    Nutrição <br />
                                    Ortomolecular
                                </h1>
                            </BlurFade>
                            <BlurFade delay={0.6}>
                                <p className="mt-4 text-lg md:text-xl font-normal text-white/90 max-w-lg leading-relaxed text-center md:text-left mx-auto md:mx-0 font-sans">
                                    Identifica e corrige desequilíbrios bioquímicos para restaurar sua saúde de dentro para fora.
                                </p>
                            </BlurFade>
                            <BlurFade delay={0.8}>
                                <div className="mt-6 flex justify-center md:justify-start w-full md:w-auto">
                                    <NatuButton onClick={handleWhatsApp}>
                                        Agendar consulta
                                    </NatuButton>
                                </div>
                            </BlurFade>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div ref={indicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:block">
                    <div className="animate-bounce">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 cursor-pointer">
                            <Unicon name="arrow-down" className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            </section>


            {/* 2. O Conceito: O que é Nutrição Ortomolecular */}
            <section className="py-12 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                        {/* Video side */}
                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                            <motion.div
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative w-full max-w-[320px] aspect-[9/16] bg-gray-100 rounded-3xl overflow-hidden group cursor-pointer"
                            >
                                <video
                                    ref={videoRef}
                                    src="/video-ortomolecular-julimar.mov"
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted={isMuted}
                                    loop
                                    playsInline
                                    onClick={(e) => {
                                        const video = e.target;
                                        if (video.paused) video.play();
                                        else video.pause();
                                    }}
                                />

                                {/* Mute Toggle Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMuted(!isMuted);
                                    }}
                                    className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                                >
                                    {isMuted ? (
                                        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.22 6.36574C16.3606 6.22529 16.5512 6.1464 16.75 6.1464C16.9488 6.1464 17.1394 6.22529 17.28 6.36574L18.75 7.83573L20.22 6.36574C20.3622 6.23326 20.5502 6.16113 20.7445 6.16456C20.9388 6.16799 21.1242 6.2467 21.2616 6.38411C21.399 6.52153 21.4777 6.70691 21.4812 6.90121C21.4846 7.09551 21.4125 7.28356 21.28 7.42573L19.811 8.89574L21.281 10.3657C21.4176 10.5073 21.4931 10.6967 21.4913 10.8934C21.4895 11.09 21.4105 11.2781 21.2714 11.4171C21.1322 11.5561 20.9441 11.6349 20.7475 11.6365C20.5508 11.6381 20.3614 11.5624 20.22 11.4257L18.75 9.95574L17.28 11.4257C17.1378 11.5582 16.9498 11.6303 16.7555 11.6269C16.5612 11.6235 16.3758 11.5448 16.2384 11.4074C16.101 11.2699 16.0223 11.0846 16.0188 10.8903C16.0154 10.696 16.0875 10.5079 16.22 10.3657L17.69 8.89574L16.22 7.42573C16.0795 7.28511 16.0007 7.09449 16.0007 6.89574C16.0007 6.69698 16.0795 6.50636 16.22 6.36574ZM11.787 0.291735C12.95 -0.475265 14.5 0.359735 14.5 1.75274V16.0387C14.5 17.4327 12.95 18.2667 11.787 17.4997L5.787 13.5447C5.74641 13.5177 5.69879 13.5031 5.65 13.5027H2.75C2.02065 13.5027 1.32118 13.213 0.805456 12.6973C0.289731 12.1816 0 11.4821 0 10.7527V7.03873C0 6.30939 0.289731 5.60992 0.805456 5.09419C1.32118 4.57847 2.02065 4.28874 2.75 4.28874H5.65C5.69903 4.2889 5.74702 4.27464 5.788 4.24774L11.787 0.291735Z" fill="currentColor" />
                                        </svg>
                                    ) : (
                                        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.787 0.291735C12.95 -0.475265 14.5 0.359735 14.5 1.75274V16.0387C14.5 17.4327 12.95 18.2667 11.787 17.4997L5.787 13.5447C5.74641 13.5177 5.69879 13.5031 5.65 13.5027H2.75C2.02065 13.5027 1.32118 13.213 0.805456 12.6973C0.289731 12.1816 0 11.4821 0 10.7527V7.03873C0 6.30939 0.289731 5.60992 0.805456 5.09419C1.32118 4.57847 2.02065 4.28874 2.75 4.28874H5.65C5.69903 4.2889 5.74702 4.27464 5.788 4.24774L11.787 0.291735Z" fill="currentColor" />
                                        </svg>
                                    )}
                                </button>

                                {/* Overlay Gradient for readability of the card below */}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                            </motion.div>


                        </div>

                        {/* Text Content side */}
                        <div className="w-full lg:w-1/2">
                            <BlurFade delay={0.3}>
                                <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] text-natu-brown/40 mb-6 block font-sans">
                                    A Ciência do Equilíbrio
                                </span>
                            </BlurFade>
                            <BlurFade delay={0.4}>
                                <h2 className="text-4xl md:text-5xl font-sans font-black text-[#2D3134] leading-[1] tracking-tighter mb-8 uppercase" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                    O que é a Nutrição <br /> Ortomolecular?
                                </h2>
                            </BlurFade>
                            <div className="space-y-6">
                                <BlurFade delay={0.5}>
                                    <p className="font-sans text-lg text-gray-700 leading-relaxed font-light">
                                        Criada pelo Dr. Linus Pauling, a nutrição ortomolecular foca no <strong className="font-bold text-natu-brown">reequilíbrio químico do organismo</strong>. Ao contrário da nutrição convencional, que foca apenas em macros, nós olhamos para as moléculas.
                                    </p>
                                </BlurFade>
                                <BlurFade delay={0.6}>
                                    <p className="font-sans text-lg text-gray-700 leading-relaxed font-light">
                                        Identificamos carências de vitaminas, minerais e aminoácidos, além de combater o estresse oxidativo causado pelos radicais livres. É a ciência de fornecer ao seu corpo os <strong className="font-bold text-natu-brown">elementos exatos</strong> para que ele cure a si mesmo.
                                    </p>
                                </BlurFade>
                                <BlurFade delay={0.7}>
                                    <div className="pt-4">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-natu-pink mt-2.5 shrink-0" />
                                            <p className="text-sm font-sans text-gray-600 leading-relaxed">Foco na longevidade e prevenção de doenças crônicas.</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-natu-pink mt-2.5 shrink-0" />
                                            <p className="text-sm font-sans text-gray-600 leading-relaxed">Tratamentos personalizados baseados em bioquímica individual.</p>
                                        </div>
                                    </div>
                                </BlurFade>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Identificação dos Sintomas (A "Dor") */}
            <section className="py-12 md:py-20 bg-white overflow-hidden relative">

                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col items-center gap-8 lg:gap-12">
                        {/* Coluna da Esquerda: Conteúdo Estratégico */}
                        <motion.div
                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full max-w-3xl flex flex-col items-center text-center flicker-fix"
                        >
                            <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] text-[#2D3134]/40 mb-6 block font-sans">
                                Por que fazer?
                            </span>
                            <h2 className="text-3xl md:text-6xl font-sans font-black text-[#2D3134] leading-[0.95] tracking-tighter mb-8 uppercase" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                Nutrição Ortomolecular <br /> <span className="text-[#2D3134]/40">Resolve:</span>
                            </h2>
                            <p className="font-sans text-lg md:text-xl text-gray-500 leading-relaxed font-light mb-12">
                                O desequilíbrio que rouba sua energia, <br className="hidden md:block" /> seu humor e a sua vontade de viver.
                            </p>

                            <NatuButton onClick={() => window.open('https://wa.me/5561999999330', '_blank')}>
                                Agendar consulta
                            </NatuButton>
                        </motion.div>

                        {/* Coluna da Direita: Horizontal scroll on mobile, Grid on desktop */}
                        <div
                            ref={symptomsScrollRef}
                            onScroll={(e) => {
                                const container = e.currentTarget;
                                const index = Math.round(container.scrollLeft / (container.offsetWidth * 0.8));
                                setSymptomsIndex(index);
                            }}
                            className="w-full max-w-4xl mx-auto overflow-x-auto no-scrollbar snap-x snap-mandatory lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0"
                        >
                            <div className="flex lg:grid lg:grid-cols-2 gap-6 min-w-max lg:min-w-0 items-stretch">
                                {[
                                    { title: "Fadiga Crônica", desc: "Cansaço persistente que não cessa com o repouso comum.", delay: 0 },
                                    { title: "Suporte Oncológico", desc: "Aporte nutricional estratégico para fortalecer o organismo no tratamento.", delay: 0.1 },
                                    { title: "Inflamação", desc: "Combate à inflamação silenciosa e distúrbios intestinais recorrentes.", delay: 0.2 },
                                    { title: "Metabolismo", desc: "Otimização da queima de gordura e equilíbrio da resistência insulínica.", delay: 0.3 }
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: item.delay }}
                                        className="snap-center shrink-0 w-[85vw] md:w-auto p-8 md:p-10 bg-gradient-to-br from-[#4C261A] to-[#3D1E15] border border-white/5 rounded-2xl group cursor-default flex flex-row items-center text-left gap-6 flicker-fix"
                                    >
                                        {/* Icon Style Circles (Left Side) */}
                                        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                                            <div className="absolute inset-0 border border-white/10 rounded-full" />
                                            <div className="absolute inset-[3px] border border-white/10 rounded-full" />
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>

                                        {/* Text Content (Right Side) */}
                                        <div className="flex flex-col">
                                            <h4 className="font-sans font-black text-white text-lg md:text-xl mb-1 uppercase tracking-tight leading-tight" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                                {item.title}
                                            </h4>
                                            <p className="font-sans text-xs md:text-sm text-white/50 font-light leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Pagination Dots (Mobile only) */}
                        <div className="flex lg:hidden justify-center gap-2 mt-8">
                            {[0, 1, 2, 3].map((dot) => (
                                <div
                                    key={dot}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${symptomsIndex === dot ? 'w-6 bg-natu-brown' : 'w-1.5 bg-natu-brown/20'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Apresentação Dr. Julimar */}
            <section className="py-12 md:py-20 px-6 md:px-16 max-w-[1400px] mx-auto lg:flex lg:items-center">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 w-full">
                    {/* Foto */}
                    <motion.div
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full max-w-sm lg:w-[420px] shrink-0"
                    >
                        <div className="rounded-xl overflow-hidden aspect-[3/4]">
                            <img
                                src="/nutricionista-dr-ortomolecular.jfif"
                                alt="Dr. Julimar Meneses - Nutricionista Ortomolecular"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                    </motion.div>

                    {/* Conteúdo */}
                    <motion.div
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col justify-center relative p-6 md:p-0"
                    >
                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 font-sans">
                            Conheça o especialista
                        </span>
                        <h2 className="text-4xl md:text-5xl font-sans font-black text-gray-900 leading-tight tracking-tighter mb-2 uppercase" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                            Dr. Julimar Meneses
                        </h2>
                        <p className="font-sans text-sm font-medium tracking-widest text-gray-400 uppercase mb-6">
                            Nutricionista · Farmacêutico · Doutor em Naturopatia
                        </p>
                        <div className="space-y-4 font-sans font-light text-gray-500 leading-relaxed text-base max-w-lg">
                            <p>
                                Formado em Nutrição e Farmácia, com doutorado em Naturopatia e especialização em Biologia Molecular, o Dr. Julimar iniciou sua jornada na Nutrição Ortomolecular em 2016 — uma abordagem que se tornaria o centro de toda a sua atuação clínica e científica.
                            </p>
                            <p>
                                Pesquisador ativo, dedica parte de sua trajetória ao estudo do uso terapêutico do <em>Aloe Vera Gel</em> e à investigação de casos clínicos em oncologia nutricional, modulação intestinal e fitoterapia. Sua visão integrativa parte de uma crença central: a saúde começa na raiz celular, e tratar de dentro para fora é o caminho mais eficaz e duradouro.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>



            <section className="bg-white py-12 md:py-20 overflow-hidden relative">

                <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16 md:mb-24 flicker-fix"
                    >
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#2D3134]/40 uppercase block mb-6 font-sans">
                            Nossa Metodologia
                        </span>
                        <h2 className="text-4xl md:text-6xl font-sans font-black text-[#2D3134] uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                            Pilares do seu <br /> atendimento
                        </h2>
                    </motion.div>

                    <div className="w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-6">
                            {[
                                {
                                    title: "Diagnóstico Bioquímico",
                                    desc: "Análise profunda de biomarcadores para identificar carências celulares precisas.",
                                    bgImage: "/quanto-custa-uma-consulta-com-nutricionista-ortomolecular.webp",
                                },
                                {
                                    title: "Suplementação",
                                    desc: "Fórmulas personalizadas com vitaminas e minerais na dose exata para você.",
                                    bgImage: "/suplementação-natural-natuclinic-ortomolecular-em-brasilia.webp",
                                },
                                {
                                    title: "Dieta Funcional",
                                    desc: "Plano alimentar focado em silenciar genes inflamatórios e nutrir células.",
                                    bgImage: "/nutrição-oncologica-nutricionista-ortomolecular.png",
                                },
                                {
                                    title: "Alta Performance",
                                    desc: "Monitoramento contínuo para manter sua vitalidade e clareza mental no topo.",
                                    bgImage: "/julimar-naturopata-em-brasilia.webp",
                                }
                            ].map((item, i) => (
                                <div key={i} className="w-full">
                                    <motion.div
                                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                                        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 group cursor-pointer flicker-fix mb-8"
                                    >
                                        {/* Background Image with Scaling Effect */}
                                        {item.bgImage && (
                                            <motion.div
                                                className="absolute inset-0 z-0 group-hover:scale-110 transition-transform duration-[1500ms] ease-out"
                                                style={{
                                                    backgroundImage: `url(${item.bgImage})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            />
                                        )}
                                    </motion.div>

                                    <div className="px-4 text-left">
                                        <h3 className="font-sans font-black text-[#1d1d1f] text-lg md:text-xl mb-2 tracking-tight" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                            {item.title}
                                        </h3>
                                        <p className="font-sans text-[13px] md:text-sm text-[#86868b] leading-relaxed font-normal">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Especialidades de Alta Complexidade */}
            <div ref={deckRef} className="bg-white md:h-screen w-full relative flex flex-col items-center justify-start pt-16 md:pt-24 pb-12 px-6">
                {/* Header */}
                <div className="max-w-4xl w-full mb-10 text-center">
                    <BlurFade className="text-center">
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#2D3134]/40 uppercase block mb-4 font-sans">
                            Áreas de Foco
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sans font-black text-[#2D3134] uppercase tracking-tighter leading-[0.9]"
                            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                        >
                            Especialidades de <br /> Alta Complexidade
                        </h2>
                    </BlurFade>
                </div>

                {/* Cards Deck Container */}
                <div className="relative w-full max-w-4xl h-[750px] md:h-[550px] px-6 md:px-0">
                    {/* 4.1 Oncologia */}
                    <section ref={card1Ref} className="absolute inset-x-0 top-0 z-10 will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
                        <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-10 relative overflow-hidden">
                            {/* Noise Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 %3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                            <div className="mb-6 text-left relative z-10">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-[#1d1d1f] uppercase tracking-tight" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                    Oncologia Nutricional Integrativa
                                </h3>
                            </div>
                            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-video relative overflow-hidden rounded-2xl">
                                        <img
                                            src="/tratamento-oncologico-nutricional-ortomolecular-Topaz-Gigapixel-escala-2x.jpg"
                                            alt="Oncologia Nutricional"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <p className="text-base text-[#424245] font-sans font-light leading-relaxed relative z-10">
                                        Suporte bioquímico fundamental através do ajuste fino de nutrientes para mitigar efeitos colaterais e fortalecer o sistema imunológico durante a jornada terapêutica.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4.2 Modulação */}
                    <section ref={card2Ref} className="absolute inset-x-0 top-0 z-20 will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
                        <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-10 relative overflow-hidden">
                            {/* Noise Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 %3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                            <div className="mb-6 text-left relative z-10">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-[#1d1d1f] uppercase tracking-tight" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                    Modulação Intestinal Sistêmica
                                </h3>
                            </div>
                            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-video relative overflow-hidden rounded-2xl">
                                        <img
                                            src="/tratamento-reabilitação-intestinal-ortomolecular.jpg"
                                            alt="Modulação Intestinal"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <p className="text-base text-[#424245] font-sans font-light leading-relaxed relative z-10">
                                        Recuperação da barreira epitelial e reequilíbrio profundo da microbiota. O protocolo essencial para silenciar inflamações e restaurar a absorção plena de nutrientes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4.3 Performance */}
                    <section ref={card3Ref} className="absolute inset-x-0 top-0 z-30 will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
                        <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-10 relative overflow-hidden">
                            {/* Noise Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 %3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                            <div className="mb-6 text-left relative z-10">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans font-black text-[#1d1d1f] uppercase tracking-tight" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                    Alta Performance & Longevidade
                                </h3>
                            </div>
                            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-video relative overflow-hidden rounded-2xl">
                                        <img
                                            src="/longevidade-com-nutrição-ortomolecular-emagrecimento-e-performance.jpg"
                                            alt="Alta Performance"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <p className="text-base text-[#424245] font-sans font-light leading-relaxed relative z-10">
                                        Ajuste meticuloso de biomarcadores e otimização celular profunda para elevar sua capacidade cognitiva e física ao topo, garantindo vitalidade prolongada.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>


            <div className="px-6 md:px-12 pb-12 max-w-6xl mx-auto mt-0 space-y-8">

                {/* 3. O Processo */}
                <section className="py-12 md:py-16 bg-white relative overflow-hidden border-t border-gray-50">
                    <div className="max-w-5xl mx-auto px-6 md:px-12">
                        <div className="text-center mb-12 md:mb-16">
                            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-[#2D3134]/30 uppercase block mb-6 font-sans">Jornada do Paciente</span>
                            <h2 className="text-4xl md:text-6xl font-sans font-black text-[#2D3134] uppercase tracking-tighter mb-8 leading-[0.9]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                Sua trajetória <br /> para o equilíbrio
                            </h2>
                        </div>

                        {/* White Card Container */}
                        <div ref={journeyContainerRef} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 lg:p-14 relative overflow-hidden">
                            {/* Vertical Progress Container (Fixed on the far left) */}
                            <div className="absolute left-[24px] md:left-[44px] lg:left-[54px] top-14 bottom-14 w-[1px] bg-gray-100" />

                            {/* Animated Progress Bar (Before the numbers) */}
                            <div
                                ref={progressRef}
                                className="absolute left-[24px] md:left-[44px] lg:left-[54px] top-14 bottom-14 w-[2px] bg-natu-brown origin-top z-10 scale-y-0"
                            />

                            <div className="relative z-0 space-y-10 md:space-y-12">
                                {[
                                    {
                                        title: "Consulta Especializada",
                                        desc: "O primeiro passo para entender suas queixas e alinhar o foco do seu tratamento celular."
                                    },
                                    {
                                        title: "Anamnese Bioquímica",
                                        desc: "Investigação profunda de biomarcadores para mapear seu equilíbrio metabólico."
                                    },
                                    {
                                        title: "Protocolo Vital",
                                        desc: "Entrega do plano estratégico: dieta funcional e suplementação personalizada."
                                    },
                                    {
                                        title: "Acompanhamento",
                                        desc: "Ajustes finos no protocolo baseados na sua evolução clínica e novos exames."
                                    },
                                    {
                                        title: "Longevidade Ativa",
                                        desc: "Consolidação dos resultados para manter sua saúde celular no topo a longo prazo."
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                                        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                        className="flex gap-8 md:gap-16 lg:gap-20 items-start relative pl-6 md:pl-10 lg:pl-12"
                                    >
                                        {/* Number on the left */}
                                        <div className="relative z-20 flex flex-col items-center">
                                            <div className="bg-white py-2">
                                                <span className="text-xl md:text-2xl font-sans font-black text-natu-brown leading-none">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content on the right */}
                                        <div className="flex-1 pt-2">
                                            <h3 className="font-sans font-black text-[#2D3134] text-lg md:text-xl mb-2 uppercase tracking-tight" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
                                                {item.title}
                                            </h3>
                                            <p className="font-sans font-light text-[#2D3134]/70 text-[13px] md:text-sm lg:text-base leading-relaxed max-w-2xl">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>




                {/* 4. Indicações */}
                <section className="py-12 md:py-20 text-center">
                    <BlurFade>
                        <h2 className="text-3xl font-sans font-black uppercase mb-4 text-[#2D3134]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Para quem é indicado?</h2>
                        <p className="font-sans font-light text-gray-600 mb-8">A Nutrição Ortomolecular atua em um amplo espectro de condições e objetivos de saúde.</p>
                    </BlurFade>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            "Fadiga crônica", "Ansiedade e estresse", "Distúrbios do sono", "Desequilíbrio hormonal",
                            "Hipotireoidismo", "TPM e menopausa", "Envelhecimento precoce", "Queda de cabelo",
                            "Acne e dermatites", "Dificuldade de emagrecer", "Inflamação silenciosa", "Disbiose intestinal",
                            "Pré e pós-operatório", "Performance esportiva", "Baixa imunidade", "Fibromialgia",
                            "Depressão leve", "Colesterol alto", "Resistência à insulina", "Longevidade e prevenção"
                        ].map((item, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.03 }}
                                className="px-4 py-2 rounded-full border border-natu-brown/20 text-natu-brown text-sm font-sans font-light bg-[#F9F7F5]/50"
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                </section>


                {/* 6. FAQ */}
                <section className="py-12 md:py-20">
                    <BlurFade className="text-center mb-12">
                        <span className="text-xs font-bold tracking-widest text-[#2D3134]/50 uppercase block mb-4 font-sans">Dúvidas comuns</span>
                        <h2 className="text-3xl md:text-5xl font-sans font-black uppercase text-[#2D3134]" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Perguntas Frequentes</h2>
                    </BlurFade>

                    <div className="max-w-3xl mx-auto">
                        <FAQItem
                            question="O que é Nutrição Ortomolecular e como ela difere da nutrição convencional?"
                            answer="Enquanto a nutrição convencional muitas vezes foca no cálculo de calorias e macronutrientes, a nutrição ortomolecular atua em nível celular. O objetivo é equilibrar vitaminas, minerais, aminoácidos e neutralizar radicais livres, focando em tratar a causa dos sintomas, não apenas a manifestação externa."
                        />
                        <FAQItem
                            question="Quais exames são solicitados na primeira consulta?"
                            answer="Geralmente, solicitamos um rastreio metabólico profundo. Isso inclui dosagem de vitaminas, minerais, perfil hormonal, marcadores inflamatórios, função tireoidiana, hepática e renal. O objetivo é criar um mapa preciso do funcionamento íntimo do seu corpo."
                        />
                        <FAQItem
                            question="Em quanto tempo verei resultados?"
                            answer="O tempo de resposta varia de acordo com o nível da deficiência nutricional e do comprometimento do seu sistema. Muitas pessoas relatam melhora na disposição física, sono e clareza mental já nas primeiras semanas, enquanto o reequilíbrio metabólico duradouro se consolida ao longo dos meses de acompanhamento."
                        />
                        <FAQItem
                            question="A Nutrição Ortomolecular substitui medicamentos?"
                            answer="Não necessariamente. Tratamos a saúde de forma integrada. O aporte de nutrientes e a correção de deficiências ajudam as células a funcionarem de forma otimizada. Muitas vezes, isso cria a saúde necessária para que o médico possa, com segurança, readequar ou até desmamar a medicação medicamentosa."
                        />
                        <FAQItem
                            question="A Natuclinic atende convênios?"
                            answer="Os nossos atendimentos são particulares. Optamos por este modelo para garantir o tempo de consulta necessário para conhecer nossos pacientes de forma profunda (com consultas mais longas e detalhadas), prezando sempre pela excelência e acolhimento humano da clínica."
                        />
                        <FAQItem
                            question="Posso combinar com os tratamentos estéticos da clínica?"
                            answer="Com certeza! Essa é a combinação perfeita (a verdadeira beleza de dentro para fora). A nutrição fornece a matéria-prima — os blocos construtores que o seu corpo usará para potencializar os resultados de procedimentos de harmonização, bioestimuladores e lasers, assegurando que o brilho se revele também na textura da sua pele e na força dos tecidos."
                        />
                    </div>
                </section>
            </div>

        </ServiceLayout >
    );
};

export default NutricaoOrtomolecular;
