import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Unicon from './Unicon';

gsap.registerPlugin(ScrollTrigger);

const FeedbackSection = () => {
    const sectionRef = useRef(null);
    const cardRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Entrance animation for the whole card
            gsap.from(cardRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out"
            });

            // Individual elements animation
            gsap.from(contentRef.current.children, {
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 70%",
                },
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                delay: 0.3
            });

            // Image container animation
            gsap.from(imageRef.current, {
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 70%",
                },
                x: 40,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.5
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleWhatsApp = () => {
        const phone = "5561992551867";
        const message = encodeURIComponent("Olá! Vi as avaliações da Natuclinic e gostaria de agendar uma consulta.");
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <section ref={sectionRef} className="py-12 md:py-20 bg-white overflow-hidden">
            <div className="desktop-container">
                <div
                    ref={cardRef}
                    className="relative bg-natu-brown rounded-[2.5rem] p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 shadow-2xl overflow-hidden"
                >
                    {/* Subtle Background Glows */}
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-natu-pink/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

                    {/* Left Content Column */}
                    <div ref={contentRef} className="flex-1 text-center lg:text-left z-10">
                        <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-natu-pink mb-6">
                            O QUE DIZEM
                        </span>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-[#F2F0E9] leading-[1.1] mb-8">
                            Feedbacks de quem <br className="hidden lg:block" />
                            <span className="italic whitespace-nowrap">já transformou a vida</span>
                        </h2>
                        <p className="text-[#F2F0E9]/80 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 font-sans font-light">
                            Veja o impacto real dos nossos protocolos através das avaliações no Google Meu Negócio. Nossa maior satisfação é o sorriso de cada paciente.
                        </p>

                        {/* Google Rating Badge */}
                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <p className="text-[#F2F0E9]/90 text-xs md:text-sm font-bold uppercase tracking-wider">
                                Somos a clínica mais avaliada de Taguatinga
                            </p>
                            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3">
                                <img src="/google-icon.png" alt="Google" className="w-6 h-6" />
                                <div className="flex gap-0.5 text-[#FFB800]">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-[#F2F0E9] font-bold text-base">5,0</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Media Column */}
                    <div ref={imageRef} className="flex-1 w-full max-w-[500px] lg:max-w-none z-10">
                        <div className="relative aspect-[4/5] md:aspect-[5/4] lg:aspect-square bg-white/5 rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                            <img
                                src="/Feedbacks.gif"
                                alt="Feedbacks Natuclinic Google"
                                loading="lazy"
                                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                            />
                            {/* Overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-natu-brown/40 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeedbackSection;
