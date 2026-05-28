import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users2, Sparkles, Trophy, Zap, ChevronDown } from 'lucide-react';
import WinnerCard from './WinnerCard';

gsap.registerPlugin(useGSAP, ScrollTrigger);

// --- TIPOS ---
interface TeamMember {
  name: string;
  role: string;
}

interface Winner {
  position: string;
  name: string;
  project: string;
  votes: number;
  medal: string;
  color: string;
  members: TeamMember[];
  differentials: string[];
  videoUrl: string;
}

interface Stat {
  icon: any;
  value: string;
  label: string;
}

interface PhaseContent {
  phase: {
    title: string;
    number: string;
    subtitle: string;
    highlightedSubtitle: string;
    description?: string;
    stats: string;
    swipeHint: string;
  };
  overview: {
    tag: string;
    title: string;
    description: string;
    highlightedDescription: string;
    winnersTitle: string;
  };
  winners: {
    champion: string;
    viceChampion: string;
    thirdPlace?: string;
  };
}

interface PhaseSectionProps {
  content: PhaseContent;
  winners: Winner[];
  stats: Stat[];
  sectionId: string;
  backgroundColor?: string;
  panelCount: number;
}

const PhaseSection = ({
  content,
  winners,
  stats,
  sectionId,
}: PhaseSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate the main timeline line filling up
    if (timelineLineRef.current && timelineProgressRef.current) {
      gsap.to(timelineProgressRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        }
      });
    }

    // Animate each timeline node (dot) and content
    const nodes = gsap.utils.toArray('.timeline-node');
    nodes.forEach((node: any) => {
      const dot = node.querySelector('.timeline-dot');
      const contentBox = node.querySelector('.timeline-content');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: node,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      });

      if (dot) {
        tl.fromTo(dot, 
          { scale: 0, opacity: 0, backgroundColor: '#f3f4f6' }, 
          { scale: 1, opacity: 1, backgroundColor: '#dc2626', duration: 0.5, ease: 'back.out(1.5)' }
        );
      }
      
      if (contentBox) {
        tl.fromTo(contentBox,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.3'
        );
      }
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      id={sectionId} 
      className="relative min-h-screen py-24 sm:py-32 bg-gray-50 overflow-hidden border-t border-gray-200"
    >
      {/* Background Decor */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-red-100 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-red-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Phase Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-6 border border-red-200">
            <Sparkles className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            {content.phase.title} <span className="text-red-600 relative">
              {content.phase.number}
              <span className="absolute -bottom-2 left-0 w-full h-[4px] bg-red-600/20 rounded-full"></span>
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            {content.phase.subtitle}{' '}
            <span className="text-slate-900 font-bold">{content.phase.highlightedSubtitle}</span>
            {content.phase.description && ` ${content.phase.description}`}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-8 sm:pl-16">
          {/* Vertical Line */}
          <div 
            ref={timelineLineRef} 
            className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 rounded-full origin-top"
          >
            {/* Progress Line */}
            <div 
              ref={timelineProgressRef} 
              className="absolute top-0 left-0 w-full h-full bg-red-600 rounded-full origin-top scale-y-0 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            />
          </div>

          {/* Node 1: Visão Geral */}
          <div className="timeline-node relative mb-24 sm:mb-32">
            <div className="timeline-dot absolute -left-8 sm:-left-16 w-6 h-6 -translate-x-[11px] sm:-translate-x-[11px] bg-white border-4 border-gray-100 rounded-full z-10" />
            
            <div className="timeline-content bg-white border border-gray-200 p-8 sm:p-10 rounded-3xl shadow-sm">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-6">
                <Zap className="w-4 h-4 text-red-600" />
                <span className="text-red-700 font-bold text-sm tracking-wide">{content.overview.tag}</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6">{content.overview.title}</h3>
              
              <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-3xl">
                {content.overview.description}
                <span className="text-slate-900 font-bold"> {content.overview.highlightedDescription}</span> {content.phase.number === "1" ? "foram os critérios para escolha dos vencedores." : "foram os critérios decisivos para a vitória final."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <stat.icon className="w-8 h-8 text-red-600 mb-3" />
                    <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Node 2+: Vencedores */}
          {winners.length > 0 && (
            <div className="timeline-node relative mb-16">
              <div className="timeline-dot absolute -left-8 sm:-left-16 w-6 h-6 -translate-x-[11px] sm:-translate-x-[11px] bg-white border-4 border-gray-100 rounded-full z-10" />
              <div className="timeline-content">
                <h4 className="flex items-center gap-3 text-2xl font-black text-slate-900 mb-8">
                  <Trophy className="w-6 h-6 text-red-600" />
                  {content.overview.winnersTitle}
                </h4>
              </div>
            </div>
          )}

          {winners.map((winner, index) => {
            const getWinnerLabel = () => {
              if (index === 0) return content.winners.champion;
              if (index === 1) return content.winners.viceChampion;
              return content.winners.thirdPlace || `TOP ${index + 1}`;
            };
            
            return (
              <div key={winner.name} className="timeline-node relative mb-16 sm:mb-24">
                <div className="timeline-dot absolute -left-8 sm:-left-16 w-6 h-6 -translate-x-[11px] sm:-translate-x-[11px] bg-white border-4 border-gray-100 rounded-full z-10" />
                
                <div className="timeline-content">
                  <div className="mb-6 inline-block">
                    <span className="px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-700 font-bold text-sm tracking-widest shadow-sm">
                      {getWinnerLabel()}
                    </span>
                  </div>
                  
                  <WinnerCard
                    {...winner}
                    isChampion={index === 0}
                    isThirdPlace={index === 2}
                  />
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
};

export default PhaseSection;