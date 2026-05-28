import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Code2,
  Users,
  Trophy,
  Zap,
  Target,
  Sparkles,
  Award,
  Rocket,
} from 'lucide-react';
import { GiSharkFin } from 'react-icons/gi';
import { useGlobalContent } from '@/hooks/useActiveEdition';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const iconMap: Record<string, any> = {
  Code2, Users, Trophy, Zap, Target, Sparkles, Award, Rocket
};

const AboutSection = () => {
  const { data } = useGlobalContent();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Fallback / Base structure
  const baseContent = {
    title: 'O QUE É O',
    sharkText: 'SHARKTANK DSM',
    description: data?.about_text || 'SharkTank DSM é mais do que uma competição. É uma experiência transformadora onde desenvolvedores provam suas habilidades, aprendem com os melhores e conquistam reconhecimento no mercado tech.',
    highlightedText: 'experiência transformadora',
    features: data?.about?.stats?.length > 0 ? data.about.stats.map((stat: any, index: number) => {
      const icons = [Code2, Users, Trophy, Zap];
      return {
        icon: iconMap[stat.icon] || icons[index % icons.length],
        title: stat.label,
        description: stat.description || '',
      }
    }) : [
      {
        icon: Code2,
        title: 'Competição de Elite',
        description: 'Times batalham em desafios de programação de alto nível, resolvendo problemas reais do mercado.',
      },
      {
        icon: Users,
        title: 'Colaboração Inteligente',
        description: 'Vencedores se tornam mentores, compartilhando conhecimento através de workshops práticos e code reviews.',
      },
      {
        icon: Trophy,
        title: 'Duas Fases Épicas',
        description: 'Primeira fase elege os melhores. Segunda fase: batalha final com jurados especialistas e investidores.',
      },
      {
        icon: Zap,
        title: 'Inovação Real',
        description: 'Projetos que transformam ideias em soluções tecnológicas impactantes, funcionais e escaláveis.',
      },
    ],
  };

  const content = baseContent;

  useGSAP(() => {
    // Header Animation
    if (headerRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        }
      });

      tl.fromTo('.about-decor-line', 
        { scaleX: 0 }, 
        { scaleX: 1, duration: 0.8, ease: "power3.out" }
      )
      .fromTo('.about-shark-icon',
        { opacity: 0, scale: 0, rotation: -180 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1, ease: "back.out(1.5)" },
        "-=0.4"
      )
      .fromTo('.about-title',
        { opacity: 0, y: 50, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo('.about-desc',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );
    }

    // Cards Animation
    if (cardsRef.current) {
      const cards = gsap.utils.toArray('.about-card');
      
      gsap.fromTo(cards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          }
        }
      );

      // Add 3D hover tilt animations via GSAP
      cards.forEach((card: any) => {
        const icon = card.querySelector('.about-card-icon');
        const title = card.querySelector('.about-card-title');
        
        card.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left; 
          const y = e.clientY - rect.top;  
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = ((y - centerY) / centerY) * -10; 
          const rotateY = ((x - centerX) / centerX) * 10;
          
          gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 1000,
            scale: 1.05,
            boxShadow: '0 20px 40px rgba(220, 38, 38, 0.15)',
            borderColor: 'rgba(220, 38, 38, 0.4)',
            ease: "power1.out",
            duration: 0.4
          });
          
          if(icon) gsap.to(icon, { scale: 1.15, rotation: 5, backgroundColor: 'rgba(220, 38, 38, 0.15)', duration: 0.3 });
          if(title) gsap.to(title, { color: '#ef4444', duration: 0.3 });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            borderColor: 'rgba(0, 0, 0, 0.05)',
            ease: "power3.out",
            duration: 0.6
          });
          if(icon) gsap.to(icon, { scale: 1, rotation: 0, backgroundColor: 'rgba(220, 38, 38, 0.05)', duration: 0.3 });
          if(title) gsap.to(title, { color: '#0f172a', duration: 0.3 });
        });
      });
    }

    // Parallax Background Decor
    gsap.to('.about-bg-decor-1', {
      y: -150,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to('.about-bg-decor-2', {
      y: 150,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen py-24 sm:py-32 px-4 sm:px-6 bg-white relative flex items-center overflow-hidden border-t border-gray-100 z-10"
    >
      {/* Enhanced Background Ambience */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDEiLz4KPC9zdmc+')] opacity-50 z-0"></div>
      <div className="about-bg-decor-1 absolute top-0 right-0 w-[60vw] h-[60vw] bg-red-100 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-60" />
      <div className="about-bg-decor-2 absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-orange-100 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-50" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Header Section */}
        <div ref={headerRef} className="text-center mb-16 sm:mb-24">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="about-decor-line w-12 sm:w-24 h-[2px] bg-gradient-to-r from-transparent to-red-600/50 origin-right" />
            <div className="bg-red-50 p-3 rounded-2xl border border-red-100">
              <GiSharkFin className="about-shark-icon w-8 h-8 sm:w-10 sm:h-10 text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.2)]" />
            </div>
            <div className="about-decor-line w-12 sm:w-24 h-[2px] bg-gradient-to-l from-transparent to-red-600/50 origin-left" />
          </div>

          <h2 className="about-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter px-2 text-slate-900">
            {content.title}{' '}
            <span className="text-red-600 relative">
              {content.sharkText}
              <span className="absolute -bottom-2 left-0 w-full h-[4px] bg-red-600/20 rounded-full"></span>
            </span>
          </h2>

          <p className="about-desc text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-medium px-4">
            {content.description.split(content.highlightedText)[0]}
            <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded-lg">
              {content.highlightedText}
            </span>
            {content.description.split(content.highlightedText)[1]}
          </p>
        </div>

        {/* Features Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {content.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="about-card bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 cursor-pointer relative overflow-hidden"
              >
                {/* Decorative background shape */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-red-100 to-orange-50 rounded-full blur-2xl opacity-60 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                
                <div className="flex flex-col items-start relative z-10">
                  <div className="about-card-icon w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6 border border-red-100">
                    <Icon className="text-red-600" size={28} />
                  </div>
                  
                  <h3 className="about-card-title text-xl font-bold mb-3 text-slate-900 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;