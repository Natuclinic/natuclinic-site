import React, { useRef, useEffect } from 'react';
import Unicon from './Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ResultsCTA = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(containerRef.current,
                {
                    rotateX: 50,
                    y: 80,
                    opacity: 0,
                    transformPerspective: 1000,
                    transformOrigin: "center top"
                },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 95%", // Starts as soon as it enters viewport
                        end: "center center", // Finishes when centered
                        scrub: 1, // Fluid scrubbing with 1s smoothing
                    },
                    rotateX: 0,
                    y: 0,
                    opacity: 1,
                    ease: "power2.out"
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleWhatsApp = () => {
        const phone = "5561992551867";
        const message = encodeURIComponent("Olá! Vi os resultados no site e gostaria de agendar uma avaliação.");
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <section className="relative z-20 mt-20 mb-12 pointer-events-none">
            <div
                ref={containerRef}
                onClick={handleWhatsApp}
                className="desktop-container pointer-events-auto"
            >
                <div className="bg-natu-brown rounded-[2rem] p-12 md:p-16 relative overflow-hidden cursor-pointer group hover:scale-[1.01] transition-transform duration-500">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3 group-hover:bg-white/10 transition-colors duration-500"></div>

                    {/* Logo Grafismo */}
                    <img
                        src="/logo-outline-svg.svg"
                        alt=""
                        className="absolute top-1/2 right-[10%] -translate-y-1/2 h-[180%] w-auto opacity-10 pointer-events-none select-none invert rotate-12"
                    />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">

                        <div className="space-y-4 max-w-lg">
                            <h3 className="font-serif text-3xl md:text-4xl text-[#F2F0E9] leading-tight">
                                Sua transformação <br />
                                <span className="italic opacity-80">começa hoje</span>
                            </h3>
                            <p className="font-sans font-light text-[#F2F0E9]/70 text-lg">
                                Descubra qual é o protocolo ideal para o seu corpo. Agende sua avaliação personalizada.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <button className="bg-[#F2F0E9] text-natu-brown px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-4 group-hover:scale-105 transition-all duration-300">
                                Agendar Agora
                                <Unicon name="arrow-right" size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ResultsCTA;
