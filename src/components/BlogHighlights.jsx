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

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollPosition = container.scrollLeft;
        const itemWidth = container.offsetWidth * 0.85;
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

    const handleMouseUp = () => {
        if (!isDown) return;
        setIsDown(false);
        if (isDragging) {
            snapToCenter();
        }
    };

    const snapToCenter = () => {
        if (window.innerWidth >= 1024) return;
        const container = scrollContainerRef.current;
        const centerPoint = container.scrollLeft + (window.innerWidth / 2);

        let closestIndex = 0;
        let minDistance = Infinity;

        highlightArticles.forEach((_, index) => {
            const item = itemRefs.current[index];
            if (item) {
                const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
                const distance = Math.abs(centerPoint - itemCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = index;
                }
            }
        });

        // Use existing handleItemClick to center
        handleItemClick(highlightArticles[closestIndex].id, closestIndex);
    };

    const handleMouseMove = (e) => {
        if (!isDown) return;
        if (e.cancelable) e.preventDefault();

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
                    scrollLeft: itemRefs.current[index].offsetLeft - (window.innerWidth * 0.075),
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
        <section ref={sectionRef} className="py-12 md:py-24 bg-white overflow-hidden select-none border-t border-black/5">
            <div className="desktop-container">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

                    {/* Left Sidebar: Title & Controls */}
                    <div className="w-full lg:w-[30%] flex flex-col justify-center lg:min-h-[400px] space-y-6 lg:space-y-8">
                        <h2 className="text-4xl md:text-5xl font-sans font-bold text-natu-brown leading-[1.1] tracking-tight">
                            Fique por dentro <br />
                            <span>das novidades</span>
                        </h2>

                        {/* Navigation Arrows - Desktop Only */}
                        <div className="hidden lg:flex gap-3">
                            <button
                                onClick={() => scroll('prev')}
                                className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-natu-brown hover:bg-natu-brown hover:text-white transition-all active:scale-95"
                            >
                                <Unicon name="arrow-left" size={16} />
                            </button>
                            <button
                                onClick={() => scroll('next')}
                                className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-natu-brown hover:bg-natu-brown hover:text-white transition-all active:scale-95"
                            >
                                <Unicon name="arrow-right" size={16} />
                            </button>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => navigate('/blog')}
                            className="w-fit px-8 py-4 bg-natu-brown text-[#F2F0E9] rounded-full font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all duration-300 flex items-center gap-3"
                        >
                            IR PARA O BLOG
                            <Unicon name="arrow-right" size={14} />
                        </button>
                    </div>

                    {/* Right Side: Carousel Container */}
                    <div className="w-full lg:w-[70%] relative">
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
                            className={`flex gap-6 lg:gap-8 overflow-x-auto pb-8 no-scrollbar px-[7.5%] lg:px-0 
                                    ${isDown ? 'cursor-grabbing' : 'lg:cursor-grab'}`}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {highlightArticles.map((article, index) => (
                                <div
                                    key={article.id}
                                    ref={el => itemRefs.current[index] = el}
                                    className={`min-w-[85%] md:min-w-[360px] flex flex-col bg-white rounded-xl border border-natu-brown/5 overflow-hidden group cursor-pointer transition-all duration-500
                                        ${window.innerWidth < 1024 && activeIndex !== index ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'}
                                    `}
                                    onClick={() => handleItemClick(article.id, index)}
                                >
                                    {/* Card Image */}
                                    <div className="aspect-[4/3] overflow-hidden relative border-b border-natu-brown/5 pointer-events-none">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            draggable="false"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                                        />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-sans font-bold text-black leading-snug mb-8 group-hover:text-natu-pink transition-colors">
                                            {article.title}
                                        </h3>

                                        <div className="mt-auto flex items-center gap-1 text-natu-pink text-xs font-bold">
                                            <span>Leia aqui</span>
                                            <Unicon name="arrow-right" size={10} className="mt-0.5" />
                                        </div>
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
