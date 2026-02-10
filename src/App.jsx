import React, { useState, useEffect, useRef } from 'react';
import Unicon from './components/Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Lenis from 'lenis'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';

const Ninfoplastia = React.lazy(() => import('./pages/Ninfoplastia'));
const Endolaser = React.lazy(() => import('./pages/Endolaser'));
const HarmonizacaoGluteos = React.lazy(() => import('./pages/HarmonizacaoGluteos'));
const HarmonizacaoFacial = React.lazy(() => import('./pages/HarmonizacaoFacial'));
const Blog = React.lazy(() => import('./pages/Blog'));
const CeoSection = React.lazy(() => import('./components/CeoSection'));
const FooterNew = React.lazy(() => import('./components/FooterNew'));
const ClinicGallery = React.lazy(() => import('./components/ClinicGallery'));
const Silk = React.lazy(() => import('./components/Silk'));
const LocationsSection = React.lazy(() => import('./components/LocationsSection'));
const StatsSection = React.lazy(() => import('./components/StatsSection'));
const ResultsSection = React.lazy(() => import('./components/ResultsSection'));
const ResultsCTA = React.lazy(() => import('./components/ResultsCTA'));
const BlurText = React.lazy(() => import('./components/BlurText'));
const BlogPostDemo = React.lazy(() => import('./pages/BlogPostDemo'));
const BlogPostNutricao = React.lazy(() => import('./pages/BlogPostNutricao'));
const BlogPostGeneric = React.lazy(() => import('./pages/BlogPostGeneric'));
const AdminPost = React.lazy(() => import('./pages/AdminPost'));
const LeadCapture = React.lazy(() => import('./components/LeadCapture'));
const FeedbackSection = React.lazy(() => import('./components/FeedbackSection'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const BlogHighlights = React.lazy(() => import('./components/BlogHighlights'));
const VideoFeedbacks = React.lazy(() => import('./components/VideoFeedbacks'));
import { useArticles } from './hooks/useArticles';

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis global smooth scroll
const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Ease Out Quart
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sync GSAP ticker with Lenis requestAnimationFrame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Turn off GSAP's lag smoothing to avoid jitters with Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const NatuButton = ({ children, onClick, className, ...props }) => (
  <button className={`natu-button ${className || ''}`} onClick={onClick} {...props}>
    <span className="natu-button__icon-wrapper">
      <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg" width="10">
        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
      </svg>
      <svg viewBox="0 0 14 15" fill="none" width="10" xmlns="http://www.w3.org/2000/svg" className="natu-button__icon-svg natu-button__icon-svg--copy">
        <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
      </svg>
    </span>
    {children}
  </button>
);

// Optimized DnaAnimation using CSS Variables for cleanliness
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

const ProcedureCard = ({ imageUrl, title, category, onClick, themeColor }) => {
  return (
    <div style={{ "--theme-color": themeColor }} className="group w-full aspect-[4/5] cursor-pointer" onClick={onClick}>
      <div
        className="relative block w-full h-full rounded-2xl overflow-hidden border border-white/10 transition-all duration-500 ease-in-out group-hover:scale-[1.02]"
      >
        <div
          className="absolute inset-0 bg-cover bg-center grayscale-[20%] transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:grayscale-0"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, hsl(var(--theme-color) / 0.95) 0%, hsl(var(--theme-color) / 0.4) 40%, transparent 80%)`,
          }}
        />
        <div className="relative flex flex-col justify-end h-full p-8 text-white">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 mb-2 font-sans">
            {category}
          </span>
          <h3 className="text-3xl font-serif leading-tight">{title}</h3>
          <div className="mt-8 flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-5 py-4 transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40">
            <span className="text-[10px] font-bold uppercase tracking-widest font-sans">Saber Mais</span>
            <Unicon name="arrow-right" className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsApp = () => {
    const phone = "5561992551867";
    const message = encodeURIComponent("Olá! Gostaria de agendar uma consulta na Natuclinic.");
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Procedimentos', href: 'https://wa.me/5561992551867?text=Olá! Gostaria de saber mais sobre os procedimentos da Natuclinic.' },
    { label: 'Blog', path: '/blog' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled || mobileMenuOpen ? 'bg-white/95 py-4 border-b border-gray-100' : 'bg-transparent py-8'}`}>
      <div className="desktop-container flex justify-between items-center relative">
        <span onClick={() => handleNavigation('/')} className="cursor-pointer z-50 relative">
          <img src="/logo-natuclinic.png" alt="Natuclinic Logo" className="h-12 md:h-16 w-auto object-contain" />
        </span>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 p-2 text-natu-brown"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <Unicon name="times" size={24} />
          ) : (
            <Unicon name="bars" size={24} />
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12 font-sans">
          {menuItems.map((item, i) => (
            item.path ? (
              <button key={i} onClick={() => handleNavigation(item.path)} className="text-[10px] uppercase tracking-widest font-bold hover:opacity-50 bg-transparent border-0 p-0 text-natu-brown">
                {item.label}
              </button>
            ) : (
              <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-bold hover:opacity-50 text-natu-brown no-underline">
                {item.label}
              </a>
            )
          ))}
          <NatuButton onClick={handleWhatsApp}>
            Agendar
          </NatuButton>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-white/98 backdrop-blur-md transition-all duration-500 md:hidden flex flex-col justify-center items-center gap-0 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'}`}>
          <div className="w-full max-w-[280px] flex flex-col items-center">
            {menuItems.map((item, i) => (
              <React.Fragment key={i}>
                {item.path ? (
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className="w-full py-6 text-base uppercase tracking-[0.3em] font-light text-natu-brown hover:opacity-50 bg-transparent border-0 transition-all duration-300"
                  >
                    {item.label}
                  </button>
                ) : (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-6 text-base uppercase tracking-[0.3em] font-light text-natu-brown hover:opacity-50 bg-transparent border-0 transition-all duration-300 flex justify-center items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
                {i < menuItems.length - 1 && (
                  <div className="w-8 h-[1px] bg-natu-brown/10" />
                )}
              </React.Fragment>
            ))}
            <div className="mt-12">
              <NatuButton onClick={() => { handleWhatsApp(); setMobileMenuOpen(false); }}>
                Agendar
              </NatuButton>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomeIntro = () => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
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
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-white pt-12 md:pt-16">
      {/* Background/Image Card */}
      <div className="absolute inset-0 flex items-center justify-center p-0 md:p-8 z-0 pt-24 md:pt-32">
        <div
          className="relative w-full h-full md:w-[95%] md:h-[85%] md:rounded-[2.5rem] overflow-hidden border border-gray-100/10"
        >
          <video
            ref={bgRef}
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none"
            src="/dna-video.mp4"
            autoPlay
            loop
            muted
            playsInline
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
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/40 cursor-pointer">
            <Unicon name="arrow-down" className="w-5 h-5 text-natu-brown" />
          </div>
        </div>
      </div>
    </section>
  );
};

const HomeManifesto = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline Animation
      gsap.from(".manifesto-headline span", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 24,
        filter: "blur(10px)",
        duration: 2.5,
        ease: "power3.out",
        stagger: 0.2,
      });

      // Method Items Animation
      gsap.from(".method-item", {
        scrollTrigger: {
          trigger: ".method-item",
          start: "top 85%",
        },
        opacity: 0,
        y: 32,
        filter: "blur(10px)",
        duration: 2.5,
        ease: "power3.out",
        stagger: 0.18,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative bg-natu-brown overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Silk
          speed={5.2}
          scale={0.8}
          color="#37261c"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      {/* Subtle Organic Gradient Background */}
      <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_#6E4A3C_0%,_transparent_70%)] opacity-20 blur-3xl mix-blend-multiply z-0"></div>

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 lg:grid lg:grid-cols-12 lg:gap-x-16 relative z-10">
        {/* HEADLINE */}
        <div className="lg:col-span-6 manifesto-headline">
          <span className="block mb-6 text-xs tracking-[0.3em] uppercase text-[#F2F0E9]/60 font-sans font-bold">
            Metodologia Natuclinic
          </span>

          <h2 className="font-serif text-4xl leading-tight text-[#F2F0E9] sm:text-5xl lg:text-7xl">
            <span className="block opacity-90">não tratamos sintomas,</span>
            <span className="block mt-4 font-medium">tratamos pessoas</span>
          </h2>
        </div>

        {/* METODOLOGIA */}
        <div className="mt-20 space-y-16 lg:col-span-5 lg:mt-0 lg:ml-auto">
          {[
            { id: "01", title: "Consulta Avaliativa Criteriosa", text: "Cada protocolo nasce de uma análise detalhada. Não padronizamos você." },
            { id: "02", title: "Integração Terapêutica", text: "Unimos nutrição ortomolecular, estética avançada e suplementação funcional." },
            { id: "03", title: "Saúde Celular", text: "Equilíbrio biológico como base. Beleza é consequência de saúde." }
          ].map((item, idx) => (
            <div key={idx} className="method-item relative pl-6 border-l border-[#F2F0E9]/20 lg:pl-0 lg:border-l-0">
              <span className="block mb-4 font-serif text-2xl text-[#F2F0E9]/30">{item.id}</span>
              <h3 className="mb-3 font-serif text-xl text-[#F2F0E9]">
                {item.title}
              </h3>
              <p className="max-w-[42ch] text-sm leading-relaxed text-[#F2F0E9]/80 font-sans font-light text-pretty">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
            className="px-3 py-1.5 md:px-10 md:py-3 border border-[#F2F0E9] rounded-full text-[7px] md:text-[10px] lg:text-xs tracking-[0.2em] uppercase font-sans hover:bg-[#F2F0E9] hover:text-natu-brown transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap"
          >
            Contato
          </button>
        </div>

      </div>
    </section>
  );
};

const ProceduresSection = () => {
  const navigate = useNavigate();
  const procedimentos = [
    { title: "Nutrição Ortomolecular", category: "Saúde Celular", imageUrl: "/soroterapia.jpg", theme: "var(--theme-brown)", id: "nutricao" },
    { title: "Ninfoplastia Sem Cortes", category: "Estética Íntima", imageUrl: "/ninfoplastia.jpeg", theme: "var(--theme-pink)", id: "ninfoplastia" },
    { title: "Endolaser", category: "Tecnologia Avançada", imageUrl: "/harmonizacao-corporal.jpg", theme: "var(--theme-brown)", id: "endolaser" },
    { title: "Harmonização de Glúteos", category: "Estética Corporal", imageUrl: "/harmonizacao-de-gluteo.jpg", theme: "var(--theme-pink)", id: "harmonizacao" },
    { title: "Harmonização Facial", category: "Estética Facial", imageUrl: "/harmonizacao-facial.jpg", theme: "var(--theme-brown)", id: "harmonizacao-facial" },
    { title: "Emagrecimento Saudável", category: "Nutrição Taguatinga", imageUrl: "/emagrecimento-saudavel.jpg", theme: "var(--theme-pink)", id: "emagrecimento" },
  ];

  const handleCardClick = (id, title) => {
    const phone = "5561992551867";
    const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre o procedimento de ${title}.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <section className="py-16 md:py-20 bg-white" id="procedimentos-section">
      <div className="desktop-container">
        <div className="mb-12 md:mb-24 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6 md:gap-0">
          <div>
            <span className="text-natu-pink font-bold tracking-widest text-[10px] uppercase">Estética e Nutrição Ortomolecular</span>
            <div className="mt-4">
              <BlurText
                text="Nutrição Ortomolecular e Estética em Brasília"
                className="text-3xl md:text-5xl font-serif text-natu-brown italic text-balance"
                delay={200}
                animateBy="words"
                direction="top"
              />
            </div>
          </div>
          <a
            href="https://wa.me/5561992551867?text=Olá! Gostaria de conhecer todos os protocolos da Natuclinic."
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase font-bold tracking-[0.2em] border-b border-natu-brown pb-1 hover:opacity-50 transition-all self-start text-natu-brown no-underline"
          >
            Ver Todos Protocolos
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {procedimentos.map((p, i) => (
            <ProcedureCard
              key={i}
              title={p.title}
              category={p.category}
              imageUrl={p.imageUrl}
              themeColor={p.theme}
              onClick={() => handleCardClick(p.id, p.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const BlogPostWrapper = ({ articles, loading }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[100]">
        <div className="scale-75">
          <DnaAnimationClean color="#4C261A" />
        </div>
      </div>
    );
  }

  const post = articles.find(a => a.id === id || a.slug === id);

  if (!post) return <Navigate to="/blog" />;

  return <BlogPostGeneric goBack={() => navigate('/blog')} post={post} articles={articles} setCurrentPage={(newId) => navigate(`/blog/${newId}`)} />;
};

export default function App() {
  useSmoothScroll();
  const { articles, loading } = useArticles();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const isServicePage = location.pathname.startsWith('/procedimentos/') && location.pathname !== '/procedimentos';

  return (
    <div className="min-h-screen bg-white">
      {!isServicePage && <Navbar />}

      <React.Suspense fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white z-[100]">
          <div className="scale-50 sm:scale-75 md:scale-95 lg:scale-100 origin-center">
            <DnaAnimationClean color="#4C261A" />
          </div>
        </div>
      }>
        <main className="relative z-10 bg-white">
          <Routes>
            <Route path="/" element={
              <>
                <HomeIntro />
                <HomeManifesto />
                <ProceduresSection />
                <CeoSection />
                <ResultsSection id="results" />
                <VideoFeedbacks />
                <ResultsCTA />
                <FeedbackSection />
                <ClinicGallery />
                <StatsSection />
                <BlogHighlights />
                <LeadCapture />
                <QuietCTA />
              </>
            } />

            <Route path="/procedimentos" element={
              <div className="pt-48 min-h-screen">
                <ProceduresSection />
              </div>
            } />

            <Route path="/procedimentos/ninfoplastia" element={<Ninfoplastia goBack={() => navigate(-1)} />} />
            <Route path="/procedimentos/endolaser" element={<Endolaser goBack={() => navigate(-1)} />} />
            <Route path="/procedimentos/harmonizacao" element={<HarmonizacaoGluteos goBack={() => navigate(-1)} />} />
            <Route path="/procedimentos/harmonizacao-facial" element={<HarmonizacaoFacial goBack={() => navigate(-1)} />} />

            <Route path="/blog" element={<Blog goBack={() => navigate('/')} setCurrentPage={(id) => navigate(`/blog/${id}`)} articles={articles} loading={loading} />} />
            <Route path="/blog/:id" element={<BlogPostWrapper articles={articles} loading={loading} />} />

            <Route path="/adminblogpost" element={<AdminPost goBack={() => navigate(-1)} />} />
            <Route path="/politica-de-privacidade" element={<PrivacyPolicy goBack={() => navigate(-1)} />} />

            {/* Legacy/Other routes */}
            <Route path="/blog-post-demo" element={<BlogPostDemo goBack={() => navigate(-1)} />} />
            <Route path="/blog-post-nutricao" element={<BlogPostNutricao goBack={() => navigate(-1)} />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {!isServicePage && <FooterNew />}
      </React.Suspense>

      {/* WhatsApp Flutuante - Global */}
      <a href="https://wa.me/5561992551867?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Natuclinic%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="Falar com Natuclinic Taguatinga" className="fixed bottom-10 right-10 bg-natu-brown text-white w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform z-50">
        <Unicon name="whatsapp" size={24} />
      </a>

      <SpeedInsights />
    </div>
  );
}
