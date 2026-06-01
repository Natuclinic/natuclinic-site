import React, { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import Unicon from './Unicon';
import { gsap } from 'gsap';

const BlogHighlights = () => {
    const { articles, loading } = useArticles();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startScroll = useRef(0);

    const scroll = useCallback((direction) => {
        const el = containerRef.current;
        if (!el) return;
        const card = el.querySelector('[data-card]');
        const cardWidth = card ? card.offsetWidth + 24 : el.offsetWidth / 3;
        gsap.to(el, {
            scrollLeft: el.scrollLeft + (direction === 'next' ? cardWidth : -cardWidth),
            duration: 0.7,
            ease: 'power2.inOut'
        });
    }, []);

    const onMouseDown = (e) => {
        isDragging.current = false;
        startX.current = e.pageX;
        startScroll.current = containerRef.current.scrollLeft;
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = useCallback((e) => {
        const dx = e.pageX - startX.current;
        if (Math.abs(dx) > 5) isDragging.current = true;
        if (isDragging.current) {
            containerRef.current.scrollLeft = startScroll.current - dx;
        }
    }, []);

    const onMouseUp = useCallback(() => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        setTimeout(() => { isDragging.current = false; }, 50);
    }, [onMouseMove]);

    if (loading || !articles.length) return null;

    const highlightArticles = articles.slice(0, 6);

    return (
        <section className="py-12 md:py-24 bg-white overflow-hidden select-none border-t border-black/5">
            <div className="desktop-container">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

                    {/* Sidebar esquerda */}
                    <div className="w-full lg:w-[26%] flex flex-col justify-center lg:min-h-[400px] space-y-6 lg:space-y-8 flex-shrink-0">
                        <h2 className="text-4xl md:text-5xl font-sans font-bold text-natu-brown leading-[1.1] tracking-tight">
                            Fique por dentro<br />das novidades
                        </h2>

                        {/* Setas — desktop */}
                        <div className="hidden lg:flex gap-3">
                            <button
                                onClick={() => scroll('prev')}
                                className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-natu-brown hover:bg-natu-brown hover:text-white transition-all active:scale-95"
                                aria-label="Artigo anterior"
                            >
                                <Unicon name="arrow-left" size={16} animate={false} />
                            </button>
                            <button
                                onClick={() => scroll('next')}
                                className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-natu-brown hover:bg-natu-brown hover:text-white transition-all active:scale-95"
                                aria-label="Próximo artigo"
                            >
                                <Unicon name="arrow-right" size={16} animate={false} />
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/blog')}
                            className="w-fit px-8 py-4 bg-natu-brown text-[#F2F0E9] rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all duration-300 flex items-center gap-3"
                        >
                            IR PARA O BLOG
                            <Unicon name="arrow-right" size={14} animate={false} />
                        </button>
                    </div>

                    {/* Carrossel */}
                    <div className="w-full lg:flex-1 overflow-hidden">
                        <div
                            ref={containerRef}
                            onMouseDown={onMouseDown}
                            className="flex gap-6 overflow-x-auto no-scrollbar pb-4 cursor-grab active:cursor-grabbing"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {highlightArticles.map((article) => (
                                <div
                                    key={article.id}
                                    data-card
                                    className="min-w-[80vw] sm:min-w-[340px] lg:min-w-[calc(33.33%_-_1rem)] flex-shrink-0 flex flex-col bg-white rounded-xl border border-natu-brown/5 overflow-hidden group cursor-pointer"
                                    onClick={() => { if (!isDragging.current) navigate(`/blog/${article.id}`); }}
                                >
                                    <div className="aspect-[4/3] overflow-hidden border-b border-natu-brown/5">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            draggable="false"
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-base font-sans font-bold text-black leading-snug mb-3 group-hover:text-natu-brown transition-colors line-clamp-3">
                                            {article.title}
                                        </h3>
                                        <p className="text-[13px] font-sans font-light text-natu-brown/60 line-clamp-2 mb-6 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                        <div className="mt-auto flex items-center gap-1 text-gray-400 text-[10px] font-bold uppercase tracking-widest group-hover:text-natu-brown transition-colors">
                                            <span>Leia aqui</span>
                                            <Unicon name="arrow-right" size={10} animate={false} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Setas — mobile */}
                        <div className="flex justify-center gap-3 mt-4 lg:hidden">
                            <button onClick={() => scroll('prev')} className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-natu-brown">
                                <Unicon name="arrow-left" size={14} animate={false} />
                            </button>
                            <button onClick={() => scroll('next')} className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-natu-brown">
                                <Unicon name="arrow-right" size={14} animate={false} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BlogHighlights;
