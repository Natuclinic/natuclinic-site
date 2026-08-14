import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import Unicon from './Unicon';
import { gsap } from 'gsap';

const BlogHighlights = () => {
    const { articles, loading } = useArticles();
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const sectionRef = useRef(null);
    const itemRefs = useRef({});
    const [activeIndex, setActiveIndex] = React.useState(0);

    // Drag state
    const [isDown, setIsDown] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeftState, setScrollLeftState] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const onTouchMove = (e) => {
            if (!isDown) return;
            if (e.cancelable) e.preventDefault();
        };
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        return () => el.removeEventListener('touchmove', onTouchMove);
    }, [isDown]);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollPosition = container.scrollLeft;
        const itemWidth = container.offsetWidth * 0.92;
        const index = Math.round(scrollPosition / itemWidth);
        if (index !== activeIndex) setActiveIndex(index);
    };

    const scrollTo = (index) => {
        if (itemRefs.current[index]) {
            itemRefs.current[index].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
            setActiveIndex(index);
        }
    };

    // Mouse & Touch Drag Logic
    const handleMouseDown = (e) => {
        setIsDown(true);
        const pageX = e.pageX || e.touches?.[0].pageX;
        setStartX(pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeftState(scrollContainerRef.current.scrollLeft);
        setIsDragging(false);
    };

    const snapToCenter = () => {
        if (window.innerWidth >= 1024) return;
        const container = scrollContainerRef.current;
        if (!container) return;

        const centerPoint = container.scrollLeft + container.offsetWidth / 2;

        let closestIndex = 0;
        let minDistance = Infinity;

        Object.entries(itemRefs.current).forEach(([idx, item]) => {
            if (!item) return;
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const distance = Math.abs(centerPoint - itemCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = Number(idx);
            }
        });

        const target = itemRefs.current[closestIndex];
        if (!target) return;

        gsap.to(container, {
            scrollLeft: target.offsetLeft - (container.offsetWidth - target.offsetWidth) / 2,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
        });
        setActiveIndex(closestIndex);
    };

    const handleMouseUp = () => {
        if (!isDown) return;
        setIsDown(false);
        snapToCenter();
    };

    const handleMouseMove = (e) => {
        if (!isDown) return;

        const pageX = e.pageX || e.touches?.[0].pageX;
        const x = pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.8;

        gsap.to(scrollContainerRef.current, {
            scrollLeft: scrollLeftState - walk,
            duration: 0.8,
            ease: "expo.out",
            overwrite: "auto"
        });

        setIsDragging(true);
    };

    const scroll = (direction) => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollAmount = container.offsetWidth * 0.8;

        gsap.to(container, {
            scrollLeft: direction === 'next' ? container.scrollLeft + scrollAmount : container.scrollLeft - scrollAmount,
            duration: 1,
            ease: "power2.inOut"
        });
    };

    const handleItemClick = (id, index) => {
        if (isDragging) return; // Prevent click if dragging

        if (window.innerWidth < 1024) {
            if (activeIndex !== index) {
                // Smooth center on mobile
                gsap.to(scrollContainerRef.current, {
                    scrollLeft: itemRefs.current[index].offsetLeft - (window.innerWidth * 0.04),
                    duration: 0.6,
                    ease: "power2.out"
                });
                setActiveIndex(index);
            } else {
                navigate(`/blog/${id}`);
            }
        } else {
            navigate(`/blog/${id}`);
        }
    };

    if (loading || !articles.length) return null;

    const highlightArticles = articles.slice(0, 6);

    return (
        <section ref={sectionRef} className="py-12 md:py-24 bg-white overflow-hidden select-none">
            <div className="desktop-container-fluid">
                <div className="flex flex-col gap-12 lg:gap-16">
                    
                    {/* Text & Controls (Moved Top) */}
                    <div className="w-full flex flex-col items-center justify-center text-center space-y-6">
                        <div>
                            <span className="text-natu-brown/60 font-medium text-[10px] uppercase tracking-wider block mb-4">
                                Conheça o melhor procedimento para você
                            </span>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold tracking-normal text-natu-brown leading-[1.1] max-w-2xl mx-auto">
                                Antes de fazer qualquer procedimento, entenda o melhor caminho
                            </h2>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => navigate('/blog')}
                            className="group flex items-center justify-center gap-3 w-fit mx-auto text-natu-brown font-bold uppercase tracking-widest text-xs hover:opacity-70 transition-all duration-300"
                        >
                            Descubra mais matérias
                            <Unicon name="arrow-right" className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    {/* Right Side: Cards Container */}
                    <div className="w-full max-w-5xl mx-auto relative flex flex-col">
                        
                        {/* DESKTOP LAYOUT (Grid 1 Large, 2 Small) */}
                        <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-5 h-[420px] xl:h-[500px]">
                            {highlightArticles.slice(0, 3).map((article, index) => (
                                <div
                                    key={article.id}
                                    className={`relative rounded-[16px] overflow-hidden group cursor-pointer transition-all duration-500
                                        ${index === 0 ? 'row-span-2 col-span-1' : 'row-span-1 col-span-1'}
                                    `}
                                    onClick={() => navigate(`/blog/${article.id}`)}
                                >
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-natu-brown/95 via-natu-brown/40 to-transparent pointer-events-none"></div>
                                    <div className={`absolute inset-x-0 bottom-0 flex flex-col z-10 ${index === 0 ? 'p-8 lg:p-10' : 'p-6'}`}>
                                        <span className="text-white/90 text-[11px] font-bold mb-1">
                                            {article.category || 'Blog'}
                                        </span>
                                        <h3 className={`font-sans font-bold text-white tracking-tight text-balance
                                            ${index === 0 ? 'text-3xl xl:text-4xl leading-[1.05] mb-3' : 'text-lg xl:text-xl leading-[1.1] mb-1'}
                                        `}>
                                            {article.title}
                                        </h3>
                                        {index === 0 && article.excerpt && (
                                            <p className="text-white/80 text-sm line-clamp-2 mt-1">
                                                {article.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* MOBILE / TABLET LAYOUT (Carousel) */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseUp}
                            onMouseUp={handleMouseUp}
                            onMouseMove={handleMouseMove}
                            onTouchStart={handleMouseDown}
                            onTouchMove={handleMouseMove}
                            onTouchEnd={handleMouseUp}
                            className={`flex lg:hidden gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5 bleed-right
                                    ${isDown ? 'cursor-grabbing' : ''}`}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {highlightArticles.map((article, index) => (
                                <div
                                    key={article.id}
                                    ref={el => itemRefs.current[index] = el}
                                    className={`min-w-[85%] sm:min-w-[280px] h-[420px] flex-1 flex flex-col rounded-[20px] overflow-hidden group cursor-pointer transition-all duration-500 relative flex-shrink-0
                                        ${window.innerWidth < 1024 && activeIndex !== index ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}
                                    `}
                                    onClick={() => handleItemClick(article.id, index)}
                                >
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        draggable="false"
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out select-none"
                                    />
                                    
                                    <div className="absolute inset-0 bg-gradient-to-t from-natu-brown/95 via-natu-brown/40 to-transparent pointer-events-none"></div>

                                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col z-10">
                                        <span className="text-white/90 text-[11px] font-bold mb-1">{article.category || 'Blog'}</span>
                                        <h3 className="text-xl font-sans font-bold text-white leading-[1.1] tracking-tight mb-2 text-balance">
                                            {article.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile Navigation Dots */}
                        <div className="flex justify-center gap-2 mt-4 lg:hidden">
                            {highlightArticles.map((_, index) => (
                                <button
                                    key={`dot-${index}`}
                                    onClick={() => scrollTo(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'w-8 bg-natu-pink' : 'bg-natu-brown/20'}`}
                                    aria-label={`Ver artigo ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>


                </div>

            </div>
        </section>
    );
};

export default BlogHighlights;
