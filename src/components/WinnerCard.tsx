import { LucideIcon, Play, Users2, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  color = 'from-red-500 to-red-600',
  isChampion = false,
  isThirdPlace = false 
}: WinnerCardProps) => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é mobile
  useEffect(() => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 1024);
  };
  
  checkMobile();
  window.addEventListener('resize', checkMobile, { signal });
  
  return () => controller.abort();
}, []);

  const handleVideoPlay = () => {
    setVideoPlaying(true);
  };

  const handleVideoEnd = () => {
    setVideoPlaying(false);
  };

  // Determinar cores baseadas na posição
  const getBorderColor = () => {
    if (isChampion) return 'border-yellow-300';
    if (isThirdPlace) return 'border-amber-300';
    return 'border-gray-200';
  };

  const getTopBarColor = () => {
    if (isChampion) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    if (isThirdPlace) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    return 'bg-gradient-to-r from-gray-400 to-gray-500';
  };

  const getMedalColor = () => {
    if (isChampion) return 'text-yellow-600';
    if (isThirdPlace) return 'text-amber-600';
    return 'text-gray-600';
  };

  // Verificar se é um vídeo do YouTube
  const isYouTubeVideo = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

  // Extrair ID do vídeo do YouTube
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = isYouTubeVideo ? getYouTubeId(videoUrl) : null;
  const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0` : '';

  const borderColor = getBorderColor();
  const topBarColor = getTopBarColor();
  const medalColor = getMedalColor();

  // Layout para mobile
  if (isMobile) {
    return (
      <div className={`bg-white rounded-2xl shadow-xl border-2 ${borderColor} overflow-hidden relative mx-4`}>
        {/* Faixa no topo */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${topBarColor} z-20`}></div>
        
        <div className="flex flex-col pt-4">
          {/* Cabeçalho */}
          <div className="text-center px-4 pb-4 border-b border-gray-100">
            <div className="text-5xl mb-2 drop-shadow-lg">{medal}</div>
            <h3 className="font-sans text-xl font-black text-red-600 mb-1 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              {name}
            </h3>
            <p className="text-gray-600 font-semibold text-sm">{project}</p>
          </div>

          {/* Vídeo - Agora vem primeiro no mobile */}
          <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            <h4 className="font-sans text-sm font-semibold text-red-600 mb-3 text-center flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              DEMONSTRAÇÃO
            </h4>
            <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video shadow-lg border-2 border-red-200 group">
              {!videoPlaying ? (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-300"
                  onClick={handleVideoPlay}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg mb-2 mx-auto group-hover:scale-110 transition-transform duration-300 group-hover:from-red-600 group-hover:to-red-700">
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 bg-white/80 px-2 py-1 rounded-full">
                      Assistir vídeo
                    </span>
                  </div>
                </div>
              ) : isYouTubeVideo ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
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

          {/* Conteúdo informativo */}
          <div className="p-4 space-y-4">
            {/* Diferenciais */}
            <div>
              <h4 className="font-sans text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                DIFERENCIAIS
              </h4>
              <ul className="space-y-1">
                {differentials.map((diff, diffIndex) => (
                  <li key={diffIndex} className="flex items-start gap-2 text-xs text-gray-600 bg-white p-2 rounded-lg border border-red-100">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="font-medium">{diff}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Membros da Equipe */}
            <div>
              <h4 className="font-sans text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                <Users2 className="w-4 h-4" />
                {isChampion ? 'TIME VENCEDOR' : 'EQUIPE'}
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                {members.map((member, memberIndex) => (
                  <div key={memberIndex} className="text-center group flex-1 min-w-[70px]">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1 mx-auto overflow-hidden border-2 border-red-300 shadow-lg">
                      <div className="w-full h-full bg-red-400 flex items-center justify-center">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-900 truncate">{member.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-red-500 font-semibold truncate">{member.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Layout original para desktop
  return (
    <div className={`bg-white rounded-2xl shadow-xl border-2 ${borderColor} overflow-hidden h-auto max-h-[85vh] relative`}>
      {/* Faixa no topo */}
      <div className={`absolute top-0 left-0 right-0 h-2 ${topBarColor} z-20`}></div>
      
      <div className="flex h-full">
        {/* Lado Esquerdo - Informações principais */}
        <div className="w-2/5 p-6 border-r border-red-100 flex flex-col justify-between bg-gradient-to-b from-white to-red-50">
          <div>
            <div className="text-center mb-4">
              <div className="text-6xl mb-3 drop-shadow-lg">{medal}</div>
              <h3 className="font-sans text-2xl font-black text-red-600 mb-2 bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                {name}
              </h3>
              <p className="text-gray-600 font-semibold text-base">{project}</p>
            </div>

            {/* Diferenciais */}
            <div className="mb-4">
              <h4 className="font-sans text-base font-semibold text-red-600 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                DIFERENCIAIS
              </h4>
              <ul className="space-y-1">
                {differentials.map((diff, diffIndex) => (
                  <li key={diffIndex} className="flex items-start gap-2 text-xs text-gray-600 bg-white p-2 rounded-lg border border-red-100">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span className="font-medium">{diff}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Membros da Equipe */}
          <div>
            <h4 className="font-sans text-base font-semibold text-red-600 mb-3 flex items-center gap-2">
              <Users2 className="w-4 h-4" />
              {isChampion ? 'TIME VENCEDOR' : isThirdPlace ? 'EQUIPE' : 'EQUIPE'}
            </h4>
            <div className="flex justify-center gap-4">
              {members.map((member, memberIndex) => (
                <div key={memberIndex} className="text-center group">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-200 to-red-300 rounded-full flex items-center justify-center text-white font-bold text-xs mb-1 mx-auto overflow-hidden border-2 border-red-300 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full bg-red-400 flex items-center justify-center">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-900 truncate max-w-[60px]">{member.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-red-500 font-semibold truncate max-w-[60px]">{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito - Vídeo */}
        <div className="w-3/5 p-6 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="w-full max-w-lg">
            <h4 className="font-sans text-base font-semibold text-red-600 mb-3 text-center flex items-center justify-center gap-2">
              <Play className="w-4 h-4" />
              DEMONSTRAÇÃO DO PROJETO
            </h4>
            <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video shadow-lg border-2 border-red-200 group">
              {!videoPlaying ? (
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-gray-300 group-hover:to-gray-400 transition-all duration-300"
                  onClick={handleVideoPlay}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg mb-3 mx-auto group-hover:scale-110 transition-transform duration-300 group-hover:from-red-600 group-hover:to-red-700">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 bg-white/80 px-3 py-1.5 rounded-full">
                      Assistir demonstração
                    </span>
                  </div>
                </div>
              ) : isYouTubeVideo ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
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