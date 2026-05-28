import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '@/assets/hero-shark.jpg';
import phase1Image from '@/assets/phase1-team.jpg';
import workshopImage from '@/assets/workshop.jpg';
import awardsImage from '@/assets/awards.jpg';
import { Camera, Play } from 'lucide-react';
import GalleryModal from './GalleryModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useActiveEdition } from '@/hooks/useActiveEdition';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const GallerySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data } = useActiveEdition();

  const content = {
    title: "O LEGADO",
    highlightedTitle: "SHARK TANK DSM",
    description: "Inspire-se nas mentes brilhantes que já deixaram sua marca. Veja os momentos mais épicos e inovadores das edições anteriores.",
    cta: {
      text: "Quer ver como as ideias ganham vida? Confira o acervo completo e sinta a energia!",
      button: "DESBLOQUEAR ÁLBUM COMPLETO 📸"
    },
    labels: {
      photo: "Foto",
      video: "Vídeo"
    }
  };

  const fallbackGalleryItems = [
    { type: 'image' as const, src: heroImage, title: 'Abertura do Evento' },
    { type: 'video' as const, title: 'Highlights da Fase 1' },
    { type: 'image' as const, src: phase1Image, title: 'Times em Ação' },
    { type: 'video' as const, title: 'Workshop em Destaque' },
    { type: 'image' as const, src: workshopImage, title: 'Mentoria dos Vencedores' },
    { type: 'video' as const, title: 'Apresentação Final' },
    { type: 'image' as const, src: awardsImage, title: 'Cerimônia de Premiação' },
    { type: 'video' as const, title: 'Depoimentos dos Campeões' },
  ];

  const galleryItems = data?.gallery?.length > 0 ? data.gallery.map((g: any) => ({
    type: g.image_url.includes('.mp4') || g.image_url.includes('youtube') || g.image_url.includes('vimeo') ? 'video' as const : 'image' as const,
    src: g.image_url,
    title: g.caption || 'Sem legenda'
  })) : fallbackGalleryItems;

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Title animation
    gsap.fromTo('.gallery-title-anim', 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gallery-header',
          start: 'top 80%'
        }
      }
    );

    // Grid items animation
    gsap.fromTo('.gallery-item',
      { opacity: 0, scale: 0.8, y: 50 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 75%'
        }
      }
    );

    // CTA animation
    gsap.fromTo('.gallery-cta',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gallery-cta',
          start: 'top 90%'
        }
      }
    );

    // Hover effects for grid items
    const items = gsap.utils.toArray('.gallery-item') as HTMLElement[];
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { scale: 1.05, y: -10, duration: 0.3, ease: 'power2.out', boxShadow: '0 20px 25px -5px rgba(220, 38, 38, 0.2)' });
        const overlay = item.querySelector('.gallery-overlay');
        const content = item.querySelector('.gallery-content');
        if(overlay) gsap.to(overlay, { opacity: 1, duration: 0.3 });
        if(content) gsap.to(content, { y: 0, opacity: 1, duration: 0.3, ease: 'back.out(2)' });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' });
        const overlay = item.querySelector('.gallery-overlay');
        const content = item.querySelector('.gallery-content');
        if(overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
        if(content) gsap.to(content, { y: 20, opacity: 0, duration: 0.3 });
      });
    });
  }, { scope: sectionRef });

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    setSelectedIndex((prev) => {
      if (direction === 'prev') {
        return prev === 0 ? galleryItems.length - 1 : prev - 1;
      } else {
        return prev === galleryItems.length - 1 ? 0 : prev + 1;
      }
    });
  };

  return (
    <>
      <GalleryModal
        isOpen={modalOpen}
        onClose={closeModal}
        items={galleryItems}
        currentIndex={selectedIndex}
        onNavigate={handleNavigate}
      />
      
      <section id="gallery" ref={sectionRef} className="snap-section min-h-screen py-24 px-4 sm:px-6 bg-gray-50 text-slate-900 relative overflow-hidden flex items-center border-t border-gray-200">
        <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-red-50 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full z-10">
          {/* Header Section */}
          <div className="gallery-header text-center mb-12 sm:mb-16">
            <h2 className="gallery-title-anim text-4xl sm:text-6xl md:text-7xl font-black mb-4 tracking-tighter">
              {content.title} <span className="text-red-600 relative">
                {content.highlightedTitle}
                <span className="absolute -bottom-2 left-0 w-full h-[4px] bg-red-600/20 rounded-full"></span>
              </span>
            </h2>
            <p className="gallery-title-anim text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4 font-medium">
              {content.description}
            </p>
          </div>

          {/* Carrossel para todas as telas */}
          <div className="px-4">
            <Carousel className="w-full max-w-sm md:max-w-3xl lg:max-w-7xl mx-auto">
              <CarouselContent>
                {galleryItems.map((item, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                    <div
                      onClick={() => openModal(index)}
                      className="relative cursor-pointer rounded-3xl overflow-hidden shadow-md border border-gray-200"
                      style={{ aspectRatio: '1/1' }}
                    >
                      {item.type === 'image' ? (
                        <>
                          <img 
                            src={item.src} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white group-hover:translate-y-0 transition-transform">
                            <div className="flex items-center gap-2 mb-2 text-red-400">
                              <Camera size={18} />
                              <span className="text-xs font-bold uppercase tracking-wider">{content.labels.photo}</span>
                            </div>
                            <p className="font-bold text-lg">{item.title}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] mix-blend-overlay"></div>
                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)] z-10">
                              <Play className="text-white ml-1" size={28} />
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <div className="flex items-center gap-2 mb-2 text-red-400">
                              <Play size={18} />
                              <span className="text-xs font-bold uppercase tracking-wider">{content.labels.video}</span>
                            </div>
                            <p className="font-bold text-lg">{item.title}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 -translate-x-1/2 md:-translate-x-4 bg-white border-gray-200 text-slate-600 hover:bg-gray-50 hover:text-slate-900 shadow-sm" />
              <CarouselNext className="right-0 translate-x-1/2 md:translate-x-4 bg-white border-gray-200 text-slate-600 hover:bg-gray-50 hover:text-slate-900 shadow-sm" />
            </Carousel>

            <div className="mt-12 text-center">
              <a href="/edicoes-passadas" className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 font-bold transition-colors group">
                <span>Veja tudo sobre as edições passadas</span>
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GallerySection;