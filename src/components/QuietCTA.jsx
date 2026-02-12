import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const DnaAnimationClean = ({ color }) => {
    const n = 60;
    const t = 3;

    return (
        <div className="dna whitespace-nowrap" style={color ? { '--dna-color': color } : {}}>
            {Array.from({ length: n }).map((_, i) => {
                const idx = i + 1;
                const baseDelay = (t / n) * idx * -2;
                const eleDelay = idx % 2 !== 0 ? baseDelay - (t * 0.5) : baseDelay;

                return (
                    <div
                        key={i}
                        className="ele"
                        style={{ animationDelay: `${eleDelay}s` }}
                    >
                        <div
                            className="dot"
                            style={{ "--dot-delay": `${baseDelay}s` }}
                        ></div>
                    </div>
                )
            })}
        </div>
    )
}

const QuietCTA = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current.children, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 90%",
                },
                y: 20,
                opacity: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section className="relative w-full py-10 md:py-12 bg-natu-brown overflow-hidden text-[#F2F0E9]">
            <div ref={containerRef} className="desktop-container flex flex-row items-center justify-between gap-1 md:gap-0 relative z-10">

                {/* Left: Purpose Statement */}
                <div className="w-1/3 text-left">
                    <span className="block text-[7px] md:text-xs lg:text-sm tracking-[0.2em] font-sans font-light opacity-90 hover:opacity-100 transition-opacity cursor-default whitespace-nowrap">
                        AGENDE SUA CONSULTA
                    </span>
                </div>

                {/* Center: Dna Animation */}
                <div className="w-1/3 flex justify-center py-0 overflow-visible">
                    <div className="scale-[0.25] sm:scale-[0.4] md:scale-75 lg:scale-90 origin-center">
                        <DnaAnimationClean color="#6E4A3C" />
                    </div>
                </div>

                {/* Right: Action */}
                <div className="w-1/3 flex justify-end">
                    <button
                        onClick={() => window.open('https://wa.me/5561992551867?text=Olá! Gostaria de mais informações sobre os tratamentos.', '_blank')}
                        className="px-3 py-1.5 md:px-10 md:py-3 border border-[#F2F0E9] rounded-full text-[7px] md:text-[10px] lg:text-xs tracking-[0.2em] uppercase font-sans hover:bg-[#F2F0E9] hover:text-natu-brown transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap bg-transparent cursor-pointer"
                    >
                        Contato
                    </button>
                </div>

            </div>
        </section>
    );
};

export default QuietCTA;
