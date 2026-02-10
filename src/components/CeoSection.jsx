import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CircularText from './CircularText';

gsap.registerPlugin(ScrollTrigger);

const CeoSection = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".ceo-block", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.3,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-12 md:py-20 bg-[#F9F7F5] relative overflow-hidden">
            {/* Subtle Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"></div>

            <div className="desktop-container relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40">
                        Conheça nossos especialistas
                    </span>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-start">

                    {/* Dr. Julimar */}
                    <div className="ceo-block flex flex-col gap-8">
                        <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 w-full relative group">
                            <img
                                src="/dr-julimar.png"
                                alt="Dr. Julimar Meneses"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>
                        <div>
                            <h3 className="font-sans font-bold uppercase text-3xl md:text-4xl text-natu-brown mb-3">Dr. Julimar Meneses</h3>
                            <div className="space-y-1 mb-6">
                                <p className="font-sans text-xs uppercase tracking-widest text-natu-brown/60">Nutricionista Ortomolecular • Farmacêutico</p>
                                <p className="font-sans text-xs uppercase tracking-widest text-natu-brown/60">Doutor em Naturopatia • Biologia Molecular</p>
                                <p className="font-sans text-xs uppercase tracking-widest text-natu-brown/60">Oncologista • Fitoterapia</p>
                                <p className="font-sans text-xs uppercase tracking-widest text-natu-brown/60">Modulação Intestinal.</p>
                            </div>
                            <p className="font-sans font-light text-gray-500 leading-relaxed text-pretty max-w-sm">
                                Com uma visão integrativa que une bioquímica e naturopatia, Dr. Julimar lidera protocolos focados na raiz celular das disfunções estéticas e de saúde, garantindo resultados sustentáveis e seguros.
                            </p>
                        </div>
                    </div>

                    {/* Dra. Débora */}
                    <div className="ceo-block flex flex-col gap-8 md:mt-24">
                        <div className="relative">
                            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 w-full relative group">
                                <img
                                    src="/dra-debora.jpg"
                                    alt="Dra. Débora Meneses"
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute -top-12 -right-6 md:-right-10 z-20">
                                <CircularText
                                    text="INSTITUTO * NATUCLINIC *"
                                    onHover="speedUp"
                                    spinDuration={20}
                                    className="w-24 h-24 md:w-32 md:h-32 text-[8px] md:text-[10px] font-bold tracking-widest text-natu-brown bg-white/30 backdrop-blur-md rounded-full border border-white/40 shadow-xl"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-sans font-bold uppercase text-3xl md:text-4xl text-natu-brown mb-3">Dra. Débora Meneses</h3>
                            <div className="space-y-1 mb-6">
                                <p className="font-sans text-xs uppercase tracking-widest text-natu-brown/60">Biomédica Esteta</p>
                                <p className="font-sans text-xs uppercase tracking-widest text-natu-brown/60">Especialista em Harmonização Facial</p>
                            </div>
                            <p className="font-sans font-light text-gray-500 leading-relaxed text-pretty max-w-sm">
                                Responsável pela excelência técnica dos procedimentos estéticos, Dra. Débora une senso artístico apurado e rigor científico para realçar a beleza natural sem descaracterizar a identidade do paciente.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CeoSection;
