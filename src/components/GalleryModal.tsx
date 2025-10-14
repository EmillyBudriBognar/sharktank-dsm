import { useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

interface GalleryItem {
  type: 'image' | 'video';
  src?: string;
  title: string;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: GalleryItem[];
  currentIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const GalleryModal = ({ isOpen, onClose, items, currentIndex, onNavigate }: GalleryModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
        { scale: 0.85, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.3)' }
      );
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Animate image transitions
  useEffect(() => {
    if (!imageRef.current || !isOpen) return;

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.95, x: 30 },
      { opacity: 1, scale: 1, x: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [currentIndex, isOpen]);

  const handleClose = useCallback(() => {
    if (!modalRef.current || !contentRef.current) return;

    gsap.to(contentRef.current, {
      scale: 0.85,
      opacity: 0,
      y: 40,
      duration: 0.3,
      ease: 'power2.in',
    });

    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose,
    });
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, onNavigate]);

  if (!isOpen) return null;

  const currentItem = items[currentIndex];

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
        {/* Header */}
        <div className="flex items-center justify-between mb-4 bg-black/50 backdrop-blur-md rounded-t-2xl px-4 sm:px-6 py-3 sm:py-4">
          <h3 className="text-white font-display text-base sm:text-xl font-bold truncate mr-4">
            {currentItem.title}
          </h3>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="text-white/60 text-xs sm:text-sm font-medium">
              {currentIndex + 1} / {items.length}
            </span>
            <button 
              onClick={handleClose} 
              className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors group" 
              title="Fechar"
              aria-label="Fechar"
            >
              <X className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden rounded-b-2xl bg-black relative">
          {currentItem.type === 'image' && currentItem.src ? (
            <img 
              ref={imageRef}
              src={currentItem.src} 
              alt={currentItem.title} 
              className="max-w-full max-h-[80vh] object-contain" 
            />
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
              <div className="text-center text-white p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <div className="w-0 h-0 border-l-[20px] border-l-primary border-y-[12px] border-y-transparent ml-1" />
                </div>
                <p className="text-lg sm:text-xl font-semibold mb-2">Vídeo em breve</p>
                <p className="text-sm text-white/70">O conteúdo será disponibilizado em breve.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('prev');
                }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Anterior"
              >
                <ChevronLeft className="text-white" size={24} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('next');
                }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/20"
                aria-label="Próximo"
              >
                <ChevronRight className="text-white" size={24} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;