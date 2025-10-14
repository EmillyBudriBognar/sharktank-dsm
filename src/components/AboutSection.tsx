import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, Variants } from 'framer-motion'; // Import Variants
import {
  Code2,
  Users,
  Trophy,
  Zap,
  Target,
  Sparkles,
  Award,
  Rocket,
} from 'lucide-react';
import { GiSharkFin } from 'react-icons/gi';

const AboutSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Textos em array
  const content = {
    title: 'O QUE É O',
    sharkText: 'SHARKTANK DSM',
    description:
      'SharkTank DSM é mais do que uma competição. É uma experiência transformadora onde desenvolvedores provam suas habilidades, aprendem com os melhores e conquistam reconhecimento no mercado tech.',
    highlightedText: 'experiência transformadora',
    features: [
      {
        icon: Code2,
        glowIcon: Target,
        title: 'Competição de Elite',
        description:
          'Times batalham em desafios de programação de alto nível, resolvendo problemas reais do mercado.',
        stats: '95% dos participantes afirmam evolução técnica',
        gradient: 'from-purple-400 to-pink-400',
        bgGradient: 'from-purple-50 to-pink-50',
        borderColor: 'border-purple-200',
      },
      {
        icon: Users,
        glowIcon: Sparkles,
        title: 'Colaboração Inteligente',
        description:
          'Vencedores se tornam mentores, compartilhando conhecimento através de workshops práticos e code reviews.',
        stats: '+50 mentores formados na última edição',
        gradient: 'from-blue-400 to-cyan-400',
        bgGradient: 'from-blue-50 to-cyan-50',
        borderColor: 'border-blue-200',
      },
      {
        icon: Trophy,
        glowIcon: Award,
        title: 'Duas Fases Épicas',
        description:
          'Primeira fase elege os melhores. Segunda fase: batalha final com jurados especialistas e investidores.',
        stats: '3 rounds eliminatórios + final ao vivo',
        gradient: 'from-orange-400 to-red-400',
        bgGradient: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-200',
      },
      {
        icon: Zap,
        glowIcon: Rocket,
        title: 'Inovação Real',
        description:
          'Projetos que transformam ideias em soluções tecnológicas impactantes, funcionais e escaláveis.',
        stats: '15 startups surgiram das edições anteriores',
        gradient: 'from-green-400 to-emerald-400',
        bgGradient: 'from-green-50 to-emerald-50',
        borderColor: 'border-green-200',
      },
    ],
  };

  // useInView hooks para animações
  const [headerRef, headerInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [cardsRef, cardsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

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

  // Animação para o container principal
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Animação para os elementos filhos
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  // Animação para os cards
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
    hover: {
      y: -4,
      boxShadow: '0 20px 40px rgba(239, 68, 68, 0.15)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  // Animação para o ícone do shark
  const sharkVariants: Variants = {
    hidden: { opacity: 0, scale: 0.75 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.6,
        duration: 0.7,
        ease: 'easeOut',
      },
    },
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section
      id="about"
      className="snap-section min-h-screen py-16 sm:py-32 px-4 sm:px-6 bg-white relative flex items-center overflow-hidden"
    >
      {/* Background Elements */}
      <motion.div
        className="absolute top-10 sm:top-20 left-4 sm:left-10 w-32 h-32 sm:w-64 sm:h-64 bg-primary/5 rounded-full blur-2xl sm:blur-3xl opacity-60"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-40 h-40 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur-2xl sm:blur-3xl opacity-60"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-accent/5 rounded-full blur-2xl sm:blur-3xl opacity-40" />

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Header Section */}
        <motion.div
          ref={headerRef}
          className="text-center mb-8 sm:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6"
          >
            <div className="w-8 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-primary" />
            <motion.div
              variants={sharkVariants}
              animate={headerInView ? ['visible', 'pulse'] : 'hidden'}
            >
              <GiSharkFin className="w-8 h-8 sm:w-12 sm:h-12 text-primary drop-shadow-lg" />
            </motion.div>
            <div className="w-8 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-primary" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 tracking-tight px-2">
              {content.title}{' '}
              <motion.span variants={sharkVariants} className="text-primary">
                {content.sharkText}
              </motion.span>
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-foreground max-w-4xl mx-auto leading-relaxed font-semibold px-2 sm:px-4">
              {content.description.split(content.highlightedText)[0]}
              <span className="text-primary font-bold">
                {content.highlightedText}
              </span>
              {content.description.split(content.highlightedText)[1]}
            </p>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={cardsInView ? 'visible' : 'hidden'}
        >
          {content.features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                whileHover={!isMobile ? 'hover' : undefined}
                whileTap={isMobile ? 'tap' : undefined}
                className="group bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-shark transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-shark rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon
                      className="text-primary-foreground"
                      size={isMobile ? 20 : 28}
                    />
                  </motion.div>
                  <h3 className="font-display text-base sm:text-lg font-bold mb-2 sm:mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;