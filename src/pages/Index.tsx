import { useEffect, Suspense, lazy } from 'react';
import Navigation from '@/components/Navigation';
import ScrollIndicator from '@/components/ScrollIndicator';
import HeroSection from '@/components/HeroSection';

// Lazy load sections that are below the fold
const StatsSection = lazy(() => import('@/components/StatsSection'));
const AboutSection = lazy(() => import('@/components/AboutSection'));
const TimelineSection = lazy(() => import('@/components/TimelineSection'));
const ClassifiedTeamsSection = lazy(() => import('@/components/ClassifiedTeamsSection'));
const JudgesSection = lazy(() => import('@/components/JudgesSection'));
const AwardsPreviewSection = lazy(() => import('@/components/AwardsPreviewSection'));
const GallerySection = lazy(() => import('@/components/GallerySection'));
const SponsorsSection = lazy(() => import('@/components/SponsorsSection'));
const FAQSection = lazy(() => import('@/components/FAQSection'));
const FutureSection = lazy(() => import('@/components/FutureSection'));
const Footer = lazy(() => import('@/components/Footer'));

// Loading fallback component
const SectionFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

const Index = () => {

  useEffect(() => {
    // Ultra-smooth scroll configuration
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
    
    // Set global light theme classes on body
    document.body.classList.add('bg-white', 'text-slate-900');
    
    if (window.innerWidth < 1024) {
      (document.body.style as any).webkitOverflowScrolling = 'touch';
      document.body.style.touchAction = 'pan-y pan-x';
      document.body.style.overscrollBehavior = 'contain';
    } else {
      document.body.style.touchAction = 'pan-y';
    }
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.overflowX = 'auto';
      document.body.classList.remove('bg-white', 'text-slate-900');
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-red-600/30 selection:text-red-900">
      <Navigation/>
      <ScrollIndicator />
      <main>
        <div id="hero-section">
          <HeroSection />
        </div>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="stats-section">
            <StatsSection />
          </div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div id="about-section">
            <AboutSection />
          </div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div id="timeline-section">
            <TimelineSection />
          </div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div id="awards-preview-section">
            <AwardsPreviewSection />
          </div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div id="gallery-section">
            <GallerySection />
          </div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div id="sponsors-section">
            <SponsorsSection />
          </div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div id="future-section">
            <FutureSection />
          </div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <div id="faq-section">
            <FAQSection />
          </div>
        </Suspense>
      </main>
      
      <Suspense fallback={<SectionFallback />}>
        <div id="footer">
          <Footer />
        </div>
      </Suspense>
    </div>
  );
};

export default Index;