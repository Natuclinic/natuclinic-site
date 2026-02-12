import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Silk = React.lazy(() => import('./Silk'));

const HomeManifesto = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Headline Animation
            gsap.from(".manifesto-headline span", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                opacity: 0,
                y: 24,
                filter: "blur(10px)",
                duration: 2.5,
                ease: "power3.out",
                stagger: 0.2,
            });

            // Method Items Animation
            gsap.from(".method-item", {
                scrollTrigger: {
                    trigger: ".method-item",
                    start: "top 85%",
                },
                opacity: 0,
                y: 32,
                filter: "blur(10px)",
                duration: 2.5,
                ease: "power3.out",
                stagger: 0.18,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="clinica" ref={containerRef} className="py-24 bg-white relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <React.Suspense fallback={null}>
                    <Silk
                        speed={5.2}
                        scale={0.8}
                        color="#37261c"
                        noiseIntensity={1.5}
                        rotation={0}
                    />
                </React.Suspense>
            </div>
            {/* Subtle Organic Gradient Background */}
            <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_#6E4A3C_0%,_transparent_70%)] opacity-20 blur-3xl mix-blend-multiply z-0"></div>

            <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:grid lg:grid-cols-12 lg:gap-x-16 relative z-10">
                {/* HEADLINE */}
                <div className="lg:col-span-6 manifesto-headline">
                    <span className="block mb-6 text-xs tracking-[0.3em] uppercase text-[#F2F0E9]/60 font-sans font-bold">
                        Metodologia Natuclinic
                    </span>

                    <h2 className="font-serif text-4xl leading-tight text-[#F2F0E9] sm:text-5xl lg:text-7xl">
                        <span className="block opacity-90">não tratamos sintomas,</span>
                        <span className="block mt-4 font-medium">tratamos pessoas</span>
                    </h2>
                </div>

                {/* METODOLOGIA */}
                <div className="mt-20 space-y-16 lg:col-span-5 lg:mt-0 lg:ml-auto">
                    {[
                        { id: "01", title: "Consulta Avaliativa Criteriosa", text: "Cada protocolo nasce de uma análise detalhada. Não padronizamos você." },
                        { id: "02", title: "Integração Terapêutica", text: "Unimos nutrição ortomolecular, estética avançada e suplementação funcional." },
                        { id: "03", title: "Saúde Celular", text: "Equilíbrio biológico como base. Beleza é consequência de saúde." }
                    ].map((item, idx) => (
                        <div key={idx} className="method-item relative pl-6 border-l border-[#F2F0E9]/20 lg:pl-0 lg:border-l-0">
                            <span className="block mb-4 font-serif text-2xl text-[#F2F0E9]/30">{item.id}</span>
                            <h3 className="mb-3 font-serif text-xl text-[#F2F0E9]">
                                {item.title}
                            </h3>
                            <p className="max-w-[42ch] text-sm leading-relaxed text-[#F2F0E9]/80 font-sans font-light text-pretty">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HomeManifesto;
