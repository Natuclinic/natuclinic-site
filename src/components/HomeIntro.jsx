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
            
            // Simplest autoplay trigger
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay failed:", error);
                });
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
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="home" ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-natu-ivory pt-12 md:pt-16">
            {/* Background/Image Card */}
            <div className="absolute inset-0 flex items-center justify-center p-0 md:p-8 z-0 pt-24 md:pt-32">
                <div
                    className="relative w-full h-full md:w-[95%] md:h-[85%] md:rounded-[2.5rem] overflow-hidden border border-gray-100/10"
                >
                    <video
                        ref={bgRef}
                        className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        poster="/dna-foto-preload-natuclinic-estetica-e-nutrição-ortomolecular.webp"
                        disableRemotePlayback
                        disablePictureInPicture
                    >
                        <source src="/dna-video.mp4" type="video/mp4" />
                    </video>

                    {/* Content positioned bottom-left inside the card */}
                    <div className="absolute inset-0 z-10 flex flex-col justify-center md:justify-end items-center md:items-start p-6 pb-0 md:p-20 md:pb-24">
                        {/* Hidden SEO Header */}
                        <h2 className="sr-only">Natuclinic: Clínica de Estética e Nutrição Ortomolecular em Brasília e Taguatinga</h2>

                        <div className="mb-4 animate-in fade-in zoom-in duration-1000 text-center md:text-left">
                            <span className="text-natu-brown/60 font-medium text-[10px] uppercase tracking-wider">
                                Clínica Natuclinic em Brasília
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-[64px] font-['Helvetica',_Arial,_sans-serif] font-bold text-natu-brown leading-[0.85] tracking-tighter animate-in fade-in zoom-in duration-1000 text-center md:text-left max-w-2xl mx-auto md:mx-0">
                            Cuidar de você <br className="hidden md:block" />
                            <span>está em nosso DNA</span>
                        </h1>
                        <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 flex justify-center md:justify-start">
                            <div className="inline-flex flex-col items-center">
                                <NatuButton onClick={() => {
                                    const element = document.getElementById('results');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}>Conheça nossos serviços</NatuButton>
                                <p className="mt-3 text-[11px] font-sans text-natu-brown/50">
                                    Não aceitamos convênio.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
};

export default HomeIntro;
