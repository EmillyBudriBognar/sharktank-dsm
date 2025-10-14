// src/components/MediaModal.tsx

import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn, ZoomOut, Play } from 'lucide-react';
import gsap from 'gsap';

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'image' | 'video' | 'youtube';
  src?: string;
  title: string;
  youtubeId?: string;
}

const MediaModal = ({ isOpen, onClose, type, src, title, youtubeId }: MediaModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      gsap.fromTo(
        contentRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
      );
    } else {
      document.body.style.overflow = 'auto';
      setIsVideoPlaying(false);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (!modalRef.current || !contentRef.current) return;

    gsap.to(contentRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: 'power2.in',
    });

    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose,
    });

    setIsVideoPlaying(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleVideoPlay = () => setIsVideoPlaying(true);

  const getYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = youtubeId || (src && getYouTubeId(src));

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm px-4"
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="relative max-w-7xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 bg-black/50 backdrop-blur-md rounded-t-2xl px-6 py-4">
          <h3 className="text-white font-display text-xl font-bold">{title}</h3>
          <div className="flex items-center gap-3">
            {type === 'image' && (
              <>
                <button onClick={handleZoomOut} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors" title="Zoom Out">
                  <ZoomOut className="text-white" size={20} />
                </button>
                <button onClick={handleZoomIn} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors" title="Zoom In">
                  <ZoomIn className="text-white" size={20} />
                </button>
              </>
            )}
            <button onClick={handleClose} className="w-10 h-10 bg-white/10 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors group" title="Fechar">
              <X className="text-white" size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden rounded-b-2xl bg-black">
          {type === 'image' && src ? (
            <div className="relative overflow-auto max-h-full max-w-full">
              <img src={src} alt={title} className="max-w-full max-h-[80vh] object-contain transition-transform duration-300" style={{ transform: `scale(${zoom})` }} />
            </div>
          ) : type === 'youtube' && videoId ? (
            <div className="w-full aspect-video max-h-[80vh]">
              <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`} title={title} className="w-full h-full rounded-b-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
            </div>
          ) : type === 'video' && src ? (
            <div className="w-full aspect-video max-h-[80vh] relative">
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-b-2xl">
                  <button onClick={handleVideoPlay} className="w-20 h-20 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Play className="text-white ml-1" size={32} fill="currentColor" />
                  </button>
                </div>
              )}
              <video controls autoPlay={isVideoPlaying} className="w-full h-full rounded-b-2xl" onPlay={handleVideoPlay}>
                <source src={src} type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
          ) : (
            <div className="w-full aspect-video bg-gradient-overlay rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Play className="text-primary" size={32} />
                </div>
                <p className="text-xl font-semibold mb-2">Mídia indisponível</p>
                <p className="text-sm text-white/70">O conteúdo não pôde ser carregado.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaModal;