import React, { useEffect, useRef } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Unicon from './components/Unicon';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

const Ninfoplastia = React.lazy(() => import('./pages/Ninfoplastia'));
const SaudeDaMulher = React.lazy(() => import('./pages/SaudeDaMulher'));
const Endolaser = React.lazy(() => import('./pages/Endolaser'));
const HarmonizacaoGluteos = React.lazy(() => import('./pages/HarmonizacaoGluteos'));
const HarmonizacaoFacial = React.lazy(() => import('./pages/HarmonizacaoFacial'));
const HarmonizacaoCorporal = React.lazy(() => import('./pages/HarmonizacaoCorporal'));
const NutricaoOrtomolecular = React.lazy(() => import('./pages/NutricaoOrtomolecular'));
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
const BlogPostGeneric = React.lazy(() => import('./pages/BlogPostGeneric'));
const AdminPost = React.lazy(() => import('./pages/AdminPost'));
const LeadCapture = React.lazy(() => import('./components/LeadCapture'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const BlogHighlights = React.lazy(() => import('./components/BlogHighlights'));
const VideoFeedbacks = React.lazy(() => import('./components/VideoFeedbacks'));
const GluteoLanding = React.lazy(() => import('./pages/GluteoLanding'));
const Contato = React.lazy(() => import('./pages/Contato'));
const Soroterapia = React.lazy(() => import('./pages/Soroterapia'));
const Sobre = React.lazy(() => import('./pages/Sobre'));
import { useArticles } from './hooks/useArticles';

import Navbar from './components/Navbar';
import HomeIntro from './components/HomeIntro';
import SEO from './components/SEO';
const HomeManifesto = React.lazy(() => import('./components/HomeManifesto'));
const ProceduresSection = React.lazy(() => import('./components/ProceduresSection'));
const BariátricaBanner = React.lazy(() => import('./components/ProceduresSection').then(m => ({ default: m.BariátricaBanner })));
const QuietCTA = React.lazy(() => import('./components/QuietCTA'));
const CookieConsent = React.lazy(() => import('./components/CookieConsent'));
const FaqSection = React.lazy(() => import('./components/FaqSection'));


import Lenis from 'lenis';

// Initialize Lenis global smooth scroll
const useSmoothScroll = () => {
  const lenisRef = useRef(null);
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      infinite: false,
    });
    lenisRef.current = lenis;

    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(tickerFn);
    };
  }, []);
  return lenisRef;
};

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BlogPostWrapper = ({ articles, adConfig, loading }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Removido carregamento inicial para navegação instantânea
  const normalizedId = String(id || '').toLowerCase().replace(/\/$/, '');
  const post = articles.find(a => {
    const aId = String(a.id || '').toLowerCase().replace(/\/$/, '');
    const aSlug = String(a.slug || '').toLowerCase().replace(/\/$/, '');
    return aId === normalizedId || (a.slug && aSlug === normalizedId);
  });

  if (!post) {
    if (loading) return null; // Wait for data without showing a loader
    return <Navigate to="/blog" />;
  }

  return <BlogPostGeneric goBack={() => navigate('/blog')} post={post} articles={articles} adConfig={adConfig} setCurrentPage={(newId) => navigate(`/blog/${newId}`)} />;
};

export default function App() {
  const lenisRef = useSmoothScroll();
  const { articles, adConfig, loading } = useArticles();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const [showScrollTop, setShowScrollTop] = React.useState(false);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isServicePage = location.pathname.startsWith('/procedimentos/') &&
    location.pathname !== '/procedimentos' &&
    location.pathname !== '/procedimentos/nutricao-ortomolecular' &&
    location.pathname !== '/procedimentos/ninfoplastia' &&
    location.pathname !== '/procedimentos/saude-da-mulher' &&
    location.pathname !== '/procedimentos/harmonizacao-corporal' &&
    location.pathname !== '/procedimentos/soroterapia';

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-natu-ivory">
        <ErrorBoundary>
        <React.Suspense fallback={null}>
          <main className="relative z-10 bg-natu-ivory">
            {!isServicePage && <Navbar />}
            <Routes>
              <Route path="/" element={
                <>
                  <SEO
                    title="Natuclinic — Estética e Nutrição Ortomolecular em Brasília e Taguatinga"
                    description="Clínica especializada em nutrição ortomolecular, harmonização facial, ninfoplastia sem cortes, endolaser e estética corporal em Brasília e Taguatinga. Agende sua avaliação."
                    url="https://www.natuclinic.com.br"
                    canonical="https://www.natuclinic.com.br"
                    keywords="clínica estética brasília, nutrição ortomolecular taguatinga, harmonização facial brasília, ninfoplastia sem cortes, endolaser brasília, natuclinic"
                    image="/og-default.jpg"
                  />
                  <HomeIntro />
                  <ProceduresSection />
                  <ResultsSection id="results" />
                  <CeoSection />
                  <VideoFeedbacks />
                  <BariátricaBanner />
                  <ClinicGallery />
                  <ResultsCTA />
                  <BlogHighlights />
                  <LeadCapture />
                  <FaqSection />
                </>
              } />

              <Route path="/procedimentos" element={
                <div className="pt-48 min-h-screen">
                  <ProceduresSection />
                </div>
              } />

              <Route path="/procedimentos/ninfoplastia" element={<Ninfoplastia goBack={() => navigate(-1)} />} />
              <Route path="/procedimentos/saude-da-mulher" element={<SaudeDaMulher goBack={() => navigate(-1)} />} />
              <Route path="/procedimentos/endolaser" element={<Endolaser goBack={() => navigate(-1)} />} />
              <Route path="/procedimentos/harmonizacao" element={<HarmonizacaoGluteos goBack={() => navigate(-1)} />} />
              <Route path="/procedimentos/harmonizacao-facial" element={<HarmonizacaoFacial goBack={() => navigate(-1)} />} />
              <Route path="/procedimentos/harmonizacao-corporal" element={<HarmonizacaoCorporal />} />
              <Route path="/procedimentos/nutricao-ortomolecular" element={<NutricaoOrtomolecular goBack={() => navigate(-1)} />} />

              <Route path="/blog" element={<Blog goBack={() => navigate('/')} setCurrentPage={(id) => navigate(`/blog/${id}`)} articles={articles} loading={loading} />} />
              <Route path="/blog/:id" element={<BlogPostWrapper articles={articles} adConfig={adConfig} loading={loading} />} />

              <Route path="/adminblogpost" element={<AdminPost goBack={() => navigate(-1)} />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy goBack={() => navigate(-1)} />} />

              {/* Legacy routes — 301 no vercel.json, Navigate como fallback client-side */}
              <Route path="/blog-post-demo" element={<Navigate to="/blog" replace />} />
              <Route path="/blog-post-nutricao" element={<Navigate to="/blog/nutricao-ortomolecular-o-que-e" replace />} />

              <Route path="/gluteo-dos-sonhos" element={<GluteoLanding />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/procedimentos/soroterapia" element={<Soroterapia goBack={() => navigate(-1)} />} />
              <Route path="/contato" element={<Contato goBack={() => navigate(-1)} />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          {!isServicePage && <FooterNew />}
        </React.Suspense>
        </ErrorBoundary>

        {/* Botões flutuantes */}
        <div className="fixed bottom-10 right-10 flex flex-col items-center gap-3 z-[9999]">
          <button
            onClick={() => lenisRef.current?.scrollTo(0)}
            aria-label="Voltar ao topo"
            className={`bg-white text-natu-brown w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-md ring-2 ring-inset ring-natu-brown/40 ${showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>
          </button>
          <a href="https://wa.me/5561992551867?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Natuclinic%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es." target="_blank" rel="noopener noreferrer" aria-label="Falar com Natuclinic Taguatinga" className="bg-whatsapp text-white w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-2xl transition-all duration-300 shadow-lg shadow-[inset_0_0_20px_var(--color-whatsapp-dark)] border border-white/10">
            <Unicon name="whatsapp" size={38} className="drop-shadow-md" />
          </a>
        </div>

        <SpeedInsights />
        <CookieConsent />
      </div>
    </HelmetProvider>
  );
}


