import React, { useState, useEffect, useRef, useCallback } from 'react';
import Unicon from './Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BeforeAfterSlider = ({ beforeImage, afterImage, altText, onClick, isActive = true }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const hasMovedRef = useRef(false);
    const clipRef = useRef(null);
    const lineRef = useRef(null);
    const tlRef = useRef(null);

    // Subtle idle animation to encourage interaction
    useEffect(() => {
        if (!isActive) {
            if (tlRef.current) {
                tlRef.current.kill();
                tlRef.current = null;
            }
            // Reset to center when not active
            setSliderPosition(50);
            if (clipRef.current) clipRef.current.style.clipPath = `inset(0 50% 0 0)`;
            if (lineRef.current) lineRef.current.style.left = `50%`;
            return;
        }

        if (hasMovedRef.current) return;

        const obj = { pos: 50 };
        tlRef.current = gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 1 });
        
        const updateDOM = () => {
            if (clipRef.current) clipRef.current.style.clipPath = `inset(0 ${100 - obj.pos}% 0 0)`;
            if (lineRef.current) lineRef.current.style.left = `${obj.pos}%`;
        };

        // Premium "flick and settle" curve
        tlRef.current.to(obj, { pos: 55, duration: 0.8, ease: "power2.out", onUpdate: updateDOM })
                     .to(obj, { pos: 50, duration: 2.0, ease: "elastic.out(1, 0.6)", onUpdate: updateDOM });

        return () => {
            if (tlRef.current) {
                tlRef.current.kill();
                tlRef.current = null;
            }
        };
    }, [isActive]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        hasMovedRef.current = false;
        if (tlRef.current) tlRef.current.kill();
    };

    const handleTouchStart = () => {
        setIsDragging(true);
        hasMovedRef.current = false;
        if (tlRef.current) tlRef.current.kill();
    };

    const handleMove = (clientX) => {
        if (!isDragging || !containerRef.current) return;

        hasMovedRef.current = true;

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

    const handleContainerClick = (e) => {
        if (hasMovedRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (onClick) onClick();
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[4/5] md:aspect-square overflow-hidden rounded-2xl cursor-ew-resize select-none group"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onClick={handleContainerClick}
        >
            {/* After Image (Background) */}
            <img
                src={afterImage}
                alt={`${altText} - Depois`}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                draggable="false"
                loading="lazy"
            />

            {/* Before Image (Foreground with Clip Path) */}
            <div
                ref={clipRef}
                className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage}
                    alt={`${altText} - Antes`}
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    draggable="false"
                    loading="lazy"
                />
            </div>

            {/* Vertical slider line & handle */}
            <div
                ref={lineRef}
                className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize z-20"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white/30 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 flicker-fix shadow-xl">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                </div>
            </div>

            {/* Labels */}
            <div className={`absolute bottom-4 left-4 bg-black/50 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none transition-opacity duration-300 flicker-fix ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
                Antes
            </div>
            <div className={`absolute bottom-4 right-4 bg-white/80 text-natu-brown text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none transition-opacity duration-300 flicker-fix ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
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
                            before: `${beforeSrc}?v=2`,
                            after: `${afterSrc}?v=2`,
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

    // GSAP Header animation — só registra quando o DOM está montado com dados
    useEffect(() => {
        if (!sectionRef.current || baseResults.length === 0) return;
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
    }, [baseResults.length]);

    if (baseResults.length === 0) return null;

    const itemWidth = 100 / visibleItems;
    const centerOffset = ((visibleItems - 1) / 2) * itemWidth;
    const translateX = -(currentIndex * itemWidth) + centerOffset;

    return (
        <section id={id} ref={sectionRef} className="py-12 md:py-20 bg-natu-ivory border-t border-black/5 overflow-hidden">
            <div className="desktop-container-fluid">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16 results-header">
                    <div>
                        <span className="sr-only">
                            Galeria de Casos
                        </span>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-natu-brown leading-[0.95]">
                            Resultados de quem já passou por&nbsp;aqui.
                        </h2>
                    </div>
                    <p className="max-w-xs font-sans font-light text-natu-brown/50 text-sm leading-relaxed md:text-right text-pretty">
                        Resultados de nossos pacientes da Natuclinic em&nbsp;Brasília.
                    </p>
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
                                    isActive={index === currentIndex}
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
