import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Unicon from '../components/Unicon';
import { WHATSAPP_LINKS } from '../constants/links';
import SEO from '../components/SEO';

gsap.registerPlugin(ScrollTrigger);

const NatuButton = ({ children, href, className, dark }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center rounded-full font-sans font-bold text-sm md:text-base transition-all transform hover:scale-105 p-1.5 pr-6 sm:pr-8 ${dark
                ? 'bg-white text-natu-brown hover:bg-white/90 shadow-md'
                : 'bg-natu-brown text-white hover:bg-natu-brown/90'
            } ${className || ''}`}
    >
        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center mr-3 sm:mr-4 shrink-0 transition-colors ${dark ? 'bg-natu-brown text-white' : 'bg-white text-natu-brown'
            }`}>
            <Unicon name="arrow-right" size={16} />
        </div>
        <span className="mt-0.5">{children}</span>
    </a>
);

export default function Hipro({ goBack }) {
    const heroRef = useRef(null);
    const sectionsRef = useRef([]);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Animação da Hero
        const ctx = gsap.context(() => {
            gsap.fromTo('.hero-content > *',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
            );
            gsap.fromTo('.hero-image',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 1.2, ease: "power3.out", delay: 0.2 }
            );

            // Animação das seções ao scrollar
            sectionsRef.current.forEach((section) => {
                if (section) {
                    gsap.fromTo(section.querySelectorAll('.fade-up'),
                        { opacity: 0, y: 40 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            stagger: 0.15,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: section,
                                start: "top 85%",
                                toggleActions: "play none none reverse"
                            }
                        }
                    );
                }
            });
        });

        return () => ctx.revert();
    }, []);

    const addToRefs = (el) => {
        if (el && !sectionsRef.current.includes(el)) {
            sectionsRef.current.push(el);
        }
    };

    return (
        <div className="bg-[#F5F5F5] min-h-screen antialiased">
            <SEO
                title="Ultrassom Microfocado HIPRO® em Brasília — Natuclinic"
                description="Tratamento com Ultrassom Microfocado HIPRO® em Brasília para flacidez, contorno facial, papada e rejuvenescimento na Natuclinic."
                url="https://www.natuclinic.com.br/procedimentos/hipro"
                canonical="https://www.natuclinic.com.br/procedimentos/hipro"
                keywords="ultrassom microfocado brasília, hifu brasília, tratamento para flacidez facial brasília, rejuvenescimento facial brasília, tratamento para papada brasília, contorno facial brasília, hipro"
                image="/images/hipro-bg.png"
            />

            {/* HERO SECTION */}
            <header
                ref={heroRef}
                className="relative flex items-end pt-24 pb-0 md:pt-40 md:pb-0 overflow-hidden bg-[#F0F0F0]"
            >
                {/* Background Decorativo */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-black/5 rounded-bl-[100px] -z-10 hidden lg:block"></div>

                <div className="container mx-auto px-8 sm:px-12 lg:px-16 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-24">

                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 hero-content text-center lg:text-left z-10 pb-10 md:pb-16">
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                                <span className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.25em] font-bold text-natu-gold">
                                    Rejuvenescimento Sem Cortes
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-natu-brown leading-none tracking-tighter mb-6 max-w-2xl lg:max-w-3xl mx-auto lg:mx-0 text-balance">
                                Ultrassom Microfocado em Brasília:<br className="hidden md:block" /> Rejuvenescimento Facial
                            </h1>

                            <p className="text-sm md:text-base lg:text-lg text-natu-brown/70 leading-relaxed font-light font-sans mb-6 md:mb-10 max-w-md mx-auto lg:mx-0">
                                Recupere a definição da mandíbula, melhore a aparência da flacidez e trate a papada.
                            </p>

                            <div className="flex flex-col items-center lg:items-start gap-3">
                                <NatuButton href={WHATSAPP_LINKS.MSG_HIPRO}>
                                    Agendar Avaliação
                                </NatuButton>
                                <button
                                    onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
                                    className="px-6 py-3 rounded-full border border-natu-brown/20 text-natu-brown font-bold text-sm hover:bg-natu-brown/5 transition-colors flex items-center justify-center h-[44px] sm:h-[48px]"
                                >
                                    Mais informações
                                </button>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="w-full lg:w-1/2 hero-image relative flex items-end justify-center">
                            <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg">
                                <picture>
                                    <source media="(min-width: 1024px)" srcSet="/dra-debora-hipro-brasilia.png" />
                                    <img
                                        src="/dra-debora-hipro-brasilia.png"
                                        alt="Dra. Débora - Ultrassom Microfocado HIPRO em Brasília"
                                        className="w-full h-auto block object-contain object-bottom"
                                    />
                                </picture>
                                {/* Removed Floating Badge */}
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            {/* SECTION 2: Image Left, Text Right (Ivory BG) */}
            <section ref={addToRefs} className="min-h-[70vh] pt-20 pb-0 md:py-28 lg:py-32 bg-natu-ivory flex items-center overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-24">

                        <div className="w-full lg:w-1/2 fade-up flex justify-center items-end self-end">
                            <div className="relative w-full max-w-md lg:max-w-lg">
                                <img
                                    src="/Aplicador-hirpo-HIFU-natuclinic.png.webp"
                                    alt="Aparelho Hipro na Natuclinic"
                                    className="w-full h-auto block"
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2">
                            <div className="max-w-lg">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold text-natu-brown leading-none tracking-tighter mb-6 fade-up">
                                    Como funciona a tecnologia?
                                </h2>
                                <div className="space-y-5 text-sm md:text-base text-natu-brown/80 font-light fade-up leading-relaxed">
                                    <p>
                                        A tecnologia de <strong>ultrassom micro e macrofocado (HIFU)</strong> atinge as camadas mais profundas da pele, onde os cremes não chegam.
                                    </p>
                                    <p>
                                        Com um controle eletrônico de profundidade, o tratamento é <strong>100% personalizado</strong> para a sua necessidade, aquecendo os tecidos de sustentação e estimulando a produção natural de colágeno.
                                    </p>
                                    <p>
                                        É a tecnologia ideal em <strong>rejuvenescimento facial em Brasília</strong> para quem busca resultados duradouros, progressivos e <strong>sem cirurgia</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 1: Card marrom */}
            <section ref={addToRefs} className="py-12 md:py-16 bg-white overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                    {/* Card */}
                    <div
                        className="rounded-3xl overflow-hidden flex flex-col-reverse lg:flex-row items-stretch fade-up min-h-[460px] lg:min-h-[520px]"
                        style={{ background: 'radial-gradient(ellipse at top left, #6B3526 0%, #4C261A 50%), radial-gradient(ellipse at bottom right, #7A3D2C 0%, #4C261A 55%)' }}
                    >

                        {/* Image side — ocupa toda a altura do card */}
                        <div className="w-full lg:w-[48%] flex items-end justify-center overflow-hidden">
                            <img
                                src="/Sheila-Mello-com-Hipro-natuclinic.png.webp"
                                alt="Sheila Mello com Hipro"
                                className="w-full h-auto block object-contain object-bottom lg:max-h-[500px]"
                            />
                        </div>

                        {/* Text side */}
                        <div className="w-full lg:w-[52%] p-10 md:p-12 lg:p-16 flex flex-col justify-center gap-8">
                            <div>
                                <span className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold block mb-4">Tratamento Não Invasivo</span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white leading-[0.95] tracking-tighter">
                                    Flacidez e<br />Contorno Facial
                                </h2>
                            </div>
                            <p className="text-base text-white/70 font-light leading-relaxed">
                                Buscando <strong className="text-white font-semibold">ultrassom microfocado em Brasília</strong>? O <strong className="text-white font-semibold">HIPRO®</strong> é a tecnologia de ponta para tratar flacidez, papada e perda de contorno facial de forma não invasiva.
                            </p>
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                                    <Unicon name="check-circle" size={14} /> Remodelação do colágeno
                                </span>
                                <span className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                                    <Unicon name="check-circle" size={14} /> Definição da mandíbula
                                </span>
                                <span className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                                    <Unicon name="check-circle" size={14} /> Redução da papada
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* SECTION 3: Grid Details (Dark BG) */}
            <section ref={addToRefs} className="py-24 md:py-32 bg-[#3D1E15] text-white overflow-hidden relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">

                    <div className="text-center max-w-2xl mx-auto mb-16 fade-up">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold text-white leading-none tracking-tighter mb-4">
                            Para quem é indicado?
                        </h2>
                        <p className="text-white/70 text-sm md:text-base font-light">
                            O tratamento ideal para quem apresenta sinais de perda de estrutura, firmeza ou contorno.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            { icon: "heart", title: "Flacidez Facial", desc: "Melhora a aparência e firmeza da pele do rosto e pescoço." },
                            { icon: "user", title: "Contorno", desc: "Recupera a definição da mandíbula para um rosto mais marcado." },
                            { icon: "activity", title: "Papada", desc: "Atua em regiões com maior volume de tecido adiposo e flacidez." },
                            { icon: "microscope", title: "Rugas e Linhas", desc: "Estimula o colágeno para atenuar sinais de envelhecimento." },
                            { icon: "stethoscope", title: "Corpo", desc: "Também utilizado para alterações de contorno e gordura localizada." },
                            { icon: "shield-check", title: "Prevenção", desc: "Tratamento preventivo para manter a firmeza da pele a longo prazo." }
                        ].map((item, index) => (
                            <div key={index} className="bg-white/5 rounded-3xl p-6 lg:p-8 hover:bg-white/10 transition-colors fade-up group">
                                <div className="w-12 h-12 rounded-full bg-natu-gold/10 group-hover:bg-natu-gold/20 flex items-center justify-center text-natu-gold mb-6 transition-colors">
                                    <Unicon name={item.icon} size={20} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold font-sans mb-3 text-white">{item.title}</h3>
                                <p className="text-white/50 font-light text-xs md:text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4: Text Left, Image Right (White BG) - Focus on Identity */}
            <section ref={addToRefs} className="min-h-[70vh] py-20 md:py-28 lg:py-32 bg-white flex items-center overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                        <div className="w-full lg:w-1/2">
                            <div className="max-w-lg">
                                <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold text-natu-brown leading-none tracking-tighter mb-6 fade-up">
                                    Rejuvenescimento sem perder <br className="hidden md:block" />sua identidade
                                </h2>
                                <div className="space-y-5 text-sm md:text-base text-natu-brown/80 font-light fade-up mb-10 leading-relaxed">
                                    <p>
                                        O verdadeiro rejuvenescimento não muda quem você é. Nosso objetivo é <strong>suavizar os sinais do tempo</strong> e devolver a firmeza natural do seu rosto.
                                    </p>
                                    <p>
                                        Seja para redefinir o contorno da mandíbula, tratar a papada ou eliminar a aparência de "rosto cansado", nossa abordagem garante resultados <strong>elegantes, naturais e harmoniosos</strong>.
                                    </p>
                                    <p>
                                        <strong>A sua identidade preservada, na sua melhor versão.</strong>
                                    </p>
                                </div>
                                <div className="fade-up">
                                    <NatuButton href={WHATSAPP_LINKS.MSG_HIPRO}>
                                        Falar com Especialista
                                    </NatuButton>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 fade-up flex justify-center">
                            <div className="relative w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
                                <img
                                    src="/Areas-de-aplicacao-do-ultrassom-microfocado-hipro-contourline-medical-1024x637.jpg.webp"
                                    alt="Áreas de aplicação do ultrassom microfocado Hipro"
                                    className="w-full h-auto block"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* FINAL CTA SECTION */}
            <section ref={addToRefs} className="py-20 md:py-32 bg-natu-ivory">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                    <div className="bg-[#3D1E15] rounded-[2rem] md:rounded-[3rem] p-10 md:p-16 lg:p-20 text-center relative overflow-hidden fade-up">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-natu-gold/10 flex items-center justify-center text-natu-gold mb-8">
                                <Unicon name="calendar-alt" size={24} />
                            </div>

                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-white leading-none tracking-tighter mb-6">
                                Agende sua avaliação
                            </h2>

                            <p className="text-white/70 text-sm md:text-base font-light mb-10 max-w-xl mx-auto leading-relaxed">
                                O primeiro passo para o seu tratamento é realizar uma avaliação. Analisamos as características do seu rosto e identificamos se o HIPRO® é indicado para o seu caso.
                            </p>

                            <NatuButton href={WHATSAPP_LINKS.MSG_HIPRO} dark={true}>
                                Agendar no WhatsApp
                            </NatuButton>

                            <p className="text-white/30 text-[10px] sm:text-xs mt-8 uppercase tracking-[0.2em] font-bold">
                                Natuclinic Brasília — Ultrassom Microfocado HIPRO®
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
