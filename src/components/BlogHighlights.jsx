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
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-stretch">

                    {/* Left Sidebar: Title & Controls */}
                    <div className="w-full lg:w-[24%] flex flex-col justify-center lg:min-h-[400px] space-y-6 lg:space-y-8 pl-4 lg:pl-0">
                        <h2 className="text-4xl md:text-5xl lg:text-5xl font-sans font-bold text-natu-brown leading-[1.1] tracking-tight">
                            Fique por <br />
                            dentro das <br />
                            novidades
                        </h2>

                        {/* CTA Button */}
                        <button
                            onClick={() => navigate('/blog')}
                            className="w-fit px-8 py-3.5 bg-natu-brown text-[#F2F0E9] rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all duration-300"
                        >
                            Ir para o Blog
                        </button>
                    </div>

                    {/* Right Side: Carousel Container */}
                    <div className="w-full lg:w-[76%] relative flex flex-col">
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
                            className={`flex gap-4 lg:gap-5 overflow-x-auto pb-4 no-scrollbar pl-[1.25rem] md:pl-[4%] lg:pl-0 bleed-right
                                    ${isDown ? 'cursor-grabbing' : 'lg:cursor-grab'}`}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {highlightArticles.map((article, index) => (
                                <div
                                    key={article.id}
                                    ref={el => itemRefs.current[index] = el}
                                    className={`min-w-[85%] sm:min-w-[280px] lg:min-w-[280px] xl:min-w-[300px] h-[420px] flex-1 flex flex-col rounded-[20px] overflow-hidden group cursor-pointer transition-all duration-500 relative flex-shrink-0
                                        ${window.innerWidth < 1024 && activeIndex !== index ? 'opacity-50 scale-[0.98]' : 'opacity-100 scale-100'}
                                    `}
                                    onClick={() => handleItemClick(article.id, index)}
                                >
                                    {/* Card Image Background */}
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        draggable="false"
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                                    />
                                    
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-natu-brown/95 via-natu-brown/40 to-transparent pointer-events-none"></div>

                                    {/* Card Content */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col z-10">
                                        <span className="text-white text-[10px] uppercase tracking-widest font-bold mb-2">Blog</span>
                                        <h3 className="text-xl font-sans font-bold text-white leading-tight mb-6">
                                            {article.title}
                                        </h3>
                                        <button className="w-fit px-5 py-2.5 rounded-full border border-white text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
                                            Leia aqui ↗
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Navigation Arrows */}
                        <div className="hidden lg:flex justify-end gap-3 mt-4 pr-[4%] lg:pr-0">
                            <button
                                onClick={() => scroll('prev')}
                                className="w-10 h-10 rounded-full bg-natu-brown flex items-center justify-center text-[#F2F0E9] hover:bg-black transition-all active:scale-95"
                            >
                                <Unicon name="arrow-left" size={20} />
                            </button>
                            <button
                                onClick={() => scroll('next')}
                                className="w-10 h-10 rounded-full bg-natu-brown flex items-center justify-center text-[#F2F0E9] hover:bg-black transition-all active:scale-95"
                            >
                                <Unicon name="arrow-right" size={20} />
                            </button>
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
