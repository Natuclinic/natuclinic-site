import React, { useState, useRef, useEffect } from 'react';
import Unicon from './Unicon';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'motion/react';

const feedbacks = [
    {
        id: 'edilza',
        name: "Edilza",
        video: "https://pub-cf3f0550e96b441691fba3f1c70e6a39.r2.dev/edilza.mp4#t=0.001",
        title: "Emagrecimento Saudável",
        result: "Emagreceu 10kg e melhorou sua saúde por completo."
    },
    {
        id: 'elizangela',
        name: "Elizangela",
        video: "https://pub-cf3f0550e96b441691fba3f1c70e6a39.r2.dev/elisangela.mp4#t=0.001",
        title: "Transformação Corporal",
        result: "Elizangela perdeu +de 5kg e elevou sua qualidade de vida."
    },
    {
        id: 'margarete',
        name: "Margarete",
        video: "https://pub-cf3f0550e96b441691fba3f1c70e6a39.r2.dev/margarete.mp4#t=0.001",
        title: "Qualidade de Vida",
        result: "Margarete tomou iniciativa de cuidar de si mesma e hoje colhe os frutos."
    },
    {
        id: 'josi',
        name: "Josi",
        video: "https://pub-cf3f0550e96b441691fba3f1c70e6a39.r2.dev/josi.mp4#t=0.001",
        title: "Metodologia Natuclinic",
        result: "Josi emagreceu e transformou sua autoestima com o nosso acompanhamento."
    }
];

const VideoFeedbacks = () => {
    const [activeId, setActiveId] = useState(feedbacks[0].id);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRefs = useRef({});
    const modalVideoRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const itemRefs = useRef({});
    const [modalIsPlaying, setModalIsPlaying] = useState(true);

    // Drag state
    const [isDown, setIsDown] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [scrollLeftState, setScrollLeftState] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);

    const handleToggle = (id) => {
        if (activeId === id && !isDragging) return;

        setActiveId(id);
        setIsPlaying(false);

        // Center item in mobile slider using GSAP for liquid smoothness
        if (window.innerWidth < 1024 && itemRefs.current[id]) {
            const container = scrollContainerRef.current;
            const item = itemRefs.current[id];
            const targetScroll = item.offsetLeft - (window.innerWidth * 0.075);

            gsap.to(container, {
                scrollLeft: targetScroll,
                duration: 0.8,
                ease: "power2.out"
            });
        }

        // Stop all videos
        Object.values(videoRefs.current).forEach(v => {
            if (v) { v.pause(); v.currentTime = 0; }
        });
    };

    // Mouse Drag Logic
    const handleMouseDown = (e) => {
        if (window.innerWidth >= 1024) return;
        setIsDown(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
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

        let closestId = feedbacks[0].id;
        let minDistance = Infinity;

        feedbacks.forEach(f => {
            const item = itemRefs.current[f.id];
            if (item) {
                const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
                const distance = Math.abs(centerPoint - itemCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestId = f.id;
                }
            }
        });

        handleToggle(closestId);
    };

    const handleMouseMove = (e) => {
        if (!isDown || window.innerWidth >= 1024) return;
        e.preventDefault();
        const pageX = e.pageX || e.touches?.[0].pageX;
        const x = pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;

        setIsDragging(true);

        gsap.to(scrollContainerRef.current, {
            scrollLeft: scrollLeftState - walk,
            duration: 0.8,
            ease: "expo.out",
            overwrite: "auto"
        });
    };

    const togglePlay = (id) => {
        const video = videoRefs.current[id];
        if (video) {
            if (video.paused) {
                video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    };

    const toggleModalPlay = () => {
        const video = modalVideoRef.current;
        if (video) {
            if (video.paused) {
                video.play();
                setModalIsPlaying(true);
            } else {
                video.pause();
                setModalIsPlaying(false);
            }
        }
    };

    const activeFeedback = feedbacks.find(f => f.id === activeId);

    return (
        <section className="py-12 md:py-24 bg-white overflow-hidden">
            <div className="desktop-container">
                <div className="mb-10 space-y-2 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 text-natu-brown/40">
                        <Unicon name="video" size={12} />
                        <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] uppercase block">
                            O que nossos pacientes dizem
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif text-natu-brown">
                        Depoimentos que <span className="italic">inspiram</span>
                    </h2>
                </div>

                {/* Mobile Slider / Desktop Accordion Wrapper */}
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseUp}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        onTouchStart={(e) => {
                            const pageX = e.touches[0].pageX;
                            setIsDown(true);
                            setStartX(pageX - scrollContainerRef.current.offsetLeft);
                            setScrollLeftState(scrollContainerRef.current.scrollLeft);
                            setIsDragging(false);
                        }}
                        onTouchMove={handleMouseMove}
                        onTouchEnd={handleMouseUp}
                        className={`flex lg:flex-row flex-nowrap lg:items-start gap-4 lg:gap-3 overflow-x-auto lg:overflow-visible no-scrollbar pb-8 lg:pb-0 min-h-[450px] px-[7.5%] lg:px-0
                            ${isDown && window.innerWidth < 1024 ? 'cursor-grabbing' : 'cursor-grab lg:cursor-default'}`}
                    >
                        {feedbacks.map((f) => {
                            const isActive = activeId === f.id;

                            return (
                                <div
                                    key={f.id}
                                    ref={el => itemRefs.current[f.id] = el}
                                    className={`flex flex-col shrink-0 lg:shrink transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] snap-center
                                        ${isActive ? 'lg:flex-[2.5] w-[85%] lg:w-full opacity-100' : 'lg:flex-[1] w-[85%] lg:w-full opacity-40 lg:opacity-40 hover:opacity-100'}`}
                                    onClick={() => handleToggle(f.id)}
                                >
                                    {/* Video Container */}
                                    <div
                                        className={`relative w-full h-[400px] lg:h-[480px] rounded-[2rem] overflow-hidden bg-gray-100 cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
                                            ${isActive ? 'shadow-xl shadow-natu-brown/10' : 'opacity-80 scale-[0.98] lg:scale-100'}
                                        `}
                                    >
                                        <video
                                            ref={el => videoRefs.current[f.id] = el}
                                            src={f.video}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            playsInline
                                            preload="metadata"
                                            loop
                                            muted={!isActive}
                                            onEnded={() => setIsPlaying(false)}
                                            onClick={(e) => {
                                                if (isActive) {
                                                    e.stopPropagation();
                                                    togglePlay(f.id);
                                                }
                                            }}
                                        />

                                        {/* Play/Pause Overlay */}
                                        {isActive && (
                                            <div
                                                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none
                                                    ${isPlaying ? 'opacity-0' : 'opacity-100 bg-black/10'}`}
                                            >
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); togglePlay(f.id); }}
                                                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-black transition-all active:scale-95 flicker-fix"
                                                >
                                                    <Unicon name={isPlaying ? "pause" : "play"} size={22} className={isPlaying ? "" : "ml-1"} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Minimalist Expand Button (Bottom Left) */}
                                        {isActive && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // Pause card video
                                                    const video = videoRefs.current[activeId];
                                                    if (video) {
                                                        video.pause();
                                                        setIsPlaying(false);
                                                    }
                                                    setModalIsPlaying(true);
                                                    setIsFullscreen(true);
                                                }}
                                                className="absolute bottom-6 left-6 p-2 text-white/60 hover:text-white transition-all hover:scale-125 z-20 drop-shadow-lg hidden lg:block"
                                                title="Expandir vídeo"
                                            >
                                                <img
                                                    src="/expand-natuclinic-icon-svg.svg"
                                                    className="w-5 h-5 brightness-0 invert opacity-80"
                                                    alt="Expandir"
                                                    loading="lazy"
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {/* Text content BELOW the video container */}
                                    <div className={`mt-6 lg:mt-8 space-y-4 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 
                                        ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 lg:opacity-0 translate-y-4 pointer-events-none h-0 lg:h-auto overflow-hidden'}`}>
                                        <h3 className="text-base md:text-lg font-sans font-bold text-black opacity-80 leading-snug max-w-sm">
                                            {f.result}
                                        </h3>

                                        <button className="flex items-center gap-2 text-natu-pink font-bold uppercase tracking-widest text-[9px] hover:gap-3 transition-all group">
                                            Conheça o Protocolo <Unicon name="arrow-right" size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile Navigation Dots */}
                    <div className="flex justify-center gap-2 mt-4 lg:hidden">
                        {feedbacks.map((f) => (
                            <button
                                key={`dot-${f.id}`}
                                onClick={() => handleToggle(f.id)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeId === f.id ? 'w-8 bg-natu-pink' : 'bg-natu-brown/20'}`}
                                aria-label={`Ver depoimento de ${f.name}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Fullscreen Video Modal */}
            <AnimatePresence>
                {isFullscreen && activeFeedback && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8 isolate"
                    >
                        {/* Background Blur Overlay */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-xl flicker-fix"
                            style={{ willChange: 'backdrop-filter' }}
                            onClick={() => setIsFullscreen(false)}
                        />

                        {/* Centered Video Card */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-full max-w-[80vw] md:max-w-[340px] aspect-[9/16] max-h-[85vh] rounded-[2rem] overflow-hidden shadow-2xl z-10 isolate flicker-fix"
                            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
                        >
                            <video
                                ref={modalVideoRef}
                                src={activeFeedback.video}
                                className="w-full h-full object-cover rounded-[2rem]"
                                autoPlay
                                playsInline
                                loop
                                onContextMenu={(e) => e.preventDefault()}
                                controlsList="nodownload noplaybackrate"
                                disablePictureInPicture
                                onPlay={() => setModalIsPlaying(true)}
                                onPause={() => setModalIsPlaying(false)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleModalPlay();
                                }}
                            />

                            {/* Play/Pause Overlay for Modal */}
                            <div
                                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none
                                    ${modalIsPlaying ? 'opacity-0' : 'opacity-100 bg-black/10'}`}
                            >
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleModalPlay(); }}
                                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center text-white pointer-events-auto hover:bg-white hover:text-black transition-all active:scale-95 flicker-fix"
                                >
                                    <Unicon name={modalIsPlaying ? "pause" : "play"} size={22} className={modalIsPlaying ? "" : "ml-1"} />
                                </button>
                            </div>

                            {/* Back Button (Circular on Top-Left) */}
                            <button
                                onClick={() => setIsFullscreen(false)}
                                className="absolute top-6 left-6 w-12 h-12 flex items-center justify-center bg-white/20 backdrop-blur-xl border border-white/40 rounded-full text-white hover:bg-white hover:text-black transition-all active:scale-95 group z-20 flicker-fix"
                            >
                                <Unicon name="arrow-left" size={20} className="transition-transform group-hover:-translate-x-1" />
                            </button>

                            {/* Name Overlay (Plain) */}
                            <div className="absolute bottom-8 left-0 right-0 px-8 pointer-events-none text-center">
                                <span className="text-white/40 text-[9px] uppercase tracking-[0.4em] font-bold block mb-1">Resultado</span>
                                <h3 className="text-white text-2xl font-serif italic">{activeFeedback.name}</h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default VideoFeedbacks;
