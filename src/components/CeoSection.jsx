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
            gsap.fromTo('.ceo-card', 
                { y: 60, opacity: 0 },
                {
                    scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
                    y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out',
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="especialistas" ref={containerRef} className="py-20 md:py-32 bg-natu-ivory overflow-hidden">
            <div className="desktop-container-fluid">

                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center gap-4 mb-16 max-w-2xl mx-auto">
                    <span className="sr-only">Corpo Clínico</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-natu-brown leading-[0.95]">
                        Quem cuida de você
                    </h2>
                    <p className="max-w-md font-sans font-light text-natu-brown/60 text-sm leading-relaxed">
                        Profissionais com formação científica de excelência e compromisso com resultados reais.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch max-w-4xl mx-auto">
                    {specialists.map((s) => (
                        <div key={s.name} className="ceo-card flex flex-col bg-white rounded-[24px] overflow-hidden border border-natu-brown/10 group hover:border-natu-brown/20 transition-all duration-500 hover:-translate-y-1">
                            
                            {/* Image Header (Instagram Style Circle) */}
                            <div className="pt-10 px-8 flex justify-center">
                                {/* Gradient Ring */}
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-natu-brown via-[#c29681] to-natu-pink">
                                    {/* Inner white border + Image */}
                                    <div className="w-full h-full rounded-full border-4 border-white overflow-hidden relative bg-natu-ivory">
                                        <img
                                            src={s.image}
                                            alt={s.alt}
                                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${s.facePos}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-8 flex flex-col flex-grow text-center items-center">
                                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-natu-pink block mb-2">
                                    {s.role}
                                </span>
                                <h3 className="font-sans font-bold text-2xl md:text-3xl text-natu-brown leading-tight tracking-tight mb-4">
                                    {s.name}
                                </h3>

                                <p className="font-sans font-light text-natu-brown/60 leading-relaxed text-[15px] text-pretty mb-6">
                                    {s.bio}
                                </p>

                                <div className="mt-auto pt-5 border-t border-natu-brown/10">
                                    <p className="font-sans text-[11px] text-natu-brown/40 leading-relaxed">
                                        {s.credentials.join(' · ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default CeoSection;
