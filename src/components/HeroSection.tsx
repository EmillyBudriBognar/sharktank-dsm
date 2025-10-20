import { useInView } from 'react-intersection-observer';
import { motion, Variants } from 'framer-motion';
import { Zap } from 'lucide-react';
import { GiSharkFin } from 'react-icons/gi';

const HeroSection = () => {
  // Textos em array
  const content = {
    title: {
      part1: "SHARK",
      part2: "TANK", 
      part3: "DSM"
    },
    subtitle: {
      line1: "ONDE",
      highlighted1: "TUBARÕES DA PROGRAMAÇÃO",
      line2: "SE ENCONTRAM",
      line3: "COM A", 
      highlighted2: "TECNOLOGIA DO FUTURO"
    },
  };

  // useInView hook - sempre visível pois é o hero
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
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

  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const decorVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.6
      }
    }
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-red-50/30 to-white overflow-hidden py-16"
    >
      {/* Enhanced background patterns */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
      >
        {/* Decorations */}
        <motion.div 
          className="flex items-center justify-center gap-8 mb-8 sm:mb-12"
          variants={decorVariants}
          animate={["visible", "pulse"]}
        >
          <motion.div 
            className="w-12 sm:w-20 h-0.5 bg-gradient-to-r from-transparent to-primary"
            variants={lineVariants}
          />
          <GiSharkFin className="w-8 h-8 sm:w-12 sm:h-12 text-primary drop-shadow-[0_0_8px_rgba(178,0,0,0.6)]" />
          <motion.div 
            className="w-12 sm:w-20 h-0.5 bg-gradient-to-l from-transparent to-primary"
            variants={lineVariants}
          />
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-4 sm:mb-6 tracking-tighter leading-[0.9]">
          <motion.div 
            className="mb-1 sm:mb-2"
            variants={titleVariants}
          >
            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(178,0,0,0.3)]">
              {content.title.part1}
            </span>
          </motion.div>
          
          <motion.div 
            className="mb-1 sm:mb-2"
            variants={titleVariants}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
              {content.title.part2}
            </span>
          </motion.div>
          
          <motion.div 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary font-extrabold mt-2 sm:mt-4 tracking-widest"
            variants={titleVariants}
            transition={{ delay: 0.4 }}
          >
            {content.title.part3}
          </motion.div>
        </h1>

        {/* Middle Decorations */}
        <motion.div 
          className="flex items-center justify-center gap-3 sm:gap-4 my-6 sm:my-8"
          variants={decorVariants}
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="w-8 sm:w-12 h-0.5 bg-primary/60"
            variants={lineVariants}
          />
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <motion.div 
            className="w-8 sm:w-12 h-0.5 bg-primary/60"
            variants={lineVariants}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-foreground mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed font-semibold px-2"
          variants={subtitleVariants}
        >
          {content.subtitle.line1}{' '}
          <span className="text-primary font-bold">{content.subtitle.highlighted1}</span>{' '}
          {content.subtitle.line2}
          <br className="hidden sm:block" />
          {content.subtitle.line3}{' '}
          <span className="text-primary font-bold">{content.subtitle.highlighted2}</span>
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroSection;