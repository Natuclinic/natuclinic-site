import React, { useState, useEffect, useRef, useCallback } from 'react';
import Unicon from './Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BeforeAfterSlider = ({ beforeImage, afterImage, altText, onClick }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
    };

    const handleMouseUp = (e) => {
        setIsDragging(false);
    };

    const handleTouchStart = () => setIsDragging(true);
    const handleTouchEnd = () => setIsDragging(false);

    const handleMove = (clientX) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderPosition(percentage);
    };

    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

    useEffect(() => {
        const stopDragging = () => setIsDragging(false);
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);
        return () => {
            window.removeEventListener('mouseup', stopDragging);
            window.removeEventListener('touchend', stopDragging);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl cursor-ew-resize select-none group"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onClick={onClick}
        >
            {/* After Image (Background) */}
            <img
                src={afterImage}
                alt={`${altText} - Depois`}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable="false"
            />

            {/* Before Image (Foreground with Clip Path) */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt={`${altText} - Antes`}
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    draggable="false"
                />
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-20"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110">
                    <Unicon name="arrows-h-alt" size={16} className="text-white" />
                </div>
            </div>

            {/* Labels */}
            <div className={`absolute bottom-4 left-4 bg-black/50 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none transition-opacity duration-300 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
                Antes
            </div>
            <div className={`absolute bottom-4 right-4 bg-white/80 text-natu-brown text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none transition-opacity duration-300 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
                Depois
            </div>
        </div>
    );
};

const ResultsSection = ({ id }) => {
    const [baseResults, setBaseResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(3);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const sectionRef = useRef(null);
    const autoPlayRef = useRef(null);
    const resumeTimerRef = useRef(null);

    // Triple results for seamless loop
    const results = baseResults.length ? [...baseResults, ...baseResults, ...baseResults] : [];

    // Responsive visible items
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setVisibleItems(1);
            else if (window.innerWidth < 1024) setVisibleItems(2);
            else setVisibleItems(3);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-detect images
    useEffect(() => {
        const detectImages = async () => {
            const detected = [];
            for (let i = 1; i <= 10; i++) {
                const num = i.toString().padStart(2, '0');
                const beforeSrc = `/images/resultados/resultado-${num}-antes.jpg`;
                const afterSrc = `/images/resultados/resultado-${num}-depois.jpg`;

                try {
                    const res = await fetch(beforeSrc, { method: 'HEAD' });
                    if (res.ok) {
                        detected.push({
                            id: i,
                            before: beforeSrc,
                            after: afterSrc,
                            alt: `Resultado ${i} - Natuclinic`
                        });
                    }
                } catch (e) { }
            }
            if (detected.length > 0) {
                setBaseResults(detected);
                // Start exactly at the middle set's first item
                setCurrentIndex(detected.length);
            }
        };
        detectImages();
    }, []);

    const resetResumeTimer = useCallback(() => {
        setIsAutoPlaying(false);
        if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
            setIsAutoPlaying(true);
        }, 10000);
    }, []);

    // Seamless jump logic
    const handleJump = useCallback((newIndex) => {
        const baseLen = baseResults.length;
        if (!baseLen) return;

        // Jump if we reach the first set or the third set
        if (newIndex >= baseLen * 2 || newIndex < baseLen) {
            // Wait for transition to complete
            setTimeout(() => {
                setIsTransitioning(false);
                const jumpedIndex = newIndex >= baseLen * 2 ? newIndex - baseLen : newIndex + baseLen;
                setCurrentIndex(jumpedIndex);
                // Force a browser reflow or small delay before re-enabling transition
                setTimeout(() => setIsTransitioning(true), 50);
            }, 1000); // Should match duration-1000
        }
    }, [baseResults.length]);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => {
            const next = prev + 1;
            handleJump(next);
            return next;
        });
    }, [handleJump]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => {
            const next = prev - 1;
            handleJump(next);
            return next;
        });
    }, [handleJump]);

    const centerOnIndex = (index) => {
        resetResumeTimer();
        setCurrentIndex(index);
        handleJump(index);
    };

    // Auto-play interval
    useEffect(() => {
        if (isAutoPlaying && baseResults.length > 0) {
            autoPlayRef.current = setInterval(nextSlide, 4500); // 4.5s between scrolls
        } else {
            clearInterval(autoPlayRef.current);
        }
        return () => clearInterval(autoPlayRef.current);
    }, [isAutoPlaying, baseResults.length, nextSlide]);

    // GSAP Header animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".results-header", {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power2.out"
            });
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    if (baseResults.length === 0) return null;

    const itemWidth = 100 / visibleItems;
    const centerOffset = ((visibleItems - 1) / 2) * itemWidth;
    const translateX = -(currentIndex * itemWidth) + centerOffset;

    return (
        <section id={id} ref={sectionRef} className="py-12 md:py-20 bg-white border-t border-black/5 overflow-hidden">
            <div className="desktop-container">
                <div className="text-center mb-16 results-header">
                    <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40 block mb-4">
                        Resultados Reais
                    </span>
                    <h2 className="font-serif text-4xl md:text-7xl text-natu-brown mb-6">
                        Veja a <span className="italic">transformação</span>
                    </h2>
                </div>

                <div className="results-slider relative">
                    <div
                        className={`flex ${isTransitioning ? 'transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)' : ''} will-change-transform`}
                        style={{ transform: `translateX(${translateX}%)` }}
                    >
                        {results.map((result, index) => (
                            <div
                                key={`${result.id}-${index}`}
                                className={`shrink-0 px-3 transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-30 hover:opacity-100'
                                    }`}
                                style={{ width: `${itemWidth}%` }}
                            >
                                <BeforeAfterSlider
                                    beforeImage={result.before}
                                    afterImage={result.after}
                                    altText={result.alt}
                                    onClick={() => centerOnIndex(index)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows Below Slider */}
                <div className="flex justify-center gap-6 mt-12">
                    <button
                        onClick={() => { prevSlide(); resetResumeTimer(); }}
                        className="w-14 h-14 rounded-full border border-natu-brown/10 flex items-center justify-center text-natu-brown hover:bg-natu-brown hover:text-white transition-all active:scale-95"
                    >
                        <Unicon name="arrow-left" size={24} />
                    </button>
                    <button
                        onClick={() => { nextSlide(); resetResumeTimer(); }}
                        className="w-14 h-14 rounded-full border border-natu-brown/10 flex items-center justify-center text-natu-brown hover:bg-natu-brown hover:text-white transition-all active:scale-95"
                    >
                        <Unicon name="arrow-right" size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ResultsSection;
