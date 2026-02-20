import React, { useRef, useEffect } from 'react';
import Unicon from './Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlurText from './BlurText';
import CountUp from './CountUp';
import GlareHover from './GlareHover';

gsap.registerPlugin(ScrollTrigger);

const StatsSection = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".stat-item", {
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

    const ratings = [
        {
            to: 5,
            decimals: 1,
            label: "Avaliação no Google",
            icon: true,
            suffix: ""
        },
        {
            to: 2000,
            prefix: "+",
            label: "Pacientes Transformados",
            icon: false,
            separator: "."
        },
        {
            to: 100,
            suffix: "%",
            label: "Satisfação nos Procedimentos",
            icon: false
        }
    ];

    return (
        <section ref={containerRef} className="py-12 md:py-16 bg-white">
            <div className="desktop-container">
                <GlareHover
                    glareOpacity={0.1}
                    glareColor="#ffffff"
                    className="rounded-[2.5rem]"
                >
                    <div className="bg-natu-brown rounded-[2.5rem] py-16 px-6 md:px-20 border border-white/5 h-full w-full relative overflow-hidden">
                        {/* Lighting effect */}
                        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                        <div className="mx-auto max-w-5xl space-y-12 md:space-y-16">
                            <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center">
                                <span className="text-[10px] md:text-xs font-sans font-bold tracking-[0.3em] uppercase text-white/40 block">
                                    Excelência Comprovada
                                </span>
                                <div className="text-4xl font-sans font-bold text-white lg:text-5xl">
                                    <BlurText
                                        text="Confiança que se constrói com resultados"
                                        className="font-sans font-bold text-white justify-center"
                                        delay={200}
                                        animateBy="words"
                                        direction="top"
                                    />
                                </div>
                                <p className="font-sans font-light text-white/60 text-lg leading-relaxed">
                                    A satisfação de quem viveu a experiência Natuclinic é a nossa maior prova de qualidade.
                                </p>
                            </div>

                            <div className="grid gap-x-12 gap-y-20 md:grid-cols-3 *:text-center">
                                {ratings.map((stat, i) => (
                                    <div key={i} className="stat-item flex flex-col items-center group">
                                        <div className="text-5xl lg:text-7xl font-sans font-bold text-white flex items-center gap-3 mb-8 transition-transform duration-500 group-hover:scale-105">
                                            <CountUp
                                                to={stat.to}
                                                decimals={stat.decimals || 0}
                                                prefix={stat.prefix || ''}
                                                suffix={stat.suffix || ''}
                                                separator={stat.separator || '.'}
                                                duration={2}
                                            />
                                            {stat.icon && <Unicon name="star" className="w-8 h-8 fill-natu-pink text-natu-pink" />}
                                        </div>

                                        {/* Minimalist Divider */}
                                        <div className="w-full max-w-[200px] md:max-w-xs h-[1px] bg-white/10 mb-6 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-natu-pink translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                                        </div>

                                        <p className="font-sans font-bold text-white/40 uppercase tracking-[0.2em] text-[10px]">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Social Proof Avatars */}
                            <div className="flex justify-center pt-8">
                                <div className="flex -space-x-2 overflow-hidden p-2">
                                    <img src="https://randomuser.me/api/portraits/women/79.jpg" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
                                    <img src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
                                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
                                    <img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
                                    <img src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
                                    <img src="https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
                                    <img src="https://randomuser.me/api/portraits/men/18.jpg" className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="User" />
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-natu-brown bg-white text-natu-brown text-xs font-medium z-10 relative">
                                        +100
                                    </div>
                                    <button className="flex items-center justify-center -ml-2 translate-x-4 w-10 h-10 rounded-full border-dashed border border-white/20 bg-white/5 hover:bg-white/10 text-white/40 z-0 cursor-pointer transition-colors" aria-label="Add user">
                                        <Unicon name="plus" size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </GlareHover>
            </div>
        </section>
    );
};

export default StatsSection;
