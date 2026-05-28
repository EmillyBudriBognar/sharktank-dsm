import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, GraduationCap, Users, Zap } from 'lucide-react';
import { useActiveEdition } from '@/hooks/useActiveEdition';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const iconMap: Record<string, any> = {
  Calendar: BookOpen, TrendingUp: GraduationCap, Users, Zap
};

const FutureSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { data } = useActiveEdition();

  const fallbackContent = {
    title: "O FUTURO É",
    highlightedTitle: "AGORA",
    description: "Professores, chegou a hora de colocar seus alunos no maior palco de tecnologia e inovação da nossa região.",
    cta: {
      title: "🚀 Inscreva seus alunos",
      description: "Apenas professores vinculados podem cadastrar as equipes para o SharkTank DSM. A próxima geração de talentos começa aqui!",
      buttons: {
        register: "Portal do Professor",
        faq: "Dúvidas Frequentes",
        sponsor: "Ser Patrocinador"
      }
    }
  };

  const content = data?.future ? {
    title: data.future.title,
    highlightedTitle: data.future.highlighted_title,
    description: "Professores, chegou a hora de colocar seus alunos no maior palco de tecnologia e inovação da nossa região.", // Override for professor focus
    cta: fallbackContent.cta
  } : fallbackContent;

  const fallbackFutureEditions = [
    {
      icon: BookOpen,
      title: 'Mentoria Exclusiva',
      description: 'Seus alunos terão acesso a profissionais e veteranos que já atuam no mercado de trabalho.',
    },
    {
      icon: GraduationCap,
      title: 'Desafios Reais',
      description: 'As equipes resolverão problemas autênticos propostos por empresas parceiras da região.',
    },
    {
      icon: Users,
      title: 'Networking',
      description: 'Um ambiente perfeito para que os estudantes se conectem com recrutadores e especialistas.',
    },
    {
      icon: Zap,
      title: 'Premiações',
      description: 'Prêmios em dinheiro, cursos e equipamentos para as equipes com as melhores soluções tecnológicas.',
    },
  ];

  const icons = [BookOpen, GraduationCap, Users, Zap];

  const futureEditions = data?.future?.items?.length > 0 ? data.future.items.map((item: any, index: number) => ({
    icon: iconMap[item.icon] || icons[index % icons.length],
    title: item.title,
    description: item.description
  })) : fallbackFutureEditions;

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Title animation
    gsap.fromTo('.future-title-anim',
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.future-header',
          start: 'top 80%'
        }
      }
    );

    // Cards animation
    gsap.fromTo('.future-card',
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: '.future-cards-grid',
          start: 'top 75%'
        }
      }
    );

    // CTA animation
    gsap.fromTo('.future-cta',
      { opacity: 0, scale: 0.9, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: '.future-cta',
          start: 'top 85%'
        }
      }
    );

    // Pulse animation for the main CTA button
    gsap.to('.future-cta-btn-pulse', {
      scale: 1.05,
      opacity: 0.6,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    // Hover effects for cards
    const cards = gsap.utils.toArray('.future-card') as HTMLElement[];
    cards.forEach((card) => {
      const icon = card.querySelector('.future-card-icon');
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { y: -10, scale: 1.02, borderColor: 'rgba(220,38,38,0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', duration: 0.4, ease: 'power2.out' });
        if(icon) gsap.to(icon, { scale: 1.15, rotate: 5, duration: 0.3 });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { y: 0, scale: 1, borderColor: 'rgba(229,231,235,1)', boxShadow: 'none', duration: 0.4, ease: 'power2.out' });
        if(icon) gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3 });
      });
    });

  }, { scope: sectionRef });

  return (
    <section id="teacher-registration" ref={sectionRef} className="snap-section min-h-screen py-24 px-4 sm:px-6 bg-white text-slate-900 relative overflow-hidden flex items-center border-t border-gray-100">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[50vw] h-[50vw] bg-red-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Header Section */}
        <div className="future-header text-center mb-16">
          <h2 className="future-title-anim text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tighter">
            {content.title} <span className="text-red-600 relative">
              {content.highlightedTitle}
              <span className="absolute -bottom-2 left-0 w-full h-[4px] bg-red-600/20 rounded-full"></span>
            </span>
          </h2>
          <p className="future-title-anim text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-4 font-medium">
            {content.description}
          </p>
        </div>

        {/* Cards */}
        <div className="future-cards-grid grid sm:grid-cols-2 gap-6 sm:gap-8 mb-20">
          {futureEditions.map((item, index) => (
            <div
              key={index}
              className="future-card bg-white border border-gray-200 rounded-3xl p-8 transition-all duration-500 group cursor-default shadow-sm"
            >
              <div className="flex items-start gap-6">
                <div className="future-card-icon flex-shrink-0 w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                  <item.icon className="text-red-600" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-red-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MASSIVE Call to Action */}
        <div className="future-cta text-center relative mt-10">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-50 rounded-[3rem] transform -rotate-1 scale-105 opacity-50 blur-xl"></div>
          <div className="relative bg-white text-slate-900 rounded-[3rem] p-12 sm:p-20 shadow-[0_20px_60px_-15px_rgba(220,38,38,0.15)] border border-red-100 overflow-hidden">
            {/* Inner background glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-100 rounded-full blur-[100px] opacity-60 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100 rounded-full blur-[100px] opacity-60 -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 tracking-tight">
                {content.cta.title}
              </h3>
              <p className="text-xl sm:text-2xl text-slate-600 mb-12 font-medium leading-relaxed">
                {content.cta.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
                <div className="relative group w-full sm:w-auto">
                  <div className="future-cta-btn-pulse absolute -inset-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                  <a href="/teacher-portal" className="relative w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-12 py-6 rounded-full font-black text-xl tracking-wider shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3">
                    {content.cta.buttons.register}
                    <Zap className="w-6 h-6 animate-pulse text-yellow-300" />
                  </a>
                </div>
                
                <button className="w-full sm:w-auto bg-slate-900 text-white border-2 border-slate-900 hover:bg-slate-800 hover:border-slate-800 shadow-xl hover:shadow-2xl px-8 py-6 rounded-full font-bold text-xl transition-all duration-300 transform hover:-translate-y-1">
                  {content.cta.buttons.sponsor}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSection;