import { useInView } from 'react-intersection-observer';
import { motion, Variants } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Textos em array
  const content = {
    title: "SharkTank DSM",
    highlightedTitle: "Tank",
    description: "O maior campeonato de programação. Transformando desenvolvedores em campeões.",
    acknowledgments: {
      title: "Agradecimentos Especiais",
      fatec: {
        logo: "/logo-fatec_diadema.png",
        alt: "Fatec Diadema"
      },
      andrea: {
        name: "Coordenadora Andréa Zotovici",
        role: "Por tornar este projeto possível"
      },
      bruno: {
        name: "Prof. Bruno Zolotareff", 
        role: "Pela iniciativa e orientação"
      }
    },
    copyright: {
      text: `© ${currentYear} SharkTank DSM - Todos os direitos reservados`,
      developedBy: "Desenvolvido por",
      budri: {
        name: "Budri",
        link: "https://budri.com.br"
      }
    }
  };

  // useInView hooks para animações
  const [titleRef, titleInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const [acknowledgmentsRef, acknowledgmentsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [copyrightRef, copyrightInView] = useInView({
    threshold: 0.3,
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

  const slideInVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const scaleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut"
      }
    }
  };

  return (
    <footer className="bg-primary text-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          ref={titleRef}
          className="flex flex-col items-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={titleInView ? "visible" : "hidden"}
        >
          <motion.h3 
            className="font-display text-3xl font-bold text-center"
            variants={itemVariants}
          >
            Shark<span className="text-red-400">{content.highlightedTitle}</span> DSM
          </motion.h3>
          <motion.p 
            className="text-gray-100 text-center mt-2 max-w-md"
            variants={itemVariants}
          >
            {content.description}
          </motion.p>
        </motion.div>

        {/* Agradecimentos */}
        <motion.div 
          ref={acknowledgmentsRef}
          className="bg-red-800 rounded-lg p-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate={acknowledgmentsInView ? "visible" : "hidden"}
        >
          <motion.h4 
            className="font-display text-xl font-semibold text-center mb-6 text-white"
            variants={itemVariants}
          >
            {content.acknowledgments.title}
          </motion.h4>
          
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* Logo Fatec */}
            <motion.div 
              className="text-center"
              variants={scaleVariants}
            >
              <motion.img 
                src={content.acknowledgments.fatec.logo} 
                alt={content.acknowledgments.fatec.alt} 
                className="h-16 w-auto object-contain mx-auto mb-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
            
            {/* Coordenadora Andréa */}
            <motion.div 
              className="text-center"
              variants={slideInVariants}
            >
              <motion.p 
                className="font-medium mb-2"
                whileHover={{ color: "#fecaca" }}
                transition={{ duration: 0.2 }}
              >
                {content.acknowledgments.andrea.name}
              </motion.p>
              <motion.p 
                className="text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {content.acknowledgments.andrea.role}
              </motion.p>
            </motion.div>
            
            {/* Professor Bruno */}
            <motion.div 
              className="text-center"
              variants={slideInVariants}
              custom={1}
            >
              <motion.p 
                className="font-medium mb-2"
                whileHover={{ color: "#fecaca" }}
                transition={{ duration: 0.2 }}
              >
                {content.acknowledgments.bruno.name}
              </motion.p>
              <motion.p 
                className="text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {content.acknowledgments.bruno.role}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          ref={copyrightRef}
          className="border-t border-red-900 pt-6 flex flex-col sm:flex-row justify-between items-center"
          variants={containerVariants}
          initial="hidden"
          animate={copyrightInView ? "visible" : "hidden"}
        >
          <motion.p 
            className="text-gray-100 text-sm mb-4 sm:mb-0"
            variants={itemVariants}
          >
            {content.copyright.text}
          </motion.p>
          
          <motion.div 
            className="flex items-center gap-1 text-gray-100"
            variants={itemVariants}
          >
            <span className="text-sm">{content.copyright.developedBy}</span>
            <motion.a 
              href={content.copyright.budri.link}
              className="text-white hover:text-red-200 transition-colors duration-300 font-medium flex items-center gap-1"
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ 
                scale: 1.05,
                color: "#fecaca"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {content.copyright.budri.name}
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;