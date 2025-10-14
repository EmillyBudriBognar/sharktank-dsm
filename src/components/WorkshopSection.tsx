import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import workshopImage from '@/assets/workshop.jpg';
import { GraduationCap, Presentation, Brain, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

// Registro dos plugins do GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const WorkshopSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Estado para controle do swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Textos em array
  const content = {
    intro: {
      title: "VENCEDORES VIRAM",
      highlightedTitle: "PROFESSORES",
      description: "Os campeões não apenas venceram — eles compartilharam conhecimento! Prepararam workshops intensivos para ensinar suas técnicas."
    },
    image: {
      title: "WORKSHOP EM AÇÃO",
      description: "Conhecimento sendo transmitido"
    },
    topics: {
      title: "CONTEÚDO MINISTRADO"
    },
    judges: {
      title: "E VIRARAM JURADOS!",
      description: "Após transmitirem seu conhecimento, os vencedores assumiram o papel de jurados na Fase 2, avaliando os projetos com olhar técnico e estratégico de quem já conquistou a vitória."
    }
  };

  const topics = [
    { icon: Brain, title: 'Arquitetura de Software', description: 'Padrões e melhores práticas para construir sistemas escaláveis e robustos' },
    { icon: BookOpen, title: 'Clean Code', description: 'Técnicas avançadas para código limpo, legível e fácil de manter' },
    { icon: Presentation, title: 'Git & Colaboração', description: 'Workflows profissionais e gestão eficiente de código em equipe' },
    { icon: GraduationCap, title: 'Debugging Avançado', description: 'Estratégias para identificar e resolver problemas complexos rapidamente' },
  ];

  // useInView hooks para animações no mobile
  const [introRef, introInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [imageRef, imageInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [topicsRef, topicsInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [judgesRef, judgesInView] = useInView({ threshold: 0.3, triggerOnce: true });

  // Variants para animações mobile
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const carouselSlideVariants: Variants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      x: -100,
      position: 'absolute',
      transition: { duration: 0.5, ease: "easeIn" }
    }
  };

  const topicCardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" }
    }),
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const buttonVariants: Variants = {
    hover: {
      scale: 1.1,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const indicatorVariants: Variants = {
    inactive: {
      scale: 1,
      backgroundColor: 'rgb(229, 231, 235)'
    },
    active: {
      scale: 1.25,
      backgroundColor: 'rgb(239, 68, 68)',
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: {
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
      transition: { duration: 0.2 }
    }
  };

  // Detecta se é mobile - Corrigido
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Funções de navegação
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % topics.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + topics.length) % topics.length);
  };

  // Handlers para swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Carrossel automático no mobile
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % topics.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isMobile, topics.length]);

  // Animação GSAP de Scroll (apenas desktop) - CORRIGIDA
  useEffect(() => {
    if (isMobile || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Configuração global do GSAP para melhor performance
      gsap.config({
        nullTargetWarn: false,
        units: { left: '%', top: '%', rotation: 'rad' }
      });

      const panels = gsap.utils.toArray('.workshop-panel') as HTMLElement[];
      
      if (panels.length === 0) return;

      // Timeline principal com scroll trigger
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${window.innerHeight * (panels.length - 0.5)}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.2, max: 0.6 },
            ease: 'power2.inOut'
          },
          invalidateOnRefresh: true,
          markers: false // Defina como true para debug
        }
      });

      // Animação de transição entre painéis
      panels.forEach((panel, index) => {
        if (index === 0) return;
        
        const previousPanel = panels[index - 1];

        // Fade out do painel anterior
        masterTimeline.to(previousPanel, {
          opacity: 0,
          y: -50,
          scale: 0.95,
          duration: 1,
          ease: 'power2.inOut'
        }, index - 1);

        // Fade in do painel atual
        masterTimeline.fromTo(panel, 
          { 
            opacity: 0, 
            y: 100, 
            scale: 0.9 
          }, 
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1, 
            ease: 'power2.out' 
          }, 
          index - 1
        );
      });

      // Animações individuais para elementos dentro de cada painel
      panels.forEach((panel, index) => {
        // Anima elementos com a classe animate-in
        gsap.fromTo(panel.querySelectorAll('.animate-in'),
          { 
            y: 30, 
            opacity: 0 
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true
            }
          }
        );

        // Anima cards de tópicos com stagger
        if (panel.querySelector('.topic-card')) {
          gsap.fromTo(panel.querySelectorAll('.topic-card'),
            { 
              y: 50, 
              opacity: 0,
              scale: 0.9
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.2,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: panel,
                start: 'top 70%',
                end: 'bottom 30%',
                toggleActions: 'play none none reverse',
                invalidateOnRefresh: true
              }
            }
          );
        }
      });

      // Efeito parallax para a imagem
      const imagePanel = panels[1]; // Painel da imagem
      if (imagePanel) {
        gsap.to(imagePanel.querySelector('img'), {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: imagePanel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // **CORREÇÃO:** Variável com letra maiúscula para o ícone do carrossel mobile
  const IconComponent = topics[currentSlide].icon;

  return (
    <section id="workshop" ref={sectionRef} className="relative bg-background overflow-hidden">
      {isMobile ? (
        // Renderização Mobile com Framer Motion
        <div className="workshop-mobile-container">
          {/* Painel 1: Intro */}
          <motion.div 
            ref={introRef}
            className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white px-6 py-20"
            variants={containerVariants}
            initial="hidden"
            animate={introInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="max-w-4xl text-center"
              variants={containerVariants}
            >
              <motion.h2 
                className="font-display text-4xl md:text-8xl font-black mb-8"
                variants={itemVariants}
              >
                {content.intro.title} <span className="text-primary">{content.intro.highlightedTitle}</span>
              </motion.h2>
              <motion.p 
                className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto"
                variants={itemVariants}
              >
                {content.intro.description}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Painel 2: Imagem */}
          <motion.div 
            ref={imageRef}
            className="min-h-screen flex items-center justify-center bg-white px-6 py-20"
            variants={containerVariants}
            initial="hidden"
            animate={imageInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="max-w-6xl w-full"
              variants={itemVariants}
            >
              <div className="relative h-[400px] md:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
                <img src={workshopImage} alt="Workshop" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-6 md:p-12">
                  <div className="text-background">
                    <h3 className="font-display text-3xl md:text-5xl font-black mb-4">{content.image.title}</h3>
                    <p className="text-lg md:text-2xl">{content.image.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Painel 3: Tópicos */}
          <motion.div 
            ref={topicsRef}
            className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-red-50 px-4 py-16"
            variants={containerVariants}
            initial="hidden"
            animate={topicsInView ? "visible" : "hidden"}
          >
            <div className="w-full max-w-6xl">
              <motion.h3 
                className="font-display text-3xl md:text-5xl font-black text-center mb-8 md:mb-12 text-foreground"
                variants={itemVariants}
              >
                {content.topics.title}
              </motion.h3>

              <motion.div 
                className="relative w-full"
                variants={itemVariants}
              >
                {/* Container do carrossel com swipe gesture */}
                <div 
                  className="relative overflow-hidden px-2 h-[320px] flex items-center"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={currentSlide}
                      variants={carouselSlideVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="w-full flex-shrink-0 px-2"
                    >
                      <motion.div 
                        className="bg-card border border-border rounded-2xl p-6 shadow-lg h-[280px] flex flex-col justify-center"
                        variants={topicCardVariants}
                        custom={currentSlide}
                        whileHover="hover"
                      >
                        <div className="flex flex-col items-center text-center gap-4">
                          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center">
                            <IconComponent className="text-primary-foreground" size={28} />
                          </div>
                          <div className="space-y-3">
                            <h4 className="font-display text-xl font-bold text-foreground leading-tight">
                              {topics[currentSlide].title}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed text-base px-2">
                              {topics[currentSlide].description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Botões de navegação */}
                <motion.button 
                  onClick={prevSlide} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border z-10"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                
                <motion.button 
                  onClick={nextSlide} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border z-10"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>

                {/* Indicadores */}
                <div className="flex justify-center gap-3 mt-8">
                  {topics.map((_, index) => (
                    <motion.button 
                      key={index} 
                      onClick={() => setCurrentSlide(index)}
                      className="w-3 h-3 rounded-full"
                      variants={indicatorVariants}
                      initial="inactive"
                      animate={index === currentSlide ? "active" : "inactive"}
                      whileHover="hover"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Painel 4: Jurados */}
          <motion.div 
            ref={judgesRef}
            className="min-h-screen flex items-center justify-center bg-white px-6 py-20"
            variants={containerVariants}
            initial="hidden"
            animate={judgesInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="max-w-4xl text-center"
              variants={containerVariants}
            >
              <motion.div 
                className="mb-8 md:mb-12"
                variants={itemVariants}
              >
                <div className="text-6xl md:text-8xl mb-6">⚖️</div>
                <h3 className="font-display text-4xl md:text-6xl font-black mb-6 text-primary">
                  {content.judges.title}
                </h3>
              </motion.div>
              <motion.p 
                className="text-lg md:text-2xl text-foreground leading-relaxed"
                variants={itemVariants}
              >
                {content.judges.description}
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        // Renderização Desktop com GSAP
        <div
          ref={containerRef}
          className="workshop-container relative w-full h-screen"
          style={{ perspective: '1000px' }}
        >
          {/* Painel 1: Intro */}
          <div
            className="workshop-panel absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background to-secondary px-6 py-20"
          >
            <div className="max-w-4xl text-center">
              <h2 className="font-display text-4xl md:text-8xl font-black mb-8 animate-in">
                {content.intro.title} <span className="text-primary">{content.intro.highlightedTitle}</span>
              </h2>
              <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-in">
                {content.intro.description}
              </p>
            </div>
          </div>

          {/* Painel 2: Imagem */}
          <div
            className="workshop-panel absolute inset-0 flex items-center justify-center bg-background px-6 py-20"
          >
            <div className="max-w-6xl w-full">
              <div className="relative h-[400px] md:h-[600px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg animate-in">
                <img src={workshopImage} alt="Workshop" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-6 md:p-12">
                  <div className="text-background">
                    <h3 className="font-display text-3xl md:text-5xl font-black mb-4 animate-in">{content.image.title}</h3>
                    <p className="text-lg md:text-2xl animate-in">{content.image.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Painel 3: Tópicos */}
          <div
            className="workshop-panel absolute inset-0 flex items-center justify-center bg-gradient-to-b from-secondary to-background px-4 py-16"
          >
            <div className="w-full max-w-6xl">
              <h3 className="font-display text-3xl md:text-5xl font-black text-center mb-8 md:mb-12 text-foreground animate-in">
                {content.topics.title}
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {topics.map((topic, index) => {
                  const Icon = topic.icon;
                  return (
                    <div 
                      key={index} 
                      className="topic-card bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-500 animate-in hover:-translate-y-2"
                    >
                      <div className="flex flex-col items-center text-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center">
                          <Icon className="text-primary-foreground" size={32} />
                        </div>
                        <div>
                          <h4 className="font-display text-2xl font-bold mb-3 text-foreground">{topic.title}</h4>
                          <p className="text-muted-foreground leading-relaxed">{topic.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Painel 4: Jurados */}
          <div
            className="workshop-panel absolute inset-0 flex items-center justify-center bg-background px-6 py-20"
          >
            <div className="max-w-4xl text-center">
              <div className="mb-8 md:mb-12 animate-in">
                <div className="text-6xl md:text-8xl mb-6">⚖️</div>
                <h3 className="font-display text-4xl md:text-6xl font-black mb-6 text-primary">
                  {content.judges.title}
                </h3>
              </div>
              <p className="text-lg md:text-2xl text-foreground leading-relaxed animate-in">
                {content.judges.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkshopSection;