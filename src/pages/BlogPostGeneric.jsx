
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import '../styles/blog-system.css';
import Unicon from '../components/Unicon';
import { gsap } from 'gsap';
import { Helmet } from 'react-helmet-async';
import CarouselAd from '../components/CarouselAd';

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

const BlogPostGeneric = ({ goBack, post, articles = [], adConfig = null, setCurrentPage }) => {
    const tocRef = useRef(null);
    const contentRef = useRef(null);
    const progressBarRef = useRef(null);
    const containerRef = useRef(null); // Added containerRef

    const markdownComponents = React.useMemo(() => ({
        details: ({ children, ...props }) => (
            <details {...props} className="blog-faq">
                {children}
            </details>
        ),
        summary: ({ children, ...props }) => (
            <summary {...props}>{children}</summary>
        ),
        img: ({ ...props }) => {
            const { node, ...rest } = props;
            return (
                <img
                    className="w-full h-auto rounded-2xl mt-[10px] mb-8 shadow-sm"
                    {...rest}
                />
            );
        },
        table: ({ children }) => (
            <div className="table-responsive-wrapper">
                <table className="min-w-full border-collapse">
                    {children}
                </table>
            </div>
        ),
        a: ({ node, children, href, ...props }) => {
            if (href && href.startsWith('#button:')) {
                const realHref = href.replace('#button:', '');
                return (
                    <span className="flex justify-center my-10 w-full">
                        <NatuButton href={realHref} className="scale-90 md:scale-100">
                            {children}
                        </NatuButton>
                    </span>
                );
            }
            return (
                <a href={href} {...props} className="text-natu-pink hover:underline font-medium">
                    {children}
                </a>
            );
        },
    }), []);

    // Reading Progress Logic
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
        // Initial update
        updateProgress();
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    // GSAP Entrance Animations
    useEffect(() => {
        gsap.fromTo('.blog-header-content > *',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power4.out" }
        );
    }, [post?.id]);

    // Removed the original useEffect for dynamic head tags, SEO component will handle it.
    useEffect(() => {
        if (!post) return;
        // Update Title
        document.title = `${post.title || ''} - Blog Natuclinic`;

        // Update Meta Keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = "keywords";
            document.head.appendChild(metaKeywords);
        }
        // Update JSON-LD Structured Data
        let jsonLdScript = document.getElementById('blog-post-schema');
        if (!jsonLdScript) {
            jsonLdScript = document.createElement('script');
            jsonLdScript.id = "blog-post-schema";
            jsonLdScript.type = "application/ld+json";
            document.head.appendChild(jsonLdScript);
        }
        const structuredData = {
            "@context": "https://schema.org",
            "@graph": [
                {
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
                }
            ]
        };

        // Extract FAQs for SEO if present in markdown content
        const contentStr = String(post.content || '');
        const faqsFound = [];

        // 1. Match ### FAQ: Pattern
        const faqHeaderRegex = /### FAQ: (.*)\n([\s\S]*?)(?=\n### FAQ:|\n---|\n##|$)/g;
        let match;
        while ((match = faqHeaderRegex.exec(contentStr)) !== null) {
            faqsFound.push({
                "@type": "Question",
                "name": match[1].trim(),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": match[2].trim().replace(/[#*`]/g, '')
                }
            });
        }

        // 2. Match <details><summary> Pattern
        const detailsRegex = /<details(?:.*?)>\s*<summary>(.*?)<\/summary>\s*([\s\S]*?)\s*<\/details>/g;
        while ((match = detailsRegex.exec(contentStr)) !== null) {
            faqsFound.push({
                "@type": "Question",
                "name": match[1].trim(),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": match[2].trim().replace(/<[^>]*>?/gm, '') // Strip HTML tags for JSON-LD text
                }
            });
        }

        if (faqsFound.length > 0) {
            structuredData["@graph"].push({
                "@type": "FAQPage",
                "mainEntity": faqsFound
            });
        }

        jsonLdScript.text = JSON.stringify(structuredData);

    }, [post]);

    // Generate TOC
    useEffect(() => {
        if (!post || !contentRef.current || !tocRef.current) return;

        const article = contentRef.current;
        const headings = Array.from(article.querySelectorAll('h2'));

        // Only show TOC if there are headings
        if (headings.length === 0) {
            tocRef.current.innerHTML = '';
            tocRef.current.className = '';
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
        tocRef.current.className = 'table-of-contents animate-in fade-in duration-500';

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

    const isEstetica = post.tags?.some(tag => tag.toLowerCase().includes('estética')) || post.category?.toLowerCase().includes('estética');
    const isSaude = post.tags?.some(tag => tag.toLowerCase().includes('saúde')) || post.category?.toLowerCase().includes('saúde');

    let authorCardInfo = null;
    if (isEstetica) {
        authorCardInfo = {
            name: 'Dra. Débora Meneses',
            role: 'Biomédica Esteta',
            credentials: 'CRBM-DF 26802',
            image: '/dra-debora.jpg',
            whatsapp: "https://wa.me/5561992551867?text=Olá! Gostaria de agendar uma avaliação de Estética Avançada.",
            text: 'O primeiro passo é uma avaliação estética detalhada e individualizada que entende o seu caso.',
            footer: 'Você fala direto com a Natuclinic • Brasília'
        };
    } else if (isSaude) {
        authorCardInfo = {
            name: 'Dr. Julimar Meneses',
            role: 'Nutricionista Ortomolecular',
            credentials: 'CRN-DF 21414',
            image: '/nutricionista-ortomolecular-integrativo-dr-julimar-meneses.jpeg',
            whatsapp: "https://wa.me/5561992551867?text=Olá! Gostaria de agendar uma avaliação Nutricional.",
            text: 'O primeiro passo é uma avaliação médica e nutricional que entende o seu metabolismo.',
            footer: 'Você fala direto com a Natuclinic • Brasília'
        };
    } else {
        authorCardInfo = {
            name: 'Equipe Natuclinic',
            role: 'Especialistas',
            credentials: 'Brasília - DF',
            image: '/logo-svg.svg',
            whatsapp: "https://wa.me/5561992551867?text=Olá! Gostaria de agendar uma avaliação.",
            text: 'O primeiro passo é uma avaliação personalizada que entende o seu caso.',
            footer: 'Você fala direto com a Natuclinic • Brasília'
        };
    }

    const authorCardRender = (
        <div className="author-cta-card bg-white p-4 md:p-5 rounded-2xl flex flex-col items-center text-center border border-gray-200 mb-8 max-w-sm mx-auto relative overflow-hidden mt-8 w-full">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200 shrink-0">
                    <img src={authorCardInfo.image} alt={authorCardInfo.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="md:text-left text-left w-full">
                    <h4 className="font-bold text-natu-brown text-[15px] leading-tight mb-0.5">{authorCardInfo.name}</h4>
                    <p className="text-gray-500 text-[11px] font-medium leading-tight">{authorCardInfo.role} • {authorCardInfo.credentials}</p>
                </div>
            </div>

            <p className="text-gray-700 text-[13px] mb-4 leading-relaxed font-sans w-full text-left">
                {authorCardInfo.text}
            </p>

            <a 
                href={authorCardInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#187a41] hover:bg-[#125c31] text-white font-bold font-sans py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors mb-3 text-[14px]"
            >
                <Unicon name="whatsapp" size={18} />
                Agendar avaliação
            </a>

            <p className="text-[10px] text-gray-400 font-medium font-sans w-full">
                {authorCardInfo.footer}
            </p>
        </div>
    );

    return (
        <div className="blog-system-wrapper pt-28 md:pt-32 pb-20 md:pb-32">
            {/* Reading Progress Bar */}
            <div
                ref={progressBarRef}
                className="fixed top-0 left-0 h-1.5 bg-natu-pink z-[100] transition-all duration-150 ease-out"
                style={{ width: '0%' }}
            />


            <div className="container">
                {/* Lateral Esquerda - Leia Também & Tags (Desktop) */}
                <aside className="related-articles-sidebar hidden xl:block">
                    <div className="sticky top-32 space-y-12">
                        <div>
                            <h3 className="font-sans font-bold text-xl text-natu-brown mb-8 flex items-center justify-between">
                                Leia também
                            </h3>
                            <div className="space-y-8">
                                {(() => {
                                    const related = articles.filter(a => a.id !== post.id && a.category !== 'Internal_Config' && a.category === post.category);
                                    if (related.length < 3) {
                                        const others = articles.filter(a => a.id !== post.id && a.category !== 'Internal_Config' && a.category !== post.category);
                                        related.push(...others.slice(0, 3 - related.length));
                                    }
                                    return related.slice(0, 3);
                                })()
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
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>


                    </div>
                </aside>

                <aside className="blog-sidebar-right hidden lg:block">
                    <div className="sticky top-32 space-y-4">
                        <div ref={tocRef}></div>
                        
                        {/* Dynamic Author CTA Card (Desktop) */}
                        {authorCardRender}

                        {/* Espaço para anúncio lateral global */}
                        {adConfig?.ads && adConfig.ads['sidebar-ad-global'] && adConfig.ads['sidebar-ad-global'].length > 0 && (
                            <div className="mt-8 animate-in fade-in duration-700 w-full">
                                <CarouselAd ads={adConfig.ads['sidebar-ad-global']} rotationInterval={adConfig.settings?.rotationInterval} className="rounded-2xl border border-natu-brown/10 aspect-[3/4]" />
                            </div>
                        )}
                    </div>
                </aside>

                <header id="pre" className="relative mb-0 blog-header-content">
                    {/* Breadcrumbs Removed */}

                    <div className="hidden flex-wrap items-center gap-x-4 gap-y-2 text-[10px] md:text-xs font-sans tracking-[0.2em] text-natu-brown/60 mb-4 uppercase font-bold">
                        <span className="text-natu-pink">{post.category}</span>
                        <span className="w-1 h-1 bg-natu-brown/20 rounded-full"></span>
                        <span>{post.date}</span>
                    </div>

                    <h1 className="blog-title fluid mt-1 mb-0 text-natu-brown leading-[1.1] tracking-tight font-bold">
                        {post.title}
                    </h1>

                    <div className="mt-8">
                        {post.excerpt && (
                            <p className="font-sans font-normal text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}
                        <p className="text-gray-500 font-sans text-sm md:text-base">
                            Por <span className="font-bold text-[#187a41]">{authorCardInfo.name}</span>, {authorCardInfo.credentials}
                        </p>
                        <p className="text-gray-400 font-sans text-sm mt-1 mb-8">
                            {post.date}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mt-8 mb-10 w-full" aria-label="Compartilhar artigo">
                        <a 
                            className="flex-1 h-12 md:h-14 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors border border-gray-100" 
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href.split('?')[0] + "?utm_source=facebook&utm_medium=share_button&utm_campaign=blog")}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="Compartilhar no Facebook"
                        >
                            <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
                                <path d="M24 12.073C24 5.446 18.627.073 12 .073S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z"></path>
                            </svg>
                            <span className="sr-only">Compartilhar no Facebook</span>
                        </a>
                        <a 
                            className="flex-1 h-12 md:h-14 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors border border-gray-100" 
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href.split('?')[0] + "?utm_source=whatsapp&utm_medium=share_button&utm_campaign=blog")}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="Compartilhar no WhatsApp"
                        >
                            <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.889-9.884 2.64.001 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.887 9.884M20.52 3.449C18.258 1.186 15.25.001 12.056 0 5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.946L.057 24l6.305-1.654a11.892 11.892 0 0 0 5.683 1.448h.005c6.557 0 11.892-5.335 11.895-11.893A11.821 11.821 0 0 0 20.52 3.449Z"></path>
                            </svg>
                            <span className="sr-only">Compartilhar no WhatsApp</span>
                        </a>
                        <button 
                            className="flex-1 h-12 md:h-14 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center transition-colors border border-gray-100" 
                            type="button" 
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: post.title,
                                        url: window.location.href.split('?')[0] + "?utm_source=native_share&utm_medium=share_button&utm_campaign=blog",
                                    }).catch(console.error);
                                }
                            }}
                            aria-label="Compartilhar"
                        >
                            <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" aria-hidden="true" focusable="false" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="18" cy="5" r="3"></circle>
                                <circle cx="6" cy="12" r="3"></circle>
                                <circle cx="18" cy="19" r="3"></circle>
                                <path d="m8.59 13.51 6.83 3.98"></path>
                                <path d="m15.41 6.51-6.82 3.98"></path>
                            </svg>
                            <span className="sr-only">Compartilhar</span>
                        </button>
                    </div>
                </header>

                <main className="relative mt-0">
                    <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-natu-brown/10 via-transparent to-transparent hidden xl:block"></div>
                    <article ref={contentRef} className="relative z-10">
                        {/* Render the content with enhanced image styling */}
                        {typeof ContentComponent === 'function' || (typeof ContentComponent === 'object' && ContentComponent !== null) ? (
                            <ContentComponent />
                        ) : (
                            <div className="article-content-render">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={markdownComponents}
                                >
                                    {String(ContentComponent || '')}
                                </ReactMarkdown>
                            </div>
                        )}
                    </article>
                </main>

                <footer className="article-footer pt-4 mt-12 border-t border-natu-brown/5">
                    
                    {/* Organic Tags Section */}
                    <div className="tags-section flex flex-wrap gap-2 mb-10">
                        {['Natuclinic', post.category, 'Procedimentos', 'Tecnologias', 'Saúde Celular'].map((tag, idx) => (
                            <span key={idx} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full font-sans text-[10px] font-bold uppercase tracking-widest text-natu-brown/60 hover:bg-natu-brown hover:text-white transition-all cursor-pointer">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* New CTA Block */}
                    <div className="bg-natu-brown p-8 md:p-10 rounded-2xl text-white mb-12 shadow-sm">
                        <h3 className="font-sans text-2xl md:text-3xl font-bold mb-4 leading-tight text-white tracking-tight max-w-md">
                            Quer entender se esse cuidado faz sentido para você?
                        </h3>
                        <p className="font-sans text-white/90 text-[15px] font-medium leading-relaxed mb-8 max-w-sm">
                            A avaliação médica é o caminho para decidir com segurança, contexto e acompanhamento.
                        </p>
                        <a
                            href="https://wa.me/5561992551867?text=Olá! Gostaria de agendar uma avaliação."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-max bg-white text-natu-brown py-3.5 px-8 rounded-full font-sans font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-[15px]"
                        >
                            <Unicon name="whatsapp" size={22} />
                            Agendar avaliação
                        </a>
                    </div>

                    {/* "Veja também" Section (Vertical List) */}
                    <div className="mb-16">
                        <h3 className="font-sans font-bold text-xl text-natu-brown mb-6">Veja também</h3>
                        <div className="flex flex-col gap-5 md:grid md:grid-cols-2 md:gap-8">
                            {(() => {
                                const related = articles.filter(a => a.id !== post.id && a.category !== 'Internal_Config' && a.category === post.category);
                                if (related.length < 6) {
                                    const others = articles.filter(a => a.id !== post.id && a.category !== 'Internal_Config' && a.category !== post.category);
                                    related.push(...others.slice(0, 6 - related.length));
                                }
                                return related.slice(0, 6);
                            })()
                                .map(related => (
                                    <div
                                        key={related.id}
                                        onClick={() => {
                                            setCurrentPage(related.slug || related.id);
                                            window.scrollTo(0, 0);
                                        }}
                                        className="group cursor-pointer flex items-center gap-4"
                                    >
                                        <div className="w-28 h-20 md:w-32 md:h-24 rounded-lg overflow-hidden shrink-0 border border-natu-brown/5">
                                            <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <h4 className="font-sans font-normal text-natu-brown text-[15px] md:text-[16px] leading-snug group-hover:text-natu-pink transition-colors">
                                            {related.title}
                                        </h4>
                                    </div>
                                ))}
                        </div>
                    </div>

                </footer>
            </div>
        </div>
    );
};

export default BlogPostGeneric;
