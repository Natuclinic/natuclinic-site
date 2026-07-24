import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ParametricBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const LINE_COUNT = 15;
        const AMPLITUDE = 80;
        const STEP = 10;
        const INTERVAL = 1000 / 30; // 30fps cap

        let width, height, tick = 0, rafId, lastTime = 0;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        };

        const lerpColor = (r1, g1, b1, r2, g2, b2, t) =>
            `${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)}`;

        const drawLine = (offset, index) => {
            const ratio = index / LINE_COUNT;
            const lineOpacity = 0.8 * (0.3 + 0.7 * (1 - Math.abs(ratio - 0.5) * 2));
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${lerpColor(101, 67, 33, 255, 182, 193, ratio)}, ${lineOpacity * 0.4})`;
            ctx.lineWidth = 1.2;
            for (let x = 0; x <= width; x += STEP) {
                const y = (height / 2)
                    + Math.sin(x * 0.003 + tick + offset) * AMPLITUDE
                    + Math.cos(x * 0.008 - tick * 0.5) * (AMPLITUDE * 0.4);
                x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        const animate = (now) => {
            rafId = requestAnimationFrame(animate);
            if (now - lastTime < INTERVAL) return;
            lastTime = now;
            ctx.clearRect(0, 0, width, height);
            tick += 0.01;
            for (let i = 0; i < LINE_COUNT; i++) drawLine(i * 0.15, i);
        };

        const onResize = () => resize();
        window.addEventListener('resize', onResize);
        resize();
        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', onResize);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-[101%] left-[-0.5%] h-full pointer-events-none z-0 opacity-40 mix-blend-multiply"
        />
    );
};

gsap.registerPlugin(ScrollTrigger);

const ClinicGallery = () => {
    const containerRef = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".gallery-item", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 40,
                opacity: 0,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section id="espaco" ref={containerRef} className="pt-12 md:pt-20 pb-12 md:pb-16 bg-natu-ivory relative overflow-hidden">
            {isInView && <ParametricBackground />}

            {/* Parallax elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-natu-pink/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-natu-brown/5 rounded-full blur-3xl" />

            <div className="desktop-container relative z-10">
                <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
                    <span className="text-[10px] font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40 block mb-4">
                        Bem-vindo à Natuclinic
                    </span>
                    <h2 className="font-sans text-3xl md:text-5xl text-natu-brown font-bold leading-tight mb-6 text-balance max-w-2xl mx-auto">
                        Espaços pensados para o seu bem-estar
                    </h2>
                    <p className="text-sm md:text-base text-natu-brown/70 leading-relaxed font-light text-balance">
                        Nossas unidades em Taguatinga e Planaltina foram projetadas para entregar uma experiência premium do início ao fim. Ambientes modernos, climatizados e acolhedores, unindo tecnologia de ponta em estética avançada com uma atmosfera de conforto que você não encontra em nenhum outro lugar do Distrito Federal.
                    </p>
                </div>

                <div
                    className="grid grid-cols-4 grid-rows-5 gap-3 md:gap-6 h-[400px] md:h-[660px] lg:h-[700px] mx-auto max-w-5xl"
                >
                    {/* Div 1: Left Top */}
                    <div className="gallery-item col-start-1 col-span-2 row-span-3 relative overflow-hidden rounded-2xl group cursor-pointer h-full">
                        <img
                            src="/espaco-1.jpg"
                            alt="Recepção Natuclinic"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                    </div>

                    {/* Div 2: Left Bottom */}
                    <div className="gallery-item col-start-1 col-span-2 row-start-4 row-span-2 relative overflow-hidden rounded-2xl group cursor-pointer h-full">
                        <img
                            src="/espaco-2.jpg"
                            alt="Sala de Procedimentos"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                    </div>

                    {/* Div 3: Right Tall */}
                    <div className="gallery-item col-start-3 col-span-2 row-span-5 relative overflow-hidden rounded-2xl group cursor-pointer h-full">
                        <img
                            src="/sala-dra-debora.jpg"
                            alt="Estética Avançada"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClinicGallery;
