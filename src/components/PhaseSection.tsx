import { useEffect, useRef, useState, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from 'react-intersection-observer';
import { motion, Variants } from 'framer-motion';
import { Award, Users2, Sparkles, ChevronRight, Trophy, Zap } from 'lucide-react';
import WinnerCard from './WinnerCard';

// O plugin GSAP é registrado
gsap.registerPlugin(ScrollTrigger);

// --- TIPOS (Sem alterações) ---
interface TeamMember {
  name: string;
  role: string;
}

interface Winner {
  position: string;
  name: string;
  project: string;
  votes: number;
  medal: string;
  color: string;
  members: TeamMember[];
  differentials: string[];
  videoUrl: string;
}

interface Stat {
  icon: any;
  value: string;
  label: string;
}

interface PhaseContent {
  phase: {
    title: string;
    number: string;
    subtitle: string;
    highlightedSubtitle: string;
    description?: string;
    stats: string;
    swipeHint: string;
  };
  overview: {
    tag: string;
    title: string;
    description: string;
    highlightedDescription: string;
    winnersTitle: string;
  };
  winners: {
    champion: string;
    viceChampion: string;
    thirdPlace?: string;
  };
}

interface PhaseSectionProps {
  content: PhaseContent;
  winners: Winner[];
  stats: Stat[];
  sectionId: string;
  backgroundColor?: string;
  panelCount: number;
}


// --- ANIMAÇÕES (Framer Motion Variants para Mobile) ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const statsVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "backOut" },
  }),
  hover: {
    scale: 1.05,
    y: -5,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const winnerCardVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};


// --- COMPONENTE AUXILIAR PARA OS CARDS DE VENCEDORES NO MOBILE ---
// Isso corrige a violação da "Regra dos Hooks" e organiza o código.
interface MobileWinnerPanelProps {
  winner: Winner;
  index: number;
  content: PhaseContent;
}

const MobileWinnerPanel = memo(({ winner, index, content }: MobileWinnerPanelProps) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  const getWinnerTitle = () => {
    if (index === 0) return content.winners.champion;
    if (index === 1) return content.winners.viceChampion;
    return content.winners.thirdPlace;
  };

  const getBackgroundColor = () => {
    if (index === 0) return 'bg-gradient-to-br from-red-50 to-white';
    if (index === 1) return 'bg-gradient-to-br from-gray-50 to-red-50';
    return 'bg-gradient-to-br from-red-50 to-pink-50';
  };
  
  const getTextColor = () => {
    if (index === 0) return 'text-yellow-600 border-red-200';
    if (index === 1) return 'text-gray-600 border-gray-200';
    return 'text-amber-700 border-red-200';
  };

  return (
    <motion.div
      ref={ref}
      className={`min-h-screen flex items-center justify-center py-12 px-4 ${getBackgroundColor()}`}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <motion.div
        className="w-full max-w-5xl"
        variants={winnerCardVariants}
      >
        <div className="text-center mb-6">
          <span className={`text-base font-black bg-white px-4 py-1.5 rounded-full border shadow-lg ${getTextColor()}`}>
            {getWinnerTitle()}
          </span>
        </div>
        <WinnerCard
          {...winner}
          isChampion={index === 0}
          isThirdPlace={index === 2}
        />
      </motion.div>
    </motion.div>
  );
});


// --- COMPONENTE PRINCIPAL ---
const PhaseSection = ({
  content,
  winners,
  stats,
  sectionId,
  backgroundColor = "bg-white",
  panelCount
}: PhaseSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Hooks do useInView para os painéis estáticos no mobile
  const [panel1Ref, panel1InView] = useInView({ threshold: 0.2, triggerOnce: true, rootMargin: '-100px 0px' });
  const [panel2Ref, panel2InView] = useInView({ threshold: 0.1, triggerOnce: true, rootMargin: '-50px 0px' });

  // Hook para detectar a largura da tela e definir se é mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hook para as animações GSAP, executa APENAS em desktop
  useEffect(() => {
    if (isMobile) return; // Não executa nada em mobile

    // gsap.context() gerencia a criação e limpeza das animações
    const ctx = gsap.context(() => {
      const panels: HTMLElement[] = gsap.utils.toArray(".phase-panel");
      if (panels.length === 0) return;

      const scrollTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => `+=${sectionRef.current!.offsetWidth * (panels.length - 1)}`,
        },
      });
      
      panels.forEach((panel) => {
        const content = panel.querySelector('.panel-content');
        if (!content) return;
        gsap.from(content.children, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'left 80%',
            toggleActions: 'play none none reverse',
          },
        });
      });

    }, sectionRef);

    // A função de retorno do useEffect faz a limpeza automática,
    // evitando conflitos com o React.
    return () => ctx.revert();

  }, [isMobile, panelCount]); 

  // ==========================================================
  // RENDERIZAÇÃO MOBILE (Scroll Vertical Padrão)
  // ==========================================================
  if (isMobile) {
    return (
      // Esta seção terá altura automática, permitindo o scroll vertical
      <section id={sectionId} className={backgroundColor}>
        
        {/* Painel 1: Intro */}
        <motion.div
          ref={panel1Ref}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-glow to-primary-dark relative overflow-hidden py-12 px-4"
          variants={containerVariants}
          initial="hidden"
          animate={panel1InView ? "visible" : "hidden"}
        >
          <motion.div className="max-w-2xl text-center relative z-10" variants={containerVariants}>
            <motion.div variants={itemVariants}>
              <Sparkles className="mx-auto text-white mb-8" size={48} />
            </motion.div>
            <motion.h2 className="font-display text-5xl font-black mb-6 text-white tracking-tighter drop-shadow-2xl" variants={itemVariants}>
              {content.phase.title} <span className="text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.5)]">{content.phase.number}</span>
            </motion.h2>
            <motion.div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20" variants={itemVariants}>
              <p className="text-lg text-white/90 mb-4 font-light">
                {content.phase.subtitle} <span className="font-semibold text-yellow-300">{content.phase.highlightedSubtitle}</span>
                {content.phase.description && ` ${content.phase.description}`}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="text-white/80 text-sm font-medium">{content.phase.stats}</span>
                <Zap className="w-5 h-5 text-yellow-300" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Painel 2: Visão Geral */}
        <motion.div
          ref={panel2Ref}
          className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4"
          variants={containerVariants}
          initial="hidden"
          animate={panel2InView ? "visible" : "hidden"}
        >
          <motion.div className="max-w-4xl w-full space-y-8" variants={containerVariants}>
            <motion.div className="space-y-6" variants={itemVariants}>
              <div className="inline-flex items-center gap-3 bg-red-100 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-red-600 font-semibold text-sm">{content.overview.tag}</span>
              </div>
              <h3 className="font-sans text-3xl font-black text-red-600">{content.overview.title}</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {content.overview.description}
                <span className="font-semibold text-red-600"> {content.overview.highlightedDescription}</span> {content.phase.number === "1" ? "foram os critérios para escolha dos vencedores." : "foram os critérios decisivos para a vitória final."}
              </p>
              <motion.div className="grid grid-cols-3 gap-3 pt-4" variants={containerVariants}>
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={statsVariants}
                    whileHover="hover"
                    initial="hidden"
                    animate="visible"
                    className="text-center p-3 bg-white rounded-xl shadow-lg border border-red-100"
                  >
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 text-red-500`} />
                    <div className="text-xl font-black text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div className="bg-white rounded-2xl p-6 shadow-xl border border-red-100 relative overflow-hidden" variants={itemVariants}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              <h4 className="font-sans text-lg font-black text-red-600 mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                {content.overview.winnersTitle}
              </h4>
              <div className="space-y-4">
                {winners.map((winner, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <span className="text-2xl">{winner.medal}</span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-base">{winner.name}</div>
                      <div className="text-sm text-red-600 font-semibold">{winner.votes} votos</div>
                    </div>
                    <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Painéis dos Vencedores (scroll vertical) */}
        {winners.map((winner, index) => (
          <MobileWinnerPanel 
            key={winner.name} 
            winner={winner} 
            index={index} 
            content={content} 
          />
        ))}
      </section>
    );
  }

  // ==========================================================
  // RENDERIZAÇÃO DESKTOP (Scroll Horizontal com GSAP)
  // ==========================================================
  return (
    // Esta seção é travada em altura e esconde o overflow para o GSAP funcionar
    <section ref={sectionRef} id={sectionId} className="h-screen w-full overflow-hidden">
      <div className="flex" style={{ width: `${panelCount * 100}vw`, height: '100vh' }}>

        {/* Painel 1: Intro */}
        <div className="phase-panel w-screen h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-glow to-primary-dark relative">
          <div className="panel-content max-w-2xl text-center px-6 relative z-10">
            <Sparkles className="mx-auto text-white mb-8" size={48} />
            <h2 className="font-display text-5xl sm:text-6xl md:text-8xl font-black mb-6 text-white tracking-tighter drop-shadow-2xl">
              {content.phase.title} <span className="text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.5)]">{content.phase.number}</span>
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
              <p className="text-xl text-white/90 mb-4 font-light">
                {content.phase.subtitle} <span className="font-semibold text-yellow-300">{content.phase.highlightedSubtitle}</span>
                {content.phase.description && ` ${content.phase.description}`}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Trophy className="w-5 h-5 text-yellow-300" />
                <span className="text-white/80 text-sm font-medium">{content.phase.stats}</span>
                <Zap className="w-5 h-5 text-yellow-300" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 text-white/80 animate-pulse">
              <ChevronRight className="w-6 h-6" />
              <span className="text-sm font-medium bg-white/10 px-4 py-2 rounded-full">{content.phase.swipeHint}</span>
              <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Painel 2: Visão Geral */}
        <div className="phase-panel w-screen h-screen flex items-center justify-center bg-secondary">
          <div className="panel-content max-w-4xl w-full px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 bg-red-100 px-4 py-2 rounded-full mb-2">
                  <Zap className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 font-semibold text-sm">{content.overview.tag}</span>
                </div>
                <h3 className="font-sans text-4xl font-black text-red-600">{content.overview.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {content.overview.description}
                  <span className="font-semibold text-red-600"> {content.overview.highlightedDescription}</span> {content.phase.number === "1" ? "foram os critérios para escolha dos vencedores." : "foram os critérios decisivos para a vitória final."}
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-4 bg-white rounded-xl shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300">
                      <stat.icon className={`w-8 h-8 mx-auto mb-2 text-red-500`} />
                      <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-red-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <h4 className="font-sans text-xl font-black text-red-600 mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  {content.overview.winnersTitle}
                </h4>
                <div className="space-y-4">
                  {winners.map((winner, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 hover:shadow-md transition-all duration-300">
                      <span className="text-3xl">{winner.medal}</span>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-lg">{winner.name}</div>
                        <div className="text-sm text-red-600 font-semibold">{winner.votes} votos</div>
                      </div>
                      <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Painéis dos Vencedores */}
        {winners.map((winner, index) => (
          <div
            key={winner.name}
            className={`phase-panel w-screen h-screen flex items-center justify-center ${index === 0 ? 'bg-gradient-to-br from-red-50 to-white' : index === 1 ? 'bg-gradient-to-br from-gray-50 to-red-50' : 'bg-gradient-to-br from-red-50 to-pink-50'} py-8`}
          >
            <div className="panel-content max-w-5xl w-full px-6">
              <div className="text-center mb-4">
                <span className={`text-lg font-black bg-white px-4 py-1.5 rounded-full border shadow-lg ${index === 0 ? 'text-yellow-600 border-red-200' : index === 1 ? 'text-gray-600 border-gray-200' : 'text-amber-700 border-red-200'}`}>
                  {index === 0 ? content.winners.champion : index === 1 ? content.winners.viceChampion : content.winners.thirdPlace}
                </span>
              </div>
              <WinnerCard
                {...winner}
                isChampion={index === 0}
                isThirdPlace={index === 2}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhaseSection;