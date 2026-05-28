import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Lightbulb, Trophy, Rocket } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const countersRef = useRef<HTMLDivElement[]>([]);

  const stats = [
    { id: 1, icon: Users, label: "Alunos Participantes", value: 250, suffix: "+", color: "text-white" },
    { id: 2, icon: Lightbulb, label: "Projetos Inovadores", value: 45, suffix: "+", color: "text-white" },
    { id: 3, icon: Trophy, label: "Reais em Prêmios", value: 15, suffix: "k", prefix: "R$ ", color: "text-white" },
    { id: 4, icon: Rocket, label: "Empresas Parceiras", value: 10, suffix: "+", color: "text-white" }
  ];

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Counter animation
    countersRef.current.forEach((counter) => {
      if (!counter) return;
      const target = parseFloat(counter.getAttribute('data-target') || '0');
      
      gsap.to(counter, {
        innerHTML: target,
        duration: 2.5,
        ease: "power3.out",
        snap: { innerHTML: 1 },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
        onUpdate: function() {
          if (counter.dataset.prefix) {
            counter.innerHTML = counter.dataset.prefix + Math.round(Number(this.targets()[0].innerHTML)) + (counter.dataset.suffix || '');
          } else {
            counter.innerHTML = Math.round(Number(this.targets()[0].innerHTML)) + (counter.dataset.suffix || '');
          }
        }
      });
    });

    // Reveal animation
    gsap.fromTo('.stat-card',
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        }
      }
    );
  }, { scope: sectionRef });

  const addToRefs = (el: HTMLDivElement) => {
    if (el && !countersRef.current.includes(el)) {
      countersRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="py-10 bg-red-600 relative overflow-hidden z-20 shadow-inner">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none mix-blend-screen"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="stat-card flex flex-col items-center text-center group">
              <div className={`w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:bg-white/20`}>
                <stat.icon className={`${stat.color}`} size={24} />
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <div 
                  ref={addToRefs}
                  data-target={stat.value}
                  data-prefix={stat.prefix || ''}
                  data-suffix={stat.suffix || ''}
                  className="text-3xl md:text-4xl font-black text-white tracking-tighter"
                >
                  0
                </div>
              </div>
              <p className="text-xs md:text-sm font-bold text-red-100 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
