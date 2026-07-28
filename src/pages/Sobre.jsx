import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SEO from '../components/SEO';
import Unicon from '../components/Unicon';
import { WHATSAPP_LINKS } from '../constants/links';
import StatsSection from '../components/StatsSection';
import LocationsSection from '../components/LocationsSection';

gsap.registerPlugin(ScrollTrigger);

const specialists = [
    {
        name: 'Dr. Julimar Meneses',
        role: 'Saúde & Nutrição Ortomolecular',
        credentials: 'Nutricionista Ortomolecular · Farmacêutico · Doutor em Naturopatia · Biologia Molecular · Oncologista · Fitoterapia · CRN-DF 21414',
        bio: 'Dr. Julimar lidera os protocolos de nutrição e saúde funcional da Natuclinic com uma visão integrativa que une bioquímica e naturopatia. Sua abordagem foca na raiz celular das disfunções, tratando causas — não apenas sintomas.',
        image: '/nutricionista-ortomolecular-integrativo-dr-julimar-meneses.jpeg',
        alt: 'Dr. Julimar Meneses — Nutricionista Ortomolecular em Brasília',
        facePos: 'object-[50%_20%]',
    },
    {
        name: 'Dra. Débora Meneses',
        role: 'Estética & Harmonização',
        credentials: 'Biomédica Esteta · Especialista em Harmonização Facial',
        bio: 'Dra. Débora é responsável pelos protocolos estéticos da Natuclinic, unindo rigor científico e senso artístico para realçar a beleza natural de cada paciente. Sua expertise garante resultados harmoniosos e personalizados.',
        image: '/dra-debora.jpg',
        alt: 'Dra. Débora Meneses — Biomédica Esteta em Brasília',
        facePos: 'object-[50%_15%]',
    },
];

const valores = [
    { label: 'Integridade', desc: 'Transparência total no diagnóstico, no processo e nos resultados esperados. O paciente sempre sabe o que está fazendo e por quê.' },
    { label: 'Individualidade', desc: 'Cada organismo é único. Respeitamos a bioquímica, a história e os objetivos de cada pessoa — não existe protocolo padrão na Natuclinic.' },
    { label: 'Ciência', desc: 'Todos os protocolos são baseados em evidências clínicas e literatura científica atualizada. Nenhuma promessa sem fundamento.' },
    { label: 'Acolhimento', desc: 'Criamos um ambiente seguro onde o paciente se sente ouvido, respeitado e cuidado em cada etapa do tratamento.' },
    { label: 'Excelência', desc: 'Buscamos continuamente atualização técnica, melhores insumos e aperfeiçoamento dos resultados obtidos.' },
    { label: 'Naturalidade', desc: 'Realçamos o que já existe em cada pessoa. Nossa estética recusa exageros e preza pela harmonia individual.' },
];

const ValoresAccordion = () => {
    const [open, setOpen] = React.useState(null);
    return (
        <section className="mt-16 pt-16 border-t border-natu-brown/10">
            <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-natu-brown/40 mb-3">
                Nossos Valores
            </h2>
            <p className="text-2xl font-sans font-bold text-natu-brown mb-10 max-w-lg leading-snug">
                Os princípios que guiam cada atendimento
            </p>
            <div className="divide-y divide-natu-brown/10">
                {valores.map((v, i) => (
                    <div key={v.label}>
                        <button
                            onClick={() => setOpen(open === i ? null : i)}
                            className="w-full flex items-center justify-between py-5 text-left group"
                        >
                            <span className="text-base font-sans font-bold text-natu-brown group-hover:text-natu-brown/70 transition-colors">
                                {v.label}
                            </span>
                            <span className={`w-7 h-7 rounded-full border border-natu-brown/20 flex items-center justify-center flex-shrink-0 ml-4 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                            </span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                            <p className="text-sm font-sans font-light text-natu-brown/55 leading-relaxed">
                                {v.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const Sobre = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.sobre-fade', {
                y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "Sobre a Natuclinic - Clínica de Estética Integrativa",
        "url": "https://www.natuclinic.com.br/sobre",
        "description": "Conheça a Natuclinic: história, equipe, valores e abordagem integrativa que une estética avançada e nutrição ortomolecular em Brasília e Taguatinga.",
        "publisher": {
            "@type": "MedicalBusiness",
            "name": "Natuclinic"
        },
        "about": [
            {
                "@type": "Person",
                "name": "Dr. Julimar Meneses",
                "jobTitle": "Nutricionista Ortomolecular"
            },
            {
                "@type": "Person",
                "name": "Dra. Débora Meneses",
                "jobTitle": "Biomédica Esteta"
            }
        ]
    };

    return (
        <div ref={containerRef} className="pt-36 pb-24 min-h-screen bg-white">
            <SEO
                title="Melhor Clínica de Estética Integrativa de Brasília | Natuclinic"
                description="Conheça a Natuclinic: Clínica especializada em Estética Avançada e Nutrição Ortomolecular em Brasília e Taguatinga. Agende sua avaliação."
                url="https://www.natuclinic.com.br/sobre"
                canonical="https://www.natuclinic.com.br/sobre"
                keywords="natuclinic sobre, clínica estética brasília história, Dr. Julimar Meneses naturopata, Dra. Débora Natuclinic, missão visão natuclinic, estética integrativa brasília, clínica de estética brasília, clínica integrativa taguatinga, nutricionista ortomolecular df, biomédica esteta brasília, estética avançada df"
                jsonLd={structuredData}
            />

            {/* Layout editorial: coluna central de leitura */}
            <div className="max-w-3xl mx-auto px-6 lg:px-8">

                {/* Breadcrumb / categoria */}
                <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-natu-brown/40 mb-6 sobre-fade">
                    Natuclinic · Brasília
                </p>

                {/* H1 */}
                <h1 className="text-4xl md:text-5xl font-sans font-bold text-natu-brown leading-tight tracking-tight mb-6 sobre-fade">
                    Sobre a Natuclinic
                </h1>

                {/* Lead */}
                <p className="text-lg font-sans font-light text-natu-brown/70 leading-relaxed mb-12 sobre-fade border-b border-natu-brown/10 pb-12">
                    A Natuclinic é uma clínica especializada em estética avançada e nutrição ortomolecular, com unidades em Taguatinga Norte e Planaltina, no Distrito Federal. Fundada pelo Dr. Julimar Meneses e pela Dra. Débora Meneses, a clínica nasceu da convicção de que beleza real e saúde interna são inseparáveis.
                </p>

                {/* Nossa história */}
                <section className="mb-12 sobre-fade">
                    <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-natu-brown/40 mb-3">
                        Nossa História
                    </h2>
                    <h3 className="text-2xl font-sans font-bold text-natu-brown mb-5 leading-snug">
                        De um propósito a uma referência em Brasília
                    </h3>
                    <div className="space-y-4 text-[15px] font-sans font-light text-natu-brown/65 leading-relaxed">
                        <p>
                            A Natuclinic surgiu da percepção de que o mercado de estética oferecia procedimentos sem considerar o contexto de saúde de cada paciente. Dr. Julimar e Dra. Débora decidiram criar uma clínica onde os dois mundos se integrassem de forma genuína: tratar o organismo por dentro para potencializar os resultados visíveis por fora.
                        </p>
                        <p>
                            Desde o início, a abordagem foi construída sobre protocolos individualizados, recusando fórmulas genéricas. Cada paciente passa por uma avaliação completa antes de qualquer intervenção — esse cuidado com o diagnóstico é o que diferencia os resultados obtidos na Natuclinic dos tratamentos convencionais.
                        </p>
                        <p>
                            Hoje, com duas unidades no DF e centenas de pacientes atendidos, a clínica consolidou-se como referência em harmonização facial, nutrição ortomolecular integrativa e protocolos corporais avançados na região de Brasília e Taguatinga.
                        </p>
                    </div>
                </section>

                {/* Divisor */}
                <div className="border-t border-natu-brown/10 mb-12" />

                {/* Abordagem */}
                <section className="mb-12 sobre-fade">
                    <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-natu-brown/40 mb-3">
                        Nossa Abordagem
                    </h2>
                    <h3 className="text-2xl font-sans font-bold text-natu-brown mb-5 leading-snug">
                        Estética e saúde funcionam melhor juntas
                    </h3>
                    <blockquote className="border-l-2 border-natu-pink pl-5 mb-6">
                        <p className="text-base font-sans font-light text-natu-brown/80 leading-relaxed italic">
                            "Quando o organismo está equilibrado por dentro, os procedimentos estéticos entregam resultados mais expressivos, mais duradouros e mais naturais."
                        </p>
                    </blockquote>
                    <div className="space-y-4 text-[15px] font-sans font-light text-natu-brown/65 leading-relaxed">
                        <p>
                            A base da Natuclinic é a integração entre nutrição ortomolecular e estética avançada. Enquanto os protocolos nutricionais atuam na correção de desequilíbrios celulares — inflamação, deficiências vitamínicas, estresse oxidativo — os procedimentos estéticos trabalham o aspecto externo de forma precisa e segura.
                        </p>
                        <p>
                            Essa sinergia resulta em pacientes que se transformam de dentro para fora: mais disposição, pele mais saudável, recuperação mais rápida e resultados estéticos que se sustentam no tempo. Não é estética isolada. É cuidado integral.
                        </p>
                        <p>
                            Atendemos exclusivamente de forma particular, o que nos permite dedicar o tempo e a atenção que cada caso exige — sem os limites e protocolos padronizados impostos por convênios.
                        </p>
                    </div>
                </section>

                {/* Divisor */}
                <div className="border-t border-natu-brown/10 mb-12" />

                {/* Missão · Visão · Filosofia */}
                <section className="mb-12 sobre-fade">
                    <div className="space-y-8">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-natu-pink mb-2">Missão</p>
                            <h4 className="text-lg font-sans font-bold text-natu-brown mb-2 leading-snug">
                                Transformar saúde em beleza, e beleza em autoestima
                            </h4>
                            <p className="text-[15px] font-sans font-light text-natu-brown/60 leading-relaxed">
                                Oferecer tratamentos integrativos de excelência que unem estética avançada e saúde funcional, promovendo resultados visíveis, duradouros e alinhados à individualidade de cada paciente.
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-natu-pink mb-2">Visão</p>
                            <h4 className="text-lg font-sans font-bold text-natu-brown mb-2 leading-snug">
                                Ser referência em estética integrativa no Centro-Oeste
                            </h4>
                            <p className="text-[15px] font-sans font-light text-natu-brown/60 leading-relaxed">
                                Consolidar a Natuclinic como modelo de clínica que une ciência, ética e cuidado humano, sendo reconhecida pela transformação real e duradoura na vida dos pacientes.
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-natu-pink mb-2">Filosofia</p>
                            <h4 className="text-lg font-sans font-bold text-natu-brown mb-2 leading-snug">
                                Beleza real começa pela saúde interna
                            </h4>
                            <p className="text-[15px] font-sans font-light text-natu-brown/60 leading-relaxed">
                                Procedimentos estéticos alcançam seu máximo potencial quando o organismo está em equilíbrio. Por isso integramos nutrição ortomolecular a cada protocolo estético que aplicamos.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Valores */}
                <ValoresAccordion />

                {/* Divisor */}
                <div className="border-t border-natu-brown/10 mt-16 mb-16" />

                {/* Equipe */}
                <section className="sobre-fade">
                    <h2 className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-natu-brown/40 mb-3">
                        Equipe
                    </h2>
                    <h3 className="text-2xl font-sans font-bold text-natu-brown mb-10 leading-snug">
                        Os profissionais por trás da Natuclinic
                    </h3>

                    <div className="space-y-10">
                        {specialists.map((s) => (
                            <article key={s.name} className="flex gap-6 items-start">
                                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-natu-brown/30 ring-offset-2 ring-offset-white">
                                    <img
                                        src={s.image}
                                        alt={s.alt}
                                        className={`w-full h-full object-cover ${s.facePos}`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-natu-pink mb-1">{s.role}</p>
                                    <h4 className="text-lg font-sans font-bold text-natu-brown mb-1">{s.name}</h4>
                                    <p className="text-[11px] font-sans text-natu-brown/35 mb-3">{s.credentials}</p>
                                    <p className="text-[15px] font-sans font-light text-natu-brown/60 leading-relaxed">{s.bio}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

            </div>

            {/* Números — full width */}
            <div className="mt-20">
                <StatsSection />
            </div>

            {/* Unidades */}
            <LocationsSection />

            {/* CTA */}
            <div className="max-w-3xl mx-auto px-6 lg:px-8 py-20 border-t border-natu-brown/10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-sans font-bold text-natu-brown mb-2">Pronto para começar?</h2>
                        <p className="text-sm font-sans font-light text-natu-brown/50 mb-3">Agende sua avaliação e descubra o protocolo ideal para você.</p>
                        <p className="text-[11px] font-sans text-natu-brown/35 flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                            Atendimento exclusivamente particular.
                        </p>
                    </div>
                    <a
                        href={WHATSAPP_LINKS.GENERAL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-natu-brown text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-colors duration-300"
                    >
                        <Unicon name="whatsapp" size={16} />
                        Agendar avaliação
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Sobre;
