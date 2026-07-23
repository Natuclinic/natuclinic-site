import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
    {
        q: 'Vocês aceitam convênio?',
        a: 'Não. Trabalhamos exclusivamente com atendimento particular. Isso nos permite dedicar tempo, atenção e personalização completos a cada paciente, sem restrições impostas por operadoras de plano.',
    },
    {
        q: 'Como funciona a primeira consulta?',
        a: 'A primeira consulta é uma avaliação completa. Analisamos seu histórico, objetivos e exames para montar um protocolo individualizado. Não existe receita pronta: cada plano é construído exclusivamente para você.',
    },
    {
        q: 'Posso fazer procedimentos estéticos e nutrição ortomolecular ao mesmo tempo?',
        a: 'Sim, e é exatamente assim que obtemos os melhores resultados. A nutrição ortomolecular potencializa os efeitos dos procedimentos estéticos ao equilibrar o organismo por dentro, acelerando recuperação e prolongando os resultados.',
    },
    {
        q: 'Os resultados dos procedimentos são permanentes?',
        a: 'Depende do procedimento. Alguns tratamentos oferecem resultados duradouros que podem ser mantidos com cuidados simples; outros exigem manutenção periódica. Durante a consulta, explicamos em detalhes a expectativa real de cada protocolo.',
    },
    {
        q: 'Onde ficam as unidades da Natuclinic?',
        a: 'Temos duas unidades no Distrito Federal: Taguatinga Norte e Planaltina. Entre em contato pelo WhatsApp para saber qual unidade está mais próxima de você e agendar sua avaliação.',
    },
    {
        q: 'Quanto tempo leva para ver resultados?',
        a: 'Varia conforme o protocolo e o organismo de cada paciente. Em tratamentos estéticos, resultados iniciais costumam aparecer entre 1 e 3 sessões. Na nutrição ortomolecular, as primeiras mudanças perceptíveis geralmente ocorrem entre 30 e 60 dias de acompanhamento.',
    },
];

const FaqSection = () => {
    const [open, setOpen] = React.useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.faq-header', 
                { y: 30, opacity: 0 },
                {
                    scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
                    y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                    clearProps: 'opacity,transform'
                }
            );
            gsap.fromTo('.faq-item',
                { y: 20, opacity: 0 },
                {
                    scrollTrigger: { trigger: '.faq-list', start: 'top 85%' },
                    y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out',
                    clearProps: 'opacity,transform'
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-20 md:py-32 bg-natu-ivory border-t border-natu-brown/10">
            <div className="desktop-container">
                <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24">

                    {/* Header */}
                    <div className="faq-header">
                        <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/50 block mb-4">
                            Dúvidas Frequentes
                        </span>
                        <h2 className="font-sans font-bold text-4xl md:text-5xl text-[#3D1E15] leading-tight tracking-tight">
                            Perguntas<br />frequentes
                        </h2>
                    </div>

                    {/* Accordion */}
                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div key={i} className="faq-item bg-natu-ivory rounded-2xl md:rounded-3xl border border-natu-brown/20 overflow-hidden mb-4 transition-all duration-300">
                                <button
                                    onClick={() => setOpen(open === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 md:p-6 text-left group border-none bg-transparent cursor-pointer"
                                >
                                    <span className="text-base md:text-lg font-sans font-bold text-[#3D1E15] group-hover:text-[#3D1E15]/80 transition-colors pr-4 leading-snug">
                                        {faq.q}
                                    </span>
                                    <span
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                            open === i
                                                ? 'bg-[#3D1E15] text-white rotate-90'
                                                : 'bg-[#3D1E15]/10 text-[#3D1E15] group-hover:bg-[#3D1E15]/20'
                                        }`}
                                    >
                                        {open === i ? (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        ) : (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="12" y1="5" x2="12" y2="19" />
                                                <line x1="5" y1="12" x2="19" y2="12" />
                                            </svg>
                                        )}
                                    </span>
                                </button>
                                {open === i && (
                                    <div className="animate-in fade-in duration-300">
                                        <div className="border-t border-natu-brown/10 mx-5 md:mx-6" />
                                        <div className="p-5 md:p-6">
                                            <p className="text-sm md:text-base font-sans font-light text-[#3D1E15]/85 leading-relaxed m-0">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FaqSection;
