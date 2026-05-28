import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Trophy, Gift, Monitor, Code } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const AwardsPreviewSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const awards = [
    {
      id: 1,
      icon: Trophy,
      title: "1º LUGAR",
      prize: "R$ 5.000 + Mentoria + Troféu",
      description: "A equipe campeã recebe o prêmio máximo em dinheiro e uma trilha de mentoria exclusiva com executivos.",
      color: "bg-amber-100",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      shadow: "shadow-amber-500/20"
    },
    {
      id: 2,
      icon: Monitor,
      title: "2º LUGAR",
      prize: "R$ 2.500 + Equipamentos",
      description: "Kits de desenvolvimento completos e prêmio em dinheiro para continuar evoluindo o projeto.",
      color: "bg-slate-200",
      textColor: "text-slate-700",
      borderColor: "border-slate-300",
      shadow: "shadow-slate-500/20"
    },
    {
      id: 3,
      icon: Gift,
      title: "3º LUGAR",
      prize: "R$ 1.000 + Cursos",
      description: "Acesso vitalício a plataformas de tecnologia e prêmio em dinheiro.",
      color: "bg-orange-100",
      textColor: "text-orange-600",
      borderColor: "border-orange-200",
      shadow: "shadow-orange-500/20"
    },
    {
      id: 4,
      icon: Code,
      title: "MENÇÃO HONROSA",
      prize: "Destaque Técnico",
      description: "Prêmio especial para a equipe que apresentar o código mais limpo e a arquitetura mais inovadora.",
      color: "bg-indigo-100",
      textColor: "text-indigo-600",
      borderColor: "border-indigo-200",
      shadow: "shadow-indigo-500/20"
    }
  ];

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Header reveal
    gsap.fromTo('.awards-header',
      { opacity: 0, scale: 0.9, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "back.out(1.2)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%"
        }
      }
    );

    // Floating cards entrance
    const cards = gsap.utils.toArray('.award-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 100, rotationY: 45, transformPerspective: 1000 },
      {
        opacity: 1,
        y: 0,
        rotationY: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: '.awards-grid',
          start: "top 75%"
        }
      }
    );

    // 3D Tilt Effect on Hover
    cards.forEach((card: any) => {
      card.addEventListener("mousemove", (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          scale: 1.05,
          ease: "power1.out",
          duration: 0.4
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          ease: "power3.out",
          duration: 0.6
        });
      });
    });

    // Background slow rotation
    gsap.to('.awards-bg-glow', {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: "none"
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-50 relative overflow-hidden border-t border-gray-200 z-10">
      {/* Background glow effects for Light Mode */}
      <div className="awards-bg-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-red-400/20 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-amber-400/20 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="awards-header text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-slate-900 tracking-tight">
            A GLÓRIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">AGUARDA</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
            Os melhores projetos serão recompensados com prêmios incríveis, além da visibilidade para empresas parceiras de toda a região.
          </p>
        </div>

        <div className="awards-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {awards.map((award) => (
            <div 
              key={award.id} 
              className={`award-card bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 flex flex-col items-center text-center will-change-transform shadow-xl ${award.shadow}`}
            >
              <div className={`w-20 h-20 rounded-full ${award.color} flex items-center justify-center mb-6 border-4 border-white shadow-lg`}>
                <award.icon className={`w-10 h-10 ${award.textColor}`} />
              </div>
              
              <div className={`text-xs font-bold tracking-widest ${award.textColor} mb-3 uppercase px-3 py-1 rounded-full ${award.color}`}>
                {award.title}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
                {award.prize}
              </h3>
              
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {award.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsPreviewSection;
