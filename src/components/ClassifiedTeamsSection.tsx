import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users2, CheckCircle2, Search, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useActiveEdition } from '@/hooks/useActiveEdition';
import { Input } from '@/components/ui/input';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ClassifiedTeamsSection = () => {
  const { data: editionData } = useActiveEdition();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const emptyStateRef = useRef<HTMLDivElement>(null);
  
  const [teams, setTeams] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch classified teams
  useEffect(() => {
    const fetchTeams = async () => {
      if (!editionData?.edition?.id) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from('st_participants')
        .select('project_name, name, role')
        .eq('edition_id', editionData.edition.id)
        .not('project_name', 'is', null);

      if (!error && data) {
        // Group by project_name to simulate "Teams"
        const groupedTeams = data.reduce((acc: any, curr: any) => {
          if (!curr.project_name) return acc;
          const proj = curr.project_name.trim();
          if (!acc[proj]) {
            acc[proj] = { name: proj, members: [] };
          }
          acc[proj].members.push({ name: curr.name, role: curr.role });
          return acc;
        }, {});
        
        const teamsArray = Object.values(groupedTeams);
        setTeams(teamsArray); // No more hardcoded teams. Empty means waiting for phase 2.
      }
      setLoading(false);
    };

    fetchTeams();
  }, [editionData]);

  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

    if (gridRef.current && filteredTeams.length > 0) {
      const cards = gsap.utils.toArray('.team-card');
      
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
            trigger: gridRef.current,
            start: "top 85%",
          }
        }
      );
    }

    if (emptyStateRef.current && !loading && teams.length === 0) {
      gsap.fromTo(emptyStateRef.current,
        { opacity: 0, scale: 0.9, filter: 'blur(10px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: emptyStateRef.current,
            start: "top 85%"
          }
        }
      );

      // Pulse animation for the lock icon
      gsap.to('.lock-icon', {
        scale: 1.1,
        boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)',
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut"
      });
    }
  }, { scope: sectionRef, dependencies: [filteredTeams, loading, teams.length] });

  return (
    <section
      ref={sectionRef}
      id="classified-teams"
      className="py-12 sm:py-16 px-4 sm:px-6 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div ref={headerRef} className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-600 font-bold text-sm tracking-wide uppercase mb-6">
            <CheckCircle2 size={16} />
            Classificação
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-slate-900 tracking-tight">
            EQUIPES <span className="text-red-600">CLASSIFICADAS</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
            Confira as mentes brilhantes que garantiram seu lugar na disputa. 
            Prepare-se para enfrentar os melhores.
          </p>
          
          {teams.length > 0 && (
            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Buscar por nome da equipe..." 
                className="pl-10 h-12 rounded-full border-gray-200 focus-visible:ring-red-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Teams Grid or Empty State */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            Carregando status das equipes...
          </div>
        ) : teams.length === 0 ? (
          <div ref={emptyStateRef} className="max-w-3xl mx-auto bg-gray-50 border border-gray-200 rounded-3xl p-12 text-center shadow-inner relative overflow-hidden">
            {/* Background elements for empty state */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="lock-icon w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg border border-gray-100">
                <Lock className="text-red-600" size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">O Mistério Permanece</h3>
              <p className="text-lg text-slate-600 max-w-lg mx-auto font-medium">
                As equipes classificadas para a Fase 2 serão reveladas em breve. Continue acompanhando o cronograma e prepare-se para a grande revelação.
              </p>
            </div>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTeams.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-500 font-medium">
                Nenhuma equipe encontrada com esse nome.
              </div>
            ) : (
              filteredTeams.map((team, index) => (
                <div 
                  key={index}
                  className="team-card bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-red-200 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors duration-300">
                    <Users2 className="text-red-600 group-hover:text-white transition-colors" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                    {team.name}
                  </h3>
                  <div className="text-sm text-slate-500 font-medium bg-gray-50 px-3 py-1 rounded-full inline-block">
                    {team.members.length} {team.members.length === 1 ? 'Membro' : 'Membros'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClassifiedTeamsSection;
