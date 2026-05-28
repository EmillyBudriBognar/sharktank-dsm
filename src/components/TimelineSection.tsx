import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarDays, Rocket, BrainCircuit, Flag, Award } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TimelineSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const timelineEvents = [
    {
      id: 1,
      title: "Período de Inscrições",
      date: "01 a 15 de Agosto",
      description: "Cadastre sua equipe através do Portal do Professor com a sua ideia inovadora.",
      icon: CalendarDays,
      status: "completed"
    },
    {
      id: 2,
      title: "Fase 1 - O Desafio",
      date: "20 a 30 de Agosto",
      description: "As equipes começam a desenvolver o protótipo inicial e validar o problema.",
      icon: Rocket,
      status: "current"
    },
    {
      id: 3,
      title: "Mentorias Exclusivas",
      date: "05 de Setembro",
      description: "Profissionais do mercado auxiliam as equipes classificadas a refinar seus projetos.",
      icon: BrainCircuit,
      status: "upcoming"
    },
    {
      id: 4,
      title: "Fase 2 - A Batalha",
      date: "15 a 25 de Setembro",
      description: "Desenvolvimento final, aprimoramento da UI/UX e preparação do Pitch.",
      icon: Flag,
      status: "upcoming"
    },
    {
      id: 5,
      title: "O Grande Evento (Pitch)",
      date: "30 de Setembro",
      description: "Apresentação para os Sharks, avaliação e cerimônia de premiação.",
      icon: Award,
      status: "upcoming"
    }
  ];

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Initial Header Reveal
    gsap.fromTo('.timeline-header-content',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.timeline-header',
          start: "top 85%",
        }
      }
    );

    // Pin the left sidebar (LKS Data style)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: headerRef.current,
        pinSpacing: false,
      });
    });

    // Floating Background Blobs Animation (LKS Data style)
    const blobs = gsap.utils.toArray('.timeline-bg-shape');
    blobs.forEach((blob: any) => {
      gsap.to(blob, {
        x: "random(-50, 50)",
        y: "random(-50, 50)",
        duration: "random(6, 10)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });

    // SVG Line drawing animation
    if (lineRef.current) {
      const length = lineRef.current.getTotalLength();
      gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(lineRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1.5,
        }
      });
    }

    // Timeline items reveal
    const items = gsap.utils.toArray('.timeline-item');
    items.forEach((item: any, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          }
        }
      );
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-12 px-4 sm:px-6 bg-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="timeline-bg-shape absolute top-20 -right-20 w-80 h-80 bg-red-400/10 rounded-full blur-[100px]" />
        <div className="timeline-bg-shape absolute top-1/2 -left-20 w-96 h-96 bg-rose-400/10 rounded-full blur-[100px]" />
        <div className="timeline-bg-shape absolute bottom-20 right-10 w-96 h-96 bg-orange-400/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Left Side: Pinned Header */}
        <div className="lg:w-1/3 relative z-20">
          <div ref={headerRef} className="timeline-header lg:h-screen lg:flex lg:flex-col lg:justify-center py-8 lg:py-0">
            <div className="text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 text-slate-900 tracking-tight">
                A JORNADA DO <br className="hidden lg:block"/><span className="text-red-600">CAMPEÃO</span>
              </h2>
              <p className="text-lg text-slate-500">
                Acompanhe as datas importantes da edição atual. Prepare-se para o maior desafio de tecnologia.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Scrolling Timeline */}
        <div className="lg:w-2/3 relative py-8 lg:py-32">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 hidden lg:block">
            <svg width="4" height="100%" className="absolute inset-0">
              <line x1="2" y1="0" x2="2" y2="100%" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" />
              <path 
                ref={lineRef}
                d="M 2 0 L 2 10000" 
                stroke="#dc2626" 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-gray-100 rounded-full lg:hidden">
            <div className="absolute top-0 left-0 w-full bg-red-600 rounded-full" style={{ height: '50%' }}></div>
          </div>

          <div className="space-y-12 pl-20 md:pl-24 timeline-container">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              
              return (
                <div key={event.id} className="timeline-item relative group">
                  
                  {/* Center Dot */}
                  <div className="absolute -left-20 md:-left-24 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white bg-red-50 flex items-center justify-center z-10 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <Icon className={`w-5 h-5 ${event.status === 'upcoming' ? 'text-slate-400' : 'text-red-600'}`} />
                  </div>

                  {/* Card Content */}
                  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300">
                    <div className="text-red-600 font-bold text-sm tracking-widest uppercase mb-2 flex items-center gap-2">
                      {event.date}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
