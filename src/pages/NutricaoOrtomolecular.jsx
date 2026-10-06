import React, { useState, useEffect, useRef } from 'react';
import ServiceLayout from '../components/ServiceLayout';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from "motion/react";
import Unicon from '../components/Unicon';
import { NatuButton } from '../components/Navbar';
import FeedbackSection from '../components/FeedbackSection';
import VideoFeedbacks from '../components/VideoFeedbacks';

gsap.registerPlugin(ScrollTrigger);

// TODO: trocar "Paciente N" pelo nome real de cada paciente e ajustar o resumo do resultado.
const ORTOMOLECULAR_FEEDBACKS = [
    {
        id: 'depoimento-1',
        name: "Paciente",
        youtubeId: "0HdWQ4IwdVI",
        title: "Nutrição Ortomolecular",
        result: "Desde os 9 anos de idade convivia com dificuldade para digerir, congestão e apagões — hoje vive livre dessas crises."
    },
    {
        id: 'depoimento-2',
        name: "Jabes",
        youtubeId: "nLaNbhYjcyI",
        title: "Nutrição Ortomolecular",
        result: "Jabes superou as crises de dor causadas por pedras na vesícula e gordura no fígado."
    },
    {
        id: 'depoimento-3',
        name: "João Gomes",
        youtubeId: "TyfihLIf4S8",
        title: "Nutrição Ortomolecular",
        result: "João Gomes enfrentava aumento da próstata e câncer, e encontrou no tratamento natural com o Dr. Julimar a virada que buscava para sua saúde."
    },
];

// Fonte única das perguntas: alimenta tanto o FAQPage schema (SEO/GEO) quanto a seção visível.
const FAQ_ITEMS = [
    {
        q: "O que é a Inflamação Silenciosa e por que ela causa cansaço e trava o emagrecimento?",
        a: "É uma inflamação de baixo grau que você não sente como dor ou vermelhidão (por isso o nome 'silenciosa'), mas que mexe com os hormônios do sono e da fome e deixa o corpo mais resistente a perder peso. Na prática, isso explica cansaço mesmo dormindo bem, inchaço, desânimo e um metabolismo que não responde à dieta. A investigação bioquímica do Dr. Julimar identifica esse processo antes de montar seu protocolo."
    },
    {
        q: "O que é Nutrição Ortomolecular e como ela difere da nutrição convencional?",
        a: "Enquanto a nutrição convencional muitas vezes foca no cálculo de calorias e macronutrientes, a nutrição ortomolecular atua em nível celular. O objetivo é equilibrar vitaminas, minerais, aminoácidos e neutralizar radicais livres, focando em tratar a causa dos sintomas, não apenas a manifestação externa."
    },
    {
        q: "Quais exames são solicitados na primeira consulta?",
        a: "Geralmente, solicitamos um rastreio metabólico profundo. Isso inclui dosagem de vitaminas, minerais, perfil hormonal, marcadores inflamatórios, função tireoidiana, hepática e renal. O objetivo é criar um mapa preciso do funcionamento íntimo do seu corpo."
    },
    {
        q: "Em quanto tempo verei resultados?",
        a: "O tempo de resposta varia de acordo com o nível da deficiência nutricional e do comprometimento do seu sistema. Muitas pessoas relatam melhora na disposição física, sono e clareza mental já nas primeiras semanas, enquanto o reequilíbrio metabólico duradouro se consolida ao longo dos meses de acompanhamento."
    },
    {
        q: "A Nutrição Ortomolecular substitui medicamentos?",
        a: "Não necessariamente. Tratamos a saúde de forma integrada. O aporte de nutrientes e a correção de deficiências ajudam as células a funcionarem de forma otimizada. Muitas vezes, isso cria a saúde necessária para que o médico possa, com segurança, readequar ou até desmamar a medicação medicamentosa."
    },
    {
        q: "A Natuclinic atende convênios?",
        a: "Os nossos atendimentos são particulares. Optamos por este modelo para garantir o tempo de consulta necessário para conhecer nossos pacientes de forma profunda (com consultas mais longas e detalhadas), prezando sempre pela excelência e acolhimento humano da clínica."
    },
    {
        q: "Posso combinar com os tratamentos estéticos da clínica?",
        a: "Com certeza! Essa é a combinação perfeita (a verdadeira beleza de dentro para fora). A nutrição fornece a matéria-prima — os blocos construtores que o seu corpo usará para potencializar os resultados de procedimentos de harmonização, bioestimuladores e lasers, assegurando que o brilho se revele também na textura da sua pele e na força dos tecidos."
    },
];

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-natu-brown/20 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-start justify-between w-full text-left focus:outline-none group gap-4"
            >
                <h3 className="font-sans text-lg md:text-xl text-natu-brown group-hover:text-natu-pink transition-colors leading-[1.2] flex-1">
                    {question}
                </h3>
                <span className={`text-natu-brown text-2xl transition-transform duration-300 font-sans leading-none shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 font-sans font-light text-gray-600 text-left pl-8 ${isOpen ? 'max-h-[500px] mt-6 opacity-100' : 'max-h-0 opacity-0'}`}>
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
    const menuRef = useRef(null);
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const indicatorRef = useRef(null);
    const deckRef = useRef(null);
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);
    const card3Ref = useRef(null);
    const journeyContainerRef = useRef(null);
    const progressCursorRef = useRef(null);
    const progressRef = useRef(null);
    const journeyBgRef = useRef(null);
    const journeyIllustrationRefs = useRef([]);

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

            // Progress Bar Animation for Journey - Ends at the 4th marker
            const progressTl = gsap.timeline({
                scrollTrigger: {
                    trigger: journeyContainerRef.current,
                    start: "top 75%",
                    end: "bottom 80%",
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        // Grow effect on scroll
                        if (progressCursorRef.current) {
                            const isScrolling = Math.abs(self.getVelocity()) > 10;
                            gsap.to(progressCursorRef.current, {
                                scale: isScrolling ? 1.6 : 1,
                                duration: 0.3,
                                ease: "power2.out"
                            });

                            // Final Bloom Effect (Eco)
                            if (self.progress > 0.98) {
                                gsap.to(progressCursorRef.current, {
                                    scale: 4,
                                    opacity: 0,
                                    duration: 0.8,
                                    ease: "power2.out"
                                });
                            } else {
                                gsap.to(progressCursorRef.current, {
                                    opacity: 1,
                                    scale: isScrolling ? 1.6 : 1,
                                    duration: 0.2
                                });
                            }
                        }
                    }
                }
            });

            progressTl.to(progressRef.current, { scaleY: 1, ease: "none" }, 0);

            progressTl.fromTo(progressCursorRef.current,
                { top: "24px" },
                { top: "100%", ease: "none" },
                0
            );

            if (journeyBgRef.current) {
                gsap.to(journeyBgRef.current, {
                    y: -100,
                    ease: "none",
                    scrollTrigger: {
                        trigger: journeyContainerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                });
            }

            // Ilustrações da jornada se afastam levemente do centro ao rolar (desktop)
            journeyIllustrationRefs.current.forEach((el, i) => {
                if (!el) return;
                const direction = i % 2 === 0 ? -1 : 1;
                gsap.to(el, {
                    x: 36 * direction,
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                });
            });

            // Prevent glitches by forcing a refresh calculation
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);

        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleWhatsApp = () => {
        window.open("https://wa.me/5561982582150?text=Olá! Gostaria de agendar uma consulta de Nutrição Ortomolecular na Natuclinic.", '_blank');
    };

    return (
        <ServiceLayout
            title="Nutrição Ortomolecular"
            goBack={goBack}
            hideHeader={true}
            whatsappMessage="Olá! Gostaria de agendar uma consulta de Nutrição Ortomolecular na Natuclinic."
            seo={{
                title: "Nutrição Ortomolecular — Inflamação Silenciosa, Cansaço e Emagrecimento Travado",
                description: "Cansaço mesmo dormindo bem, intestino que trava tudo, emagrecimento que não acontece: pode ser inflamação silenciosa. Dr. Julimar Meneses investiga a causa bioquímica e monta seu protocolo de nutrição ortomolecular em Brasília.",
                url: "https://www.natuclinic.com.br/procedimentos/nutricao-ortomolecular",
                canonical: "https://www.natuclinic.com.br/procedimentos/nutricao-ortomolecular",
                keywords: "inflamação silenciosa, intestino inflamado emagrecimento, cansaço mesmo dormindo, por que não emagreço mesmo fazendo dieta, disbiose intestinal, nutrição ortomolecular brasília, naturopatia brasília, nutrição funcional taguatinga, nutricionista ortomolecular taguatinga, Dr Julimar Meneses naturopata, emagrecimento ortomolecular",
                image: "/julimar-naturopata-em-brasilia.webp",
                jsonLd: {
                    "@context": "https://schema.org",
                    "@type": "MedicalProcedure",
                    "name": "Nutrição Ortomolecular",
                    "description": "Consulta de nutrição ortomolecular, naturopatia e nutrição funcional baseada em biologia molecular para emagrecimento, performance, modulação intestinal e longevidade em Brasília.",
                    "url": "https://www.natuclinic.com.br/procedimentos/nutricao-ortomolecular",
                    "procedureType": "Noninvasive",
                    "performer": {
                        "@type": "Person",
                        "name": "Dr. Julimar Meneses",
                        "jobTitle": "Nutricionista Ortomolecular",
                        "hasCredential": { "@type": "EducationalOccupationalCredential", "credentialCategory": "CRN-DF 21414" },
                        "worksFor": { "@type": "MedicalOrganization", "name": "Natuclinic" }
                    }
                },
                jsonLdList: [
                    {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": FAQ_ITEMS.map((item) => ({
                            "@type": "Question",
                            "name": item.q,
                            "acceptedAnswer": { "@type": "Answer", "text": item.a }
                        }))
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "MedicalWebPage",
                        "name": "Inflamação Silenciosa, Cansaço e Emagrecimento Travado",
                        "url": "https://www.natuclinic.com.br/procedimentos/nutricao-ortomolecular",
                        "about": { "@type": "MedicalCondition", "name": "Inflamação de baixo grau associada à disbiose intestinal" },
                        "mainContentOfPage": {
                            "@type": "WebPageElement",
                            "cssSelector": "#mecanismo-inflamacao-silenciosa"
                        },
                        "lastReviewed": "2026-10-02",
                        "reviewedBy": { "@type": "Person", "name": "Dr. Julimar Meneses", "jobTitle": "Nutricionista Ortomolecular" },
                        "citation": [
                            "Cani PD, et al. Metabolic Endotoxemia Initiates Obesity and Insulin Resistance. Diabetes. 2007;56(7):1761-1772.",
                            "Hotamisligil GS. Inflammation and Metabolic Disorders. Nature. 2006;444(7121):860-867.",
                            "Irwin MR. Sleep and Inflammation: Partners in Sickness and in Health. Nature Reviews Immunology. 2019;19(11):702-715.",
                            "Dantzer R, et al. From Inflammation to Sickness and Depression. Nature Reviews Neuroscience. 2008;9(1):46-56."
                        ]
                    }
                ],
            }}
        >
            {/* 1. Hero Section (Structure from Home) */}
            <section ref={containerRef} className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-white pt-12 md:pt-16">
                <div className="absolute inset-0 flex items-center justify-center p-0 md:p-8 z-0 pt-24 md:pt-32">
                    <div className="relative w-full h-full md:w-[95%] md:h-[85%] md:rounded-[2.5rem] overflow-hidden">
                        <picture>
                            <source media="(max-width: 767px)" srcSet="/Est%C3%A9tica%20e%20Nutri%C3%A7%C3%A3o%20Ortomolecular-mobile.jpg" />
                            <img
                                ref={bgRef}
                                src="/julimar-meneses-ortomolecular-nutricionista.jpg"
                                alt="Nutrição Ortomolecular na Natuclinic"
                                className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none object-[70%_center] md:object-center"
                            />
                        </picture>
                        <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-b from-[#4C261A]/95 via-[#4C261A]/40 to-transparent z-[5] md:hidden" />


                        {/* Label at the top (Mobile only) */}
                        <div className="absolute top-8 left-0 right-0 z-20 flex justify-center md:hidden">
                            <BlurFade delay={0.2}>
                                <span className="block text-[9px] font-medium tracking-[0.08em] text-white/40 font-sans text-center">
                                    Dr. Julimar Meneses · CRN-DF 21414 · Brasília-DF
                                </span>
                            </BlurFade>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-start items-center pt-20 px-6 pb-10 md:justify-end md:items-start md:p-20 md:pb-24">
                            <BlurFade delay={0.2} className="hidden md:block">
                                <span className="block text-[10px] font-medium tracking-[0.08em] text-white/45 mb-3 font-sans">
                                    Dr. Julimar Meneses · CRN-DF 21414 · Brasília-DF
                                </span>
                            </BlurFade>
                            <BlurFade delay={0.4}>
                                <h1 className="text-3xl md:text-7xl font-serif text-white leading-[0.95] md:leading-[0.85] tracking-tighter text-center md:text-left max-w-4xl mx-auto md:mx-0">
                                    Nutrição Ortomolecular <br />
                                    em Brasília
                                </h1>
                            </BlurFade>
                            <BlurFade delay={0.6}>
                                <p className="mt-4 text-xs md:text-base font-normal text-white/90 max-w-lg leading-relaxed text-center md:text-left mx-auto md:mx-0 font-sans">
                                    Cansaço, intestino travado e dificuldade no emagrecimento têm uma causa profunda. A Nutrição Ortomolecular investiga essa raiz e ajusta o que o seu corpo precisa para funcionar bem de novo.
                                </p>
                            </BlurFade>
                            <BlurFade delay={0.8}>
                                <div className="mt-6 flex justify-center md:justify-start w-full md:w-auto">
                                    <NatuButton
                                        onClick={handleWhatsApp}
                                        className="relative overflow-hidden group/shimmer transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] !bg-black !text-white border-none"
                                    >
                                        <motion.div
                                            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[25deg] pointer-events-none"
                                            initial={{ left: '-100%', opacity: 0 }}
                                            animate={{ left: '150%', opacity: 1 }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 3,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        <span className="relative z-10 font-sans">Iniciar minha jornada</span>
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

            {/* Faixa de destaque (marquee) */}
            <div
                className="py-4 overflow-hidden"
                style={{ background: 'linear-gradient(to right, #8B6A2E 0%, #4C261A 20%, #4C261A 80%, #8B6A2E 100%)' }}
            >
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                    className="flex flex-nowrap whitespace-nowrap w-max"
                >
                    {[...Array(4)].flatMap(() => [
                        "Nutrição Ortomolecular",
                        "Inflamação Silenciosa",
                        "Emagrecimento",
                        "Disposição",
                        "Saúde Intestinal",
                        "Qualidade de Vida",
                    ]).map((term, i) => (
                        <span key={i} className="flex items-center shrink-0">
                            <span className="font-sans font-bold text-white text-sm md:text-base uppercase tracking-wide px-4">
                                {term}
                            </span>
                            <span className="text-natu-pink text-sm md:text-base">•</span>
                        </span>
                    ))}
                </motion.div>
            </div>
            {/* 2. Identificação dos Sintomas (A "Dor") */}
            <section className="py-16 lg:py-24 bg-white overflow-hidden relative">
                <div className="max-w-6xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-10 md:gap-16 items-start">
                        {/* Título sticky à esquerda */}
                        <BlurFade className="text-center md:text-left md:sticky md:top-32">
                            <span className="text-xs font-bold tracking-[0.1em] uppercase text-natu-brown/70 font-sans block mb-4">
                                Nutrição Ortomolecular · Dr. Julimar Meneses
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif text-natu-brown leading-tight tracking-tight">
                                Seu corpo está tentando te dizer alguma coisa.
                            </h2>
                            <p className="font-sans text-base text-gray-500 leading-relaxed font-light mt-6 max-w-sm mx-auto md:mx-0">
                                Cansaço, intestino preso e dificuldade para emagrecer podem ser sinais que merecem investigação.
                            </p>
                            <p className="font-sans text-base text-gray-500 leading-relaxed font-light mt-4 mb-8 max-w-sm mx-auto md:mx-0">
                                Mas, se você já fez uma cirurgia bariátrica, existe outro ponto que merece atenção: a absorção de nutrientes.
                            </p>
                            <NatuButton onClick={handleWhatsApp}>
                                Agende sua consulta
                            </NatuButton>
                        </BlurFade>

                        {/* Stack de identificadores */}
                        <div className="flex flex-col gap-4">
                            {[
                                "Cansaço constante, mesmo dormindo bem",
                                "Memória e concentração mais fracas que o normal",
                                "Intestino preso ou inchaço frequente",
                                "Desânimo e falta de disposição",
                                "Já tentou emagrecer, mas o corpo não responde",
                                "Sensação de corpo inflamado ou \"travado\"",
                            ].map((text, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 14 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-60px' }}
                                    transition={{ duration: 0.5, delay: idx * 0.07 }}
                                    className="relative overflow-hidden bg-[#2D3134] rounded-lg px-6 py-5 md:px-8 md:py-6 shadow-[inset_0_1px_24px_rgba(255,255,255,0.18)]"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.14] via-white/[0.03] to-transparent pointer-events-none" />
                                    <div className="relative flex items-start gap-3">
                                        <Unicon name="check-circle" size={18} color="#FFFFFF" className="opacity-60 shrink-0 mt-0.5" />
                                        <span className="font-sans font-bold text-white text-sm md:text-base leading-snug">
                                            {text}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>



            {/* Callout Pós-Bariátrico */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
                    <BlurFade>
                        <div className="relative overflow-hidden bg-[#2D3134] rounded-[1.5rem] shadow-[inset_0_1px_32px_rgba(255,255,255,0.14)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />

                            <div className="relative grid grid-cols-1 md:grid-cols-2 md:min-h-[420px]">
                                <div className="p-8 md:p-12 text-center md:text-left flex flex-col items-center md:items-start justify-center">
                                    <span className="text-xs font-bold tracking-[0.1em] uppercase text-white/75 font-sans block mb-4">Para quem fez cirurgia bariátrica</span>
                                    <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight tracking-tight mb-4">
                                        Seu corpo pode precisar de mais do que alimentação
                                    </h2>
                                    <p className="font-sans font-light text-white/70 text-base leading-relaxed max-w-xl mb-6">
                                        Após a bariátrica, a absorção de vitaminas e minerais pode ser comprometida. Por isso, o Dr. Julimar avalia sua bioquímica e define uma reposição individualizada.
                                    </p>
                                    <button
                                        onClick={handleWhatsApp}
                                        className="inline-flex items-center gap-2 bg-white text-[#2D3134] font-sans text-[12px] font-bold tracking-wide px-6 py-3 rounded-lg hover:brightness-95 transition-all"
                                    >
                                        Quero meu protocolo
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Imagem — ocupa a metade do card, sem bordas */}
                                <div className="relative w-full h-64 md:h-auto bg-white/5">
                                    <img
                                        src="/mulher-soroterpia-em-brasilia-pos-bariatrico.jpg"
                                        alt="Paciente em reposição de vitaminas pós-bariátrica na Natuclinic"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </section>

            {/* 4. O Mecanismo: Inflamação Silenciosa (versão enxuta) */}
            <section id="mecanismo-inflamacao-silenciosa" className="bg-white py-24 md:py-36">
                <div className="max-w-5xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 md:items-center gap-12 md:gap-16">
                    <div className="text-center md:text-left">
                        <BlurFade>
                            <span className="text-xs font-bold tracking-[0.1em] uppercase text-natu-brown/70 font-sans block mb-4">
                                A causa: inflamação silenciosa
                            </span>
                            <h2 className="text-3xl md:text-5xl font-serif font-normal text-natu-brown leading-tight tracking-tight mb-6">
                                Seu corpo pode{' '}
                                <br className="md:hidden" />
                                estar resistindo ao{' '}
                                <br className="md:hidden" />
                                emagrecimento.
                            </h2>
                            <p className="font-sans text-gray-500 font-light text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0 text-balance">
                                Não é só sobre comer menos. Inflamação, sono e metabolismo também importam — inclusive a inflamação silenciosa, aquela que o corpo tem, mas você não sente diretamente.
                            </p>
                        </BlurFade>

                        {/* CTA */}
                        <BlurFade delay={0.1}>
                            <div className="mt-8">
                                <NatuButton onClick={handleWhatsApp}>
                                    Investigue a causa
                                </NatuButton>
                            </div>
                        </BlurFade>
                    </div>

                    {/* Imagem — sem bordas */}
                    <BlurFade delay={0.15}>
                        <img
                            src="/Gemini_Generated_Image_xugaafxugaafxuga.jpg"
                            alt="Investigação da causa do emagrecimento resistente na Natuclinic"
                            className="w-2/3 h-auto mx-auto md:w-full md:max-w-xs md:mx-0 md:ml-auto"
                        />
                    </BlurFade>
                </div>
            </section>

            {/* 5. Apresentação Dr. Julimar */}
            <section className="bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20">
                    <BlurFade>
                        <div className="relative overflow-hidden bg-[#2D3134] rounded-[1.5rem] shadow-[inset_0_1px_32px_rgba(255,255,255,0.14)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-white/[0.02] to-transparent pointer-events-none" />

                            <div className="relative grid grid-cols-1 md:grid-cols-2 md:min-h-[480px]">
                                {/* Foto — ocupa a metade do card, sem bordas */}
                                <div className="relative w-full h-80 md:h-auto bg-white/5">
                                    <img
                                        src="/nutricionista-ortomolecular-integrativo-dr-julimar-meneses.jpeg"
                                        alt="Dr. Julimar Meneses - Nutricionista Ortomolecular"
                                        className="absolute inset-0 w-full h-full object-cover object-top"
                                    />
                                </div>

                                {/* Conteúdo */}
                                <div className="p-8 md:p-12 text-left flex flex-col items-start justify-center">
                                    <span className="text-xs font-bold tracking-[0.1em] uppercase text-white/75 font-sans block mb-4">
                                        Conheça o especialista
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight tracking-tight mb-2">
                                        Dr. Julimar Meneses
                                    </h2>
                                    <p className="font-sans text-xs md:text-sm font-medium tracking-widest text-white/50 mb-6">
                                        Nutricionista · Farmacêutico · Doutor em Naturopatia · CRN-DF 21414
                                    </p>
                                    <div className="space-y-4 font-sans font-light text-white/70 leading-relaxed text-base max-w-xl">
                                        <p>
                                            Formado em Nutrição e Farmácia, com doutorado em Naturopatia e especialização em Biologia Molecular, o Dr. Julimar iniciou sua jornada na Nutrição Ortomolecular em 2006 — uma abordagem que se tornaria o centro de toda a sua atuação clínica e científica.
                                        </p>
                                        <p>
                                            Pesquisador ativo, dedica parte de sua trajetória ao estudo do uso terapêutico do <em>Aloe Vera Gel</em> e à investigação de casos clínicos em oncologia nutricional, modulação intestinal e fitoterapia. Sua visão integrativa parte de uma crença central: a saúde começa na raiz celular, e tratar de dentro para fora é o caminho mais eficaz e duradouro.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </section>


            {/* 4. Especialidades de Alta Complexidade */}
            <div ref={deckRef} className="bg-white md:h-screen w-full relative flex flex-col items-center justify-start pt-16 md:pt-24 pb-12 px-6">
                {/* Header */}
                <div className="max-w-4xl w-full mb-10 text-center">
                    <BlurFade className="text-center">
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.1em] text-[#2D3134]/40 block mb-4 font-sans">
                            Áreas de Foco
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-natu-brown tracking-tighter leading-[0.9]">
                            Abordagem Integrativa <br /> de Alta Precisão
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
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans text-natu-brown tracking-tight">
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
                                        Suporte bioquímico fundamental através do ajuste fino de nutrientes para mitigar (reduzir os danos) efeitos colaterais e fortalecer o sistema imunológico durante a jornada terapêutica.
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
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans text-natu-brown tracking-tight">
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
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans text-natu-brown tracking-tight">
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

            <div className="pb-12 mt-0 space-y-32 md:space-y-48">
                {/* 3. O Processo - Jornada do Paciente */}
                <section className="pt-16 md:pt-20 pb-0 relative overflow-hidden border-y border-gray-50 bg-white">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div
                            ref={journeyBgRef}
                            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-10 grayscale"
                            style={{
                                backgroundImage: "url('https://natuclinic-api.fabriccioarts.workers.dev/images/bg-julimar-meneses-1--1775824072609.png')",
                            }}
                        />
                        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
                    </div>
                    <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
                        <div className="text-center mb-16 px-6">
                            <span className="text-[10px] md:text-xs font-bold tracking-[0.1em] text-[#2D3134]/30 block mb-4 font-sans uppercase">A Jornada do Paciente</span>
                            <h2 className="text-4xl md:text-6xl font-serif text-natu-brown tracking-tighter mb-4 leading-[1.1] md:leading-[0.9]">
                                Sua trajetória <br className="md:hidden" />
                                para o equilíbrio
                            </h2>
                            <p className="font-sans text-sm md:text-base text-gray-400 mt-6 max-w-lg mx-auto">
                                Todas as consultas dão direito a retorno.
                            </p>
                        </div>

                        <div ref={journeyContainerRef} className="relative pt-10 px-4 md:px-0 max-w-6xl mx-auto">
                            {/* Centered Vertical Line on Desktop, Shorter Offset on Mobile */}
                            <div className="absolute left-[18px] md:left-1/2 top-[24px] bottom-0 w-[1px] bg-gray-100 md:-translate-x-1/2" />

                            {/* Animated Progress Bar */}
                            <div
                                ref={progressRef}
                                className="absolute left-[18px] md:left-1/2 top-[24px] bottom-0 w-[2px] bg-natu-brown origin-top z-10 scale-y-0 md:-translate-x-1/2"
                            />

                            {/* Progress Cursor (The TIP) */}
                            <div
                                ref={progressCursorRef}
                                className="absolute left-[18px] md:left-1/2 top-[24px] w-4 h-4 rounded-full bg-natu-brown shadow-[0_0_15px_rgba(76,38,26,0.5)] -translate-x-1/2 z-[11] pointer-events-none"
                            />

                            <div className="relative z-0 space-y-10 md:space-y-28">
                                {[
                                    {
                                        title: "Anamnese Nutricional",
                                        desc: "O ponto de partida para mapear seu histórico, estilo de vida e identificar as queixas que impedem sua vitalidade física e mental.",
                                        img: "/Anamnese Nutricional.svg"
                                    },
                                    {
                                        title: "Consulta e Diagnóstico Celular",
                                        desc: "Realização da Biorressonância Quântica integrada à análise detalhada do sangue e bioimpedância para um diagnóstico bioquímico de alta precisão.",
                                        img: "/Consulta e Diagnóstico Celular.svg"
                                    },
                                    {
                                        title: "Suplementação Personalizada",
                                        desc: "Entrega da sua fórmula única e orientação personalizada, com acompanhamento constante para garantir a evolução do seu protocolo.",
                                        img: "/Suplementação Personalizada.svg"
                                    },
                                    {
                                        title: "Retorno",
                                        desc: "Reavaliação clínica completa para consolidar as melhorias no seu metabolismo, analisar novos exames e ajustar o plano para longevidade.",
                                        img: "/Retorno.svg"
                                    }
                                ].map((item, i) => (
                                    <div key={i} className={`flex flex-col md:flex-row items-start md:items-center justify-center w-full relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''} pl-10 md:pl-0`}>
                                        {/* Ilustração (desktop only) */}
                                        <div className={`hidden md:flex w-1/2 ${i % 2 === 0 ? 'justify-start pl-16' : 'justify-end pr-16'}`}>
                                            <img
                                                ref={el => journeyIllustrationRefs.current[i] = el}
                                                src={item.img}
                                                alt={item.title}
                                                className="w-full max-w-[220px] h-auto will-change-transform"
                                            />
                                        </div>

                                        {/* Content Card */}
                                        <motion.div
                                            initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30, filter: 'blur(8px)' }}
                                            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                            viewport={{ once: false, margin: "-50% 0px -10% 0px" }}
                                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                            className={`w-full md:w-1/2 px-2 md:px-16 text-left ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                                        >
                                            <div className="flex flex-col items-start md:items-stretch group">
                                                <img
                                                    src={item.img}
                                                    alt=""
                                                    aria-hidden="true"
                                                    className="w-16 h-16 mb-3 md:hidden"
                                                />
                                                <span className={`text-6xl md:text-8xl font-sans font-black text-natu-brown/[0.04] leading-none mb-1 select-none`}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <h3 className="font-sans text-natu-brown text-lg md:text-2xl mb-1 tracking-tight font-bold transition-transform group-hover:scale-102 duration-500">
                                                    {item.title}
                                                </h3>
                                                <p className="font-sans font-light text-[#2D3134]/70 text-sm md:text-base leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Indicações - Infinite Horizontal Scroll Refined */}
                <section className="py-12 md:py-24 overflow-hidden relative bg-[#1a0e09]">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center opacity-20 pointer-events-none"
                        style={{ backgroundImage: "url('/fundo-card.jpg')" }}
                    />

                    <BlurFade className="relative z-10 text-center px-6 mb-12 md:mb-16">
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.1em] text-white/50 mb-3 block font-sans">
                            Aplicações
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight">
                            Para quem é indicado?
                        </h2>
                        <p className="mt-4 font-sans font-light text-white/60 max-w-2xl mx-auto">
                            Indicada para todas as idades, a Nutrição Ortomolecular atua em um amplo espectro de condições e patologias derivadas da nutrição, tratando a causa e não apenas os sintomas.
                        </p>
                    </BlurFade>

                    <div className="relative z-10 w-full overflow-hidden flex flex-col gap-5">
                        <div className="absolute inset-y-0 left-0 w-[15%] md:w-[25%] bg-gradient-to-r from-[#1a0e09] via-[#1a0e09]/80 to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-[15%] md:w-[25%] bg-gradient-to-l from-[#1a0e09] via-[#1a0e09]/80 to-transparent z-10 pointer-events-none" />

                        {[
                            {
                                direction: "left",
                                duration: 60,
                                tags: ["Fadiga crônica", "Ansiedade e estresse", "Distúrbios do sono", "Desequilíbrio hormonal", "Hipotireoidismo", "TPM e menopausa", "Envelhecimento precoce"]
                            },
                            {
                                direction: "right",
                                duration: 75,
                                tags: ["Queda de cabelo", "Acne e dermatites", "Dificuldade de emagrecer", "Inflamação silenciosa", "Disbiose intestinal", "Alergias e intolerâncias alimentares", "Pré e pós-operatório", "Performance esportiva"]
                            },
                            {
                                direction: "left",
                                duration: 70,
                                tags: ["Baixa imunidade", "Fibromialgia", "Depressão leve", "Colesterol alto", "Resistência à insulina", "Longevidade e prevenção", "Saúde Intestinal"]
                            }
                        ].map((row, rowIndex) => (
                            <div key={rowIndex} className="flex overflow-hidden">
                                <motion.div
                                    animate={{ x: row.direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
                                    transition={{
                                        duration: row.duration,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="flex flex-nowrap gap-4 whitespace-nowrap"
                                >
                                    {[...row.tags, ...row.tags, ...row.tags, ...row.tags].map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-6 py-3 rounded-full border border-white/15 text-white text-sm font-sans font-medium bg-white/5 hover:bg-white hover:text-[#1a0e09] hover:border-white transition-all duration-300 cursor-default"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Investimento: o que inclui a consulta */}
                <section className="bg-white py-16 md:py-24">
                    <div className="max-w-5xl mx-auto px-6 md:px-12">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                            {/* Parte 1: autoridade e explicação */}
                            <BlurFade>
                                <span className="text-[10px] md:text-xs font-bold tracking-[0.1em] text-[#2D3134]/40 mb-4 block font-sans">
                                    Referência em Brasília
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif text-natu-brown leading-tight tracking-tighter mb-6">
                                    Diagnóstico completo. <br /> Sem achismo.
                                </h2>
                                <p className="font-sans text-gray-500 font-light text-base md:text-lg leading-relaxed mb-6">
                                    Seu corpo dá sinais. A questão é entender o que eles estão dizendo.
                                </p>
                                <p className="font-sans text-gray-500 font-light text-base md:text-lg leading-relaxed mb-6">
                                    Com o Dr. Julimar, a consulta investiga seu organismo de forma individualizada, combinando avaliação clínica, análise sanguínea e, quando indicada, <strong className="text-natu-brown font-bold">Bioressonância Quântica</strong> (um exame indolor que avalia o funcionamento do seu corpo).
                                </p>
                                <p className="font-sans text-gray-500 font-light text-base md:text-lg leading-relaxed mb-6">
                                    A partir dos resultados, são avaliados possíveis desequilíbrios, sinais metabólicos e particularidades do organismo para direcionar uma estratégia personalizada de nutrição e suplementação.
                                </p>
                                <p className="font-sans text-natu-brown font-medium text-base md:text-lg leading-relaxed">
                                    Nada de protocolo pronto. <br />
                                    A conduta começa pelo que o seu organismo apresenta.
                                </p>
                            </BlurFade>

                            {/* Parte 2: o que está incluso */}
                            <BlurFade delay={0.1}>
                                <span className="text-[10px] md:text-xs font-bold tracking-[0.1em] text-[#2D3134]/40 mb-4 block font-sans">
                                    O que está incluso
                                </span>
                                <ul className="flex flex-col gap-3">
                                    {[
                                        "Bioressonância Quântica e análise sanguínea",
                                        "Detecção de alergias e intolerâncias alimentares",
                                        "Diagnose completa e individualizada",
                                        "Plano de suplementação natural personalizado",
                                        "Direito a consulta de retorno",
                                    ].map((text) => (
                                        <li
                                            key={text}
                                            className="relative overflow-hidden flex items-center gap-3 bg-[#2D3134] rounded-lg px-5 py-4 shadow-[inset_0_1px_24px_rgba(255,255,255,0.18)]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.14] via-white/[0.03] to-transparent pointer-events-none" />
                                            <div className="relative shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                                                <svg viewBox="0 0 12 10" fill="none" width="10" height="8"><path d="M1 5l3.5 3.5L11 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            </div>
                                            <span className="relative font-sans font-bold text-white text-sm md:text-base">{text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 rounded-xl overflow-hidden">
                                    <img
                                        src="/consulta-nutricional-ortomolecular.jpg"
                                        alt="Consulta de Nutrição Ortomolecular com o Dr. Julimar Meneses"
                                        className="w-full h-64 md:h-72 object-cover"
                                    />
                                </div>
                            </BlurFade>
                        </div>
                    </div>
                </section>

                {/* CTA Card Horizontal */}
                <section className="py-8 md:py-12">
                    <div className="max-w-5xl mx-auto px-6">
                        <BlurFade>
                            <div className="bg-gradient-to-r from-[#4C261A] to-[#3D1E15] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

                                <div className="relative z-10 text-center md:text-left">
                                    <h3 className="text-2xl md:text-4xl font-sans text-white tracking-tighter leading-tight mb-3">
                                        Recupere sua <br className="hidden md:block" /> vitalidade celular
                                    </h3>
                                    <p className="text-white/60 font-sans font-light text-sm md:text-lg max-w-sm">
                                        Dê o primeiro passo para o equilíbrio bioquímico com um atendimento de excelência.
                                    </p>
                                </div>

                                <div className="relative z-10">
                                    <NatuButton
                                        onClick={handleWhatsApp}
                                        className="!bg-white !text-[#4C261A] hover:!bg-natu-pink hover:!text-white"
                                    >
                                        Agendar consulta
                                    </NatuButton>
                                </div>
                            </div>
                        </BlurFade>
                    </div>
                </section>

                {/* Depoimentos em vídeo */}
                <VideoFeedbacks
                    feedbacks={ORTOMOLECULAR_FEEDBACKS}
                    title="Depoimentos que inspiram"
                    subtitle="Resultados reais de pacientes do Dr. Julimar"
                />

                {/* 5. Feedback */}
                <FeedbackSection />

                {/* 6. FAQ */}
                <section className="py-12 md:py-20 px-6 md:px-12">
                    <BlurFade className="text-center mb-12">
                        <span className="text-xs font-bold tracking-widest text-[#2D3134]/50 block mb-4 font-sans">Dúvidas comuns</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-natu-brown">Perguntas Frequentes</h2>
                    </BlurFade>

                    <div className="max-w-3xl mx-auto">
                        {FAQ_ITEMS.map((item, i) => (
                            <FAQItem key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </section>
            </div>
        </ServiceLayout>
    );
};

export default NutricaoOrtomolecular;
