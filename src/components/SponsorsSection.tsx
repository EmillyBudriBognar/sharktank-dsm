import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Handshake } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SponsorsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const sponsorsRef = useRef<HTMLDivElement>(null);

  // Placeholder sponsors for demonstration
  const sponsors = [
    { name: 'Empresa A', tier: 'Ouro' },
    { name: 'Empresa B', tier: 'Ouro' },
    { name: 'Empresa C', tier: 'Prata' },
    { name: 'Empresa D', tier: 'Prata' },
    { name: 'Empresa E', tier: 'Prata' },
    { name: 'Empresa F', tier: 'Apoio' },
    { name: 'Empresa G', tier: 'Apoio' },
    { name: 'Empresa H', tier: 'Apoio' },
  ];

  useGSAP(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );
    }

    if (sponsorsRef.current) {
      const cards = gsap.utils.toArray('.sponsor-card');
      
      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sponsorsRef.current,
            start: "top 85%",
          }
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="sponsors"
      className="py-24 sm:py-32 px-4 sm:px-6 bg-gray-50 border-t border-gray-100 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 text-red-700 font-bold text-sm tracking-wide uppercase mb-6">
            <Handshake size={16} />
            Patrocinadores e Apoio
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-slate-900 tracking-tight">
            QUEM FAZ ACONTECER
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            Empresas que acreditam na educação e na força da nova geração de talentos da tecnologia.
          </p>
        </div>

        {/* Sponsors Grid */}
        <div ref={sponsorsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {sponsors.map((sponsor, index) => (
            <div 
              key={index}
              className="sponsor-card bg-white border border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[160px] shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 group-hover:bg-red-50 transition-colors flex items-center justify-center">
                <span className="text-gray-400 font-bold group-hover:text-red-500">{sponsor.name.charAt(0)}</span>
              </div>
              <h3 className="font-bold text-slate-800 text-center group-hover:text-red-600 transition-colors">{sponsor.name}</h3>
              <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wider">{sponsor.tier}</p>
            </div>
          ))}
        </div>
        
        {/* CTA for new sponsors */}
        <div className="mt-16 text-center">
          <a href="mailto:contato@sharktankdsm.com.br" className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-red-100 text-red-600 font-bold rounded-full hover:bg-red-50 hover:border-red-200 transition-all duration-300 shadow-sm">
            Seja um Patrocinador
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
