import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, Variants } from 'framer-motion';
import heroImage from '@/assets/hero-shark.jpg';
import phase1Image from '@/assets/phase1-team.jpg';
import workshopImage from '@/assets/workshop.jpg';
import awardsImage from '@/assets/awards.jpg';
import { Camera, Play } from 'lucide-react';
import GalleryModal from './GalleryModal';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const GallerySection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Textos em array
  const content = {
    title: "GALERIA",
    highlightedTitle: "ÉPICA",
    description: "Momentos inesquecíveis capturados durante o SharkTank DSM",
    cta: {
      text: "Quer ver mais? Confira o álbum completo e vídeos estendidos!",
      button: "Ver Álbum Completo 📸"
    },
    labels: {
      photo: "Foto",
      video: "Vídeo"
    }
  };

  const galleryItems = [
    { type: 'image' as const, src: heroImage, title: 'Abertura do Evento' },
    { type: 'video' as const, title: 'Highlights da Fase 1' },
    { type: 'image' as const, src: phase1Image, title: 'Times em Ação' },
    { type: 'video' as const, title: 'Workshop em Destaque' },
    { type: 'image' as const, src: workshopImage, title: 'Mentoria dos Vencedores' },
    { type: 'video' as const, title: 'Apresentação Final' },
    { type: 'image' as const, src: awardsImage, title: 'Cerimônia de Premiação' },
    { type: 'video' as const, title: 'Depoimentos dos Campeões' },
  ];

  // useInView hooks para animações
  const [titleRef, titleInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '-100px 0px'
  });

  const [gridRef, gridInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '-50px 0px'
  });

  const [ctaRef, ctaInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
    rootMargin: '-100px 0px'
  });

  // Variants para animações
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const gridItemVariants: Variants = {
    hidden: { opacity: 0, x: 60, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  const contentVariants: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(239, 68, 68, 0.4)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

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
      
      <section id="gallery" className="snap-section min-h-screen py-20 sm:py-32 px-4 sm:px-6 bg-white relative overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <motion.div 
            ref={titleRef}
            className="text-center mb-8 sm:mb-12"
            variants={containerVariants}
            initial="hidden"
            animate={titleInView ? "visible" : "hidden"}
          >
            <motion.h2 
              className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
              variants={itemVariants}
            >
              {content.title} <span className="text-primary">{content.highlightedTitle}</span>
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4"
              variants={itemVariants}
            >
              {content.description}
            </motion.p>
          </motion.div>

          {/* Grid para desktop */}
          <motion.div 
            ref={gridRef}
            className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={gridInView ? "visible" : "hidden"}
          >
            {galleryItems.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={gridItemVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => openModal(index)}
                className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-card hover:shadow-shark transition-all duration-500 transform-gpu"
                style={{ aspectRatio: '1/1' }}
              >
                {item.type === 'image' ? (
                  <>
                    <img 
                      src={item.src} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"
                      variants={overlayVariants}
                      initial="hidden"
                      whileHover="visible"
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 p-4 text-background"
                      variants={contentVariants}
                      initial="hidden"
                      whileHover="visible"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Camera size={20} />
                        <span className="text-sm font-semibold">{content.labels.photo}</span>
                      </div>
                      <p className="font-display font-bold">{item.title}</p>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <div className="w-full h-full bg-gradient-overlay flex items-center justify-center">
                      <motion.div 
                        className="w-20 h-20 bg-primary rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Play className="text-primary-foreground ml-1" size={32} />
                      </motion.div>
                    </div>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"
                      variants={overlayVariants}
                      initial="hidden"
                      whileHover="visible"
                    />
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 p-4 text-background"
                      variants={contentVariants}
                      initial="hidden"
                      whileHover="visible"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Play size={20} />
                        <span className="text-sm font-semibold">{content.labels.video}</span>
                      </div>
                      <p className="font-display font-bold">{item.title}</p>
                    </motion.div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Carrossel para mobile */}
          <div className="md:hidden px-4">
            <Carousel className="w-full max-w-sm mx-auto">
              <CarouselContent>
                {galleryItems.map((item, index) => (
                  <CarouselItem key={index}>
                    <motion.div
                      onClick={() => openModal(index)}
                      className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-card"
                      style={{ aspectRatio: '1/1' }}
                      whileTap="tap"
                      variants={{
                        tap: { scale: 0.95 }
                      }}
                    >
                      {item.type === 'image' ? (
                        <>
                          <img 
                            src={item.src} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
                            <div className="flex items-center gap-2 mb-2">
                              <Camera size={18} />
                              <span className="text-xs font-semibold">{content.labels.photo}</span>
                            </div>
                            <p className="font-display font-bold text-sm">{item.title}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full h-full bg-gradient-overlay flex items-center justify-center">
                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                              <Play className="text-primary-foreground ml-1" size={28} />
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-background">
                            <div className="flex items-center gap-2 mb-2">
                              <Play size={18} />
                              <span className="text-xs font-semibold">{content.labels.video}</span>
                            </div>
                            <p className="font-display font-bold text-sm">{item.title}</p>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 -translate-x-1/2" />
              <CarouselNext className="right-0 translate-x-1/2" />
            </Carousel>
          </div>

          {/* CTA Section */}
          <motion.div 
            ref={ctaRef}
            className="mt-16 text-center"
            variants={containerVariants}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
          >
            <motion.p 
              className="text-muted-foreground mb-6"
              variants={itemVariants}
            >
              {content.cta.text}
            </motion.p>
            <motion.button 
              className="bg-gradient-shark text-primary-foreground px-8 py-4 rounded-xl font-display font-bold text-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {content.cta.button}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default GallerySection;