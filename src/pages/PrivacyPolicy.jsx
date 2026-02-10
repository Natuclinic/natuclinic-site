import React, { useEffect, useRef } from 'react';
import Unicon from '../components/Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy = ({ goBack }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".policy-section", {
                scrollTrigger: {
                    trigger: ".policy-content",
                    start: "top 80%",
                },
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: "power2.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const sections = [
        {
            title: "1. Introdução",
            content: "Para o Instituto Natuclinic, a privacidade e a segurança dos seus dados pessoais são fundamentais. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações quando você utiliza nosso site e serviços de estética e nutrição ortomolecular."
        },
        {
            title: "2. Quais dados coletamos?",
            content: "Coletamos dados que você nos fornece diretamente ao preencher formulários em nosso site, como: Nome completo, E-mail, Número de telefone/WhatsApp e informações básicas sobre seu interesse em nossos protocolos."
        },
        {
            title: "3. Finalidade do tratamento",
            content: "Seus dados são utilizados para: Identificar e entrar em contato com você; Enviar informações sobre protocolos e serviços solicitados; Agendar avaliações; Enviar conteúdos educativos e comunicações de marketing (caso autorizado)."
        },
        {
            title: "4. Compartilhamento de Dados",
            content: "O Instituto Natuclinic não comercializa seus dados pessoais. Podemos compartilhar informações com prestadores de serviços de tecnologia que nos auxiliam na operação do site e gestão de atendimentos, sempre sob rigorosos contratos de confidencialidade."
        },
        {
            title: "5. Seus Direitos (LGPD)",
            content: "De acordo com a Lei Geral de Proteção de Dados, você tem direito a: Confirmar a existência de tratamento de seus dados; Acessar seus dados; Corrigir dados incompletos ou desatualizados; Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários; Revogar seu consentimento a qualquer momento."
        },
        {
            title: "6. Segurança das Informações",
            content: "Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acessos não autorizados, perda ou destruição acidental."
        },
        {
            title: "7. Contato",
            content: "Caso tenha dúvidas sobre esta política ou queira exercer seus direitos, entre em contato através do e-mail: contato@natuclinic.com.br ou pelo nosso canal de atendimento oficial."
        }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-white">
            {/* Minimal Header */}
            <div className="pt-32 pb-16 md:pt-48 md:pb-24 border-b border-gray-50">
                <div className="desktop-container">
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-natu-brown/40 hover:text-natu-brown transition-colors mb-8 text-xs uppercase tracking-widest font-bold group"
                    >
                        <Unicon name="arrow-left" size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar
                    </button>
                    <h1 className="text-4xl md:text-6xl font-serif text-natu-brown leading-tight">
                        Política de <br />
                        <span className="italic">Privacidade</span>
                    </h1>
                    <p className="mt-8 text-natu-brown/40 font-sans text-xs uppercase tracking-[0.2em] font-bold">
                        Última atualização: Fevereiro de 2026
                    </p>
                </div>
            </div>

            {/* Policy Content - Nubank Inspired Layout */}
            <div className="py-20 md:py-32 policy-content">
                <div className="desktop-container">
                    <div className="max-w-3xl mx-auto space-y-20">
                        {sections.map((section, index) => (
                            <section key={index} className="policy-section">
                                <h2 className="text-2xl font-serif text-natu-brown mb-6 flex items-center gap-4">
                                    <span className="text-natu-pink font-sans text-xs font-bold tracking-widest leading-none">
                                        {section.title.split('.')[0]}
                                    </span>
                                    {section.title.split('. ')[1]}
                                </h2>
                                <p className="text-gray-500 font-sans font-light text-lg leading-relaxed text-pretty">
                                    {section.content}
                                </p>
                            </section>
                        ))}
                    </div>
                </div>
            </div>

            {/* Simple Footer CTA */}
            <div className="py-24 bg-[#F9F7F5] border-t border-gray-100">
                <div className="desktop-container text-center">
                    <h3 className="font-serif text-3xl text-natu-brown mb-8">Dúvidas sobre seus dados?</h3>
                    <a
                        href="https://wa.me/5561992551867?text=Olá! Tenho uma dúvida sobre a proteção de meus dados na Natuclinic."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-natu-brown text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                    >
                        Falar com o Encarregado
                        <Unicon name="phone" size={14} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
