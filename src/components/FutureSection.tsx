import { useInView } from 'react-intersection-observer';
import { motion, Variants } from 'framer-motion';
import { Calendar, TrendingUp, Users, Zap } from 'lucide-react';

const FutureSection = () => {
  const content = {
    title: 'O FUTURO É',
    highlightedTitle: 'AGORA',
    description:
      'O SharkTank DSM é apenas o começo de uma jornada épica. Prepare-se para as próximas edições ainda mais impressionantes!',
    cta: {
      title: '🚀 Quer participar da próxima edição?',
      description:
        'Fique atento aos nossos canais para não perder as inscrições. A próxima geração de campeões pode incluir você!',
      buttons: {
        register: 'Cadastrar Interesse',
        sponsor: 'Ser patrocinador',
      },
    },
  };

  const futureEditions = [
    {
      icon: Calendar,
      title: 'Próxima Edição',
      description:
        'SharkTank DSM 2.0 já está em planejamento! Ainda mais desafiador e com prêmios maiores.',
    },
    {
      icon: TrendingUp,
      title: 'Novos Desafios',
      description:
        'Temáticas mais complexas, tecnologias emergentes e problemas reais do mercado.',
    },
    {
      icon: Users,
      title: 'Mais Equipes',
      description:
        'Expansão para receber mais times e criar uma comunidade ainda maior de desenvolvedores.',
    },
    {
      icon: Zap,
      title: 'Parcerias Especiais',
      description:
        'Colaborações com empresas tech para mentorias, vagas e oportunidades exclusivas.',
    },
  ];

  const [titleRef, titleInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [cardsRef, cardsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [ctaRef, ctaInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -4,
      scale: 1.02,
      borderColor: 'rgba(239, 68, 68, 0.5)',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const iconVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'backOut',
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="snap-section min-h-screen py-16 sm:py-24 lg:py-32 px-4 sm:px-6 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden flex items-center">
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        variants={pulseVariants}
        animate="pulse"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary rounded-full blur-[120px]" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <motion.div
          ref={titleRef}
          className="text-center mb-12 sm:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={titleInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {content.title}{' '}
              <span className="text-primary drop-shadow-glow">
                {content.highlightedTitle}
              </span>
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              {content.description}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          ref={cardsRef}
          className="grid sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={cardsInView ? 'visible' : 'hidden'}
        >
          {futureEditions.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-8 hover:shadow-shark transition-all duration-500 group"
            >
              <div className="flex items-start gap-6">
                <motion.div
                  className="flex-shrink-0 w-16 h-16 bg-gradient-shark rounded-xl flex items-center justify-center"
                  variants={iconVariants}
                  whileHover="hover"
                >
                  <item.icon className="text-primary-foreground" size={32} />
                </motion.div>
                <div>
                  <motion.h3
                    className="font-display text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    className="text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    {item.description}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          ref={ctaRef}
          className="text-center bg-gradient-overlay border border-primary/30 rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-card"
          variants={containerVariants}
          initial="hidden"
          animate={ctaInView ? 'visible' : 'hidden'}
        >
          <motion.div variants={itemVariants}>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black mb-4 sm:mb-6 text-primary">
              {content.cta.title}
            </h3>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-base sm:text-lg text-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              {content.cta.description}
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            variants={containerVariants}
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-gradient-shark text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-display font-bold text-base sm:text-lg hover:shadow-glow transition-all duration-300"
            >
              {content.cta.buttons.register}
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="border-2 border-primary text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-display font-bold text-base sm:text-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              {content.cta.buttons.sponsor}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FutureSection;