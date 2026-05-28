import { memo, useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Clock } from 'lucide-react';
import { GiSharkFin } from 'react-icons/gi';
import { useGlobalContent } from '@/hooks/useActiveEdition';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HeroSection = () => {
  const { data } = useGlobalContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  const fallbackContent = {
    title: 'SHARK TANK DSM',
    subtitle: 'ONDE TUBARÕES DA PROGRAMAÇÃO SE ENCONTRAM COM A TECNOLOGIA DO FUTURO',
    cta: 'INSCREVA-SE PARA A PRÓXIMA EDIÇÃO',
    eventDate: '2026-11-20T08:00:00'
  };

  const content = data ? {
    title: data.hero_title || fallbackContent.title,
    subtitle: data.hero_subtitle || fallbackContent.subtitle,
    cta: data.call_to_action || fallbackContent.cta,
    eventDate: fallbackContent.eventDate
  } : fallbackContent;

  // Countdown logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(content.eventDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [content.eventDate]);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Fade in background grid
    tl.to('.hero-grid', { opacity: 0.15, duration: 2, ease: 'power2.out' }, 0);
    tl.to('.hero-glow', { opacity: 0.6, scale: 1.1, duration: 2, ease: 'power2.out' }, 0);

    // Staggered reveal for shark fin and top decor
    tl.fromTo('.hero-decor', 
      { opacity: 0, scale: 0.5, y: -30 },
      { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' },
      0.2
    );

    // Title reveal (3D staggered)
    if (titleRef.current) {
      const words = titleRef.current.querySelectorAll('.word');
      tl.fromTo(words, 
        { opacity: 0, y: 120, rotateX: -90, scale: 0.8 },
        { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: 'back.out(1.4)' },
        0.3
      );
    }

    // Subtitle reveal
    tl.fromTo('.hero-subtitle',
      { opacity: 0, y: 40, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' },
      0.8
    );

    // Countdown reveal
    tl.fromTo('.hero-countdown',
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)' },
      1.0
    );

    // CTA Button Reveal
    tl.fromTo('.hero-cta-wrapper',
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' },
      1.2
    );

    // Subtle continuous pulse on CTA wrapper to draw attention
    gsap.to('.hero-cta-pulse', {
      scale: 1.05,
      opacity: 0.8,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    // Continuous floating animation for the shark fin
    gsap.to('.shark-icon', {
      y: -10,
      rotation: 5,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    // Pin the hero section to let the next section scroll over it
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      pin: true,
      pinSpacing: false, // Allows StatsSection to overlay
    });

    // Parallax background effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          x,
          y,
          duration: 1,
          ease: 'power2.out',
        });
      }
    };

    // Magnetic Button Effect for CTA
    const handleCTAMouseMove = (e: MouseEvent) => {
      if (!ctaRef.current) return;
      const rect = ctaRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;

      gsap.to(ctaRef.current, {
        x,
        y,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleCTAMouseLeave = () => {
      if (!ctaRef.current) return;
      gsap.to(ctaRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (ctaRef.current) {
      ctaRef.current.addEventListener('mousemove', handleCTAMouseMove);
      ctaRef.current.addEventListener('mouseleave', handleCTAMouseLeave);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (ctaRef.current) {
        ctaRef.current.removeEventListener('mousemove', handleCTAMouseMove);
        ctaRef.current.removeEventListener('mouseleave', handleCTAMouseLeave);
      }
    };

  }, { scope: containerRef });

  // Split title into words for GSAP animation
  const titleWords = content.title.split(' ').map((word, i) => (
    <span key={i} className="word inline-block mr-2 sm:mr-3 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-600 pb-2" style={{ transformOrigin: '50% 50% -50px' }}>
      {word}
    </span>
  ));

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50 overflow-hidden"
      style={{
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Immersive background with Parallax & Animated Glows */}
      <div ref={bgRef} className="absolute inset-[-10%] z-0 pointer-events-none">
        <div 
          className="hero-grid absolute inset-0 opacity-0"
          style={{
            backgroundImage: `linear-gradient(to right, #ef4444 1px, transparent 1px), linear-gradient(to bottom, #ef4444 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 70%, transparent 100%)'
          }}
        />
        <div className="hero-glow absolute top-[10%] left-[10%] w-[50vw] h-[50vw] bg-red-500/15 blur-[120px] rounded-full mix-blend-multiply opacity-0" />
        <div className="hero-glow absolute bottom-[5%] right-[5%] w-[45vw] h-[45vw] bg-rose-500/10 blur-[100px] rounded-full mix-blend-multiply opacity-0" />
        <div className="hero-glow absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-orange-400/10 blur-[80px] rounded-full mix-blend-multiply opacity-0" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        
        {/* Top Decoration - Minimalist */}
        <div className="hero-decor flex items-center justify-center gap-4 mb-4">
          <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-red-600/30" />
          <div className="relative bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-red-100">
            <GiSharkFin className="shark-icon relative w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
          </div>
          <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-red-600/30" />
        </div>

        {/* Small Countdown Timer (Moved above title) */}
        <div className="hero-countdown opacity-0 flex flex-col items-center mb-6 bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-3 sm:p-4 relative overflow-hidden">
          <div className="flex gap-3 sm:gap-4 text-center items-center">
            <div className="flex items-center gap-1.5 text-red-600 font-bold uppercase tracking-widest text-[9px] sm:text-[10px] bg-red-50 px-2 py-1 rounded-full mr-2">
              <Clock size={12} className="animate-pulse" />
              Fim das Inscrições
            </div>
            <div className="flex flex-col items-center min-w-[2.5rem] sm:min-w-[3rem]">
              <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800 font-display leading-none tabular-nums">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Dias</span>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-200 leading-none pb-3">:</span>
            <div className="flex flex-col items-center min-w-[2.5rem] sm:min-w-[3rem]">
              <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800 font-display leading-none tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Horas</span>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-200 leading-none pb-3">:</span>
            <div className="flex flex-col items-center min-w-[2.5rem] sm:min-w-[3rem]">
              <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800 font-display leading-none tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Min</span>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-200 hidden sm:inline leading-none pb-3">:</span>
            <div className="flex flex-col items-center hidden sm:flex min-w-[2.5rem] sm:min-w-[3rem]">
              <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-800 font-display leading-none tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Seg</span>
            </div>
          </div>
        </div>

        {/* Prominent Highlighted Title */}
        <h1 
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter leading-tight perspective-1000 drop-shadow-sm"
          style={{ perspective: '1000px' }}
        >
          {titleWords}
        </h1>

        {/* Minimalist Subtitle */}
        <p className="hero-subtitle text-base sm:text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
          {content.subtitle}
        </p>
        
        {/* Enhanced CTA Area with Urgency */}
        <div className="hero-cta-wrapper opacity-0 flex flex-col items-center relative">
          <div className="relative group">
            <div className="hero-cta-pulse absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
            <a 
              ref={ctaRef}
              href="#teacher-registration" 
              className="relative inline-flex items-center justify-center px-8 sm:px-10 py-4 text-base sm:text-lg font-black text-white transition-all duration-300 bg-red-600 hover:bg-red-500 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-1 active:translate-y-0 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2 tracking-wide">
                {content.cta}
                <Zap className="w-5 h-5 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 group-hover:text-yellow-300" />
              </span>
            </a>
          </div>
          <p className="mt-4 text-xs sm:text-sm font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5 bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Vagas Extremamente Limitadas
          </p>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);