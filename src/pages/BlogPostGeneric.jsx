
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/blog-system.css';
import Unicon from '../components/Unicon';
import { gsap } from 'gsap';

const NatuButton = ({ children, href, className }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`natu-button ${className || ''}`} style={{ padding: '1rem 2rem', fontSize: '12px', letterSpacing: '0.2em' }}>
        <span className="natu-button__icon-wrapper">
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

const BlogPostGeneric = ({ goBack, post, articles = [], setCurrentPage }) => {
    const tocRef = useRef(null);
    const contentRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Reading Progress Logic
    useEffect(() => {
        const updateProgress = () => {
            const scrolled = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            if (height > 0) {
                setScrollProgress((scrolled / height) * 100);
            }
        };
        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    // GSAP Entrance Animations
    useEffect(() => {
        gsap.fromTo('.blog-header-content > *',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power4.out" }
        );
    }, [post.id]);

    useEffect(() => {
        // Update Title
        document.title = `${post.title} - Blog Natuclinic`;

        // Update Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = post.meta_description || post.meta?.description || post.excerpt;

        // Update Meta Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
        }
        // Update JSON-LD Structured Data
        let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
        if (!jsonLdScript) {
            jsonLdScript = document.createElement('script');
            jsonLdScript.type = "application/ld+json";
            document.head.appendChild(jsonLdScript);
        }
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": [post.image],
            "datePublished": post.created_at || new Date().toISOString(),
            "dateModified": post.updated_at || new Date().toISOString(),
            "author": {
                "@type": "Person",
                "name": post.author_name || "Natuclinic"
            },
            "description": post.meta_description || post.excerpt
        };
        jsonLdScript.text = JSON.stringify(structuredData);

    }, [post]);

    // Generate TOC
    useEffect(() => {
        if (!contentRef.current || !tocRef.current) return;

        const article = contentRef.current;
        const headings = Array.from(article.querySelectorAll('h2, h3'));

        // Only show TOC if there are headings
        if (headings.length === 0) {
            tocRef.current.innerHTML = '';
            return;
        }

        const nav = document.createElement('nav');

        // TOC Header
        const tocTitle = document.createElement('h2');
        tocTitle.innerText = "Neste Artigo"; // Translated to PT
        nav.appendChild(tocTitle);

        const list = document.createElement('ol');

        headings.forEach(heading => {
            const id = heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            heading.id = id;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = heading.textContent;

            // Basic active state on click
            a.onclick = (e) => {
                // e.preventDefault(); // Default behavior is fine
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

        // Simple ScrollSpy
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
    }, [post]); // Re-run if post changes

    if (!post) return null;

    const ContentComponent = post.content;

    return (
        <div className="blog-system-wrapper pt-44 md:pt-48">
            {/* Reading Progress Bar */}
            <div
                className="fixed top-0 left-0 h-1.5 bg-natu-pink z-[100] transition-all duration-150 ease-out"
                style={{ width: `${scrollProgress}%` }}
            />

            <div className="container">
                {/* Lateral Esquerda - Leia Também & Tags (Desktop) */}
                <aside className="related-articles-sidebar hidden xl:block">
                    <div className="sticky top-32 space-y-12">
                        <div>
                            <h3 className="font-serif text-xl text-natu-brown mb-8 flex items-center justify-between">
                                Leia também
                            </h3>
                            <div className="space-y-8">
                                {articles
                                    .filter(a => a.id !== post.id)
                                    .slice(0, 3)
                                    .map(related => (
                                        <div
                                            key={related.id}
                                            onClick={() => {
                                                setCurrentPage(related.slug || related.id);
                                                window.scrollTo(0, 0);
                                            }}
                                            className="group cursor-pointer flex flex-col gap-4 items-start"
                                        >
                                            <div className="w-full aspect-[16/9] shrink-0 rounded-xl overflow-hidden border border-natu-brown/5">
                                                <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="flex flex-col gap-1 w-full">
                                                <h4 className="blog-title text-[14px] leading-tight text-natu-brown group-hover:text-natu-pink transition-colors line-clamp-2">
                                                    {related.title}
                                                </h4>
                                                <span className="text-[10px] text-natu-brown/40 font-medium lowercase">
                                                    {related.date}
                                                </span>
                                                <div className="flex items-center gap-1 text-natu-pink text-[10px] font-bold uppercase tracking-wider mt-1">
                                                    Ler mais <Unicon name="arrow-right" size={12} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-natu-brown/5">
                            <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-natu-brown/40 mb-6">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {['Natuclinic', post.category, 'Saúde Celular'].map((tag, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-[#F9F7F5] border border-natu-brown/5 rounded-md font-sans text-[9px] font-bold uppercase tracking-wider text-natu-brown/60 hover:bg-natu-brown hover:text-white transition-all cursor-pointer">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                <table-of-contents ref={tocRef} className="hidden lg:block"></table-of-contents>

                <header id="pre" className="relative mb-0 blog-header-content">
                    {/* Breadcrumbs / Directory */}
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-natu-brown/30 mb-6">
                        <span className="hover:text-natu-brown cursor-pointer transition-colors" onClick={() => goBack()}>Blog</span>
                        <span>&gt;</span>
                        <span className="text-natu-brown/50">{post.title} | Natuclinic</span>
                    </div>

                    <div className="w-full h-[1px] bg-natu-brown/5 mb-10"></div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-xs font-sans tracking-[0.2em] text-natu-brown/60 mb-4 uppercase font-bold">
                        <span className="text-natu-pink">{post.category}</span>
                        <span className="w-1 h-1 bg-natu-brown/20 rounded-full"></span>
                        <span>{post.date}</span>
                    </div>

                    <h1 className="blog-title fluid mt-1 mb-0 text-natu-brown leading-[1.1] tracking-tight">
                        {post.title}
                    </h1>

                    <div className="mt-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-natu-brown/5 pt-8">
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                            <div className="flex items-center gap-3">
                                <Unicon name="clock" size={14} className="text-natu-pink" />
                                <span className="text-[10px] uppercase tracking-[0.2em] text-natu-brown/40 font-bold">5 min de leitura</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-widest text-natu-brown/30 font-bold">Por:</span>
                                <span className="text-[10px] uppercase tracking-widest text-natu-brown font-bold border-b border-natu-brown/10 pb-0.5">
                                    {post.author_name || "Equipe Natuclinic"}
                                </span>
                            </div>

                            <div className="hidden sm:block h-4 w-[1px] bg-natu-brown/5"></div>

                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-natu-brown/30">
                                <span>Publicado:</span>
                                <span className="text-natu-brown/50">{post.date}</span>
                            </div>
                        </div>

                        {/* Social Icons Aligned Right */}
                        <div className="flex items-center gap-5 text-natu-brown/40">
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="hover:text-natu-pink transition-colors">
                                <Unicon name="linkedin" size={16} />
                            </a>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="hover:text-natu-pink transition-colors">
                                <Unicon name="facebook" size={16} />
                            </a>
                            <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noopener noreferrer" className="hover:text-natu-pink transition-colors">
                                <Unicon name="twitter" size={16} />
                            </a>
                            <a href={`https://wa.me/?text=${post.title}%20${window.location.href}`} target="_blank" rel="noopener noreferrer" className="hover:text-natu-pink transition-colors">
                                <Unicon name="whatsapp" size={16} />
                            </a>
                        </div>
                    </div>
                </header>

                <main className="relative mt-0">
                    <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-natu-brown/10 via-transparent to-transparent hidden xl:block"></div>
                    <article ref={contentRef} className="relative z-10">
                        {/* Render the content with enhanced image styling */}
                        {typeof ContentComponent === 'function' ? (
                            <ContentComponent />
                        ) : (
                            <div className="prose max-w-none prose-img:rounded-2xl prose-img:my-6">
                                <ReactMarkdown
                                    components={{
                                        img: ({ node, ...props }) => (
                                            <img
                                                className="w-full aspect-video object-cover rounded-2xl mt-[10px] mb-8 border border-gray-100"
                                                {...props}
                                            />
                                        ),
                                    }}
                                >
                                    {ContentComponent}
                                </ReactMarkdown>
                            </div>
                        )}
                    </article>
                </main>

                <footer className="article-footer pt-4 mt-8">
                    {/* Mobile/Tablet Related Posts (shown when sidebar is hidden) */}
                    <div className="xl:hidden mt-20 pt-20 border-t border-gray-100">
                        <h3 className="blog-title text-2xl text-natu-brown mb-10">Leia também</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            {articles
                                .filter(a => a.id !== post.id)
                                .slice(0, 4)
                                .map(related => (
                                    <div
                                        key={related.id}
                                        onClick={() => {
                                            setCurrentPage(related.slug || related.id);
                                            window.scrollTo(0, 0);
                                        }}
                                        className="group cursor-pointer space-y-4"
                                    >
                                        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-natu-brown/5">
                                            <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-natu-pink font-bold uppercase tracking-widest">{related.category}</span>
                                            <h4 className="blog-title text-lg text-natu-brown group-hover:text-natu-pink transition-colors mt-2 leading-tight">
                                                {related.title}
                                            </h4>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Natuclinic Protocol CTA */}
                    <div className="flex justify-center mt-12 md:mt-16 mb-16 px-4">
                        <NatuButton href="https://wa.me/5561992551867?text=Olá! Gostaria de agendar uma consulta ideal.">
                            <span className="text-center">Falar com Especialista</span>
                        </NatuButton>
                    </div>

                    {/* Enhanced Author Card — Escrito por movido para dentro */}
                    <div
                        className="author-card p-8 md:p-10 rounded-3xl flex flex-col md:flex-row items-center gap-8 md:gap-10 mb-12 relative overflow-hidden group"
                        style={{
                            backgroundImage: 'url(/background-card.svg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {/* Overlay escuro para contraste */}
                        <div className="absolute inset-0 bg-natu-brown/70 rounded-3xl z-0" />

                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white/30 shrink-0 relative z-10 transition-transform duration-500 group-hover:scale-105">
                            <img
                                src={post.author_avatar || "https://ui-avatars.com/api/?name=Equipe+Natuclinic&background=4C261A&color=fff"}
                                alt={post.author_name || "Equipe Natuclinic"}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col flex-grow text-center md:text-left relative z-10">
                            {/* "Escrito por" agora dentro do card */}
                            <span className="font-sans font-bold text-white/60 text-[10px] uppercase tracking-[0.3em] mb-1 flex items-center justify-center md:justify-start gap-2">
                                Escrito por
                                <span className="w-6 h-[1px] bg-white/30 inline-block" />
                            </span>
                            <h4 className="blog-title text-3xl text-white mb-1">
                                {post.author_name || "Equipe Natuclinic"}
                            </h4>
                            <p className="text-white/60 text-xs uppercase tracking-widest font-sans font-bold mb-6">Equipe de Especialistas Natuclinic</p>
                            <div className="flex items-center justify-center md:justify-start gap-4">
                                <span className="p-2.5 bg-white/10 text-white rounded-full cursor-pointer hover:bg-white hover:text-natu-brown transition-all border border-white/20">
                                    <Unicon name="envelope" size={14} />
                                </span>
                                <span className="p-2.5 bg-white/10 text-white rounded-full cursor-pointer hover:bg-white hover:text-natu-brown transition-all border border-white/20">
                                    <Unicon name="link" size={14} />
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* Organic Tags Section */}
                    <div className="tags-section flex flex-wrap gap-3 mb-12">
                        {['Natuclinic', post.category, 'Procedimentos', 'Tecnologias', 'Saúde Celular'].map((tag, idx) => (
                            <span key={idx} className="px-6 py-2 bg-white border border-natu-brown/10 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest text-natu-brown/60 hover:bg-natu-brown hover:text-white hover:border-natu-brown transition-all cursor-pointer">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <hr className="my-12 border-gray-100" />

                    <div className="waitlist-form bg-[#F2F0E9] text-natu-brown p-8 md:p-16 rounded-3xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10">
                        {/* Shimmer effect for premium feel */}
                        <div className="absolute inset-0 bg-gradient-to-r from-natu-brown/0 via-natu-brown/5 to-natu-brown/0 -translate-x-full animate-[shimmer_3s_infinite]"></div>

                        <div className="relative z-10 max-w-lg">
                            <h3 className="font-serif text-4xl mb-4 text-natu-brown">Deseja resultados reais como estes?</h3>
                            <p className="font-sans font-light text-natu-brown/70 text-lg">
                                Agende sua consulta e inicie sua jornada de transformação com nossa equipe.
                            </p>
                        </div>

                        <a
                            href="https://wa.me/5561992551867?text=Olá! Desejo resultados reais. Gostaria de agendar uma avaliação."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10 px-8 py-4 bg-natu-brown text-white rounded-full font-medium text-base hover:scale-105 transition-all flex items-center gap-3"
                        >
                            <Unicon name="whatsapp" size={24} />
                            Agendar minha avaliação
                        </a>
                    </div>

                    <p className="text-center opacity-30 text-[10px] uppercase tracking-widest font-bold pt-8 pb-0">© 2026 Natuclinic • Ciência e Saúde</p>
                </footer>
            </div>
        </div>
    );
};

export default BlogPostGeneric;
