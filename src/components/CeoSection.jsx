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
        facePos: 'object-[50%_20%]',
        offset: false,
    },
    {
        name: 'Dra. Débora Meneses',
        role: 'Estética & Harmonização',
        credentials: ['Biomédica Esteta', 'Especialista em Harmonização Facial'],
        bio: 'Responsável pela excelência técnica dos procedimentos estéticos, Dra. Débora une senso artístico apurado e rigor científico para realçar a beleza natural sem descaracterizar a identidade do paciente.',
        image: '/dra-debora.jpg',
        alt: 'Dra. Débora Meneses — Biomédica Esteta em Brasília',
        facePos: 'object-[50%_15%]',
        offset: true,
    },
];

const CeoSection = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.ceo-card', {
                scrollTrigger: { trigger: containerRef.current, start: 'top 75%' },
                y: 60, opacity: 0, duration: 1.2, stagger: 0.2, ease: 'power3.out',
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="especialistas" ref={containerRef} className="py-20 md:py-32 bg-natu-ivory overflow-hidden">
            <div className="desktop-container">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
                    <div>
                        <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40 block mb-4">
                            Corpo Clínico
                        </span>
                        <h2 className="font-sans font-bold text-5xl md:text-6xl text-natu-brown leading-[1.05] tracking-tight">
                            Quem cuida<br />de você
                        </h2>
                    </div>
                    <p className="max-w-xs font-sans font-light text-natu-brown/50 text-sm leading-relaxed md:text-right">
                        Profissionais com formação científica de excelência e compromisso com resultados reais.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    {specialists.map((s) => (
                        <div key={s.name} className={`ceo-card group ${s.offset ? 'md:mt-24' : ''}`}>

                            {/* Foto */}
                            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] md:aspect-[16/9] mb-7 bg-natu-brown/10">
                                <img
                                    src={s.image}
                                    alt={s.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className={`w-full h-full object-cover ${s.facePos} transition-transform duration-[1400ms] group-hover:scale-[1.04]`}
                                />
                                {/* Gradient bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-natu-brown/60 via-transparent to-transparent" />

                                {/* Nome sobre a foto */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <span className="inline-block bg-natu-pink/20 backdrop-blur-sm border border-white/20 text-white text-[10px] font-sans font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-3">
                                        {s.role}
                                    </span>
                                    <h3 className="font-sans font-bold text-2xl md:text-3xl text-white leading-tight tracking-tight">
                                        {s.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Conteúdo */}
                            <div>
                                {/* Linha divisória */}
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-8 h-px bg-natu-pink" />
                                    <div className="w-2 h-px bg-natu-pink/40" />
                                </div>

                                <div className="space-y-1 mb-5">
                                    {s.credentials.map((c) => (
                                        <p key={c} className="font-sans text-[11px] uppercase tracking-widest text-natu-brown/50 font-medium">
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
