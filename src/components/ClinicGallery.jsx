import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ParametricBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const defaults = {
            lineCount: 25,
            amplitude: 80,
            speed: 10,
            opacity: 80
        };

        let width, height;
        let tick = 0;
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        };

        const handleMouseMove = (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        const lerpColor = (r1, g1, b1, r2, g2, b2, ratio) => {
            const r = Math.round(r1 + (r2 - r1) * ratio);
            const g = Math.round(g1 + (g2 - g1) * ratio);
            const b = Math.round(b1 + (b2 - b1) * ratio);
            return `${r}, ${g}, ${b}`;
        };

        const drawLine = (offset, index, total) => {
            const amp = defaults.amplitude;
            const opacityVal = defaults.opacity / 100;

            ctx.beginPath();
            const ratio = index / total;
            const colorRGB = lerpColor(101, 67, 33, 255, 182, 193, ratio);
            const lineOpacity = opacityVal * (0.3 + 0.7 * (1 - Math.abs(ratio - 0.5) * 2));

            ctx.strokeStyle = `rgba(${colorRGB}, ${lineOpacity * 0.4})`;
            ctx.lineWidth = 1.2;

            for (let x = 0; x <= width; x += 5) {
                const distToMouse = Math.abs(x - mouseX);
                const mouseForce = Math.max(0, (600 - distToMouse) / 600);
                const mouseEffect = (mouseY - height / 2) * mouseForce * 0.3;

                const y = (height / 2) +
                    Math.sin(x * 0.003 + tick + offset) * amp +
                    Math.cos(x * 0.008 - tick * 0.5) * (amp * 0.4) +
                    mouseEffect;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            const speedFactor = defaults.speed / 1000;
            tick += speedFactor;

            const lines = defaults.lineCount;
            for (let i = 0; i < lines; i++) {
                drawLine(i * 0.15, i, lines);
            }

            requestAnimationFrame(animate);
        };

        resize();
        const animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
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
        <section id="espaco" ref={containerRef} className="pt-12 md:pt-20 pb-12 md:pb-16 bg-white relative overflow-hidden">
            {isInView && <ParametricBackground />}

            {/* Parallax elements */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-natu-pink/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-natu-brown/5 rounded-full blur-3xl" />

            <div className="desktop-container relative z-10">
                <div className="mb-16 text-center">
                    <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] uppercase text-natu-brown/40 block mb-4">
                        Nosso Espaço
                    </span>
                    <h2 className="font-sans text-2xl md:text-5xl text-natu-brown font-bold">
                        Naturalmente acolhedor                    </h2>
                </div>

                <div
                    className="grid grid-cols-4 grid-rows-5 gap-3 md:gap-8 h-[400px] md:h-[800px] mx-auto max-w-5xl"
                >
                    {/* Div 1: Left Top */}
                    <div className="gallery-item col-start-1 col-span-2 row-span-3 relative overflow-hidden rounded-2xl group cursor-pointer h-full">
                        <img
                            src="/espaco-1.jpg"
                            alt="Recepção Natuclinic"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            loading="lazy"
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
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClinicGallery;
