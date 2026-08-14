import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Silk = React.lazy(() => import('./Silk'));

const items = [
    { id: "01", title: "Um olhar atento sobre você", text: "Cada protocolo nasce de uma escuta cuidadosa. Não padronizamos você; respeitamos sua história." },
    { id: "02", title: "O cuidado que te abraça por inteiro", text: "Unimos nutrição, estética e bem-estar para que você se sinta completa." },
    { id: "03", title: "Equilíbrio que vem de dentro", text: "Beleza é o brilho de um corpo em harmonia. Cuidamos da sua saúde para que você brilhe." },
];

const HomeManifesto = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".manifesto-headline", {
                scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
                opacity: 0, y: 30, filter: "blur(8px)",
                duration: 1.8, ease: "power3.out",
            });
            gsap.from(".method-item", {
                scrollTrigger: { trigger: ".method-item", start: "top 85%" },
                opacity: 0, y: 24, filter: "blur(6px)",
                duration: 1.6, ease: "power3.out", stagger: 0.15,
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="clinica" ref={containerRef} className="relative overflow-hidden bg-[#1a0e09]">

            {/* Silk background */}
            <div className="absolute inset-0 z-0">
                <React.Suspense fallback={null}>
                    <Silk speed={5.2} scale={0.8} color="#37261c" noiseIntensity={1.5} rotation={0} />
                </React.Suspense>
            </div>

            {/* Glow */}
            <div className="pointer-events-none absolute -right-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_#6E4A3C_0%,_transparent_70%)] opacity-25 blur-3xl z-0" />

            <div className="desktop-container relative z-10 py-24 md:py-36">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Esquerda — Headline */}
                    <div className="manifesto-headline">
                        <span className="block mb-6 text-[10px] tracking-[0.35em] uppercase text-[#F2F0E9]/40 font-sans font-bold">
                            Metodologia Natuclinic
                        </span>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-[#F2F0E9] leading-[0.95]">
                            não tratamos<br />
                            <span className="text-natu-pink">sintomas,</span><br />
                            tratamos<br />
                            pessoas
                        </h2>
                    </div>

                    {/* Direita — Itens */}
                    <div className="space-y-0 divide-y divide-[#F2F0E9]/10">
                        {items.map((item) => (
                            <div key={item.id} className="method-item py-8 flex gap-6 items-start group">
                                <span className="font-sans font-bold text-[11px] tracking-widest text-natu-pink/60 mt-1 flex-shrink-0 w-6">
                                    {item.id}
                                </span>
                                <div>
                                    <h3 className="font-sans font-bold text-lg text-[#F2F0E9] mb-2 leading-snug">
                                        {item.title}
                                    </h3>
                                    <p className="font-sans font-light text-sm leading-relaxed text-[#F2F0E9]/50 text-pretty">
                                        {item.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HomeManifesto;
