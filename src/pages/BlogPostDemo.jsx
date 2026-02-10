import React, { useEffect, useRef, useState } from 'react';
import '../styles/blog-system.css';
import Unicon from '../components/Unicon';

import renyPaesImg from '../assets/reny-paes.png';

const BlogPostDemo = ({ goBack }) => {
    const tocRef = useRef(null);
    const contentRef = useRef(null);
    const [lang, setLang] = useState('pt'); // Default to Portuguese

    // Generate TOC
    useEffect(() => {
        if (!contentRef.current || !tocRef.current) return;

        const article = contentRef.current;
        const headings = Array.from(article.querySelectorAll('h2, h3'));
        const nav = document.createElement('nav');

        // TOC Header
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

            // Basic active state on click
            a.onclick = (e) => {
                // e.preventDefault();
                // document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
                // Reset active class
                list.querySelectorAll('a').forEach(link => link.classList.remove('active'));
                a.classList.add('active');
            };

            li.appendChild(a);
            list.appendChild(li);
        });

        nav.appendChild(list);

        // Clear previous TOC if any (for hot reload)
        tocRef.current.innerHTML = '';
        tocRef.current.appendChild(nav);

        // Simple ScrollSpy (Optional but nice)
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
            {/* Back Button Removed */}

            {/* Language Switch */}
            {/* Language Switch - Moved to flow with content */}

            <div className="container">
                <table-of-contents ref={tocRef}></table-of-contents>

                <header id="pre" className="relative">
                    <div className="absolute -top-12 left-0 z-10 flex bg-white/80 rounded-full shadow-sm border border-stone-200 p-0.5">
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

                    <h1 className="fluid mt-8">Where Product Design Meets Systems Thinking</h1>
                    <div className="author">
                        <div className="author-info">
                            <img src={renyPaesImg} alt="Reny Paes" />
                            <span>Reny Paes</span>
                        </div>
                    </div>
                </header>

                <main>
                    <article ref={contentRef}>
                        <p className="intro">Design engineering bridges design and engineering in web development, ensuring products are visually appealing, performant, and user-centered. By combining systematic thinking, reusable components, and careful attention to UX, teams can deliver experiences that feel cohesive, polished, and responsive across platforms. This article explores the principles, workflows, and tools that help teams create high-quality products at scale while keeping collaboration seamless.</p>

                        <section id="overview">
                            <h2>Interpretation</h2>
                            <p>Design engineering represents the intersection of design and engineering disciplines, where teams work together to create digital products that are functional, delightful, and maintainable. This discipline goes beyond traditional handoffs and focuses on building a shared understanding of both design intent and technical constraints.</p>
                            <p>By applying systems thinking, teams ensure that individual components not only function independently but also integrate harmoniously within larger products, providing consistency and scalability.</p>
                            <h3>The Bridge</h3>
                            <p>In practice, design engineering involves iterative prototyping, rapid testing, and continuous feedback between designers and engineers. Each decision, from layout to interaction, is informed by both visual design principles and technical feasibility, reducing the chances of rework or misalignment.</p>
                        </section>

                        <section id="difference">
                            <h2>Difference</h2>
                            <p>Unlike traditional design handoffs where static mockups are passed to engineers, design engineering emphasizes shared ownership of both components and system behaviors. Designers conceptualize reusable elements with clear patterns, while engineers focus on code structure, performance, and scalability.</p>

                            <h3>Prototypes</h3>
                            <p>Interactive prototypes play a key role in this process. By iterating in a shared environment, teams can test assumptions, identify edge cases, and validate user experience choices before committing to production code.</p>
                            <p>This approach drastically reduces the gap between the initial design vision and the final implementation, resulting in products that are both beautiful and technically sound.</p>
                        </section>

                        <section id="collaboration">
                            <h2>Collaboration</h2>
                            <p>Effective design engineering relies on deep collaboration between designers and engineers. Shared tools, regular reviews, and transparent communication help identify issues early and align the team on goals. Collaboration also fosters mutual respect, where designers understand technical constraints and engineers appreciate UX priorities.</p>
                            <p>Cross-functional collaboration extends beyond the immediate team to include product managers, QA, and stakeholders. This alignment ensures the final product meets business goals, technical requirements, and user expectations, reducing friction during development and launch.</p>
                            <p>Collaborative practices enable faster iteration, fewer mistakes, and a stronger sense of ownership across disciplines, creating an environment where teams can deliver high-quality, cohesive experiences consistently.</p>
                        </section>

                        <hr />

                        <section>
                            <p>Design engineering empowers teams to build scalable, consistent, and user-centered products by bridging design intent with functional implementation. It integrates systems thinking, reusable components, motion with intent, and UX-focused quality to create cohesive experiences that delight users and meet technical requirements.</p>
                        </section>
                    </article>
                </main>

                <hr />

                <footer>
                    <div className="waitlist-form">
                        <p>
                            <strong>Join the newsletter</strong><br />
                            Get updates on design systems and engineering.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input type="text" placeholder="Name" />
                            <input type="email" placeholder="Email" />
                            <button type="submit">Join</button>
                        </form>
                    </div>
                    <hr />
                    <p className="text-center opacity-50 text-sm py-8">© 2025 Natuclinic Content</p>
                </footer>
            </div>
        </div>
    );
};

export default BlogPostDemo;
