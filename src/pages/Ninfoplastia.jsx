import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Unicon from '../components/Unicon';
import { WHATSAPP_LINKS } from '../constants/links';
import '../styles/blog-system.css';

const NatuButton = ({ children, href, className }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`natu-button ${className || ''}`} style={{ padding: '1rem 2rem', fontSize: '12px', letterSpacing: '0.2em' }}>
        <span className="natu-button__icon-wrapper flicker-fix">
            <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg" width="10">
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
            </svg>
            <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg natu-button__icon-svg--copy">
                <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
            </svg>
        </span>
        {children}
    </a>
);

const Ninfoplastia = ({ goBack }) => {
    const tocRef = useRef(null);
    const contentRef = useRef(null);
    const progressBarRef = useRef(null);

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
                        <span className="hover:text-natu-brown cursor-pointer transition-colors" onClick={() => goBack()}>Estética Íntima</span>
                        <span>&gt;</span>
                        <span className="text-natu-brown/50">Ninfoescultura | Natuclinic</span>
                    </div>

                    <div className="w-full h-[1px] bg-natu-brown/5 mb-10"></div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-xs font-sans tracking-[0.2em] text-natu-brown/60 mb-4 uppercase font-bold">
                        <span className="text-natu-pink">Estética Íntima</span>
                        <span className="w-1 h-1 bg-natu-brown/20 rounded-full"></span>
                        <span>Procedimento</span>
                    </div>

                    <h1 className="blog-title fluid mt-1 mb-0 text-natu-brown leading-[1.1] tracking-tight">
                        Ninfoescultura Sem Cortes
                    </h1>

                    <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-natu-brown/5 pt-8">
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                            <div className="flex items-center gap-3">
                                <Unicon name="clock" size={14} className="text-natu-pink" />
                                <span className="text-[10px] uppercase tracking-[0.2em] text-natu-brown/40 font-bold">4 min de leitura</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-widest text-natu-brown/30 font-bold">Por:</span>
                                <span className="text-[10px] uppercase tracking-widest text-natu-brown font-bold border-b border-natu-brown/10 pb-0.5">
                                    Equipe Natuclinic
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 text-natu-brown/40">
                            <a href={`https://wa.me/?text=Ninfoescultura%20Sem%20Cortes%20${window.location.href}`} target="_blank" rel="noopener noreferrer" className="hover:text-natu-pink transition-colors">
                                <Unicon name="whatsapp" size={22} />
                            </a>
                        </div>
                    </div>
                </header>

                <main className="relative mt-12 lg:max-w-3xl">
                    <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-natu-brown/10 via-transparent to-transparent hidden xl:block"></div>

                    <article ref={contentRef} className="relative z-10 prose max-w-none prose-img:rounded-2xl prose-img:my-6 prose-headings:font-serif prose-headings:text-natu-brown prose-p:font-sans prose-p:font-light prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-lg prose-a:text-natu-pink prose-li:font-sans prose-li:text-gray-600">

                        <p>
                            A ninfoescultura sem cortes, referida frequentemente como ninfoplastia não cirúrgica, é um protocolo de cuidado íntimo integrativo. Esse tratamento foi pensado para mulheres que desejam restaurar o conforto, a estética e, principalmente, a autoconfiança de forma segura.
                        </p>

                        <img src="/ninfoescultura-ninfoplastia.png" alt="Ninfoescultura Sem Cortes na Natuclinic" className="w-full aspect-video object-cover rounded-2xl mb-8 border border-natu-brown/5" />

                        <h2 id="o-que-e">O que é a ninfoescultura sem cortes?</h2>
                        <p>
                            Diferente da cirurgia plástica tradicional, a <strong>ninfoescultura sem cortes</strong> é um procedimento totalmente não cirúrgico. Ela é realizada utilizando tecnologias avançadas que promovem a retração, remodelação e o rejuvenescimento celular dos pequenos lábios e da região vulvar. Com isso, eliminamos a necessidade de bisturi, pontos cirúrgicos ou afastamento prolongado da rotina diária das nossas pacientes.
                        </p>
                        <p>Na Natuclinic, nossa prioridade é o respeito absoluto à anatomia e às funções do corpo feminino. Os benefícios do nosso método incluem:</p>
                        <ul>
                            <li>Procedimento completamente sem cortes, garantindo maior conforto.</li>
                            <li>Sem necessidade de internação ou preparação cirúrgica.</li>
                            <li>Sem formação de cicatrizes permanentes na região.</li>
                            <li>Sem longos períodos de recuperação, permitindo rápido retorno às atividades.</li>
                        </ul>

                        <h2 id="para-quem-e-indicado" className="mt-12">Para quem é indicado?</h2>
                        <p>A ninfoescultura sem cortes pode ser indicada para diversas situações do dia a dia da mulher, oferecendo melhora da qualidade de vida global. É altamente recomendada para mulheres que:</p>
                        <ul>
                            <li>Sentem desconforto físico constante ao usar roupas justas, biquínis ou durante atividades físicas e esportes.</li>
                            <li>Têm incômodo estético com o tamanho, assimetria ou flacidez dos pequenos lábios.</li>
                            <li>Sentem dor ou desconforto recorrente devido ao atrito durante a relação sexual (dispareunia ligada a fatores anatômicos locais).</li>
                            <li>Passaram por gestação, parto ou estão enfrentando alterações hormonais da menopausa que levaram a mudanças vulvares.</li>
                            <li>Desejam melhorar a autoestima íntima, sentirem-se mais bonitas e confiantes, sem precisar recorrer à cirurgia corretiva clássica (ninfoplastia tradicional).</li>
                        </ul>

                        <h2 id="por-que-escolher" className="mt-12">Por que escolher a Natuclinic?</h2>
                        <p>
                            Porque aqui nós não tratamos apenas uma região do corpo de forma isolada. Nós cuidamos de você como um todo. Na Natuclinic, a ninfoescultura sem cortes está inserida primeiramente dentro do conceito de <strong>estética funcional e saúde integrativa</strong>.
                        </p>
                        <p>Durante a nossa consulta e avaliação individualizada, avaliamos fatores cruciais para o sucesso e manutenção do seu tratamento:</p>
                        <ul>
                            <li>A qualidade dos tecidos da região íntima.</li>
                            <li>A sua saúde hormonal basal.</li>
                            <li>O grau e envolvimento do estado inflamatório geral do organismo.</li>
                            <li>A elaboração detalhada do seu histórico clínico e queixas emocionais.</li>
                        </ul>
                        <blockquote>
                            "Nosso diferencial está no acolhimento, na ciência aplicada e na personalização absoluta do cuidado a cada mulher."
                        </blockquote>

                        <h2 id="beneficios-reais" className="mt-12">Benefícios Reais da Ninfoescultura</h2>
                        <p>Além da óbvia melhora na aparência e remodelação estética, nosso protocolo sem cirurgia traz inúmeros benefícios tangíveis e que vão afetar beneficamente o seu bem-estar geral:</p>
                        <ul>
                            <li><strong>Melhora estética evidente dos pequenos lábios:</strong> Reduzindo seu volume aparente sem mutilação.</li>
                            <li><strong>Redução de flacidez:</strong> Melhorando o tônus utilizando estímulo fisiológico celular.</li>
                            <li><strong>Mais conforto no dia a dia:</strong> Diga adeus aos incômodos no uso de calças justas.</li>
                            <li><strong>Melhora exponencial da autoestima e da confiança íntima:</strong> Para você aproveitar cada momento seu.</li>
                            <li><strong>Procedimento ágil e não invasivo:</strong> Que torna a realização mais simples e segura no próprio consultório.</li>
                            <li><strong>Retorno imediato às atividades:</strong> Você sai das nossas clínicas pronta para continuar seu dia.</li>
                        </ul>

                        <p className="text-center italic mt-12 mb-8 text-natu-brown/60">
                            "Não é só sobre aparência. É sobre se sentir confortável e livre no próprio corpo novamente."
                        </p>
                    </article>
                </main>

                <footer className="article-footer pt-4 mt-8 lg:max-w-3xl border-t border-gray-100">
                    <div className="flex justify-center mt-12 md:mt-16 mb-16 px-4">
                        <NatuButton href={WHATSAPP_LINKS.MSG_NINFO}>
                            <span className="text-center">Falar com Especialista</span>
                        </NatuButton>
                    </div>

                    {/* Author Card */}
                    <div
                        className="author-card p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 md:gap-10 mb-12 relative overflow-hidden group"
                        style={{
                            backgroundImage: 'url(/background-card.svg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-natu-brown/70 rounded-3xl z-0" />

                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white/30 shrink-0 relative z-10 transition-transform duration-500 group-hover:scale-105 bg-white">
                            <img
                                src="/logo-icon.png"
                                alt="Equipe Natuclinic"
                                className="w-full h-full object-cover p-2"
                                onError={(e) => { e.target.src = "/images/blog-images/avatar-natuclinic-blog.jpg"; }}
                            />
                        </div>

                        <div className="flex flex-col flex-grow text-left relative z-10">
                            <span className="font-sans font-bold text-white/60 text-[10px] uppercase tracking-[0.3em] mb-1 flex items-center justify-start gap-2">
                                Especialistas
                                <span className="w-6 h-[1px] bg-white/30 inline-block" />
                            </span>
                            <h4 className="blog-title text-3xl text-white mb-1">
                                Equipe Natuclinic
                            </h4>
                            <p className="text-white/60 text-xs uppercase tracking-widest font-sans font-bold mb-6">Saúde Íntima e Estética Avançada</p>
                        </div>
                    </div>

                    <div className="tags-section flex flex-wrap gap-3 mb-12">
                        {['Natuclinic', 'Estética Íntima', 'Ninfoescultura', 'Procedimentos', 'Saúde Celular'].map((tag, idx) => (
                            <span key={idx} className="px-6 py-2 bg-white border border-natu-brown/10 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest text-natu-brown/60 hover:bg-natu-brown hover:text-white hover:border-natu-brown transition-all cursor-pointer">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <hr className="my-12 border-natu-brown/5" />

                    <div className="waitlist-form bg-[#F2F0E9] text-natu-brown p-8 md:p-10 rounded-3xl relative overflow-hidden text-left flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        <div className="absolute inset-0 bg-gradient-to-r from-natu-brown/0 via-natu-brown/5 to-natu-brown/0 -translate-x-full animate-[shimmer_3s_infinite]"></div>

                        <div className="relative z-10 max-w-lg">
                            <h3 className="font-serif text-3xl mb-4 text-natu-brown leading-tight">Sinta-se confortável com você mesma</h3>
                            <p className="font-sans font-light text-natu-brown/70 text-base">
                                Esclareça suas dúvidas e agende sua avaliação com nossa equipe de especialistas.
                            </p>
                        </div>

                        <a
                            href={WHATSAPP_LINKS.MSG_NINFO}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10 px-6 py-4 bg-natu-brown text-white rounded-full font-normal text-sm hover:scale-105 transition-all flex items-center justify-center gap-3 shrink-0 whitespace-nowrap"
                        >
                            <Unicon name="whatsapp" size={24} />
                            Agendar Avaliação
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Ninfoplastia;
