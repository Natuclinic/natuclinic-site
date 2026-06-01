import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const specialists = [
    {
        name: 'Dr. Julimar Meneses',
        role: 'Saúde & Nutrição',
        credentials: ['Nutricionista Ortomolecular · Farmacêutico', 'Doutor em Naturopatia · Biologia Molecular', 'Oncologista · Fitoterapia · CRN-DF 21414'],
        bio: 'Com uma visão integrativa que une bioquímica e naturopatia, Dr. Julimar lidera protocolos focados na raiz celular das disfunções nutricionais e de saúde, tratando de dentro para fora.',
        image: '/nutricionista-ortomolecular-integrativo-dr-julimar-meneses.jpeg',
        alt: 'Dr. Julimar Meneses — Nutricionista Ortomolecular em Brasília',
        offset: false,
    },
    {
        name: 'Dra. Débora Meneses',
        role: 'Estética & Harmonização',
        credentials: ['Biomédica Esteta', 'Especialista em Harmonização Facial'],
        bio: 'Responsável pela excelência técnica dos procedimentos estéticos, Dra. Débora une senso artístico apurado e rigor científico para realçar a beleza natural sem descaracterizar a identidade do paciente.',
        image: '/dra-debora.jpg',
        alt: 'Dra. Débora Meneses — Biomédica Esteta em Brasília',
        offset: true,
    },
];

const CeoSection = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.ceo-card', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                },
                y: 60,
                opacity: 0,
                duration: 1.4,
                stagger: 0.25,
                ease: 'power3.out',
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            id="especialistas"
            ref={containerRef}
            className="py-20 md:py-32 bg-natu-ivory relative overflow-hidden"
        >
            {/* Fundo decorativo */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-natu-pink/5 blur-3xl" />
            </div>

            <div className="desktop-container relative z-10">

                {/* Header */}
                <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40 block mb-3">
                            Corpo Clínico
                        </span>
                        <h2 className="font-serif italic text-5xl md:text-6xl text-natu-brown leading-tight">
                            Quem cuida<br />de você
                        </h2>
                    </div>
                    <p className="max-w-xs font-sans font-light text-natu-brown/50 text-sm leading-relaxed">
                        Profissionais com formação científica de excelência e compromisso com resultados reais.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
                    {specialists.map((s) => (
                        <div
                            key={s.name}
                            className={`ceo-card group ${s.offset ? 'md:mt-20' : ''}`}
                        >
                            {/* Foto */}
                            <div className="relative overflow-hidden rounded-3xl bg-natu-brown/10 aspect-[3/4] mb-8">
                                <img
                                    src={s.image}
                                    alt={s.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover object-top transition-transform duration-[1200ms] group-hover:scale-105"
                                />
                                {/* Badge de especialidade */}
                                <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-natu-brown">
                                        {s.role}
                                    </span>
                                </div>
                            </div>

                            {/* Texto */}
                            <div className="px-1">
                                <h3 className="font-serif italic text-3xl md:text-4xl text-natu-brown mb-4 leading-tight">
                                    {s.name}
                                </h3>

                                {/* Divisor */}
                                <div className="w-10 h-px bg-natu-pink mb-4" />

                                <div className="space-y-0.5 mb-6">
                                    {s.credentials.map((c) => (
                                        <p key={c} className="font-sans text-[11px] uppercase tracking-widest text-natu-brown/50">
                                            {c}
                                        </p>
                                    ))}
                                </div>

                                <p className="font-sans font-light text-natu-brown/60 leading-relaxed text-[15px] text-pretty">
                                    {s.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CeoSection;
