import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Unicon from './Unicon';

gsap.registerPlugin(ScrollTrigger);

const ServiceLayout = ({ title, subtitle, children, goBack, coverImage, whatsappMessage }) => {
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current.children, {
                y: 30,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, headerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-white text-natu-brown selection:bg-natu-pink/30">
            {/* Navigation */}
            <nav className={`fixed top-0 left-0 w-full z-50 p-6 md:p-8 ${coverImage ? 'text-white mix-blend-difference' : 'mix-blend-multiply'}`}>
                <button
                    onClick={goBack}
                    className="group flex items-center gap-3 text-sm font-sans tracking-widest uppercase hover:opacity-60 transition-opacity"
                >
                    <Unicon name="arrow-left" size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Voltar</span>
                </button>
            </nav>

            {/* Hero Header */}
            <header
                ref={headerRef}
                className={`relative pt-40 pb-20 md:pt-60 md:pb-32 px-6 md:px-12 w-full mx-auto text-center overflow-hidden ${coverImage ? 'bg-natu-brown' : ''}`}
            >
                {/* Background Image if present */}
                {coverImage && (
                    <div className="absolute inset-0 z-0">
                        <div
                            className="absolute inset-0 bg-cover bg-center opacity-60"
                            style={{ backgroundImage: `url('${coverImage}')` }}
                        />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
                    </div>
                )}

                <div className={`relative z-10 max-w-5xl mx-auto ${coverImage ? 'text-white' : ''}`}>
                    <span className={`block text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-6 font-sans ${coverImage ? 'opacity-80' : 'opacity-40'}`}>
                        Procedimentos Natuclinic
                    </span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic mb-8 leading-[1.1] text-balance">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className={`text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed font-sans text-pretty ${coverImage ? 'opacity-90' : 'opacity-70'}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </header>

            {/* Main Content Info */}
            <main className="px-6 md:px-12 pb-24 max-w-4xl mx-auto space-y-24">
                {children}
            </main>

            {/* Footer CTA */}
            <section className="bg-natu-brown text-[#F2F0E9] py-32 text-center px-6">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-serif italic mb-8">
                        Sua jornada começa aqui.
                    </h2>
                    <p className="opacity-70 mb-12 font-sans font-light leading-relaxed">
                        Dê o primeiro passo com segurança e acolhimento. Agende sua consulta avaliativa.
                    </p>
                    <a 
                        href={`https://wa.me/5561992551867?text=${encodeURIComponent(whatsappMessage || "Olá! Gostaria de agendar uma consulta.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-10 py-4 border border-[#F2F0E9]/30 rounded-full text-xs tracking-[0.2em] uppercase font-sans hover:bg-[#F2F0E9] hover:text-natu-brown transition-all duration-500"
                    >
                        Agendar Consulta
                    </a>
                </div>
            </section>
        </div>
    );
};

export default ServiceLayout;
