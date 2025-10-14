import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const Navigation = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goBack = () => {
    window.history.back();
  };

  return (
    <>
      {/* Enhanced Progress Bar with glow */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50 shadow-sm">
        <div 
          className="h-full bg-gradient-to-r from-primary via-primary-glow to-primary transition-all duration-300 shadow-glow"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Enhanced Back Button */}
      <button
        onClick={goBack}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-40 w-10 h-10 sm:w-12 sm:h-12 bg-card/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-card hover:shadow-shark transition-all duration-300 hover:scale-110 hover:bg-primary group border border-border"
        aria-label="Voltar"
      >
        <ArrowLeft 
          size={20}
          className="text-primary group-hover:text-primary-foreground transition-colors duration-300 sm:w-6 sm:h-6" 
        />
      </button>
    </>
  );
};

export default Navigation;