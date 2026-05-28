import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gift, Medal, Sparkles, Star, ChevronRight, Trophy } from 'lucide-react';
import { useActiveEdition } from '@/hooks/useActiveEdition';
import awardsImage from '@/assets/awards.jpg';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const iconMap: Record<string, any> = {
  Gift, Medal, Sparkles, Star
};

const AwardsSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const { data } = useActiveEdition();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const fallbackPrizes = [
    {
      icon: Medal,
      title: '1° Lugar',
      prize: 'R$ 3.000',
      extras: ['Certificado Premium', 'Mentoria Exclusiva', 'Kit Tech Premium'],
      emoji: '🥇',
      image: '/api/placeholder/300/300',
    },
    {
      icon: Star,
      title: '2° Lugar',
      prize: 'R$ 1.500',
      extras: ['Certificado Gold', 'Workshop Gratuito', 'Kit Tech'],
      emoji: '🥈',
      image: '/api/placeholder/300/300',
    },
    {
      icon: Sparkles,
      title: '3° Lugar',
      prize: 'R$ 800',
      extras: ['Certificado Silver', 'Acesso a Comunidade', 'Kit Starter'],
      emoji: '🥉',
      image: '/api/placeholder/300/300',
    },
    {
      icon: Gift,
      title: 'Participantes',
      prize: 'Certificado',
      extras: ['Networking', 'Experiência Única', 'Portfolio Boost'],
      emoji: '🎁',
      image: '/api/placeholder/300/300',
    },
  ];

  const prizes = data?.awards?.length > 0 ? data.awards.map((a: any) => ({
    icon: iconMap[a.icon] || Medal,
    title: a.title,
    prize: a.prize,
    extras: a.extras || [],
    emoji: a.emoji,
    image: a.image_url || '/api/placeholder/300/300',
  })) : fallbackPrizes;

  useGSAP(() => {
    if (isMobile) {
      // Mobile Animations (Vertical ScrollTrigger)
      const mobileCards = gsap.utils.toArray('.mobile-prize-card');
      mobileCards.forEach((card: any, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 50 },
          { 
            opacity: 1, y: 0, 
            duration: 0.8, 
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        );
      });
      return;
    }

    // Desktop Horizontal Scroll GSAP
    if (!horizontalRef.current || !containerRef.current) return;
    const slides = gsap.utils.toArray<HTMLElement>('.award-slide');
    if (slides.length === 0) return;

    const scrollTween = gsap.to(slides, {
      xPercent: -100 * (slides.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: {
          snapTo: 1 / (slides.length - 1),
          duration: { min: 0.2, max: 0.5 },
          delay: 0,
        },
        end: () => `+=${horizontalRef.current!.offsetWidth}`,
      },
    });

    // 3D Effects for Intro and Outro
    slides.forEach((slide, i) => {
      if (i === 0 || i === slides.length - 1) {
        const slideContent = slide.querySelector('.slide-content');
        if (slideContent) {
          gsap.fromTo(slideContent, {
            opacity: 0,
            rotationY: i === 0 ? -30 : 30,
            scale: 0.8,
          }, {
            opacity: 1,
            rotationY: 0,
            scale: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: 'left 70%',
              end: 'left 30%',
              scrub: 1,
            }
          });
          
          gsap.to(slideContent, {
            opacity: 0,
            rotationY: i === 0 ? 30 : -30,
            scale: 0.8,
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: 'right 70%',
              end: 'right 30%',
              scrub: 1,
            }
          });
        }
      } else {
        // Normal Prize cards 3D effect
        const cardBox = slide.querySelector('.prize-box');
        if (cardBox) {
          gsap.fromTo(cardBox, {
            rotationY: 45,
            opacity: 0,
            scale: 0.8,
          }, {
            rotationY: 0,
            opacity: 1,
            scale: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: slide,
              containerAnimation: scrollTween,
              start: 'left 75%',
              end: 'center center',
              scrub: 1,
            }
          });
        }
      }
    });

  }, { scope: containerRef, dependencies: [isMobile] });

  // Mobile Render
  if (isMobile) {
    return (
      <section id="awards" ref={containerRef} className="py-24 px-4 bg-white border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-red-50 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center mb-16 relative z-10">
          <Trophy className="w-16 h-16 text-red-600 mx-auto mb-6 drop-shadow-sm" />
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">
            {content.title} <span className="text-red-600 relative">
              {content.highlightedTitle}
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-red-600/20 rounded-full"></span>
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            {content.description}
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          {prizes.map((prize, index) => (
            <div key={index} className="mobile-prize-card bg-white border border-gray-200 p-6 rounded-3xl relative overflow-hidden shadow-sm">
              {index === 0 && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
              )}
              <div className="text-center">
                <div className="text-5xl mb-4 drop-shadow-sm">{prize.emoji}</div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ${index === 0 ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'}`}>
                  <prize.icon className={index === 0 ? 'text-red-600' : 'text-slate-500'} size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{prize.title}</h3>
                <div className="text-3xl font-black text-red-600 mb-6 drop-shadow-sm">{prize.prize}</div>
                
                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  {prize.extras.map((extra, idx) => (
                    <div key={idx} className="flex items-center justify-center gap-2 text-sm text-slate-600 font-medium">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      {extra}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center relative z-10">
          <div className="text-6xl mb-6 drop-shadow-sm">🎊</div>
          <h3 className="text-2xl font-black text-slate-900 mb-4">{content.investmentTitle}</h3>
          <p className="text-5xl font-black text-red-600 mb-6 drop-shadow-sm">{content.investmentAmount}</p>
          <p className="text-slate-600 mb-8 font-medium">{content.investmentDescription}</p>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-slate-700 font-bold leading-relaxed">
              {content.investmentFeatures.join(' • ')}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Desktop Render
  return (
    <section id="awards" ref={containerRef} className="h-screen w-full bg-white overflow-hidden relative border-t border-gray-100">
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-red-50 rounded-full blur-[120px] pointer-events-none" />
      
      <div ref={horizontalRef} className="flex h-full w-fit">
        
        {/* Intro Slide */}
        <div className="award-slide w-screen h-screen flex items-center justify-center px-10 relative perspective-1000">
          <div className="slide-content max-w-4xl text-center transform-style-3d">
            <Trophy className="w-20 h-20 text-red-600 mx-auto mb-8 drop-shadow-sm" />
            <h2 className="text-6xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tighter">
              {content.title} <span className="text-red-600 relative">
                {content.highlightedTitle}
                <span className="absolute -bottom-2 left-0 w-full h-[6px] bg-red-600/20 rounded-full"></span>
              </span>
            </h2>
            <p className="text-2xl text-slate-600 font-medium mb-12">
              {content.description}
            </p>
            <div className="relative h-[350px] w-full max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <img src={awardsImage} alt="Prêmios" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 text-red-600 font-bold tracking-widest animate-pulse">
              <ChevronRight />
              <span>{content.swipeHint}</span>
              <ChevronRight />
            </div>
          </div>
        </div>

        {/* Prize Slides */}
        {prizes.map((prize, index) => (
          <div key={index} className="award-slide w-screen h-screen flex items-center justify-center px-10 perspective-1000">
            <div className="prize-box max-w-5xl w-full grid grid-cols-2 gap-12 items-center bg-white border border-gray-200 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden transform-style-3d">
              {index === 0 && (
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.5)]" />
              )}
              
              <div className="text-center lg:text-left">
                <div className="text-7xl mb-6 drop-shadow-sm">{prize.emoji}</div>
                <h3 className="text-4xl font-black text-slate-900 mb-4">{prize.title}</h3>
                <div className="text-5xl font-black text-red-600 mb-8 drop-shadow-sm">{prize.prize}</div>
                
                <div className="space-y-4">
                  {prize.extras.map((extra, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-lg text-slate-600 font-medium">
                      <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.4)]" />
                      {extra}
                    </div>
                  ))}
                </div>

                {index === 0 && (
                  <div className="mt-8 inline-block bg-red-600 text-white px-6 py-2 rounded-full font-bold text-sm tracking-widest shadow-lg shadow-red-600/30">
                    {content.maxPrizeLabel}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                  <img src={prize.image} alt={prize.title} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Final Slide */}
        <div className="award-slide w-screen h-screen flex items-center justify-center px-10 relative perspective-1000">
          <div className="slide-content max-w-4xl text-center transform-style-3d">
            <div className="text-8xl mb-10 drop-shadow-md">🎊</div>
            <h3 className="text-3xl font-bold text-slate-500 mb-6 tracking-widest">{content.investmentTitle}</h3>
            <p className="text-7xl sm:text-9xl font-black text-red-600 mb-10 drop-shadow-sm">
              {content.investmentAmount}
            </p>
            <p className="text-2xl text-slate-700 font-medium mb-12">
              {content.investmentDescription}
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 shadow-sm">
              <p className="text-xl text-slate-900 font-bold">
                {content.investmentFeatures.join(' • ')}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AwardsSection;