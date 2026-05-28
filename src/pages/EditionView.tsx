import { useEffect, useMemo, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { Users2, Award, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import ScrollIndicator from '@/components/ScrollIndicator';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

// Lazy load sections
const PhaseSection = lazy(() => import('@/components/PhaseSection'));
const WorkshopSection = lazy(() => import('@/components/WorkshopSection'));
const AwardsSection = lazy(() => import('@/components/AwardsSection'));
const GallerySection = lazy(() => import('@/components/GallerySection'));
const Footer = lazy(() => import('@/components/Footer'));

const SectionFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

const EditionView = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEditionData = async () => {
      setLoading(true);
      
      const { data: editionData, error } = await supabase
        .from('st_editions')
        .select(`
          *,
          phases:st_phases(*, st_winners(*)),
          awards:st_awards(*),
          gallery:st_gallery(*)
        `)
        .eq('id', id)
        .single();
        
      if (!error && editionData) {
        setData(editionData);
      }
      setLoading(false);
    };

    if (id) {
      fetchEditionData();
    }
  }, [id]);

  const sortedPhases = useMemo(() => {
    if (!data?.phases) return [];
    return [...data.phases].sort((a, b) => parseInt(a.number || a.name) - parseInt(b.number || b.name));
  }, [data?.phases]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    document.body.classList.add('bg-white', 'text-slate-900');
    
    return () => {
      document.body.classList.remove('bg-white', 'text-slate-900');
    };
  }, []);

  if (loading) return <SectionFallback />;
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">Edição não encontrada.</div>;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-red-600/30 selection:text-red-900">
      <Navigation/>
      <ScrollIndicator />
      
      <main className="pt-24">
        <div className="text-center py-12 bg-red-50 border-b border-red-100">
          <h1 className="text-4xl md:text-6xl font-black text-red-600">
            EDIÇÃO {data.year}.{data.semester}
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto font-medium">
            Confira tudo o que rolou nesta edição épica do SharkTank DSM.
          </p>
        </div>

        {/* Dynamic Phases Mapping */}
        {sortedPhases.map((phase: any) => {
          const phaseContent = {
            phase: {
              title: phase.name,
              number: phase.name.replace(/\D/g,'') || '1',
              subtitle: 'Fase de Classificação',
              highlightedSubtitle: '',
              description: '',
              stats: "Deslize",
              swipeHint: "Deslize para continuar"
            },
            overview: {
              tag: 'RESUMO',
              title: phase.name,
              description: 'Veja as equipes que se destacaram nesta fase.',
              highlightedDescription: "",
              winnersTitle: "VENCEDORES"
            },
            winners: {
              champion: "🥇 CAMPEÃO",
              viceChampion: "🥈 VICE-CAMPEÃO",
              thirdPlace: "🥉 TERCEIRO LUGAR"
            }
          };
          
          const phaseWinners = phase.st_winners?.length > 0 
            ? phase.st_winners.map((w: any) => ({
                position: w.position || 1,
                name: w.name,
                project: w.project_name,
                votes: w.votes || 0,
                medal: w.medal || 'Ouro',
                color: w.position === 1 ? 'from-red-500 to-red-600' : 'from-slate-400 to-slate-500',
                members: w.members || [],
                differentials: w.differentials || [],
                videoUrl: w.video_url
              }))
            : [];
            
          const phaseStats = [
            { icon: Users2, value: phaseWinners.length * 3 + '+', label: 'Participantes' },
            { icon: Award, value: phaseWinners.length.toString(), label: 'Vencedores' },
          ];

          return (
            <Suspense fallback={<SectionFallback />} key={phase.id}>
              <div id={`phase-${phase.id}-section`}>
                <PhaseSection
                  content={phaseContent}
                  winners={phaseWinners}
                  stats={phaseStats}
                  sectionId={`phase${phase.id}`}
                  panelCount={phaseWinners.length > 0 ? phaseWinners.length + 2 : 2}
                />
              </div>
            </Suspense>
          );
        })}
        
        <Suspense fallback={<SectionFallback />}>
          <div id="workshop-section">
            <WorkshopSection />
          </div>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="awards-section">
            <AwardsSection />
          </div>
        </Suspense>
        
        <Suspense fallback={<SectionFallback />}>
          <div id="gallery-section">
            <GallerySection />
          </div>
        </Suspense>
      </main>
      
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default EditionView;
