import React, { useEffect, useRef } from 'react';
import Unicon from '../components/Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy = ({ goBack }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Prevent indexing of this page
        const meta = document.createElement('meta');
        meta.name = "robots";
        meta.content = "noindex";
        document.head.appendChild(meta);

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
        return () => {
            ctx.revert();
            document.head.removeChild(meta);
        };
    }, []);

    const sections = [
        {
            title: "Identificação do Controlador",
            content: "Instituto Natuclinic, inscrito no CNPJ sob o nº 28.427.967/0001-73, com sede em Taguatinga/DF, é o controlador responsável pelo tratamento dos dados pessoais coletados por meio deste site. Para o Instituto Natuclinic, a privacidade e a segurança dos seus dados pessoais são fundamentais. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações quando você utiliza nosso site e serviços de estética e nutrição ortomolecular."
        },
        {
            title: "Quais dados coletamos?",
            content: "Coletamos dados que você nos fornece diretamente ao preencher formulários em nosso site, como: nome completo, número de telefone/WhatsApp e informações básicas sobre seu interesse em nossos protocolos. Também podemos coletar automaticamente dados de navegação como endereço IP, tipo de dispositivo, páginas visitadas e origem do acesso, por meio de ferramentas de análise."
        },
        {
            title: "Base Legal do Tratamento",
            content: "O tratamento dos seus dados pessoais é realizado com fundamento nas seguintes bases legais previstas no Art. 7º da LGPD: (I) Consentimento — quando você preenche um formulário e autoriza o contato; (V) Execução de contrato — para agendamento e prestação dos serviços solicitados; (IX) Legítimo interesse — para melhorias no site, segurança e comunicações institucionais, sempre respeitando seus direitos fundamentais."
        },
        {
            title: "Finalidade do tratamento",
            content: "Seus dados são utilizados para: identificar e entrar em contato com você; enviar informações sobre protocolos e serviços solicitados; agendar avaliações personalizadas; enviar conteúdos educativos e comunicações de marketing (somente mediante autorização); e melhorar a experiência de navegação no site."
        },
        {
            title: "Cookies e Tecnologias de Rastreamento",
            content: "Nosso site utiliza cookies e tecnologias similares, incluindo o Google Tag Manager (para gerenciamento de tags), Google Analytics (para análise de tráfego) e pixels de rastreamento de plataformas de publicidade. Essas ferramentas nos ajudam a entender como os visitantes utilizam o site e a otimizar nossas campanhas. Você pode gerenciar ou recusar o uso de cookies nas configurações do seu navegador. A recusa de cookies não essenciais não impede o uso do site."
        },
        {
            title: "Compartilhamento de Dados",
            content: "O Instituto Natuclinic não comercializa seus dados pessoais. Podemos compartilhar informações com prestadores de serviços de tecnologia que nos auxiliam na operação do site e gestão de atendimentos (como plataformas de CRM, hospedagem e comunicação), sempre sob rigorosos contratos de confidencialidade e em conformidade com a LGPD."
        },
        {
            title: "Prazo de Retenção",
            content: "Seus dados pessoais são armazenados pelo tempo necessário para cumprir as finalidades descritas nesta política ou enquanto houver obrigação legal que exija sua manutenção. Após esse prazo, os dados são eliminados de forma segura ou anonimizados. Você pode solicitar a exclusão antecipada dos seus dados a qualquer momento, ressalvadas as hipóteses legais de retenção."
        },
        {
            title: "Seus Direitos (LGPD)",
            content: "De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: confirmar a existência de tratamento dos seus dados; acessar seus dados; corrigir dados incompletos, inexatos ou desatualizados; solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei; revogar seu consentimento a qualquer momento; e obter informações sobre com quem compartilhamos seus dados. Para exercer qualquer desses direitos, entre em contato conosco pelo e-mail: contato@natuclinic.com.br."
        },
        {
            title: "Proteção de Dados de Menores",
            content: "Nosso site e serviços não são direcionados a menores de 18 anos e não coletamos intencionalmente dados pessoais de crianças ou adolescentes. Caso identifiquemos que dados de menores foram coletados sem o consentimento dos responsáveis legais, procederemos à exclusão imediata dessas informações."
        },
        {
            title: "Segurança das Informações",
            content: "Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acessos não autorizados, perda, alteração ou destruição acidental, incluindo criptografia, controle de acesso e monitoramento contínuo dos nossos sistemas."
        },
        {
            title: "Encarregado de Dados (DPO)",
            content: "O Encarregado pelo Tratamento de Dados Pessoais (DPO) do Instituto Natuclinic pode ser contatado pelo e-mail: contato@natuclinic.com.br ou pelo WhatsApp (61) 98258-2150. É o canal oficial para dúvidas, solicitações e exercício dos seus direitos previstos na LGPD."
        },
        {
            title: "Canal de Reclamação à ANPD",
            content: "Caso considere que o tratamento dos seus dados pessoais viola as disposições da LGPD, você tem o direito de peticionar à Autoridade Nacional de Proteção de Dados (ANPD), órgão regulador responsável pela fiscalização da lei no Brasil. Mais informações em: www.gov.br/anpd."
        },
        {
            title: "Alterações nesta Política",
            content: "Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças em nossas práticas ou na legislação aplicável. Notificaremos alterações relevantes por meio do site. Recomendamos a leitura periódica deste documento."
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
                    <h1 className="text-4xl md:text-6xl font-sans font-bold text-natu-brown leading-tight tracking-tight">
                        Política de <br />
                        <span className="font-bold">Privacidade</span>
                    </h1>
                    <p className="mt-8 text-natu-brown/40 font-sans text-xs uppercase tracking-[0.2em] font-bold">
                        Última atualização: Setembro de 2026
                    </p>
                </div>
            </div>

            {/* Policy Content - Nubank Inspired Layout */}
            <div className="py-20 md:py-32 policy-content">
                <div className="desktop-container">
                    <div className="max-w-3xl mx-auto space-y-20">
                        {sections.map((section, index) => (
                            <section key={index} className="policy-section">
                                <h2 className="text-2xl font-sans font-bold tracking-tight text-natu-brown mb-6 flex items-center gap-4">
                                    {section.title}
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
                    <h3 className="font-sans font-bold tracking-tight text-3xl text-natu-brown mb-8">Dúvidas sobre seus dados?</h3>
                    <a
                        href="https://wa.me/5561982582150?text=Olá! Tenho uma dúvida sobre a proteção de meus dados na Natuclinic."
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
