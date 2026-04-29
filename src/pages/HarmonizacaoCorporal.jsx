import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';
import { motion, useScroll, useTransform } from "framer-motion";
import { WHATSAPP_LINKS } from '../constants/links';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoFeedbacks from '../components/VideoFeedbacks';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const VideoPlayer = ({ src }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const isDragging = useRef(false);

    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showCenter, setShowCenter] = useState(true);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
            v.play();
            setPlaying(true);
            setShowCenter(false);
        } else {
            v.pause();
            setPlaying(false);
            setShowCenter(true);
        }
    };

    const onTimeUpdate = () => {
        const v = videoRef.current;
        if (!v || isDragging.current) return;
        setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
    };

    const onEnded = () => {
        setPlaying(false);
        setShowCenter(true);
    };

    const seekAt = (clientX) => {
        const bar = progressRef.current;
        const v = videoRef.current;
        if (!bar || !v || !v.duration) return;
        const rect = bar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        v.currentTime = ratio * v.duration;
        setProgress(ratio * 100);
    };

    const onBarPointerDown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        isDragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        seekAt(e.clientX);
    };

    const onBarPointerMove = (e) => {
        if (!isDragging.current) return;
        seekAt(e.clientX);
    };

    const onBarPointerUp = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        e.currentTarget.releasePointerCapture(e.pointerId);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[9/16] md:aspect-video rounded-2xl overflow-hidden bg-black border border-[#C5A059]/20 select-none"
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover cursor-pointer"
                playsInline
                preload="metadata"
                onTimeUpdate={onTimeUpdate}
                onEnded={onEnded}
                onClick={togglePlay}
            />

            {/* Center play/pause */}
            <motion.button
                onClick={togglePlay}
                initial={false}
                animate={{ opacity: showCenter ? 1 : 0, scale: showCenter ? 1 : 0.8 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ x: '-50%', y: '-50%' }}
                className="absolute top-1/2 left-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center z-20 cursor-pointer"
            >
                {playing
                    ? <svg viewBox="0 0 24 24" fill="white" width="22" height="22"><rect x="6" y="4" width="4" height="16" rx="1.5" /><rect x="14" y="4" width="4" height="16" rx="1.5" /></svg>
                    : <svg viewBox="0 0 24 24" fill="white" width="22" height="22" style={{ marginLeft: 3 }}><path d="M5 3l14 9-14 9V3z" /></svg>
                }
            </motion.button>

            {/* Progress bar — always visible, pinned to bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                {/* Thin gradient fade above the bar for contrast */}
                <div className="h-8 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                <div
                    ref={progressRef}
                    className="relative w-full h-1 bg-white/20 cursor-pointer group"
                    onPointerDown={onBarPointerDown}
                    onPointerMove={onBarPointerMove}
                    onPointerUp={onBarPointerUp}
                >
                    {/* Fill */}
                    <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#C5A059] to-[#E5C992]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

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
                <span className="font-bold text-sm md:text-base text-[#4C261A] leading-snug">{question}</span>
                <span className={`shrink-0 w-6 h-6 rounded-full border border-[#C5A059]/40 flex items-center justify-center transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
                    <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                        <path d="M6 1v10M1 6h10" stroke="#C5A059" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </span>
            </button>
            {open && (
                <p className="text-[#4C261A]/60 text-sm leading-relaxed pb-6">{answer}</p>
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
        <div className="bg-white text-[#4C261A] font-sans overflow-x-hidden harmonizacao-page">
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
                <div className="absolute inset-0 -z-10 overflow-hidden bg-[#4C261A]">
                    <img
                        src="/bg-woman-01.svg"
                        alt="Mulher após protocolo Harmone Bee® de harmonização corporal em Brasília"
                        className="w-full h-full object-cover object-[70%_15%] md:object-[95%_15%] opacity-90"
                    />
                    {/* Gradient Overlay for Text Contrast - Mobile: Bottom to Top | Desktop: Left to Right */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4C261A]/100 via-[#4C261A]/40 to-transparent md:bg-gradient-to-r" />
                </div>

                <div className="relative w-full desktop-container pt-72 grid grid-cols-1 md:grid-cols-[45%_55%]">
                    {/* Free Space on the right */}
                    <div className="hidden md:block order-last"></div>

                    {/* Content on the left / Centered on mobile */}
                    <div className="flex flex-col justify-center items-center text-center md:items-start md:text-left relative order-first">

                        <Fade delay={0.1} className="mix-blend-difference w-full">
                            <h1 className="text-3xl md:text-4xl font-normal leading-[1.1] tracking-tight mb-8 text-white max-w-4xl mx-auto md:mx-0 drop-shadow-2xl">
                                Seu corpo cansou das dietas. <strong className="font-serif italic bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent inline-block">A gente também.</strong> Alcance seu melhor corpo em 90 dias.
                            </h1>
                            <p className="text-sm md:text-base text-white/70 max-w-xl mb-10 font-light leading-relaxed drop-shadow-lg">
                                <strong className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent inline-block">Harmone Bee®</strong> é o protocolo de harmonização corporal de 90 dias da Natuclinic em Brasília — une nutrição ortomolecular, detox e estética avançada com acompanhamento diário no WhatsApp. Sem promessa milagrosa. Só método, ciência e cuidado real.
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
                                    className="natu-button relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#C5A059] to-[#E5C992] text-[#4C261A] hover:brightness-110 transition-all duration-300 border-none shadow-2xl z-10"
                                >
                                    <span className="natu-button__icon-wrapper bg-[#4C261A] text-white">
                                        <svg viewBox="0 0 14 15" fill="none" className="natu-button__icon-svg" width="10"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                        <svg viewBox="0 0 14 15" fill="none" width="10" className="natu-button__icon-svg natu-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                    </span>
                                    <span className="font-bold text-sm md:text-base">Quero entender se é pra mim</span>
                                </button>
                            </div>
                        </Fade>

                    </div>
                </div>
            </section>

            {/* 2. Para quem é */}
            <section className="bg-[#F9F7F5] text-[#4C261A] py-24 md:py-36">
                <div className="desktop-container">
                    <Fade>
                        <h2 className="font-sans text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight mb-16 text-center text-[#4C261A]">
                            Esse protocolo é pra você <em className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent not-italic">se…</em>
                        </h2>
                    </Fade>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#4C261A]/10">
                        {[
                            { title: "Já tentou de tudo", text: "Dieta da moda, app de jejum, estética solta. Perdeu, recuperou, frustrou. Tá pronta pra um caminho com método." },
                            { title: "Quer cuidado real", text: "Cansou de ser mais um número em consultório lotado. Quer ser olhada, ouvida e ajustada ao longo do processo." },
                            { title: "Quer resultado que fica", text: "Não busca solução de 30 dias. Quer mudar a forma como seu corpo funciona — pra não voltar à estaca zero em janeiro." },
                            { title: "Quer energia e leveza", text: "Acordar sem inchaço, abotoar a calça sem prender o ar, ter disposição depois das 18h. Resultado estético é consequência." },
                        ].map((item, i) => (
                            <Fade key={i} delay={i * 0.08}>
                                <div className="bg-[#F9F7F5] p-8 md:p-10 flex flex-col gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6A2E] flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 12 10" fill="none" width="12" height="10"><path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </div>
                                    <h3 className="text-[#4C261A] font-bold text-base md:text-lg">{item.title}</h3>
                                    <p className="text-[#4C261A]/50 text-sm leading-relaxed">{item.text}</p>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Nós ouvimos você */}
            <section className="bg-[#4C261A] py-24 md:py-36 overflow-hidden noise-bg">
                <div className="desktop-container w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="w-full text-center md:text-left flex flex-col items-center md:items-start md:sticky md:top-32">
                            <Fade>
                                <h2 className="text-xl md:text-2xl font-normal leading-tight tracking-tight bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent">
                                    Antes de qualquer protocolo,<br />a gente escuta.
                                </h2>
                            </Fade>
                            <Fade delay={0.15}>
                                <p className="text-white/70 text-sm md:text-base font-light leading-relaxed mt-4">
                                    A primeira conversa não é sobre balança. É sobre o que você já tentou, o que travou, como anda seu <strong className="text-white">sono, sua menstruação, sua rotina, sua cabeça</strong>. Porque corpo que não emagrece quase sempre tá mandando recado em outra coisa.
                                </p>
                                <p className="text-white/70 text-sm md:text-base font-light leading-relaxed mt-6">
                                    Só depois disso a Dra. Débora monta o seu <strong className="text-white">Harmone Bee®</strong>. Personalizado de verdade — não no marketing, na prática.
                                </p>
                            </Fade>
                        </div>
                        <Fade delay={0.2} className="flex justify-center md:justify-end">
                            <div className="rotate-[-4deg] bg-white p-3 pb-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] w-[260px] md:w-[320px]">
                                <img src="/bg-woman-02.svg" alt="Consulta de avaliação personalizada com a Dra. Débora na Natuclinic" className="w-full h-[340px] md:h-[420px] object-cover object-[70%_center]" />
                            </div>
                        </Fade>
                    </div>
                </div>
            </section>

            {/* 4. O Protocolo */}
            <section className="bg-[#4C261A] text-white py-24 md:py-36 noise-bg overflow-hidden">
                <div className="desktop-container grid md:grid-cols-[3fr_2fr] gap-16 md:gap-0 items-center">
                    <div className="min-w-0 w-full text-center md:text-left flex flex-col items-center md:items-start order-last md:order-last">
                        <Fade className="w-full">
                            <h2 className="w-full text-2xl md:text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent">
                                Não é mais uma dieta. É um protocolo de 90 dias.
                            </h2>
                        </Fade>
                        <Fade delay={0.15} className="w-full">
                            <p className="w-full text-white/70 text-sm md:text-base leading-relaxed mt-4 mb-6">
                                Você já tentou shake, jejum, treino pesado, estética solta por aí. Funcionou um pouco, depois voltou tudo. A gente entende. O <strong className="text-white">Harmone Bee®</strong> foi desenhado pra quebrar esse ciclo: 90 dias tratando o seu corpo como um sistema inteiro — <strong className="text-white">metabolismo, intestino, pele e cabeça</strong> funcionando junto.
                            </p>
                            <p className="w-full text-white/70 text-sm md:text-base leading-relaxed mb-12">
                                Aqui em Taguatinga, a <strong className="text-white">Dra. Débora Meneses</strong> conduz cada etapa com ajustes semanais. Nada de protocolo de prateleira.
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
                                    onClick={handleWhatsApp}
                                    className="natu-button relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#E5C992] text-[#4C261A] hover:brightness-110 transition-all duration-300 border-none shadow-2xl z-10 rounded-full"
                                >
                                    <span className="natu-button__icon-wrapper bg-[#4C261A] text-white">
                                        <svg viewBox="0 0 14 15" fill="none" className="natu-button__icon-svg" width="10"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                        <svg viewBox="0 0 14 15" fill="none" width="10" className="natu-button__icon-svg natu-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                    </span>
                                    <span className="font-bold text-sm md:text-base uppercase tracking-wider">Falar com a Dra. Débora</span>
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

            {/* O que inclui */}
            <section className="bg-[#F9F7F5] text-[#4C261A] py-24 md:py-36">
                <div className="desktop-container">
                    <Fade>
                        <p className="text-[10px] uppercase tracking-normal text-[#4C261A]/30 mb-4 text-center">Tudo que você precisa em um só lugar</p>
                        <h2 className="font-sans text-2xl md:text-3xl font-bold uppercase leading-tight tracking-tight mb-16 text-[#4C261A] text-center">
                            90 dias. <em className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent not-italic">4 frentes trabalhando ao mesmo tempo.</em>
                        </h2>
                    </Fade>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#4C261A]/10">
                        {[
                            {
                                title: "Plano alimentar funcional",
                                desc: "Esquece contar caloria. Você aprende a comer pra desinflamar, regular hormônio e parar de sentir fome o dia inteiro. Ortomolecular aplicado ao seu dia real."
                            },
                            {
                                title: "Detox que faz sentido",
                                desc: "Limpeza hepática, intestinal e linfática conduzida com suplementação direcionada. Inchaço cede, energia volta — sem sofrimento e sem chá milagroso."
                            },
                            {
                                title: "Procedimentos que potencializam",
                                desc: "Tecnologias para gordura localizada, flacidez e celulite trabalhando em sinergia com o protocolo interno. Resultado aparece porque o corpo todo está respondendo."
                            },
                            {
                                title: "A gente no seu bolso, todo dia",
                                desc: "Dúvida no almoço, dia difícil, recaída no fim de semana. Você manda, a gente responde. Acompanhamento de verdade — não bot, não copia e cola."
                            },
                        ].map((item, i) => (
                            <Fade key={i} delay={i * 0.08}>
                                <div className="bg-[#F9F7F5] p-8 md:p-10 flex flex-col gap-3">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B6A2E] flex items-center justify-center shrink-0">
                                        <svg viewBox="0 0 12 10" fill="none" width="12" height="10">
                                            <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h3 className="text-[#4C261A] font-bold text-base md:text-lg">{item.title}</h3>
                                    <p className="text-[#4C261A]/50 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </Fade>
                        ))}
                    </div>
                </div>
            </section>

            {/* Passo a passo */}
            <section className="bg-[#4C261A] py-24 md:py-36 noise-bg">
                <div className="desktop-container">
                    <Fade>
                        <p className="text-[10px] uppercase tracking-normal text-white/30 mb-4 text-center">Como o método funciona</p>
                        <h2 className="font-sans text-2xl md:text-3xl font-bold uppercase text-center mb-16 bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent">
                            Quatro pilares que se sustentam juntos.
                        </h2>
                    </Fade>
                    {(() => {
                        const steps = [
                            { num: "01", title: "Detox Corporal", desc: "Limpa o terreno. Fígado, intestino e sistema linfático preparados pra responder." },
                            { num: "02", title: "Manejo Alimentar", desc: "Comida como remédio. Ajustes ortomoleculares pro seu metabolismo voltar a trabalhar a seu favor." },
                            { num: "03", title: "Procedimentos Estéticos", desc: "Tecnologia onde precisa. Gordura localizada, flacidez e textura da pele tratadas com protocolo individual." },
                            { num: "04", title: "Acompanhamento", desc: "Você não fica sozinha. Reavaliações, ajustes e WhatsApp ativo durante os 90 dias inteiros." },
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
                                                    <h3 className="text-[#4C261A] font-bold text-sm leading-snug">{step.title}</h3>
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
                                                    <h3 className="text-[#4C261A] font-bold text-sm leading-snug">{step.title}</h3>
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

            {/* 7. Vídeo */}
            <section className="bg-[#4C261A] py-12 md:py-16 noise-bg">
                <div className="desktop-container">
                    <Fade className="mb-8 text-center">
                        <p className="text-[10px] uppercase tracking-normal text-white/30 mb-2">Conheça o protocolo</p>
                        <h2 className="font-sans text-xl md:text-2xl font-bold text-white leading-tight">
                            Veja como funciona o <span className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent">Harmone Bee®</span> na prática
                        </h2>
                    </Fade>
                    <Fade>
                        <VideoPlayer src="https://natuclinic-api.fabriccioarts.workers.dev/images/instituto-1776882292978.mp4" />
                    </Fade>
                </div>
            </section>

            {/* 8. Depoimentos */}
            <section className="bg-[#F9F7F5] text-[#4C261A] pt-24 md:pt-36 pb-12 md:pb-16">
                <div className="desktop-container mb-8">
                    <Fade>
                        <h2 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-[#4C261A]">
                            Resultados<br /> que impressionam.
                        </h2>
                    </Fade>
                </div>
                <VideoFeedbacks showTitle={false} bgColor="bg-transparent" pyClass="py-0" />
            </section>

            {/* 9. Quem é a profissional */}
            <section className="bg-[#4C261A] py-24 md:py-36 noise-bg">
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
                            <p className="text-[10px] uppercase tracking-normal text-white/30">Quem cuida de você</p>
                            <h2 className="font-sans text-3xl md:text-5xl font-bold uppercase text-white leading-tight whitespace-nowrap">
                                Dra. Débora Meneses
                            </h2>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed">
                                <strong className="text-white">Dra. Débora Meneses</strong> é Biomédica Esteta com formação em Nutrição, à frente da Natuclinic em Taguatinga. Atende mulheres que chegam exaustas de tentativas avulsas — e constrói com cada uma um protocolo que faz sentido pra vida real, não pro Instagram.
                            </p>
                            <p className="text-white/60 text-sm md:text-base leading-relaxed">
                                O <strong className="text-white">Harmone Bee®</strong> é o método dela: une o que funciona da nutrição ortomolecular, do detox clínico e da estética avançada num só caminho. Sem achismo, sem moda passageira. Cada decisão é baseada no seu exame, sua rotina e sua resposta semana a semana.
                            </p>
                            <button
                                onClick={handleWhatsApp}
                                className="natu-button mt-4 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#E5C992] text-[#4C261A] hover:brightness-110 transition-all duration-300 border-none shadow-2xl rounded-full"
                            >
                                <span className="natu-button__icon-wrapper bg-[#4C261A] text-white">
                                    <svg viewBox="0 0 14 15" fill="none" className="natu-button__icon-svg" width="10"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                    <svg viewBox="0 0 14 15" fill="none" width="10" className="natu-button__icon-svg natu-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                </span>
                                <span className="font-bold text-sm">Falar com a Dra. Débora</span>
                            </button>
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
                            <p className="text-[10px] uppercase tracking-normal text-[#4C261A]/30 mb-4">Dúvidas</p>
                            <h2 className="font-sans text-2xl md:text-4xl font-bold uppercase text-[#4C261A] leading-tight">
                                Perguntas<br /><em className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent not-italic">frequentes</em>
                            </h2>
                        </Fade>
                        {/* Perguntas à direita */}
                        <div className="divide-y divide-[#4C261A]/10">
                            {[
                                {
                                    q: "Funciona pra qualquer tipo de corpo?",
                                    a: "Funciona pra qualquer mulher disposta a seguir o protocolo. O que muda é o ponto de partida e o ritmo. Corpo magro com inchaço crônico, corpo com 15kg pra perder, corpo na perimenopausa — cada um tem um Harmone Bee® próprio. A avaliação inicial define isso."
                                },
                                {
                                    q: "Preciso fazer dieta restritiva?",
                                    a: "Não. Restrição extrema é justamente o que faz você desistir no dia 12. O plano é funcional: come comida de verdade, em quantidade que sustenta seu dia, com ajustes ortomoleculares. Você vai sentir menos fome, não mais."
                                },
                                {
                                    q: "Em quanto tempo vejo resultado?",
                                    a: "Inchaço e energia costumam mudar nas primeiras 2 a 3 semanas. Medidas e composição corporal aparecem entre 30 e 60 dias. O resultado consolidado — o que fica depois do protocolo — é o objetivo dos 90 dias inteiros. A gente prefere te falar isso na cara do que prometer milagre."
                                },
                                {
                                    q: "O que está incluído nos 90 dias?",
                                    a: "Avaliação inicial completa, plano alimentar funcional, protocolo de detox com suplementação direcionada, sessões de procedimentos estéticos conforme seu plano, reavaliações periódicas e acompanhamento diário no WhatsApp com a equipe."
                                },
                                {
                                    q: "Preciso morar em Brasília?",
                                    a: "Pra parte estética, sim — os procedimentos são presenciais aqui em Taguatinga. A nutrição e o acompanhamento podem ser feitos à distância, mas o protocolo completo entrega mais quando você consegue vir à clínica. Se você é de outra cidade, conversa com a gente que adaptamos."
                                },
                                {
                                    q: "Como começar?",
                                    a: "Clica no botão, manda uma mensagem no WhatsApp e a gente agenda sua avaliação com a Dra. Débora. Nessa primeira conversa você entende se o Harmone Bee® é pra você — sem compromisso, sem pressão."
                                },
                            ].map((item, i) => (
                                <FaqItem key={i} question={item.q} answer={item.a} delay={i * 0.05} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="bg-[#4C261A] py-24 md:py-36 noise-bg">
                <div className="desktop-container flex flex-col items-center text-center gap-8">
                    <Fade className="w-full flex flex-col items-center text-center">
                        <p className="text-[10px] uppercase tracking-normal text-white/30">Pronta pra começar?</p>
                        <h2 className="font-sans text-2xl md:text-4xl font-bold uppercase text-white leading-tight mt-3 max-w-2xl mx-auto">
                            90 dias pra mudar a relação com o seu corpo. <em className="bg-gradient-to-r from-[#C5A059] to-[#E5C992] bg-clip-text text-transparent not-italic">De verdade.</em>
                        </h2>
                        <p className="text-white/50 text-sm md:text-base leading-relaxed mt-4 max-w-lg mx-auto">
                            A avaliação com a Dra. Débora é o primeiro passo — sem compromisso, sem pressão. Você entende o protocolo e decide se faz sentido pra você.
                        </p>
                    </Fade>
                    <Fade delay={0.2} className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                                <defs>
                                    <linearGradient id="beam-grad-cta" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="transparent" />
                                        <stop offset="20%" stopColor="#E5C992" />
                                        <stop offset="50%" stopColor="white" />
                                        <stop offset="80%" stopColor="#E5C992" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                                <motion.rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="40" fill="none" stroke="url(#beam-grad-cta)" strokeWidth="4" pathLength="1" strokeDasharray="0.15 1" animate={{ strokeDashoffset: [0, -1] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="drop-shadow-[0_0_10px_rgba(255,255,255,1)]" />
                                <motion.rect x="2" y="2" width="calc(100% - 4px)" height="calc(100% - 4px)" rx="40" fill="none" stroke="#E5C992" strokeWidth="10" pathLength="1" strokeDasharray="0.2 1" animate={{ strokeDashoffset: [0, -1] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="blur-2xl opacity-70" />
                            </svg>
                            <button
                                onClick={handleWhatsApp}
                                className="natu-button relative flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#C5A059] to-[#E5C992] text-[#4C261A] hover:brightness-110 transition-all duration-300 border-none shadow-2xl z-10"
                            >
                                <span className="natu-button__icon-wrapper bg-[#4C261A] text-white">
                                    <svg viewBox="0 0 14 15" fill="none" className="natu-button__icon-svg" width="10"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                    <svg viewBox="0 0 14 15" fill="none" width="10" className="natu-button__icon-svg natu-button__icon-svg--copy"><path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor" /></svg>
                                </span>
                                <span className="font-bold text-sm md:text-base">Agendar minha avaliação</span>
                            </button>
                        </div>
                        <p className="text-white/30 text-xs">Sem compromisso. Só uma conversa.</p>
                    </Fade>
                </div>
            </section>

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
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4C261A]"><path d="M17 8l4 4-4 4"></path><path d="M3 12h18"></path><path d="M7 16l-4-4 4-4"></path></svg>
                </div>
            </div>
            <div className="absolute bottom-6 left-6 bg-[#4C261A]/80 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md">Antes</div>
            <div className="absolute bottom-6 right-6 bg-white/80 text-[#4C261A] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md">Depois</div>
        </div>
    );
};

export default HarmonizacaoCorporal;
