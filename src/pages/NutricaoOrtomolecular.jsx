import React, { useState, useEffect, useRef } from 'react';
import ServiceLayout from '../components/ServiceLayout';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from "motion/react";
import Unicon from '../components/Unicon';
import { NatuButton } from '../components/Navbar';
import FeedbackSection from '../components/FeedbackSection';

gsap.registerPlugin(ScrollTrigger);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-natu-brown/20 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-start justify-between w-full text-left focus:outline-none group gap-4"
            >
                <h3 className="font-sans text-lg md:text-xl text-natu-brown group-hover:text-natu-pink transition-colors leading-[1.2] flex-1">
                    {question}
                </h3>
                <span className={`text-natu-brown text-2xl transition-transform duration-300 font-sans leading-none shrink-0 ${isOpen ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 font-sans font-light text-gray-600 text-left pl-8 ${isOpen ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                {answer}
            </div>
        </div>
    );
};

// Helper component for blur-in animation
const BlurFade = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
        className={`flicker-fix ${className}`}
    >
        {children}
    </motion.div>
);

const NutricaoOrtomolecular = ({ goBack }) => {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);
    const menuRef = useRef(null);
    const containerRef = useRef(null);
    const bgRef = useRef(null);
    const indicatorRef = useRef(null);
    const deckRef = useRef(null);
    const card1Ref = useRef(null);
    const card2Ref = useRef(null);
    const card3Ref = useRef(null);
    const [symptomsIndex, setSymptomsIndex] = useState(0);
    const symptomsScrollRef = useRef(null);
    const progressRef = useRef(null);
    const journeyContainerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftState, setScrollLeftState] = useState(0);
    const [dotsCount, setDotsCount] = useState(5);

    useEffect(() => {
        const updateDots = () => {
            if (window.innerWidth >= 1024) setDotsCount(3); // 5 cards / 3 visible = ~3 steps
            else if (window.innerWidth >= 768) setDotsCount(4); // 5 cards / 2 visible = ~4 steps
            else setDotsCount(5); // 5 cards / 1 visible = 5 steps
        };
        updateDots();
        window.addEventListener('resize', updateDots);
        return () => window.removeEventListener('resize', updateDots);
    }, []);

    const handleMouseDown = (e) => {
        if (!symptomsScrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - symptomsScrollRef.current.offsetLeft);
        setScrollLeftState(symptomsScrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !symptomsScrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - symptomsScrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        symptomsScrollRef.current.scrollLeft = scrollLeftState - walk;
    };

    const handleMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    const scrollToIndex = (index) => {
        if (symptomsScrollRef.current) {
            const container = symptomsScrollRef.current;
            const cardWidth = container.scrollWidth / 6;
            container.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
            setSymptomsIndex(index);
        }
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(bgRef.current, {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });

            gsap.to(indicatorRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "20% top",
                    scrub: true
                },
                opacity: 0,
                y: -10
            });

            // Card Deck Stacking & Pinning Animation
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: deckRef.current,
                    start: "top top",
                    end: "+=1800", // Further increased for extra reading space
                    scrub: 1,
                    pin: true,
                    pinSpacing: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true
                }
            });

            // Card 2: Less blur on entry, stays readable longer
            tl.fromTo(card2Ref.current,
                { y: 150, opacity: 0, filter: "blur(5px)", force3D: true },
                { y: 75, opacity: 1, filter: "blur(0px)", ease: "none" },
                0.1
            );

            // Card 3: Significant additional delay to isolate Card 2
            tl.fromTo(card3Ref.current,
                { y: 250, opacity: 0, filter: "blur(5px)", force3D: true },
                { y: 150, opacity: 1, filter: "blur(0px)", ease: "none" },
                1.2 // Increased delay (gap) to let Card 2 "breathe"
            );

            // Progress Bar Animation for Journey
            gsap.to(progressRef.current, {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: journeyContainerRef.current,
                    start: "top 80%", // Starts filling when top of card is at 80% of viewport
                    end: "bottom 60%", // Finishes when bottom is at 60%
                    scrub: 1
                }
            });

            // Prevent glitches by forcing a refresh calculation
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);

        }, containerRef);
        return () => ctx.revert();
    }, []);

    const handleWhatsApp = () => {
        window.open("https://wa.me/5561992551867?text=Olá! Gostaria de agendar uma consulta de Nutrição Ortomolecular na Natuclinic.", '_blank');
    };

    return (
        <ServiceLayout
            title="Nutrição Ortomolecular"
            goBack={goBack}
            hideHeader={true}
            whatsappMessage="Olá! Gostaria de agendar uma consulta de Nutrição Ortomolecular na Natuclinic."
        >
            {/* 1. Hero Section (Structure from Home) */}
            <section ref={containerRef} className="relative h-[90vh] md:h-screen flex items-center justify-center overflow-hidden bg-white pt-12 md:pt-16">
                <div className="absolute inset-0 flex items-center justify-center p-0 md:p-8 z-0 pt-24 md:pt-32">
                    <div className="relative w-full h-full md:w-[95%] md:h-[85%] rounded-b-[2.5rem] md:rounded-[2.5rem] overflow-hidden">
                        <img
                            ref={bgRef}
                            src="/julimar-meneses-ortomolecular-nutricionista.jpg"
                            alt="Nutrição Ortomolecular na Natuclinic"
                            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none object-[70%_center] md:object-center"
                        />                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#4C261A]/95 via-[#4C261A]/40 to-transparent z-[5] md:hidden" />


                        {/* Label at the top (Mobile only) */}
                        <div className="absolute top-8 left-0 right-0 z-20 flex justify-center md:hidden">
                            <BlurFade delay={0.2}>
                                <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 font-sans text-center">
                                    Dr. Julimar Meneses · CRN-DF 21414
                                </span>
                            </BlurFade>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-end items-center md:items-start p-6 pb-10 md:p-20 md:pb-24">
                            <BlurFade delay={0.2} className="hidden md:block">
                                <span className="block text-xs font-bold uppercase tracking-[0.4em] text-white/80 mb-3 font-sans">
                                    Dr. Julimar Meneses · CRN-DF 21414
                                </span>
                            </BlurFade>
                            <BlurFade delay={0.4}>
                                <h1 className="text-4xl md:text-7xl font-serif text-white leading-[0.85] tracking-tighter text-center md:text-left max-w-4xl mx-auto md:mx-0">
                                    Nutrição <br />
                                    Ortomolecular
                                </h1>
                            </BlurFade>
                            <BlurFade delay={0.6}>
                                <p className="mt-4 text-sm md:text-base font-normal text-white/90 max-w-lg leading-relaxed text-center md:text-left mx-auto md:mx-0 font-sans">
                                    Identifica e corrige desequilíbrios bioquímicos para restaurar sua saúde de dentro para fora.
                                </p>
                            </BlurFade>
                            <BlurFade delay={0.8}>
                                <div className="mt-6 flex justify-center md:justify-start w-full md:w-auto">
                                    <NatuButton
                                        onClick={handleWhatsApp}
                                        className="relative overflow-hidden group/shimmer transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                                    >
                                        <motion.div
                                            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-[25deg] pointer-events-none"
                                            initial={{ left: '-100%', opacity: 0 }}
                                            animate={{ left: '150%', opacity: 1 }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatDelay: 3,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        <span className="relative z-10 font-sans">Agendar consulta</span>
                                    </NatuButton>
                                </div>
                            </BlurFade>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div ref={indicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 hidden md:block">
                    <div className="animate-bounce">
                        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 cursor-pointer">
                            <Unicon name="arrow-down" className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            </section>


            {/* 2. O Conceito: O que é Nutrição Ortomolecular */}
            <section className="py-12 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                        {/* Video side */}
                        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
                            <motion.div
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="relative w-full max-w-[320px] aspect-[9/16] bg-gray-100 rounded-3xl overflow-hidden group cursor-pointer"
                            >
                                <video
                                    ref={videoRef}
                                    src="/video-ortomolecular-julimar.mov"
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted={isMuted}
                                    loop
                                    playsInline
                                    onClick={(e) => {
                                        const video = e.target;
                                        if (video.paused) video.play();
                                        else video.pause();
                                    }}
                                />

                                {/* Mute Toggle Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMuted(!isMuted);
                                    }}
                                    className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                                >
                                    {isMuted ? (
                                        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M16.22 6.36574C16.3606 6.22529 16.5512 6.1464 16.75 6.1464C16.9488 6.1464 17.1394 6.22529 17.28 6.36574L18.75 7.83573L20.22 6.36574C20.3622 6.23326 20.5502 6.16113 20.7445 6.16456C20.9388 6.16799 21.1242 6.2467 21.2616 6.38411C21.399 6.52153 21.4777 6.70691 21.4812 6.90121C21.4846 7.09551 21.4125 7.28356 21.28 7.42573L19.811 8.89574L21.281 10.3657C21.4176 10.5073 21.4931 10.6967 21.4913 10.8934C21.4895 11.09 21.4105 11.2781 21.2714 11.4171C21.1322 11.5561 20.9441 11.6349 20.7475 11.6365C20.5508 11.6381 20.3614 11.5624 20.22 11.4257L18.75 9.95574L17.28 11.4257C17.1378 11.5582 16.9498 11.6303 16.7555 11.6269C16.5612 11.6235 16.3758 11.5448 16.2384 11.4074C16.101 11.2699 16.0223 11.0846 16.0188 10.8903C16.0154 10.696 16.0875 10.5079 16.22 10.3657L17.69 8.89574L16.22 7.42573C16.0795 7.28511 16.0007 7.09449 16.0007 6.89574C16.0007 6.69698 16.0795 6.50636 16.22 6.36574ZM11.787 0.291735C12.95 -0.475265 14.5 0.359735 14.5 1.75274V16.0387C14.5 17.4327 12.95 18.2667 11.787 17.4997L5.787 13.5447C5.74641 13.5177 5.69879 13.5031 5.65 13.5027H2.75C2.02065 13.5027 1.32118 13.213 0.805456 12.6973C0.289731 12.1816 0 11.4821 0 10.7527V7.03873C0 6.30939 0.289731 5.60992 0.805456 5.09419C1.32118 4.57847 2.02065 4.28874 2.75 4.28874H5.65C5.69903 4.2889 5.74702 4.27464 5.788 4.24774L11.787 0.291735Z" fill="currentColor" />
                                        </svg>
                                    ) : (
                                        <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.787 0.291735C12.95 -0.475265 14.5 0.359735 14.5 1.75274V16.0387C14.5 17.4327 12.95 18.2667 11.787 17.4997L5.787 13.5447C5.74641 13.5177 5.69879 13.5031 5.65 13.5027H2.75C2.02065 13.5027 1.32118 13.213 0.805456 12.6973C0.289731 12.1816 0 11.4821 0 10.7527V7.03873C0 6.30939 0.289731 5.60992 0.805456 5.09419C1.32118 4.57847 2.02065 4.28874 2.75 4.28874H5.65C5.69903 4.2889 5.74702 4.27464 5.788 4.24774L11.787 0.291735Z" fill="currentColor" />
                                        </svg>
                                    )}
                                </button>

                                {/* Overlay Gradient for readability of the card below */}

                            </motion.div>


                        </div>

                        {/* Text Content side */}
                        <div className="w-full lg:w-1/2">
                            <BlurFade delay={0.3}>
                                <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] text-natu-brown/40 mb-6 block font-sans">
                                    A Ciência do Equilíbrio
                                </span>
                            </BlurFade>
                            <BlurFade delay={0.4}>
                                <h2 className="text-4xl md:text-5xl font-serif text-natu-brown leading-[1] tracking-tighter mb-8">
                                    O que é a Nutrição <br /> Ortomolecular?
                                </h2>
                            </BlurFade>
                            <div className="space-y-6">
                                <BlurFade delay={0.5}>
                                    <p className="font-sans text-lg text-natu-brown leading-relaxed font-light">
                                        Criada pelo Dr. Linus Pauling, a nutrição ortomolecular foca no <strong className="font-bold text-natu-brown">reequilíbrio químico do organismo</strong>. Ao contrário da nutrição convencional, que foca apenas em macros, nós olhamos para as moléculas.
                                    </p>
                                </BlurFade>
                                <BlurFade delay={0.6}>
                                    <p className="font-sans text-lg text-natu-brown leading-relaxed font-light">
                                        Identificamos carências de vitaminas, minerais e aminoácidos, além de combater o estresse oxidativo causado pelos radicais livres. É a ciência de fornecer ao seu corpo os <strong className="font-bold text-natu-brown">elementos exatos</strong> para que ele cure a si mesmo.
                                    </p>
                                </BlurFade>
                                <BlurFade delay={0.7}>
                                    <div className="pt-4">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-natu-pink mt-2.5 shrink-0" />
                                            <p className="text-sm font-sans text-gray-600 leading-relaxed">Foco na longevidade e prevenção de doenças crônicas.</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-natu-pink mt-2.5 shrink-0" />
                                            <p className="text-sm font-sans text-gray-600 leading-relaxed">Tratamentos personalizados baseados em bioquímica individual.</p>
                                        </div>
                                    </div>
                                </BlurFade>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Identificação dos Sintomas (A "Dor") */}
            <section className="py-12 lg:py-16 bg-white overflow-hidden relative">

                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    {/* Wrapper card com outline cinza escuro */}
                    <motion.div
                        initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8 }}
                        className="border border-gray-200 bg-[#F5F5F7] rounded-[1.5rem] p-8 lg:p-10 flicker-fix relative overflow-hidden"
                    >
                        {/* Decorative logo watermark */}
                        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 pointer-events-none select-none" aria-hidden="true">
                            <svg width="420" height="684" viewBox="0 0 554 902" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.12 }}>
                                <path d="M42.9414 301.454C39.9255 240.288 84.995 195.236 145.763 198.68L147.201 198.771C149.513 198.93 151.798 199.056 153.969 199.531L154.401 199.632C156.82 200.241 159.27 200.854 161.184 202.034C162.942 203.119 164.236 204.677 164.573 207.195L164.628 207.712C164.748 209.275 164.502 210.473 164.022 211.415C163.543 212.357 162.812 213.081 161.905 213.666C160.061 214.855 157.586 215.421 155.19 216.089C140.013 220.321 125.091 225.351 113.376 237.544L113.036 237.896L113.383 238.243L113.416 238.277L113.646 238.508L113.95 238.389C128.435 232.79 142.871 227.099 158.449 225.656L159.961 225.529C169.021 224.844 175.207 226.31 178.674 229.938C182.127 233.552 183.038 239.478 181.119 248.122V248.123C174.48 278.13 159.158 300.638 137.673 313.451C116.188 326.264 88.4743 329.422 56.9766 320.604H56.9756C52.2151 319.269 48.8476 316.985 46.6016 313.814C44.3499 310.635 43.1903 306.516 42.9414 301.455V301.454Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M454.794 608.711C468.881 608.91 482.985 616.153 493.54 626.881C504.095 637.61 511.043 651.766 510.893 665.719L510.89 665.929L510.923 665.961C510.721 679.864 503.543 693.901 492.898 704.495C482.2 715.142 468.062 722.249 454.129 722.266C424.262 722.332 396.863 694.992 396.963 665.222C397.012 650.643 404.121 636.412 414.917 625.868C425.543 615.489 439.698 608.726 454.107 608.707L454.794 608.711Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M179.421 329.407C181.062 329.517 182.596 330.273 183.925 332.062C185.158 333.72 185.329 335.174 184.887 336.512C184.43 337.893 183.298 339.224 181.764 340.541C180.236 341.852 178.371 343.101 176.519 344.341C174.68 345.571 172.847 346.797 171.44 348.041L171.439 348.042C155.642 362.08 139.849 376.085 123.753 389.756L120.53 392.485C114.726 397.377 110.14 403.15 105.89 409.126C101.625 415.121 97.7273 421.274 93.2363 427.04C74.6442 450.836 40.7775 459.839 12.8545 448.674C9.1235 447.181 5.95647 445.206 3.76562 442.624C1.58447 440.054 0.352078 436.861 0.514648 432.875C1.48472 409.236 8.33052 389.636 21.0273 375.687C33.7183 361.744 52.3044 353.392 76.8682 352.339C80.1503 352.208 83.5823 352.898 86.9043 353.67V353.669C88.8469 354.134 90.6813 354.778 92.0498 355.854C93.3947 356.913 94.3118 358.407 94.4062 360.657V360.661C94.517 362.892 93.8026 364.519 92.6133 365.739C91.4831 366.899 89.8984 367.718 88.1055 368.304L87.7461 368.417C78.57 371.177 69.1246 373.574 60.7803 380.102L60.7344 380.108L60.583 380.26L60.9902 380.718L61.042 381.074C98.7691 375.641 131.533 360.717 161.732 339.336L163.168 338.313C164.691 337.226 166.484 335.791 168.31 334.44C170.16 333.072 172.093 331.75 174 330.801C175.912 329.849 177.751 329.295 179.421 329.407Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M234.704 418.277C235.793 417.865 236.814 417.705 237.751 417.921C238.674 418.134 239.587 418.73 240.438 419.975L240.439 419.976C241.281 421.205 241.523 422.279 241.406 423.233C241.289 424.198 240.796 425.109 240.047 425.987C238.527 427.767 236.113 429.239 234.151 430.633C199.31 455.309 164.368 479.851 129.459 504.428C117.402 512.894 105.901 521.727 96.7219 533.879C85.8573 548.246 72.224 559.11 52.5305 557.665L52.4963 557.631L52.3069 557.619C48.3383 557.382 44.4654 557.385 40.593 556.884H40.592C31.7641 555.764 25.9603 553.41 22.7551 549.328C19.5595 545.258 18.8422 539.332 20.5442 530.786C26.287 502.033 45.3804 478.058 78.4534 476.16H78.4543C80.4961 476.042 82.4871 475.872 84.3616 475.899C86.2319 475.926 87.9283 476.15 89.3655 476.789C90.787 477.422 91.9799 478.473 92.8362 480.207C93.6455 481.847 94.1624 484.116 94.2581 487.249L94.2717 487.888C94.2978 490.318 94.9279 491.946 96.0637 492.894C97.1955 493.838 98.7074 494.003 100.259 493.795C103.345 493.382 106.997 491.433 109.372 490.17L109.371 490.169C127.168 480.765 144.762 470.959 162.187 460.884C184.302 448.128 206.141 434.922 228.179 422.072C229.187 421.487 230.3 420.725 231.39 420.035C232.5 419.333 233.615 418.688 234.704 418.277Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M499.333 473.936C508.706 472.207 517.018 473.249 524.344 476.561C531.446 479.772 537.65 485.129 543.001 492.22L543.515 492.912C550.401 502.294 553.293 512.247 552.391 521.934C551.489 531.623 546.787 541.096 538.395 549.506V549.507C522.289 565.683 500.265 568.634 482.702 554.97L481.869 554.307C477.071 550.39 473.009 548.706 469.027 548.881C465.308 549.045 461.756 550.829 457.838 553.707L457.049 554.296C442.391 565.441 425.887 573.609 409.641 582.262L406.396 584C404.48 585.027 402.663 586.16 400.448 586.762C398.383 587.323 395.965 587.417 392.852 586.434C397.669 578.368 404.012 573.09 410.611 568.042L413.514 565.836C426.801 555.743 439.653 545.127 453.114 535.323C461.641 529.132 461.791 520.127 463.382 511.61C467.04 492.018 480.927 477.353 499.333 473.936Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M474.952 365.431C482.094 360.261 490.74 357.566 498.76 358.571L499.534 358.679C518.098 361.564 532.171 377.679 532.039 395.885L532.038 396.095L532.069 396.126C531.766 421.15 506.463 439.164 483.861 429.64C479.529 427.815 475.836 427.324 472.285 427.861C468.746 428.395 465.391 429.945 461.729 432.123H461.727C428.533 451.996 395.005 471.366 361.538 490.84L361.537 490.841C357.78 493.036 353.682 494.769 349.57 496.241C348.835 496.501 347.828 496.638 346.877 496.59C345.903 496.542 345.11 496.306 344.704 495.939L344.703 495.937L344.518 495.76C344.112 495.347 343.89 494.935 343.79 494.541C343.675 494.088 343.711 493.618 343.866 493.139C344.143 492.286 344.787 491.444 345.521 490.734L345.842 490.438C352.808 484.244 359.557 477.793 367.081 472.408H367.082C394.585 452.691 420.356 430.747 446.82 409.778L446.819 409.777C454.033 404.077 458.004 397.751 459.913 388.708L460.092 387.826C461.86 378.703 467.582 370.766 474.952 365.431Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M303.75 511.688C304.527 511.602 305.251 511.662 305.904 511.927C306.551 512.189 307.163 512.667 307.701 513.474C308.246 514.296 308.443 515.049 308.422 515.745C308.401 516.447 308.158 517.131 307.755 517.805C306.938 519.173 305.538 520.394 304.291 521.521C295.355 529.572 285.62 536.515 275.662 543.179C265.715 549.835 255.522 556.23 245.732 563.149H245.731C232.247 572.686 218.348 581.638 204.408 590.52L190.467 599.396C184.433 603.262 180.065 608.507 175.773 613.837L173.934 616.123C162.189 630.641 147.753 639.338 128.39 635.955C121.134 634.687 116.499 632.478 113.849 628.886C111.197 625.291 110.445 620.195 111.246 612.934L111.247 612.933C113.671 590.608 132.082 571.978 155.062 568.585C158.228 568.117 160.721 567.978 162.616 568.223C164.506 568.467 165.733 569.083 166.466 570.064C167.207 571.055 167.521 572.519 167.353 574.628C167.185 576.732 166.543 579.406 165.457 582.742L165.858 582.872L165.865 583.396H166.294L166.298 583.381C178.771 582.985 188.218 578.442 197.542 572.747L197.542 572.748C227.245 554.62 257.281 537.097 287.225 519.368H287.226C291.003 517.128 294.912 515.089 298.92 513.318H298.922C300.487 512.621 302.173 511.862 303.75 511.688Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M195.45 82.5327C199.496 81.8751 203.132 81.5395 205.806 82.6401C207.119 83.1807 208.205 84.0713 208.996 85.4722C209.742 86.7955 210.238 88.5977 210.385 91.0317L210.411 91.5269C210.462 92.8453 210.659 94.1766 211.245 95.2827C211.843 96.4138 212.831 97.2791 214.38 97.6665L214.384 97.6675C218.261 98.6018 220.921 100.013 222.71 101.728C224.495 103.438 225.447 105.481 225.859 107.742C226.692 112.312 225.319 117.707 224.118 122.92C218.168 148.709 196.295 165.464 169.553 165.67V165.642H169.053C156.518 165.642 148.668 163.311 144.619 158.077C140.566 152.838 140.174 144.503 143.09 132.079C146.48 117.68 152.465 106.461 161.135 98.2622C169.805 90.0644 181.194 84.8535 195.45 82.5327Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M386.847 309.347C390.422 293.784 405.481 283.178 418.383 284.886H418.384C424.797 285.72 431.804 290.359 437.203 296.451C442.604 302.545 446.293 309.974 446.211 316.278C446.096 325.072 440.92 333.609 433.617 339.128C426.316 344.646 416.981 347.081 408.594 343.82H408.595C400.885 340.807 394.467 340.964 388.54 342.749C382.644 344.525 377.238 347.914 371.57 351.31C342.973 368.398 314.242 385.318 285.41 402.037L285.409 402.038C283.569 403.115 281.43 404.65 279.327 405.457C278.289 405.856 277.32 406.05 276.461 405.936C275.624 405.824 274.849 405.416 274.18 404.521L274.179 404.52C273.23 403.253 272.947 402.157 273.046 401.197C273.146 400.226 273.644 399.316 274.406 398.447C275.169 397.579 276.168 396.784 277.212 396.045C277.732 395.677 278.258 395.326 278.767 394.988C279.273 394.652 279.766 394.327 280.209 394.016L280.212 394.013C310.522 372.358 340.929 350.807 371.738 329.894C379.559 324.577 384.595 319.076 386.847 309.348V309.347Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M353.069 600.816C354.475 600.124 355.792 599.773 356.987 599.97C358.155 600.164 359.306 600.901 360.358 602.599V602.6C361.179 603.922 361.27 605.143 360.904 606.306C360.528 607.498 359.661 608.666 358.493 609.815C357.33 610.96 355.905 612.051 354.465 613.097C353.216 614.005 351.943 614.887 350.855 615.724L350.401 616.08C324.781 636.54 298.299 656.038 273.156 677.125V677.126C262.685 685.92 252.658 693.371 239.845 694.635C228.934 694.764 221.864 692.117 218.458 687.199C215.052 682.28 215.17 674.879 219.16 665.141C224.996 650.898 234.096 640.132 249.34 635.955C252.449 635.115 255.672 634.378 258.589 634.682C261.374 634.972 263.887 636.211 265.748 639.308L265.926 639.614C268.258 643.73 270.831 645.44 273.702 645.546C276.5 645.648 279.445 644.209 282.491 642.418C303.205 630.262 323.841 617.977 344.78 606.263C346.045 605.557 347.432 604.525 348.825 603.52C350.236 602.504 351.666 601.507 353.069 600.816Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M310.594 226.74C321.747 227.372 329.429 233.78 334.739 242.908V242.909C337.335 247.363 338.075 251.779 337.405 256.038C336.734 260.307 334.643 264.449 331.526 268.329C325.027 276.397 316.635 281.832 306.465 278.376C302.073 276.873 298.249 276.688 294.621 277.424C291.229 278.112 288.031 279.6 284.725 281.522L284.064 281.911C265.104 293.156 245.941 304.099 226.742 314.977L226.74 314.978C225.294 315.804 223.662 316.842 222.062 317.303C221.273 317.53 220.532 317.604 219.857 317.458C219.277 317.333 218.717 317.04 218.198 316.49L217.978 316.239C217.16 315.214 216.868 314.331 216.874 313.564C216.88 312.791 217.189 312.064 217.708 311.356C218.229 310.644 218.942 309.98 219.712 309.342C220.095 309.024 220.487 308.718 220.871 308.417C221.253 308.118 221.628 307.823 221.971 307.535C233.626 297.793 245.19 287.871 257.489 279.055C270.52 269.716 283.137 260.859 288.222 243.844L288.459 243.028C291.068 233.763 299.956 228.042 310.594 226.74Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M263.474 3.91699C270.763 0.0320946 277.11 -0.251107 282.932 1.62305C288.782 3.50621 294.145 7.58095 299.418 12.5029C301.641 14.5873 302.959 16.6659 303.649 18.7256C304.339 20.7857 304.41 22.8578 304.094 24.9434C303.457 29.153 301.27 33.3224 299.468 37.5244C292.23 54.3721 276.266 64.7211 258.839 64.7197V64.6914L258.344 64.6855C251.653 64.6026 246.4 62.6647 242.969 59.1768C239.546 55.6957 237.868 50.5993 238.462 44.0459C240.036 26.986 247.149 12.9289 262.726 4.32324L263.474 3.91699Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M392.814 749.588C409.181 749.258 424.434 764.041 424.863 780.627C425.06 788.049 420.881 796.185 414.735 802.448C408.589 808.712 400.582 812.996 393.251 812.849H393.25C376.767 812.555 361.862 797.829 361.558 781.786H361.584V781.286C361.584 764.437 375.899 749.919 392.814 749.588Z" stroke="#2D3134" strokeWidth="1.5" />
                                <path d="M334.024 858.871C338.704 858.613 344.218 861.272 348.675 865.286C352.991 869.173 356.196 874.223 356.687 878.873L356.726 879.322C357.031 883.89 354.299 889.307 350.16 893.68C346.025 898.048 340.609 901.241 335.718 901.484C330.697 901.727 325.448 899.163 321.398 895.113C317.352 891.066 314.571 885.6 314.424 880.147C314.294 875.138 316.665 869.954 320.363 865.941C324.062 861.928 329.033 859.148 334.024 858.871Z" stroke="#2D3134" strokeWidth="1.5" />
                            </svg>
                        </div>
                        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-10 lg:gap-14">
                            {/* Conteúdo Estratégico: headline + subtext + botão (Left on Desktop) */}
                            <div className="w-full lg:w-[38%] flex flex-col items-center lg:items-start text-center lg:text-left">
                                <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.4em] text-[#2D3134]/40 mb-4 block font-sans">
                                    Por que fazer?
                                </span>
                                <h2 className="text-3xl md:text-5xl lg:text-5xl font-serif text-natu-brown leading-[0.95] tracking-tighter mb-6">
                                    Nutrição Ortomolecular <br /> <span className="text-natu-brown/40">Resolve:</span>
                                </h2>
                                <p className="font-sans text-base lg:text-lg text-gray-500 leading-relaxed font-light mb-8 max-w-sm">
                                    O desequilíbrio que rouba sua energia, seu humor e a sua vontade de viver.
                                </p>

                                <NatuButton onClick={() => window.open('https://wa.me/5561999999330', '_blank')}>
                                    Agendar consulta
                                </NatuButton>
                            </div>

                            {/* Cards: Horizontal scroll on mobile, Grid on desktop (Right on Desktop) */}
                            <div
                                ref={symptomsScrollRef}
                                onScroll={(e) => {
                                    if (window.innerWidth < 1024) {
                                        const container = e.currentTarget;
                                        const index = Math.round(container.scrollLeft / (container.scrollWidth / 6));
                                        setSymptomsIndex(index);
                                    }
                                }}
                                onMouseDown={(e) => window.innerWidth < 1024 && handleMouseDown(e)}
                                onMouseMove={(e) => window.innerWidth < 1024 && handleMouseMove(e)}
                                onMouseUp={() => window.innerWidth < 1024 && handleMouseUpOrLeave()}
                                onMouseLeave={() => window.innerWidth < 1024 && handleMouseUpOrLeave()}
                                className={`w-full lg:w-[62%] overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory flex lg:grid lg:grid-cols-2 gap-4 pb-4 lg:pb-0 ${isDragging && window.innerWidth < 1024 ? 'cursor-grabbing select-none' : 'lg:cursor-default'}`}
                            >
                                {
                                    [
                                        { title: "Fadiga Crônica", desc: "Cansaço persistente que não cessa.", delay: 0 },
                                        { title: "Suporte Oncológico", desc: "Aporte para fortalecer o organismo.", delay: 0.1 },
                                        { title: "Inflamação", desc: "Combate à inflamação silenciosa.", delay: 0.2 },
                                        { title: "Metabolismo", desc: "Equilíbrio da resistência insulínica.", delay: 0.3 },
                                        { title: "Emagrecimento", desc: "Gestão do peso baseada em bioquímica.", delay: 0.4 },
                                        { title: "Regulação Intestinal", desc: "Equilíbrio da microbiota e saúde digestiva.", delay: 0.5 }
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, filter: 'blur(10px)' }}
                                            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: item.delay }}
                                            className="snap-center shrink-0 w-[95%] lg:w-full p-5 lg:p-6 bg-white border border-[#2D3134]/10 rounded-2xl group cursor-default flex flex-row items-center text-left gap-4 flicker-fix"
                                        >
                                            {/* Icon Style Circles (Left Side) */}
                                            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                                                <div className="absolute inset-0 border border-natu-brown/10 rounded-full" />
                                                <div className="absolute inset-[3px] border border-natu-brown/10 rounded-full" />
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-natu-brown">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>

                                            {/* Text Content (Right Side) */}
                                            <div className="flex flex-col">
                                                <h4 className="font-sans text-[#2D3134] text-base lg:text-lg mb-0.5 tracking-tight leading-tight">
                                                    {item.title}
                                                </h4>
                                                <p className="font-sans text-[11px] lg:text-xs text-[#2D3134]/60 font-light leading-snug">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                }
                            </div>
                        </div>
                    </motion.div>

                    {/* Pagination Dots (Mobile Only) — fora do card */}
                    <div className="flex lg:hidden justify-center gap-2 mt-6">
                        {Array.from({ length: 6 }).map((_, dot) => (
                            <button
                                key={dot}
                                onClick={() => scrollToIndex(dot)}
                                className={`h-1.5 rounded-full transition-all duration-300 focus:outline-none ${symptomsIndex === dot ? 'w-6 bg-natu-brown' : 'w-1.5 bg-natu-brown/20'
                                    }`}
                                aria-label={`Ir para sintoma ${dot + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Apresentação Dr. Julimar */}
            <section className="py-12 md:py-20 px-6 md:px-16 max-w-[1400px] mx-auto lg:flex lg:items-center">
                <div className="flex flex-col lg:flex-row lg:items-center items-start justify-center gap-8 lg:gap-20 w-full">
                    {/* Foto */}
                    <motion.div
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative w-full max-w-sm lg:w-[420px] shrink-0"
                    >
                        <div className="rounded-xl overflow-hidden aspect-[3/4]">
                            <img
                                src="/nutricionista-ortomolecular-integrativo-dr-julimar-meneses.jpeg"
                                alt="Dr. Julimar Meneses - Nutricionista Ortomolecular"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                    </motion.div>

                    {/* Conteúdo */}
                    <motion.div
                        initial={{ opacity: 0, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-col justify-center relative p-0 lg:p-0 text-left items-start"
                    >
                        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-4 font-sans">
                            Conheça o especialista
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-natu-brown leading-tight tracking-tighter mb-2">
                            Dr. Julimar Meneses
                        </h2>
                        <p className="font-sans text-sm font-medium tracking-widest text-gray-400 uppercase mb-6">
                            Nutricionista · Farmacêutico · Doutor em Naturopatia · CRN-DF 21414
                        </p>
                        <div className="space-y-4 font-sans font-light text-gray-500 leading-relaxed text-base max-w-lg">
                            <p>
                                Formado em Nutrição e Farmácia, com doutorado em Naturopatia e especialização em Biologia Molecular, o Dr. Julimar iniciou sua jornada na Nutrição Ortomolecular em 2006 — uma abordagem que se tornaria o centro de toda a sua atuação clínica e científica.
                            </p>
                            <p>
                                Pesquisador ativo, dedica parte de sua trajetória ao estudo do uso terapêutico do <em>Aloe Vera Gel</em> e à investigação de casos clínicos em oncologia nutricional, modulação intestinal e fitoterapia. Sua visão integrativa parte de uma crença central: a saúde começa na raiz celular, e tratar de dentro para fora é o caminho mais eficaz e duradouro.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section >



            <section className="bg-white py-12 md:py-20 overflow-hidden relative">
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    {/* Title and Pillars (Decoupled from card) */}
                    <div className="text-center mb-16 md:mb-20">
                        <motion.div
                            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#2D3134]/40 uppercase block mb-6 font-sans">
                                Nossa Abordagem
                            </span>
                            <h2 className="text-4xl md:text-6xl font-serif text-natu-brown tracking-tighter leading-[0.9]">
                                Os alicerces da sua <br /> saúde celular
                            </h2>
                        </motion.div>
                    </div>

                    {/* Grid of Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-white/10">
                        {[
                            {
                                title: "Rastreio Metabólico Individualizado",
                                desc: "Análise de mais de 60 biomarcadores subclínicos para identificar desequilíbrios antes que se tornem patologias.",
                            },
                            {
                                title: "Protocolo Clean Label & Nutracêuticos",
                                desc: "Seleção restrita de compostos de alta pureza e biodisponibilidade, livres de aditivos e metais pesados.",
                            },
                            {
                                title: "Estratégia Anti-inflamatória Sistêmica",
                                desc: "Protocolos desenhados para silenciar a inflamação de baixo grau, raiz de sintomas como fadiga e dores crônicas.",
                            },
                            {
                                title: "Reprogramação Metabólica",
                                desc: "Intervenção bioquímica para otimizar a queima de gordura, o ganho de massa magra e a regulação hormonal.",
                            },
                            {
                                title: "Apoio Nutricional de Alta Complexidade",
                                desc: "Suporte especializado para modulação intestinal profunda, oncologia integrativa e doenças autoimunes.",
                            },
                            {
                                title: "Atendimento Sem Fronteiras",
                                desc: "A excelência técnica do consultório físico em Brasília disponível via teleconsulta de alta resolução para todo o mundo.",
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group flex flex-col items-start p-8 md:p-12 border-r border-b border-white/10 bg-natu-brown hover:bg-[#3D1E15] transition-colors duration-500"
                            >
                                <div className="text-left w-full h-full flex flex-col">
                                    <div className="mb-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-natu-pink bg-opacity-10">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <h3 className="font-sans text-white text-lg md:text-xl mb-4 tracking-tight font-bold group-hover:text-natu-pink transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="font-sans text-sm md:text-base text-white/70 leading-relaxed font-light">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Especialidades de Alta Complexidade */}
            <div ref={deckRef} className="bg-white md:h-screen w-full relative flex flex-col items-center justify-start pt-16 md:pt-24 pb-12 px-6">
                {/* Header */}
                <div className="max-w-4xl w-full mb-10 text-center">
                    <BlurFade className="text-center">
                        <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#2D3134]/40 uppercase block mb-4 font-sans">
                            Áreas de Foco
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif text-natu-brown tracking-tighter leading-[0.9]">
                            Especialidades de <br /> Alta Complexidade
                        </h2>
                    </BlurFade>
                </div>

                {/* Cards Deck Container */}
                <div className="relative w-full max-w-4xl h-[750px] md:h-[550px] px-6 md:px-0">
                    {/* 4.1 Oncologia */}
                    <section ref={card1Ref} className="absolute inset-x-0 top-0 z-10 will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
                        <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-10 relative overflow-hidden">
                            {/* Noise Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 %3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                            <div className="mb-6 text-left relative z-10">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans text-natu-brown tracking-tight">
                                    Oncologia Nutricional Integrativa
                                </h3>
                            </div>
                            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-video relative overflow-hidden rounded-2xl">
                                        <img
                                            src="/tratamento-oncologico-nutricional-ortomolecular-Topaz-Gigapixel-escala-2x.jpg"
                                            alt="Oncologia Nutricional"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <p className="text-base text-[#424245] font-sans font-light leading-relaxed relative z-10">
                                        Suporte bioquímico fundamental através do ajuste fino de nutrientes para mitigar efeitos colaterais e fortalecer o sistema imunológico durante a jornada terapêutica.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4.2 Modulação */}
                    <section ref={card2Ref} className="absolute inset-x-0 top-0 z-20 will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
                        <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-10 relative overflow-hidden">
                            {/* Noise Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 %3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                            <div className="mb-6 text-left relative z-10">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans text-natu-brown tracking-tight">
                                    Modulação Intestinal Sistêmica
                                </h3>
                            </div>
                            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-video relative overflow-hidden rounded-2xl">
                                        <img
                                            src="/tratamento-reabilitação-intestinal-ortomolecular.jpg"
                                            alt="Modulação Intestinal"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <p className="text-base text-[#424245] font-sans font-light leading-relaxed relative z-10">
                                        Recuperação da barreira epitelial e reequilíbrio profundo da microbiota. O protocolo essencial para silenciar inflamações e restaurar a absorção plena de nutrientes.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4.3 Performance */}
                    <section ref={card3Ref} className="absolute inset-x-0 top-0 z-30 will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translateZ(0)' }}>
                        <div className="bg-white rounded-[24px] border border-gray-100 p-6 md:p-10 relative overflow-hidden">
                            {/* Noise Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3 %3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

                            <div className="mb-6 text-left relative z-10">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-sans text-natu-brown tracking-tight">
                                    Alta Performance & Longevidade
                                </h3>
                            </div>
                            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-video relative overflow-hidden rounded-2xl">
                                        <img
                                            src="/longevidade-com-nutrição-ortomolecular-emagrecimento-e-performance.jpg"
                                            alt="Alta Performance"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <p className="text-base text-[#424245] font-sans font-light leading-relaxed relative z-10">
                                        Ajuste meticuloso de biomarcadores e otimização celular profunda para elevar sua capacidade cognitiva e física ao topo, garantindo vitalidade prolongada.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>


            <div className="px-6 md:px-12 pb-12 max-w-6xl mx-auto mt-0 space-y-8">

                {/* 3. O Processo */}
                <section className="py-12 md:py-16 bg-white relative overflow-hidden border-t border-gray-50">
                    <div className="max-w-5xl mx-auto px-6 md:px-12">
                        <div className="text-center mb-12 md:mb-16">
                            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-[#2D3134]/30 uppercase block mb-6 font-sans">Jornada do Paciente</span>
                            <h2 className="text-4xl md:text-6xl font-serif text-natu-brown tracking-tighter mb-8 leading-[0.9]">
                                Sua trajetória <br /> para o equilíbrio
                            </h2>
                        </div>

                        {/* White Card Container */}
                        <div ref={journeyContainerRef} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 lg:p-14 relative overflow-hidden">
                            {/* Vertical Progress Container (Fixed on the far left) */}
                            <div className="absolute left-[24px] md:left-[44px] lg:left-[54px] top-14 bottom-14 w-[1px] bg-gray-100" />

                            {/* Animated Progress Bar (Before the numbers) */}
                            <div
                                ref={progressRef}
                                className="absolute left-[24px] md:left-[44px] lg:left-[54px] top-14 bottom-14 w-[2px] bg-natu-brown origin-top z-10 scale-y-0"
                            />

                            <div className="relative z-0 space-y-10 md:space-y-12">
                                {[
                                    {
                                        title: "Consulta Especializada",
                                        desc: "O primeiro passo para entender suas queixas e alinhar o foco do seu tratamento celular."
                                    },
                                    {
                                        title: "Anamnese Bioquímica",
                                        desc: "Investigação profunda de biomarcadores para mapear seu equilíbrio metabólico."
                                    },
                                    {
                                        title: "Protocolo Vital",
                                        desc: "Entrega do plano estratégico: dieta funcional e suplementação personalizada."
                                    },
                                    {
                                        title: "Acompanhamento",
                                        desc: "Ajustes finos no protocolo baseados na sua evolução clínica e novos exames."
                                    },
                                    {
                                        title: "Longevidade Ativa",
                                        desc: "Consolidação dos resultados para manter sua saúde celular no topo a longo prazo."
                                    }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                                        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                        className="flex gap-8 md:gap-16 lg:gap-20 items-start relative pl-6 md:pl-10 lg:pl-12"
                                    >
                                        {/* Number on the left */}
                                        <div className="relative z-20 flex flex-col items-center">
                                            <div className="bg-white py-2">
                                                <span className="text-xl md:text-2xl font-sans font-black text-natu-brown leading-none">
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content on the right */}
                                        <div className="flex-1 pt-2">
                                            <h3 className="font-sans text-natu-brown text-lg md:text-xl mb-2 tracking-tight">
                                                {item.title}
                                            </h3>
                                            <p className="font-sans font-light text-[#2D3134]/70 text-[13px] md:text-sm lg:text-base leading-relaxed max-w-2xl">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Follow-up Note */}
                            <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                                <p className="font-sans text-sm md:text-base text-natu-brown font-bold tracking-widest flex items-center justify-center gap-3">
                                    <span className="w-8 h-[1px] bg-natu-brown/20" />
                                    Todas as consultas dão direito a retorno
                                    <span className="w-8 h-[1px] bg-natu-brown/20" />
                                </p>
                            </div>
                        </div>
                    </div>
                </section>




                {/* 4. Indicações - Infinite Horizontal Scroll Refined */}
                <section className="py-12 md:py-24 overflow-hidden relative bg-white">
                    <BlurFade className="text-center px-6 mb-12 md:mb-16">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-natu-brown/40 mb-3 block font-sans">
                            Aplicações
                        </span>
                        <h2 className="text-3xl md:text-5xl font-serif text-natu-brown leading-tight">
                            Para quem é indicado?
                        </h2>
                        <p className="mt-4 font-sans font-light text-gray-500 max-w-2xl mx-auto">
                            A Nutrição Ortomolecular atua em um amplo espectro de condições e objetivos de saúde, tratando a causa e não apenas os sintomas.
                        </p>
                    </BlurFade>

                    <div className="relative w-full overflow-hidden flex flex-col gap-5">
                        {/* Gradient Overlays - Stronger for a more premium "fade" look */}
                        <div className="absolute inset-y-0 left-0 w-[15%] md:w-[25%] bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
                        <div className="absolute inset-y-0 right-0 w-[15%] md:w-[25%] bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

                        {[
                            {
                                direction: "left",
                                duration: 60,
                                tags: ["Fadiga crônica", "Ansiedade e estresse", "Distúrbios do sono", "Desequilíbrio hormonal", "Hipotireoidismo", "TPM e menopausa", "Envelhecimento precoce"]
                            },
                            {
                                direction: "right",
                                duration: 75,
                                tags: ["Queda de cabelo", "Acne e dermatites", "Dificuldade de emagrecer", "Inflamação silenciosa", "Disbiose intestinal", "Pré e pós-operatório", "Performance esportiva"]
                            },
                            {
                                direction: "left",
                                duration: 70,
                                tags: ["Baixa imunidade", "Fibromialgia", "Depressão leve", "Colesterol alto", "Resistência à insulina", "Longevidade e prevenção", "Saúde Intestinal"]
                            }
                        ].map((row, rowIndex) => (
                            <div key={rowIndex} className="flex overflow-hidden">
                                <motion.div
                                    animate={{ x: row.direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
                                    transition={{
                                        duration: row.duration,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="flex flex-nowrap gap-4 whitespace-nowrap"
                                >
                                    {/* Duplicated set for seamless loop */}
                                    {[...row.tags, ...row.tags, ...row.tags, ...row.tags].map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-6 py-3 rounded-full border border-gray-100 text-[#4C261A] text-sm font-sans font-medium bg-[#F9F7F5]/40 hover:bg-natu-brown hover:text-white hover:border-natu-brown transition-all duration-300 cursor-default"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </section>



                {/* CTA Card Horizontal */}
                <section className="py-8 md:py-12">
                    <div className="max-w-5xl mx-auto px-6">
                        <BlurFade>
                            <div className="bg-gradient-to-r from-[#4C261A] to-[#3D1E15] rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                                {/* Decorative Details */}
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

                                <div className="relative z-10 text-center md:text-left">
                                    <h3 className="text-2xl md:text-4xl font-sans text-white tracking-tighter leading-tight mb-3">
                                        Recupere sua <br className="hidden md:block" /> vitalidade celular
                                    </h3>
                                    <p className="text-white/60 font-sans font-light text-sm md:text-lg max-w-sm">
                                        Dê o primeiro passo para o equilíbrio bioquímico com um atendimento de excelência.
                                    </p>
                                </div>

                                <div className="relative z-10">
                                    <NatuButton
                                        onClick={handleWhatsApp}
                                        className="!bg-white !text-[#4C261A] hover:!bg-natu-pink hover:!text-white"
                                    >
                                        Agendar consulta
                                    </NatuButton>
                                </div>
                            </div>
                        </BlurFade>
                    </div>
                </section>

                {/* 5. Feedback */}
                <FeedbackSection />

                {/* 6. FAQ */}
                <section className="py-12 md:py-20">
                    <BlurFade className="text-center mb-12">
                        <span className="text-xs font-bold tracking-widest text-[#2D3134]/50 uppercase block mb-4 font-sans">Dúvidas comuns</span>
                        <h2 className="text-3xl md:text-5xl font-serif text-natu-brown">Perguntas Frequentes</h2>
                    </BlurFade>

                    <div className="max-w-3xl mx-auto">
                        <FAQItem
                            question="O que é Nutrição Ortomolecular e como ela difere da nutrição convencional?"
                            answer="Enquanto a nutrição convencional muitas vezes foca no cálculo de calorias e macronutrientes, a nutrição ortomolecular atua em nível celular. O objetivo é equilibrar vitaminas, minerais, aminoácidos e neutralizar radicais livres, focando em tratar a causa dos sintomas, não apenas a manifestação externa."
                        />
                        <FAQItem
                            question="Quais exames são solicitados na primeira consulta?"
                            answer="Geralmente, solicitamos um rastreio metabólico profundo. Isso inclui dosagem de vitaminas, minerais, perfil hormonal, marcadores inflamatórios, função tireoidiana, hepática e renal. O objetivo é criar um mapa preciso do funcionamento íntimo do seu corpo."
                        />
                        <FAQItem
                            question="Em quanto tempo verei resultados?"
                            answer="O tempo de resposta varia de acordo com o nível da deficiência nutricional e do comprometimento do seu sistema. Muitas pessoas relatam melhora na disposição física, sono e clareza mental já nas primeiras semanas, enquanto o reequilíbrio metabólico duradouro se consolida ao longo dos meses de acompanhamento."
                        />
                        <FAQItem
                            question="A Nutrição Ortomolecular substitui medicamentos?"
                            answer="Não necessariamente. Tratamos a saúde de forma integrada. O aporte de nutrientes e a correção de deficiências ajudam as células a funcionarem de forma otimizada. Muitas vezes, isso cria a saúde necessária para que o médico possa, com segurança, readequar ou até desmamar a medicação medicamentosa."
                        />
                        <FAQItem
                            question="A Natuclinic atende convênios?"
                            answer="Os nossos atendimentos são particulares. Optamos por este modelo para garantir o tempo de consulta necessário para conhecer nossos pacientes de forma profunda (com consultas mais longas e detalhadas), prezando sempre pela excelência e acolhimento humano da clínica."
                        />
                        <FAQItem
                            question="Posso combinar com os tratamentos estéticos da clínica?"
                            answer="Com certeza! Essa é a combinação perfeita (a verdadeira beleza de dentro para fora). A nutrição fornece a matéria-prima — os blocos construtores que o seu corpo usará para potencializar os resultados de procedimentos de harmonização, bioestimuladores e lasers, assegurando que o brilho se revele também na textura da sua pele e na força dos tecidos."
                        />
                    </div>
                </section>
            </div>

            {/* 7. Localização - Estilo Premium para Dr. Julimar */}
            <section className="pt-16 md:pt-24 pb-0 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 text-center mb-12">
                    <BlurFade>
                        <span className="text-[10px] md:text-sm font-sans font-bold tracking-[0.4em] text-gray-400 block mb-4">
                            Localização
                        </span>
                        <h2 className="text-4xl md:text-6xl font-serif text-natu-brown mb-8 tracking-tighter">
                            Onde me encontrar?
                        </h2>
                        <div className="space-y-3">
                            <p className="text-xl md:text-2xl font-sans font-bold text-natu-brown tracking-tight">
                                Dr. Julimar Meneses - Nutricionista Ortomolecular
                            </p>
                            <p className="text-sm font-sans font-bold text-gray-400 uppercase tracking-widest">
                                CRN-DF 21414
                            </p>
                            <p className="text-lg md:text-xl font-sans font-medium text-gray-500">
                                Taguatinga Norte (Setor E Norte), Brasília - DF
                            </p>
                            <p className="text-base md:text-lg font-sans text-gray-500 font-light">
                                Telefones: <span className="font-bold text-natu-brown">(61) 99255-1867</span> / <span className="font-bold text-natu-brown">(61) 3372-9962</span>
                            </p>
                        </div>
                    </BlurFade>
                </div>

                {/* Google Map Embed - Full Width Style */}
                <div className="w-full h-[400px] md:h-[550px] relative overflow-hidden group border-y border-gray-100">
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://maps.google.com/maps?q=Natuclinic%20Taguatinga%20Norte&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight="0"
                        marginWidth="0"
                        className="grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 contrast-[1.05]"
                        title="Localização Dr. Julimar"
                        loading="lazy"
                    ></iframe>
                </div>
            </section>

        </ServiceLayout >
    );
};

export default NutricaoOrtomolecular;
