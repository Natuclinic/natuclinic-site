import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const specialists = [
    {
        name: 'Dra. Débora Meneses',
        role: 'Estética & Harmonização',
        credentials: ['Biomédica Esteta', 'Especialista em Harmonização Facial'],
        bio: 'Responsável pela excelência técnica dos procedimentos estéticos, Dra. Débora une senso artístico apurado e rigor científico para realçar a beleza natural sem descaracterizar a identidade do paciente.',
        image: '/dra-debora.jpg',
        alt: 'Dra. Débora Meneses — Biomédica Esteta em Brasília',
        facePos: 'object-[50%_15%]',
    },
    {
        name: 'Dr. Julimar Meneses',
        role: 'Saúde & Nutrição',
        credentials: ['Nutricionista Ortomolecular · Farmacêutico', 'Doutor em Naturopatia · Biologia Molecular', 'Oncologista · Fitoterapia · CRN-DF 21414'],
        bio: 'Com uma visão integrativa que une bioquímica e naturopatia, Dr. Julimar lidera protocolos focados na raiz celular das disfunções nutricionais e de saúde, tratando de dentro para fora.',
        image: '/nutricionista-ortomolecular-integrativo-dr-julimar-meneses.jpeg',
        alt: 'Dr. Julimar Meneses — Nutricionista Ortomolecular em Brasília',
        facePos: 'object-[50%_20%]',
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
            <div className="desktop-container-fluid">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                    <div>
                        <span className="sr-only">
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
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {specialists.map((s) => (
                        <div key={s.name} className="ceo-card flex flex-col bg-white rounded-2xl p-8 border border-natu-brown/10">

                            <div className="w-20 h-20 rounded-full overflow-hidden mb-5 ring-1 ring-natu-brown/30 ring-offset-2 ring-offset-white flex-shrink-0">
                                <img
                                    src={s.image}
                                    alt={s.alt}
                                    loading="lazy"
                                    decoding="async"
                                    className={`w-full h-full object-cover ${s.facePos}`}
                                />
                            </div>

                            <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-natu-pink block mb-1">
                                {s.role}
                            </span>
                            <h3 className="font-sans font-bold text-2xl md:text-3xl text-natu-brown leading-tight tracking-tight mb-4">
                                {s.name}
                            </h3>

                            <p className="font-sans font-light text-natu-brown/60 leading-relaxed text-[15px] text-pretty mb-5">
                                {s.bio}
                            </p>

                            <p className="font-sans text-[11px] text-natu-brown/35">
                                {s.credentials.join(' · ')}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CeoSection;
