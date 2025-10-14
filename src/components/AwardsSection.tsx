import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useInView } from 'react-intersection-observer';
import { motion, Variants } from 'framer-motion';
import awardsImage from '@/assets/awards.jpg';
import { Gift, Medal, Sparkles, Star, ChevronRight, Trophy, ChevronLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const AwardsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Estados para controle do swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Textos em array
  const content = {
    title: "PRÊMIOS",
    highlightedTitle: "ÉPICOS",
    description: "Os melhores foram recompensados com prêmios incríveis!",
    categoriesTitle: "CATEGORIAS DE PRÊMIOS",
    investmentTitle: "INVESTIMENTO TOTAL",
    investmentAmount: "R$ 5.300+",
    investmentDescription: "Mais do que prêmios, uma experiência transformadora que impulsiona carreiras!",
    investmentFeatures: [
      "💫 Valor que inspira",
      "🚀 Oportunidades que transformam", 
      "🌟 Reconhecimento que motiva"
    ],
    swipeHint: "Deslize para ver os prêmios",
    maxPrizeLabel: "🏆 PRÊMIO MÁXIMO"
  };

  const prizes = [
    {
      icon: Medal,
      title: '1° Lugar',
      prize: 'R$ 3.000',
      extras: ['Certificado Premium', 'Mentoria Exclusiva', 'Kit Tech Premium'],
      emoji: '🥇',
      image: '/api/placeholder/300/300',
      color: 'from-yellow-400 to-amber-500'
    },
    {
      icon: Star,
      title: '2° Lugar',
      prize: 'R$ 1.500',
      extras: ['Certificado Gold', 'Workshop Gratuito', 'Kit Tech'],
      emoji: '🥈',
      image: '/api/placeholder/300/300',
      color: 'from-gray-300 to-gray-400'
    },
    {
      icon: Sparkles,
      title: '3° Lugar',
      prize: 'R$ 800',
      extras: ['Certificado Silver', 'Acesso a Comunidade', 'Kit Starter'],
      emoji: '🥉',
      image: '/api/placeholder/300/300',
      color: 'from-amber-600 to-orange-500'
    },
    {
      icon: Gift,
      title: 'Participantes',
      prize: 'Certificado',
      extras: ['Networking', 'Experiência Única', 'Portfolio Boost'],
      emoji: '🎁',
      image: '/api/placeholder/300/300',
      color: 'from-purple-400 to-pink-500'
    },
  ];

  // useInView hooks para animações no mobile
  const [introRef, introInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const [carouselRefInView, carouselInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [totalRef, totalInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  // Detecta se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Funções de navegação do carrossel
  const nextCarouselSlide = () => {
    setCurrentCarouselSlide((prev) => (prev + 1) % prizes.length);
  };

  const prevCarouselSlide = () => {
    setCurrentCarouselSlide((prev) => (prev - 1 + prizes.length) % prizes.length);
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
      nextCarouselSlide();
    } else if (distance < -minSwipeDistance) {
      prevCarouselSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Carrossel automático no mobile
  useEffect(() => {
    if (!isMobile || currentCarouselSlide !== 0) return;
    
    const interval = setInterval(() => {
      setCurrentCarouselSlide((prev) => (prev + 1) % prizes.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isMobile, currentCarouselSlide]);

  // Animação de transição do carrossel mobile (simples CSS)
  useEffect(() => {
    if (!isMobile || !carouselRef.current) return;

    carouselRef.current.style.transform = `translateX(-${currentCarouselSlide * 100}%)`;
  }, [currentCarouselSlide, isMobile]);

  // Variants para animações mobile
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  const trophyVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Animação GSAP para desktop - Corrigido
  useEffect(() => {
    if (isMobile) return;

    const ctx = gsap.context(() => {
      const horizontal = horizontalRef.current;
      const trigger = triggerRef.current;

      if (!horizontal || !trigger) return;

      const slides = gsap.utils.toArray<HTMLElement>('.award-slide');
      
      if (slides.length === 0) return;

      const scrollTween = gsap.to(slides, {
        xPercent: -100 * (slides.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: trigger,
          pin: true,
          scrub: 0.8,
          snap: {
            snapTo: 1 / (slides.length - 1),
            duration: { min: 0.15, max: 0.4 },
            delay: 0.05,
            ease: 'power1.inOut'
          },
          end: () => `+=${horizontal.offsetWidth * 0.95}`,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress * (slides.length - 1);
            setActiveSlide(Math.round(progress));
          },
          invalidateOnRefresh: true
        },
      });

      // Efeitos 3D criativos e dinâmicos - APENAS para a capa (slide 0) e último slide
      slides.forEach((slide, i) => {
        // Apenas aplicar animações no slide 0 (capa) e último slide (investimentos totais)
        if (i !== 0 && i !== slides.length - 1) return;
        
        const content = slide.querySelector('.slide-content');
        const prizeCard = slide.querySelector('.prize-card');
        const prizeImage = slide.querySelector('.prize-image-container');
        
        if (content) {
          // Entrada: Efeito 3D suave
          gsap.fromTo(content, {
            opacity: 0,
            rotationY: i % 2 === 0 ? -25 : 25,
            z: -100,
            scale: 0.85,
          }, {
            opacity: 1,
            rotationY: 0,
            z: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: 'left 75%',
              end: 'left 35%',
              scrub: 1,
            }
          });

          // Saída: Efeito 3D suave
          gsap.to(content, {
            opacity: 0,
            rotationY: i % 2 === 0 ? 20 : -20,
            z: -80,
            scale: 0.9,
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: 'right 65%',
              end: 'right 25%',
              scrub: 1,
            }
          });
        }

        // Animação específica para o card do prêmio (apenas para capa)
        if (prizeCard && i === 0) {
          gsap.fromTo(prizeCard, {
            rotationY: 90,
            opacity: 0,
            scale: 0.7,
          }, {
            rotationY: 0,
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: 'left 70%',
              end: 'left 30%',
              scrub: 1.2,
            }
          });
        }

        // Animação para a imagem do prêmio - efeito de levitação (apenas para capa)
        if (prizeImage && i === 0) {
          gsap.fromTo(prizeImage, {
            y: 60,
            rotationZ: i % 2 === 0 ? -15 : 15,
            scale: 0.7,
            opacity: 0,
          }, {
            y: 0,
            rotationZ: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: 'left 65%',
              end: 'left 25%',
              scrub: 1.2,
            }
          });

          // Efeito de flutuação contínua (apenas para capa)
          gsap.to(prizeImage, {
            y: -15,
            duration: 2.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        }
      });

      // Configurar os slides dos prêmios (1, 2, 3, 4) para estarem sempre visíveis
      slides.forEach((slide, i) => {
        // Pular capa (0) e último slide (slides.length - 1)
        if (i === 0 || i === slides.length - 1) return;
        
        const content = slide.querySelector('.slide-content');
        if (content) {
          // Garantir que o conteúdo esteja sempre visível
          gsap.set(content, {
            opacity: 1,
            rotationX: 0,
            rotationY: 0,
            z: 0,
            scale: 1
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Renderização Mobile
  if (isMobile) {
    return (
      <section id="awards" className="snap-section relative overflow-hidden bg-gradient-to-b from-red-50 to-white py-20">
        <div className="container mx-auto px-4">
          {/* Intro Section */}
          <motion.div 
            ref={introRef}
            className="text-center mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={introInView ? "visible" : "hidden"}
          >
            <motion.div variants={trophyVariants} animate={introInView ? ["visible", "pulse"] : "hidden"}>
              <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <h2 className="font-display text-4xl md:text-5xl font-black mb-4">
                {content.title} <span className="text-primary">{content.highlightedTitle}</span>
              </h2>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <p className="text-lg text-muted-foreground mb-8">
                {content.description}
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <div className="relative h-[200px] rounded-2xl overflow-hidden shadow-lg mb-6">
                <img 
                  src={awardsImage} 
                  alt="Prêmios" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              </div>
            </motion.div>
          </motion.div>

          {/* Carrossel de Prêmios */}
          <motion.div 
            ref={carouselRefInView}
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            animate={carouselInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <h3 className="font-display text-2xl font-black text-center mb-8">
                {content.categoriesTitle}
              </h3>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative w-full">
                <div 
                  className="overflow-hidden px-2"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div 
                    ref={carouselRef} 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentCarouselSlide * 100}%)` }}
                  >
                    {prizes.map((prize, index) => (
                      <div key={index} className="w-full flex-shrink-0 px-2">
                        <motion.div 
                          className="bg-card border border-border rounded-2xl p-6 shadow-lg h-[420px] flex flex-col"
                          variants={cardVariants}
                          custom={index}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          <div className="flex-1 flex flex-col items-center text-center mb-6">
                            <div className="text-5xl mb-4">{prize.emoji}</div>
                            
                            <motion.div 
                              className={`
                                w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3
                                ${index === 0 ? 'bg-gradient-shark' : 'bg-secondary'}
                              `}
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <prize.icon 
                                className={index === 0 ? 'text-primary-foreground' : 'text-primary'} 
                                size={28} 
                              />
                            </motion.div>

                            <h3 className="font-display text-xl font-black mb-3 text-foreground">
                              {prize.title}
                            </h3>

                            <div className="mb-4">
                              <span className="text-3xl font-black text-primary">{prize.prize}</span>
                            </div>

                            <div className="space-y-2 flex-1">
                              {prize.extras.map((extra, idx) => (
                                <motion.div 
                                  key={idx} 
                                  className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                >
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                  <span>{extra}</span>
                                </motion.div>
                              ))}
                            </div>

                            {index === 0 && (
                              <motion.div 
                                className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-display font-bold text-xs"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                              >
                                {content.maxPrizeLabel}
                              </motion.div>
                            )}
                          </div>

                          <div className="flex justify-center">
                            <motion.div 
                              className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img 
                                src={prize.image} 
                                alt={`Prêmio ${prize.title}`}
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões de navegação */}
                <motion.button 
                  onClick={prevCarouselSlide} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border z-10"
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                
                <motion.button 
                  onClick={nextCarouselSlide} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-border z-10"
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>

                {/* Indicadores */}
                <div className="flex justify-center gap-3 mt-6">
                  {prizes.map((_, index) => (
                    <motion.button 
                      key={index} 
                      onClick={() => setCurrentCarouselSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentCarouselSlide 
                          ? 'bg-primary scale-125' 
                          : 'bg-border hover:bg-primary/50'
                      }`}
                      whileTap={{ scale: 0.8 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Total Investido */}
          <motion.div 
            ref={totalRef}
            variants={containerVariants}
            initial="hidden"
            animate={totalInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="bg-white rounded-2xl p-8 text-center shadow-lg"
              variants={itemVariants}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <div className="text-6xl mb-6">🎊</div>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <h3 className="font-display text-2xl font-black mb-4 text-foreground">
                  {content.investmentTitle}
                </h3>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <p className="text-4xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
                  {content.investmentAmount}
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <p className="text-lg text-muted-foreground mb-6">
                  {content.investmentDescription}
                </p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 backdrop-blur-sm">
                  <p className="text-base text-foreground">
                    {content.investmentFeatures.join(' • ')}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  // Renderização Desktop (original com GSAP)
  return (
    <section id="awards" ref={sectionRef} className="snap-section relative overflow-hidden bg-gradient-to-b from-secondary to-background">
      <div ref={triggerRef} className="relative">
        <div ref={horizontalRef} className="flex w-fit">
          {/* Intro Slide - Elementos menores (COM ANIMAÇÃO) */}
          <div className="award-slide w-screen h-screen flex items-center justify-center px-6">
            <div className="slide-content max-w-3xl text-center">
              <div className="mb-6">
                <Trophy className="w-16 h-16 text-primary mx-auto mb-3" />
                <h2 className="font-display text-5xl md:text-7xl font-black mb-4">
                  {content.title} <span className="text-primary">{content.highlightedTitle}</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  {content.description}
                </p>
              </div>
              
              <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg mb-6">
                <img 
                  src={awardsImage} 
                  alt="Prêmios" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
              </div>
              
              <div className="flex items-center justify-center gap-3 text-foreground">
                <ChevronRight className="animate-bounce" />
                <span className="text-base">{content.swipeHint}</span>
                <ChevronRight className="animate-bounce" />
              </div>
            </div>
          </div>

          {/* Prize Slides - SEM ANIMAÇÃO DE FADE */}
          {prizes.map((prize, index) => (
            <div 
              key={index}
              className="award-slide w-screen h-screen flex items-center justify-center px-6"
            >
              <div className="slide-content max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Card do Prêmio */}
                <div className={`
                  prize-card relative p-1 rounded-3xl
                  ${index === 0 ? 'bg-gradient-shark shadow-glow' : 'bg-border'}
                `}>
                  <div className="bg-background rounded-3xl p-8 text-center">
                    <div className="text-5xl mb-3">{prize.emoji}</div>
                    
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3
                      ${index === 0 ? 'bg-gradient-shark' : 'bg-secondary'}
                    `}>
                      <prize.icon 
                        className={index === 0 ? 'text-primary-foreground' : 'text-primary'} 
                        size={28} 
                      />
                    </div>

                    {/* Título menor */}
                    <h3 className="font-display text-xl font-black mb-3 text-foreground">
                      {prize.title}
                    </h3>

                    <div className="mb-4">
                      <span className="text-4xl font-black text-primary">{prize.prize}</span>
                    </div>

                    <div className="space-y-2">
                      {prize.extras.map((extra, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span>{extra}</span>
                        </div>
                      ))}
                    </div>

                    {index === 0 && (
                      <div className="mt-4 inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-display font-bold text-xs">
                        {content.maxPrizeLabel}
                      </div>
                    )}
                  </div>
                </div>

                {/* Imagem do Prêmio */}
                <div className="prize-image-container flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src={prize.image} 
                        alt={`Prêmio ${prize.title}`}
                        className="w-full h-full object-cover prize-image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Final Slide - INVESTIMENTOS TOTAIS (COM ANIMAÇÃO) */}
          <div className="award-slide w-screen h-screen flex items-center justify-center bg-white px-6">
            <div className="slide-content max-w-4xl text-center">
              <div className="text-8xl mb-8 animate-pulse">🎊</div>
              <h3 className="font-display text-4xl font-black mb-6 text-foreground">
                {content.investmentTitle}
              </h3>
              <p className="text-7xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-8">
                {content.investmentAmount}
              </p>
              <p className="text-xl text-muted-foreground mb-8">
                {content.investmentDescription}
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 backdrop-blur-sm">
                <p className="text-lg text-foreground">
                  {content.investmentFeatures.join(' • ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;