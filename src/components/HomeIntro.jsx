import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Unicon from './Unicon';
import { NatuButton } from './Navbar';

const HomeIntro = () => {
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const indicatorRef = useRef(null);

    useEffect(() => {
        const video = bgRef.current;
        if (video) {
            video.defaultMuted = true;
            video.muted = true;

            // Try playing after a short delay to ensure the browser is ready
            const playVideo = () => {
                video.play().catch(error => {
                    console.log("Video autoplay blocked or failed:", error);
                });
            };

            if (video.readyState >= 3) {
                playVideo();
            } else {
                video.addEventListener('canplay', playVideo, { once: true });
            }
        }

        const ctx = gsap.context(() => {
            gsap.to(bgRef.current, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            // Fade out scroll indicator even earlier
            gsap.to(indicatorRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top", // Start fading immediately
                    end: "20% top",   // Fully gone by 20% scroll
                    scrub: true
                },
                opacity: 0,
                y: -10
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="home" ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-white pt-12 md:pt-16">
            {/* Background/Image Card */}
            <div className="absolute inset-0 flex items-center justify-center p-0 md:p-8 z-0 pt-24 md:pt-32">
                <div
                    className="relative w-full h-full md:w-[95%] md:h-[85%] md:rounded-[2.5rem] overflow-hidden border border-gray-100/10"
                >
                    <video
                        ref={bgRef}
                        className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
                        src="/dna-video.mp4"
                        poster="/natuclinic-reception.jpg"
                        autoPlay
                        loop
                        muted
                        playsInline
                        webkitPlaysInline
                        preload="auto"
                        disableRemotePlayback
                        disablePictureInPicture
                    />

                    {/* Content positioned bottom-left inside the card */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-center md:justify-end items-center md:items-start p-6 pb-0 md:p-20 md:pb-24">
                        {/* Hidden SEO Header */}
                        <h2 className="sr-only">Natuclinic: Clínica de Estética e Nutrição Ortomolecular em Brasília e Taguatinga</h2>

                        <h1 className="text-4xl md:text-7xl font-serif text-natu-brown leading-[0.95] tracking-tight animate-in fade-in zoom-in duration-1000 text-center md:text-left max-w-2xl mx-auto md:mx-0">
                            Cuidar de você <br className="hidden md:block" />
                            <span className="italic">está em nosso DNA</span>
                        </h1>
                        <div className="mt-8 flex justify-center md:justify-start animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 w-full md:w-auto">
                            <NatuButton onClick={() => {
                                const element = document.getElementById('results');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}>Conheça nossos serviços</NatuButton>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div ref={indicatorRef} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                <div className="animate-bounce">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 cursor-pointer flicker-fix">
                        <Unicon name="arrow-down" className="w-5 h-5 text-natu-brown" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeIntro;
