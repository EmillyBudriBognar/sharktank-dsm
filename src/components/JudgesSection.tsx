import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Linkedin } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const JudgesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Placeholder judges. Can be replaced with database data later.
  const judges = [
    {
      id: 1,
      name: "Ana Clara Silva",
      role: "CTO @ TechMinds",
      description: "Especialista em arquiteturas escaláveis e Cloud Computing.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400"
    },
    {
      id: 2,
      name: "Roberto Campos",
      role: "Lead Engineer @ FinTech Br",
      description: "Mais de 15 anos de experiência em desenvolvimento Fullstack e sistemas financeiros.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400"
    },
    {
      id: 3,
      name: "Juliana Mendes",
      role: "Head of Product @ InovaX",
      description: "Mestre em UX/UI, focada em criar experiências de usuário que convertem.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400"
    },
    {
      id: 4,
      name: "Marcos Oliveira",
      role: "Engenheiro de Software @ GlobalCorp",
      description: "Especialista em Inteligência Artificial e processamento de dados em tempo real.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400&h=400"
    }
  ];

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Header Reveal
    gsap.fromTo('.judges-header',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%"
        }
      }
    );

    // Cards Staggered Reveal
    const cards = gsap.utils.toArray('.judge-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        }
      }
    );

    // Image Parallax Effect inside Cards
    cards.forEach((card: any) => {
      const image = card.querySelector('.judge-image');
      
      gsap.to(image, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-white relative overflow-hidden border-t border-gray-100">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0f172a 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header removed as requested */}

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          {judges.map((judge) => (
            <div key={judge.id} className="judge-card group relative rounded-3xl overflow-hidden bg-white shadow-lg border border-gray-100 hover:shadow-[0_20px_40px_rgba(220,38,38,0.15)] hover:border-red-100 transition-all duration-500 transform hover:-translate-y-2">
              
              {/* Image Container with hidden overflow for parallax */}
              <div className="relative h-72 sm:h-80 overflow-hidden bg-slate-100">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                {/* Image has scale-110 to allow parallax movement without showing borders */}
                <img 
                  src={judge.image} 
                  alt={judge.name} 
                  className="judge-image absolute inset-0 w-full h-full object-cover object-center scale-110 group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay for Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-20"></div>
                
                {/* Text Content inside Image */}
                <div className="absolute bottom-0 left-0 w-full p-6 z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-1">{judge.name}</h3>
                  <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-3">
                    <Briefcase size={14} />
                    {judge.role}
                  </div>
                  
                  {/* Hidden Description revealed on hover */}
                  <div className="overflow-hidden h-0 group-hover:h-20 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {judge.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links / Footer of Card */}
              <div className="px-6 py-4 bg-white flex items-center justify-between border-t border-gray-50 z-40 relative">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jurado Oficial</span>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JudgesSection;
