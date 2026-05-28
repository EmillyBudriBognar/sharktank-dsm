import { Play, Users2, Zap } from 'lucide-react';
import { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  photo?: string;
}

interface WinnerCardProps {
  position: string;
  name: string;
  project: string;
  votes: number;
  medal: string;
  members: TeamMember[];
  differentials: string[];
  videoUrl: string;
  color?: string;
  isChampion?: boolean;
  isThirdPlace?: boolean;
}

const WinnerCard = ({ 
  name, 
  project, 
  medal, 
  members, 
  differentials, 
  videoUrl, 
  isChampion = false,
  isThirdPlace = false 
}: WinnerCardProps) => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const handleVideoPlay = () => setVideoPlaying(true);
  const handleVideoEnd = () => setVideoPlaying(false);

  // Border and Bar Colors
  const getBorderColor = () => {
    if (isChampion) return 'border-yellow-300';
    if (isThirdPlace) return 'border-amber-300';
    return 'border-gray-200';
  };

  const getTopBarColor = () => {
    if (isChampion) return 'bg-gradient-to-r from-yellow-500 to-yellow-300';
    if (isThirdPlace) return 'bg-gradient-to-r from-amber-600 to-amber-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-300';
  };

  const isYouTubeVideo = videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));

  const getYouTubeId = (url: string) => {
    if(!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = isYouTubeVideo ? getYouTubeId(videoUrl) : null;
  const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0` : '';

  const borderColor = getBorderColor();
  const topBarColor = getTopBarColor();

  return (
    <div className={`bg-white rounded-3xl border ${borderColor} overflow-hidden relative shadow-sm transition-all duration-300 hover:shadow-xl hover:border-red-200`}>
      {/* Top Bar */}
      <div className={`absolute top-0 left-0 right-0 h-[4px] ${topBarColor} z-20`}></div>
      
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left Side - Info */}
        <div className="w-full lg:w-5/12 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <div className="text-7xl mb-4 drop-shadow-sm">{medal}</div>
              <h3 className="font-sans text-3xl font-black text-slate-900 mb-2">
                {name}
              </h3>
              <p className="text-slate-500 font-semibold text-lg">{project}</p>
            </div>

            {/* Differentials */}
            <div className="mb-8">
              <h4 className="font-sans text-sm font-bold text-red-600 mb-4 flex items-center gap-2 tracking-wider">
                <Zap className="w-4 h-4" />
                DIFERENCIAIS
              </h4>
              <ul className="space-y-3">
                {differentials && differentials.length > 0 ? differentials.map((diff, diffIndex) => (
                  <li key={diffIndex} className="flex items-start gap-3 text-sm text-slate-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 flex-shrink-0 shadow-[0_0_8px_rgba(220,38,38,0.4)]" />
                    <span className="font-medium leading-relaxed">{diff}</span>
                  </li>
                )) : (
                  <li className="text-sm text-slate-400 italic">Nenhum diferencial cadastrado.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h4 className="font-sans text-sm font-bold text-red-600 mb-4 flex items-center gap-2 tracking-wider">
              <Users2 className="w-4 h-4" />
              {isChampion ? 'TIME VENCEDOR' : 'EQUIPE'}
            </h4>
            <div className="flex flex-wrap gap-4">
              {members && members.length > 0 ? members.map((member, memberIndex) => (
                <div key={memberIndex} className="text-center group flex flex-col items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm mb-2 border border-gray-200 shadow-sm group-hover:border-red-200 group-hover:text-red-600 transition-all duration-300 group-hover:bg-red-50">
                    {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div className="text-xs font-bold text-slate-700 truncate max-w-[70px] group-hover:text-red-600 transition-colors">{member.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 font-semibold truncate max-w-[70px]">{member.role}</div>
                </div>
              )) : (
                <div className="text-sm text-slate-400 italic">Membros não informados.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Video */}
        <div className="w-full lg:w-7/12 p-8 lg:p-10 bg-gray-50/50 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <h4 className="font-sans text-sm font-bold text-red-600 mb-4 flex items-center justify-center lg:justify-start gap-2 tracking-wider">
              <Play className="w-4 h-4" />
              DEMONSTRAÇÃO DO PROJETO
            </h4>
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video shadow-lg border border-gray-200 group">
              {!videoUrl ? (
                 <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <span className="text-slate-400 font-medium">Nenhum vídeo disponível</span>
                 </div>
              ) : !videoPlaying ? (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-slate-900/80 group-hover:bg-slate-800/80 transition-all duration-300"
                  onClick={handleVideoPlay}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] mb-4 mx-auto group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <span className="text-sm font-bold text-white tracking-wider">
                      ASSISTIR DEMONSTRAÇÃO
                    </span>
                  </div>
                </div>
              ) : isYouTubeVideo ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`Vídeo do projeto ${project}`}
                />
              ) : (
                <video 
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  onEnded={handleVideoEnd}
                >
                  <source src={videoUrl} type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnerCard;