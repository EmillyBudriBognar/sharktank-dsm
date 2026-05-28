import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import workshopImage from '@/assets/workshop.jpg';
import { GraduationCap, Presentation, Brain, BookOpen, ChevronLeft, ChevronRight, User, Calendar, MapPin } from 'lucide-react';
import { useActiveEdition } from '@/hooks/useActiveEdition';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WorkshopSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { data } = useActiveEdition();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const fallbackTopics = [
    { icon: Brain, title: 'Arquitetura de Software', description: 'Padrões e melhores práticas para construir sistemas escaláveis e robustos' },
    { icon: BookOpen, title: 'Clean Code', description: 'Técnicas avançadas para código limpo, legível e fácil de manter' },
    { icon: Presentation, title: 'Git & Colaboração', description: 'Workflows profissionais e gestão eficiente de código em equipe' },
    { icon: GraduationCap, title: 'Debugging Avançado', description: 'Estratégias para identificar e resolver problemas complexos rapidamente' },
  ];

  const icons = [Brain, BookOpen, Presentation, GraduationCap];

  const topics = data?.workshops?.length > 0 ? data.workshops.map((w: any, index: number) => ({
    icon: icons[index % icons.length],
    title: w.title,
    description: `${w.speaker} (${w.speaker_role}) • ${new Date(w.date).toLocaleDateString('pt-BR')} às ${w.time.substring(0, 5)} • ${w.location}`
  })) : fallbackTopics;

  useGSAP(() => {
    const panels = gsap.utils.toArray('.workshop-panel') as HTMLElement[];
    
    if (panels.length === 0) return;

    if (isMobile) {
      panels.forEach((panel, i) => {
        gsap.fromTo(panel, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 80%",
            }
          }
        );
      });
      return;
    }

    // Desktop 3D Stacking Panels
    panels.forEach((panel, i) => {
      // Set panel initial z-index to reverse order
      gsap.set(panel, { zIndex: panels.length - i });

      if (i === panels.length - 1) return; // Skip last panel pinning

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          scrub: 1,
        }
      });

      // 3D fold away effect
      tl.to(panel, {
        scale: 0.9,
        opacity: 0,
        rotationX: -10,
        transformOrigin: "center top",
        ease: "none"
      });
    });

    // Content animations inside panels
    panels.forEach((panel) => {
      const animates = panel.querySelectorAll('.animate-in');
      if (animates.length > 0) {
        gsap.fromTo(animates, 
          { opacity: 0, y: 50, rotationY: 15 },
          {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 60%",
            }
          }
        );
      }

      // 3D Hover effect for cards
      const cards = panel.querySelectorAll('.topic-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -10, scale: 1.02, rotationY: 5, duration: 0.3, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, rotationY: 0, duration: 0.3, ease: 'power2.out' });
        });
      });
    });

  }, { scope: containerRef, dependencies: [isMobile] });

  return (
    <section id="workshop" ref={containerRef} className="relative bg-white text-slate-900 border-t border-gray-100">
      
      {/* Panel 1: Intro */}
      <div className="workshop-panel min-h-screen w-full flex items-center justify-center bg-white px-6 py-20 relative perspective-1000">
        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-red-50 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl text-center z-10 transform-style-3d">
          <GraduationCap className="w-20 h-20 text-red-600 mx-auto mb-8 drop-shadow-sm animate-in" />
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter animate-in text-slate-900">
            {content.intro.title} <span className="text-red-600 relative">
              {content.intro.highlightedTitle}
              <span className="absolute -bottom-2 left-0 w-full h-[4px] bg-red-600/20 rounded-full"></span>
            </span>
          </h2>
          <p className="text-xl md:text-3xl text-slate-600 max-w-4xl mx-auto font-medium animate-in leading-relaxed">
            {content.intro.description}
          </p>
        </div>
      </div>

      {/* Panel 2: Image Parallax */}
      <div className="workshop-panel min-h-screen w-full flex items-center justify-center bg-gray-50 px-6 py-20 relative perspective-1000">
        <div className="max-w-7xl w-full z-10">
          <div className="relative h-[50vh] md:h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-gray-200 animate-in">
            <img src={workshopImage} alt="Workshop" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-8 md:p-16">
              <div className="max-w-3xl">
                <h3 className="text-4xl md:text-6xl font-black mb-4 text-white drop-shadow-xl">{content.image.title}</h3>
                <p className="text-xl md:text-3xl text-slate-200 font-medium drop-shadow-md">{content.image.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel 3: Topics Grid */}
      <div className="workshop-panel min-h-screen w-full flex items-center justify-center bg-white px-6 py-20 relative perspective-1000">
        <div className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] bg-red-50 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl w-full z-10">
          <h3 className="text-4xl md:text-6xl font-black text-center mb-16 animate-in text-slate-900">
            {content.topics.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <div 
                  key={index} 
                  className="topic-card bg-white border border-gray-200 rounded-3xl p-8 hover:border-red-200 hover:shadow-xl transition-all duration-300 shadow-sm animate-in"
                >
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="flex-shrink-0 w-20 h-20 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center shadow-sm">
                      <Icon className="text-red-600" size={36} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-4 text-slate-900">{topic.title}</h4>
                      <p className="text-slate-500 leading-relaxed font-medium">{topic.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel 4: Judges */}
      <div className="workshop-panel min-h-screen w-full flex items-center justify-center bg-gray-50 px-6 py-20 relative perspective-1000 border-t border-gray-200">
        <div className="max-w-5xl text-center z-10 transform-style-3d">
          <div className="mb-12 animate-in">
            <div className="text-8xl mb-8 drop-shadow-md">⚖️</div>
            <h3 className="text-5xl md:text-7xl font-black mb-8 text-red-600 drop-shadow-sm">
              {content.judges.title}
            </h3>
          </div>
          <p className="text-xl md:text-3xl text-slate-600 leading-relaxed font-medium animate-in">
            {content.judges.description}
          </p>
        </div>
      </div>

    </section>
  );
};

export default WorkshopSection;