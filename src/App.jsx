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
const GluteoLanding = React.lazy(() => import('./pages/GluteoLanding'));
import { useArticles } from './hooks/useArticles';

import Navbar from './components/Navbar';
import HomeIntro from './components/HomeIntro';
import HomeManifesto from './components/HomeManifesto';
import ProceduresSection from './components/ProceduresSection';
import QuietCTA from './components/QuietCTA';
import CookieConsent from './components/CookieConsent';

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

const BlogPostWrapper = ({ articles, loading }) => {
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
      <React.Suspense fallback={null}>
        <main className="relative z-10 bg-white">
          {!isServicePage && <Navbar />}
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

            <Route path="/gluteo-dos-sonhos" element={<GluteoLanding />} />

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
      <CookieConsent />
    </div>
  );
}


