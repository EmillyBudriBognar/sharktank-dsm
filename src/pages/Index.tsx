import { useEffect, useMemo, Suspense, lazy } from 'react';
import { Users2, Award, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ScrollIndicator from '@/components/ScrollIndicator';
import HeroSection from '@/components/HeroSection';

// Lazy load sections that are below the fold
const AboutSection = lazy(() => import('@/components/AboutSection'));
const PhaseSection = lazy(() => import('@/components/PhaseSection'));
const WorkshopSection = lazy(() => import('@/components/WorkshopSection'));
const AwardsSection = lazy(() => import('@/components/AwardsSection'));
const GallerySection = lazy(() => import('@/components/GallerySection'));
const FutureSection = lazy(() => import('@/components/FutureSection'));
const Footer = lazy(() => import('@/components/Footer'));

// Loading fallback component
const SectionFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const Index = () => {
  // Memoize phase data to prevent unnecessary re-renders
  const phase1Content = useMemo(() => ({
    phase: {
      title: "FASE",
      number: "1",
      subtitle: "A competição que definiu os",
      highlightedSubtitle: "melhores projetos",
      stats: "8 equipes • 2 vencedores • 42 horas",
      swipeHint: "Deslize para continuar"
    },
    overview: {
      tag: "COMPETIÇÃO ACIRRADA",
      title: "A Batalha Final",
      description: "8 equipes incríveis se enfrentaram em uma maratona de desenvolvimento.",
      highlightedDescription: "Criatividade, técnica e inovação",
      winnersTitle: "TOP 2 VENCEDORES"
    },
    winners: {
      champion: "🥇 CAMPEÃO",
      viceChampion: "🥈 VICE-CAMPEÃO"
    }
  }), []);

  const phase1Winners = useMemo(() => [
    { 
      position: '🥇',
      name: 'Equipe Alpha', 
      project: 'Sistema de Gestão Inteligente', 
      votes: 45,
      medal: '🥇',
      color: 'from-red-500 to-red-600',
      members: [
        { name: 'Ana Silva', role: 'Full Stack' },
        { name: 'Carlos Santos', role: 'Backend' },
        { name: 'Marina Oliveira', role: 'Frontend' },
        { name: 'Pedro Costa', role: 'DevOps' }
      ],
      differentials: [
        'Interface intuitiva com drag-and-drop',
        'Relatórios automáticos em tempo real',
        'Integração com 10+ plataformas',
        'Machine learning para previsões'
      ],
      videoUrl: '/videos/alpha-demo.mp4'
    },
    { 
      position: '🥈',
      name: 'Code Warriors', 
      project: 'Plataforma de E-Learning', 
      votes: 38,
      medal: '🥈',
      color: 'from-red-400 to-red-500',
      members: [
        { name: 'João Mendes', role: 'Full Stack' },
        { name: 'Beatriz Lima', role: 'UI/UX' },
        { name: 'Rafael Souza', role: 'Backend' }
      ],
      differentials: [
        'Aulas em tempo real com chat',
        'Sistema de gamificação',
        'Exercícios interativos',
        'Dashboard de progresso'
      ],
      videoUrl: '/videos/warriors-demo.mp4'
    }
  ], []);

  const phase1Stats = useMemo(() => [
    { icon: Users2, value: '8', label: 'Equipes' },
    { icon: Award, value: '2', label: 'Vencedores' },
    { icon: Zap, value: '42h', label: 'de Projeto' },
  ], []);

  // Dados da Fase 2
  const phase2Content = useMemo(() => ({
    phase: {
      title: "FASE",
      number: "2",
      subtitle: "A",
      highlightedSubtitle: "batalha final",
      description: "que coroou os grandes vencedores",
      stats: "6 equipes • 3 premiados • 48 horas",
      swipeHint: "Deslize para continuar"
    },
    overview: {
      tag: "BATALHA FINAL",
      title: "A Grande Final",
      description: "As 6 melhores equipes da Fase 1 se enfrentaram em uma demonstração épica de seus projetos aprimorados.",
      highlightedDescription: "Inovação, execução e impacto",
      winnersTitle: "TOP 3 VENCEDORES"
    },
    winners: {
      champion: "🥇 CAMPEÃO",
      viceChampion: "🥈 VICE-CAMPEÃO",
      thirdPlace: "🥉 TERCEIRO LUGAR"
    }
  }), []);

  const phase2Winners = useMemo(() => [
    {
      position: '🥇',
      name: 'Tech Masters',
      project: 'AI-Powered Analytics Platform',
      votes: 45,
      medal: '🥇',
      color: 'from-red-500 to-red-600',
      members: [
        { name: 'Ana Silva', role: 'Tech Lead' },
        { name: 'Carlos Santos', role: 'Frontend' },
        { name: 'Marina Costa', role: 'Backend' },
        { name: 'Ricardo Lima', role: 'Data Science' },
      ],
      differentials: [
        'Análise preditiva em tempo real',
        'Interface drag-and-drop intuitiva',
        'Integração com múltiplas fontes',
        'Relatórios automáticos com IA'
      ],
      videoUrl: '/videos/tech-masters-demo.mp4'
    },
    {
      position: '🥈',
      name: 'Digital Pioneers',
      project: 'Smart Health Monitor',
      votes: 38,
      medal: '🥈',
      color: 'from-red-400 to-red-500',
      members: [
        { name: 'Fernanda Oliveira', role: 'Product Manager' },
        { name: 'Pedro Alves', role: 'Full Stack' },
        { name: 'Juliana Rocha', role: 'UI/UX' },
        { name: 'Lucas Martins', role: 'Mobile' },
      ],
      differentials: [
        'Monitoramento contínuo 24/7',
        'Alertas inteligentes de saúde',
        'Integração com wearables',
        'Dashboard médico completo'
      ],
      videoUrl: '/videos/digital-pioneers-demo.mp4'
    },
    {
      position: '🥉',
      name: 'Future Coders',
      project: 'EcoTrack Solution',
      votes: 35,
      medal: '🥉',
      color: 'from-red-300 to-red-400',
      members: [
        { name: 'Beatriz Souza', role: 'Project Lead' },
        { name: 'Rafael Torres', role: 'Backend' },
        { name: 'Camila Nunes', role: 'Frontend' },
        { name: 'Diego Ferreira', role: 'DevOps' },
      ],
      differentials: [
        'Cálculo automático de pegada',
        'Recomendações sustentáveis',
        'Relatórios de impacto ambiental',
        'Gamificação e recompensas'
      ],
      videoUrl: '/videos/future-coders-demo.mp4'
    },
  ], []);

  const phase2Stats = useMemo(() => [
    { icon: Users2, value: '6', label: 'Equipes Finalistas' },
    { icon: Award, value: '3', label: 'Premiados' },
    { icon: Zap, value: '48h', label: 'Batalha Final' },
  ], []);

  useEffect(() => {
    // Ultra-smooth scroll configuration
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.style.overflowX = 'hidden';
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
    
    // Enhanced mobile scroll performance - PERMITIR TOUCH SCROLL
    if (window.innerWidth < 1024) {
      document.body.style.webkitOverflowScrolling = 'touch';
      document.body.style.touchAction = 'pan-y pan-x';
      // Permitir scroll touch - remover qualquer bloqueio
      document.body.style.overscrollBehavior = 'contain';
    } else {
      document.body.style.touchAction = 'pan-y';
    }
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.overflowX = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation/>
      <ScrollIndicator />
      <main>
        <div id="hero-section">
          <HeroSection />
        </div>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="about-section">
            <AboutSection />
          </div>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="phaseone-section">
            <PhaseSection
              content={phase1Content}
              winners={phase1Winners}
              stats={phase1Stats}
              sectionId="phase1"
              panelCount={4}
            />
          </div>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="workshop-section">
            <WorkshopSection />
          </div>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="phasetwo-section">
            <PhaseSection
              content={phase2Content}
              winners={phase2Winners}
              stats={phase2Stats}
              sectionId="phase2"
              panelCount={5}
            />
          </div>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="awards-section">
            <AwardsSection />
          </div>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="gallery-section">
            <GallerySection />
          </div>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="future-section">
            <FutureSection />
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