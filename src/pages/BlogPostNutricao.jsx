import React, { useEffect, useRef, useState } from 'react';
import '../styles/blog-system.css';
import Unicon from '../components/Unicon';

import renyPaesImg from '../assets/reny-paes.png';

const BlogPostNutricao = ({ goBack }) => {
    const tocRef = useRef(null);
    const contentRef = useRef(null);
    const [lang, setLang] = useState('pt');

    useEffect(() => {
        if (!contentRef.current || !tocRef.current) return;

        const article = contentRef.current;
        const headings = Array.from(article.querySelectorAll('h2, h3'));
        const nav = document.createElement('nav');

        const tocTitle = document.createElement('h2');
        tocTitle.innerText = "CONTENTS";
        nav.appendChild(tocTitle);

        const list = document.createElement('ol');

        headings.forEach(heading => {
            const id = heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            heading.id = id;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = heading.textContent;

            a.onclick = (e) => {
                list.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                a.classList.add('active');
            };

            li.appendChild(a);
            list.appendChild(li);
        });

        nav.appendChild(list);

        tocRef.current.innerHTML = '';
        tocRef.current.appendChild(nav);

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
        <div className="blog-system-wrapper pt-[200px] md:pt-[150px]">
            <div className="container">
                <table-of-contents ref={tocRef} className="hidden md:block"></table-of-contents>

                <header id="pre" className="flex flex-col items-start gap-6">
                    <div className="flex bg-white/80 rounded-full border border-stone-200 p-0.5">
                        <button
                            onClick={() => setLang('pt')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'pt' ? 'bg-[#4C261A] text-white' : 'text-gray-500 hover:text-[#4C261A]'}`}
                        >
                            PT
                        </button>
                        <button
                            onClick={() => setLang('en')}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-[#4C261A] text-white' : 'text-gray-500 hover:text-[#4C261A]'}`}
                        >
                            EN
                        </button>
                    </div>

                    <h1 className="fluid m-0">Como a Nutrição Ortomolecular potencializa estéticos</h1>
                    <div className="author">
                        <div className="author-info">
                            <img src={renyPaesImg} alt="Reny Paes" />
                            <span>Reny Paes</span>
                        </div>
                    </div>
                </header>

                <main>
                    <article ref={contentRef}>
                        <p className="intro">A beleza verdadeira começa de dentro para fora. A nutrição ortomolecular surge como uma aliada indispensável para quem busca resultados estéticos duradouros, tratando a raiz dos problemas e equilibrando o organismo para que ele possa florescer em sua plenitude.</p>

                        <section id="o-que-e">
                            <h2>O que é Nutrição Ortomolecular?</h2>
                            <p>Diferente das abordagens tradicionais que focam apenas na contagem de calorias, a nutrição ortomolecular busca o equilíbrio químico do corpo. Através da reposição de vitaminas, minerais e aminoácidos, ela restaura as funções celulares, combatendo o envelhecimento precoce e melhorando a qualidade da pele, cabelos e unhas.</p>
                            <p>O objetivo é neutralizar os radicais livres, principais responsáveis pelo processo oxidativo que degrada o colágeno e a elastina.</p>
                        </section>

                        <section id="beneficios">
                            <h2>Principais Benefícios</h2>
                            <p>Ao integrar essa abordagem ao seu protocolo estético, os resultados são potencializados de forma significativa. Procedimentos como bioestimuladores de colágeno e lasers respondem muito melhor em um organismo bem nutrido.</p>

                            <h3>Pele Radiante</h3>
                            <p>Com a desinflamação do organismo, a pele recupera seu viço natural, reduzindo acne, rosácea e manchas. A hidratação melhora e a textura se torna mais uniforme.</p>

                            <h3>Resultados Duradouros</h3>
                            <p>Investir em procedimentos estéticos sem cuidar da base biológica é como construir uma casa sobre a areia. A nutrição ortomolecular garante que seu corpo tenha os "tijolos" necessários para reparar tecidos e manter os resultados por muito mais tempo.</p>
                        </section>

                        <section id="integracao">
                            <h2>Integração com Procedimentos</h2>
                            <p>Na Natuclinic, não olhamos apenas para a queixa estética isolada. Avaliamos seu perfil bioquímico para criar um plano alimentar e de suplementação personalizado. Isso prepara seu corpo para responder com eficiência máxima aos tratamentos de alta tecnologia que oferecemos.</p>
                        </section>

                        <hr />

                        <section>
                            <p>Agende sua consulta e descubra como a ciência da nutrição pode transformar sua beleza e sua saúde de forma integrada.</p>
                        </section>
                    </article>
                </main>

                <hr />

                <footer>
                    <div className="waitlist-form">
                        <p>
                            <strong>Inscreva-se na nossa newsletter</strong><br />
                            Receba novidades sobre saúde integrativa e estética avançada.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input type="text" placeholder="Nome" />
                            <input type="email" placeholder="Email" />
                            <button type="submit">Inscrever</button>
                        </form>
                    </div>
                    <hr />
                    <p className="text-center opacity-50 text-sm py-8">© 2025 Natuclinic Blog</p>
                </footer>
            </div>
        </div>
    );
};

export default BlogPostNutricao;
