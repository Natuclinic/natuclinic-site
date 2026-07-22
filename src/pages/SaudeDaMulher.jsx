import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Unicon from '../components/Unicon';
import { WHATSAPP_LINKS } from '../constants/links';
import '../styles/blog-system.css';
import SEO from '../components/SEO';

const NatuButton = ({ children, href, className }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`natu-button max-w-full inline-flex items-center justify-center gap-2 !px-4 sm:!px-6 !py-3 sm:!py-4 !text-[10px] sm:!text-[11px] !tracking-[0.06em] sm:!tracking-[0.15em] text-center ${className || ''}`}
        style={{ letterSpacing: '0.08em' }}
    >
        <span className="natu-button__icon-wrapper flicker-fix shrink-0">
            <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg" width="10">
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
            </svg>
            <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg natu-button__icon-svg--copy">
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
            </svg>
        </span>
        <span className="truncate max-w-[200px] sm:max-w-none">{children}</span>
    </a>
);

const FaqAccordionCard = ({ question, answer, isOpen, onToggle }) => (
    <div className="bg-white rounded-xl md:rounded-2xl border border-natu-brown/15 overflow-hidden mb-3 md:mb-4 transition-all duration-300">
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left border-none bg-transparent cursor-pointer group"
        >
            <span className="font-bold text-natu-brown text-sm sm:text-base md:text-lg pr-4 font-sans leading-snug">
                {question}
            </span>
            <span
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isOpen
                        ? 'bg-[#3D1E15] text-white rotate-90'
                        : 'bg-[#FAF5F0] text-natu-brown group-hover:bg-[#f3ebe4]'
                }`}
            >
                {isOpen ? (
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

        {isOpen && (
            <div className="animate-in fade-in duration-300">
                <div className="border-t border-natu-brown/10 mx-4 sm:mx-5 md:mx-6" />
                <div className="p-4 sm:p-5 md:p-6 text-xs sm:text-sm md:text-base text-natu-brown/70 leading-relaxed font-sans font-light">
                    {answer}
                </div>
            </div>
        )}
    </div>
);

const SaudeDaMulher = ({ goBack }) => {
    const tocRef = useRef(null);
    const contentRef = useRef(null);
    const progressBarRef = useRef(null);
    const [openFaq, setOpenFaq] = React.useState(0);

    // Lógica da Barra de Progresso
    useEffect(() => {
        const updateProgress = () => {
            const scrolled = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            if (height > 0 && progressBarRef.current) {
                const progress = (scrolled / height) * 100;
                progressBarRef.current.style.width = `${progress}%`;
            }
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    // Animações de Entrada
    useEffect(() => {
        gsap.fromTo('.blog-header-content > *',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power4.out" }
        );
        window.scrollTo(0, 0);
    }, []);

    // Geração do Índice (Table of Contents)
    useEffect(() => {
        if (!contentRef.current || !tocRef.current) return;

        const article = contentRef.current;
        const headings = Array.from(article.querySelectorAll('h2, h3'));

        if (headings.length === 0) return;

        const nav = document.createElement('nav');
        const tocTitle = document.createElement('h2');
        tocTitle.innerText = "Neste Artigo";
        nav.appendChild(tocTitle);
        const list = document.createElement('ol');

        headings.forEach(heading => {
            const id = heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            heading.id = id;
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = heading.textContent;
            a.onclick = () => {
                list.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                a.classList.add('active');
            };
            li.appendChild(a);
            list.appendChild(li);
        });

        nav.appendChild(list);
        tocRef.current.innerHTML = '';
        tocRef.current.appendChild(nav);
        tocRef.current.className = 'table-of-contents animate-in fade-in duration-500';

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const link = list.querySelector(`a[href="#${id}"]`);
                    if (link) {
                        list.querySelectorAll('a').forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        }, { rootMargin: '-100px 0px -60% 0px' });

        headings.forEach(h => observer.observe(h));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="blog-system-wrapper pt-44 md:pt-48 bg-white min-h-screen">
            <SEO
                title="Saúde da Mulher & Ginecologia Integrativa em Brasília — Natuclinic"
                description="Ginecologia integrativa, estética íntima não cirúrgica, modulação hormonal e bem-estar feminino em Taguatinga e Planaltina-DF. Agende sua avaliação em ambiente sigiloso."
                url="https://www.natuclinic.com.br/procedimentos/saude-da-mulher"
                canonical="https://www.natuclinic.com.br/procedimentos/saude-da-mulher"
                keywords="saúde da mulher brasília, ginecologia integrativa taguatinga, estética íntima não cirúrgica, rejuvenescimento vaginal brasília, secura vaginal tratamento, equilíbrio hormonal feminino df, natuclinic"
                image="/images/saude-da-mulher-bg.jpg"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "MedicalBusiness",
                    "name": "Natuclinic — Saúde da Mulher e Ginecologia Integrativa",
                    "description": "Centro especializado em saúde feminina, ginecologia integrativa, modulação hormonal e estética íntima sem cortes em Taguatinga e Planaltina-DF.",
                    "url": "https://www.natuclinic.com.br/procedimentos/saude-da-mulher",
                    "areaServed": ["Brasília", "Taguatinga", "Planaltina", "Distrito Federal"],
                    "medicalSpecialty": ["Gynecology", "Integrative Medicine"],
                    "availableService": [
                        { "@type": "MedicalProcedure", "name": "Ninfoescultura Sem Cortes" },
                        { "@type": "MedicalProcedure", "name": "Rejuvenescimento Íntimo Não Invasivo" },
                        { "@type": "MedicalProcedure", "name": "Modulação Hormonal Feminina" }
                    ]
                }}
            />

            <div
                ref={progressBarRef}
                className="fixed top-0 left-0 h-1.5 bg-natu-pink z-[100] transition-all duration-150 ease-out"
                style={{ width: '0%' }}
            />

            <div className="container">
                <aside className="blog-sidebar-right hidden lg:block" style={{ float: 'right', marginLeft: '4rem', width: '300px' }}>
                    <div className="sticky top-32 space-y-4">
                        <div ref={tocRef}></div>
                    </div>
                </aside>

                <header className="relative mb-0 blog-header-content lg:max-w-3xl">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-natu-brown/30 mb-6">
                        <span className="hover:text-natu-brown cursor-pointer transition-colors" onClick={() => goBack ? goBack() : window.history.back()}>Procedimentos</span>
                        <span>&gt;</span>
                        <span className="text-natu-brown/50">Saúde da Mulher & Ginecologia Integrativa</span>
                    </div>

                    <div className="w-full h-[1px] bg-natu-brown/5 mb-10"></div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-xs font-sans tracking-[0.2em] text-natu-brown/60 mb-4 uppercase font-bold">
                        <span className="text-natu-pink">Saúde Feminina</span>
                        <span className="w-1 h-1 bg-natu-brown/20 rounded-full"></span>
                        <span>Ginecologia Integrativa</span>
                        <span className="w-1 h-1 bg-natu-brown/20 rounded-full"></span>
                        <span>Taguatinga-DF & Planaltina-DF</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-natu-brown leading-[1.15] tracking-tight mt-2 mb-0">
                        Saúde da Mulher & Ginecologia Integrativa
                    </h1>

                    <div className="mt-8 sm:mt-12 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-t border-natu-brown/5 pt-6 sm:pt-8">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Unicon name="clock" size={13} className="text-natu-pink" />
                                <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-natu-brown/40 font-bold">5 min de leitura</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-natu-brown/30 font-bold">Por:</span>
                                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-natu-brown font-bold border-b border-natu-brown/10 pb-0.5">
                                    Equipe Médica Natuclinic
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-natu-brown/40">
                            <a href={`https://wa.me/?text=Sa%C3%BAde%20da%20Mulher%20Natuclinic%20${window.location.href}`} target="_blank" rel="noopener noreferrer" className="hover:text-natu-pink transition-colors">
                                <Unicon name="whatsapp" size={20} />
                            </a>
                        </div>
                    </div>
                </header>

                <main className="relative mt-8 sm:mt-12 lg:max-w-3xl">
                    <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-natu-brown/10 via-transparent to-transparent hidden xl:block"></div>

                    <article ref={contentRef} className="relative z-10 prose max-w-none prose-img:rounded-2xl prose-img:my-4 sm:prose-img:my-6 prose-headings:font-sans prose-headings:font-bold prose-headings:text-natu-brown prose-p:font-sans prose-p:font-light prose-p:text-natu-brown/80 prose-p:leading-relaxed prose-p:text-xs sm:prose-p:text-base md:prose-p:text-lg lg:prose-p:text-xl prose-a:text-natu-pink prose-li:font-sans prose-li:text-natu-brown/80 prose-li:text-xs sm:prose-li:text-base md:prose-li:text-lg">
                        
                        <p className="text-xs sm:text-lg md:text-xl font-light text-natu-brown/75 leading-relaxed my-3 sm:my-5">
                            Uma abordagem completa e inovadora para o bem-estar feminino em Brasília. Unimos estética íntima não cirúrgica, equilíbrio hormonal e saúde ginecológica preventiva com total privacidade, conforto e atendimento individualizado.
                        </p>

                        {/* Destaques Rápidos */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-6 not-prose">
                            <div className="bg-natu-ivory/60 p-4 rounded-xl border border-natu-brown/10">
                                <div className="text-natu-pink font-bold text-xs sm:text-sm mb-1">100% Não Invasivo</div>
                                <p className="text-[10px] sm:text-xs text-natu-brown/70 leading-relaxed m-0">Protocolos modernos sem cirurgia, sem cicatrizes e sem afastamento da rotina.</p>
                            </div>
                            <div className="bg-natu-ivory/60 p-4 rounded-xl border border-natu-brown/10">
                                <div className="text-natu-pink font-bold text-xs sm:text-sm mb-1">Visão Integrativa</div>
                                <p className="text-[10px] sm:text-xs text-natu-brown/70 leading-relaxed m-0">Tratamento focado na causa raiz: hormônios, mucosa, autoestima e bem-estar.</p>
                            </div>
                            <div className="bg-natu-ivory/60 p-4 rounded-xl border border-natu-brown/10">
                                <div className="text-natu-pink font-bold text-xs sm:text-sm mb-1">Sigilo Absoluto</div>
                                <p className="text-[10px] sm:text-xs text-natu-brown/70 leading-relaxed m-0">Atendimento individualizado em consultório privativo para total conforto.</p>
                            </div>
                        </div>

                        <h2 id="o-que-e-ginecologia-integrativa" className="text-base sm:text-2xl md:text-3xl font-sans font-bold text-natu-brown mt-6 sm:mt-12 mb-3 sm:mb-6">
                            O que é a Ginecologia Integrativa?
                        </h2>
                        <p>
                            A <strong>Ginecologia Integrativa</strong> é uma vertente moderna da medicina feminina que vai além dos exames de rotina tradicionais. Ela avalia a mulher em sua totalidade: relacionando sintomas íntimos, variações hormonais, níveis de estresse, nutrição celular e saúde metabólica.
                        </p>
                        <p>
                            Na <strong>Natuclinic em Taguatinga e Planaltina-DF</strong>, associamos a ginecologia integrativa à tecnologia de estética íntima avançada. Nosso objetivo é devolver a confiança, o conforto diário e a plenitude da saúde feminina em todas as fases da vida — desde o auge da idade fértil até a pré e pós-menopausa.
                        </p>

                        <div className="my-6 sm:my-10 p-6 sm:p-8 md:p-10 bg-[#3D1E15] rounded-2xl relative overflow-hidden not-prose">
                            <div className="relative z-10">
                                <h3 className="font-sans font-bold text-base sm:text-2xl md:text-3xl !text-white leading-snug sm:leading-tight mb-3 sm:mb-4 m-0">
                                    Deseja cuidar da sua saúde íntima com máxima privacidade?
                                </h3>
                                <p className="font-sans font-light text-xs sm:text-sm md:text-base !text-white/90 leading-relaxed mb-5 sm:mb-6 max-w-xl m-0">
                                    Agende uma avaliação personalizada com nossa equipe especializada e descubra os protocolos ideais para você.
                                </p>
                                <NatuButton href={WHATSAPP_LINKS.MSG_SAUDE_MULHER}>
                                    AGENDAR AVALIAÇÃO NO WHATSAPP
                                </NatuButton>
                            </div>
                        </div>

                        <h2 id="principais-tratamentos" className="text-base sm:text-2xl md:text-3xl font-sans font-bold text-natu-brown mt-6 sm:mt-12 mb-3 sm:mb-6">
                            Principais Tratamentos de Saúde da Mulher na Natuclinic
                        </h2>
                        <p>
                            Oferecemos protocolos personalizados baseados nas necessidades específicas de cada paciente:
                        </p>

                        <h3 id="ninfoescultura-sem-cortes">
                            1. Ninfoescultura & Estética Íntima Sem Cortes
                        </h3>
                        <p>
                            Harmonização e redução dos pequenos lábios vaginais através de tecnologias não cirúrgicas. Corrige assimetrias e desconfortos estéticos ou funcionais sem necessitar de bisturi ou tempo prolongado de recuperação.
                        </p>

                        <h3 id="rejuvenescimento-e-secura-vaginal">
                            2. Rejuvenescimento Íntimo e Tratamento de Secura Vaginal
                        </h3>
                        <p>
                            Estimula a vascularização local, o colágeno e o espessamento saudável da mucosa íntima. Indicado para mulheres que sofrem com secura vaginal, ardor, frouxidão tissular ou dor na relação sexual (especialmente no climatério e menopausa).
                        </p>

                        <h3 id="modulacao-hormonal-ortomolecular">
                            3. Modulação Hormonal e Terapia Ortomolecular Feminina
                        </h3>
                        <p>
                            Reposição de vitaminas, minerais e otimização hormonal fisiológica de acordo com exames laboratoriais detalhados. Melhora a libido, a disposição diária, o sono e alivia calorões e variações de humor da menopausa.
                        </p>

                        <h3 id="clareamento-intimo">
                            4. Clareamento Íntimo Avançado
                        </h3>
                        <p>
                            Remoção de hiperpigmentações e manchas na região vulvar e virilha provocadas por atrito, lâminas ou alterações hormonais, utilizando lasers e peeling de alta precisão.
                        </p>

                        <h2 id="para-quem-e-indicado" className="text-base sm:text-2xl md:text-3xl font-sans font-bold text-natu-brown mt-6 sm:mt-12 mb-3 sm:mb-6">
                            Para Quem São Indicados os Tratamentos?
                        </h2>
                        <ul>
                            <li>Mulheres que desejam melhorar a estética e assimetria da região íntima sem passar por cirurgias.</li>
                            <li>Mulheres no climatério ou menopausa com queixas de secura vaginal, diminuição da libido ou fogachos.</li>
                            <li>Mulheres no pós-parto buscando recuperar o tônus e a firmeza da musculatura e tecidos íntimos.</li>
                            <li>Pacientes que buscam um acompanhamento preventivo integrativo e ortomolecular focado em longevidade.</li>
                        </ul>

                        <h2 id="diferenciais-natuclinic" className="text-base sm:text-2xl md:text-3xl font-sans font-bold text-natu-brown mt-6 sm:mt-12 mb-3 sm:mb-6">
                            Diferenciais da Natuclinic no DF
                        </h2>
                        <p>
                            Localizada em pontos estratégicos de <strong>Taguatinga</strong> e <strong>Planaltina-DF</strong>, a Natuclinic combina tecnologia médica de ponta com um ambiente seguro, acolhedor e altamente privativo. Cada plano de tratamento é desenhado de forma individual após consulta criteriosa.
                        </p>

                        <h2 id="perguntas-frequentes" className="text-base sm:text-2xl md:text-3xl font-sans font-bold text-natu-brown mt-6 sm:mt-12 mb-3 sm:mb-6">
                            Perguntas Frequentes sobre Saúde da Mulher
                        </h2>
                        
                        <div className="my-8 not-prose">
                            {[
                                {
                                    q: 'O procedimento íntimo dói?',
                                    a: 'Não. Os protocolos não invasivos utilizam anestésicos tópicos locais quando necessário, garantindo uma experiência inteiramente confortável, segura e indolor.'
                                },
                                {
                                    q: 'Preciso me afastar do trabalho após o tratamento?',
                                    a: 'Não. Como os tratamentos são 100% não cirúrgicos, você pode retornar às suas atividades normais de rotina e ao trabalho no mesmo dia.'
                                },
                                {
                                    q: 'Quantas sessões são necessárias para ver resultados?',
                                    a: 'O número de sessões varia de acordo com cada protocolo e objetivo da paciente. Em média, os primeiros resultados perceptíveis de firmeza e hidratação surgem já nas primeiras sessões.'
                                },
                                {
                                    q: 'O tratamento para secura vaginal funciona na menopausa?',
                                    a: 'Sim. Nossos protocolos estimulam a regeneração celular, vascularização e produção natural de colágeno na mucosa íntima, restaurando a lubrificação e o conforto da mulher no climatério e pós-menopausa.'
                                },
                                {
                                    q: 'O atendimento é privativo?',
                                    a: 'Com certeza. Todos os atendimentos são realizados em salas privativas com absoluto sigilo médico, acolhimento humanizado e total discrição em nossas unidades.'
                                }
                            ].map((faq, idx) => (
                                <FaqAccordionCard
                                    key={idx}
                                    question={faq.q}
                                    answer={faq.a}
                                    isOpen={openFaq === idx}
                                    onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                                />
                            ))}
                        </div>

                        <div className="my-10 text-center p-6 sm:p-8 bg-natu-ivory rounded-3xl border border-natu-brown/10 not-prose">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-sans font-bold text-natu-brown mb-3">Agende sua Avaliação Sigilosa</h3>
                            <p className="text-natu-brown/70 text-sm mb-8 max-w-md mx-auto">
                                Fale diretamente com nossa equipe e agende sua consulta com total discrição e atenção exclusiva em Brasília.
                            </p>
                            <div className="flex justify-center">
                                <NatuButton href={WHATSAPP_LINKS.MSG_SAUDE_MULHER}>
                                    FALAR COM ESPECIALISTA NO WHATSAPP
                                </NatuButton>
                            </div>
                        </div>

                    </article>
                </main>
            </div>
        </div>
    );
};

export default SaudeDaMulher;
