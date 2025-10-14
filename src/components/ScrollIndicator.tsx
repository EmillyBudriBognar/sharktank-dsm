import { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import gsap from 'gsap';

const ScrollIndicator = () => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [sectionIds, setSectionIds] = useState<string[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const arrowRef = useRef<HTMLDivElement>(null);
  const gsapContextRef = useRef<gsap.Context>();

  useEffect(() => {
    const getAllSections = () => {
      const sectionsWithIds = Array.from(document.querySelectorAll('[id]'))
        .filter(element => {
          const id = element.id;
          return id.includes('-section') || id === 'footer';
        })
        .sort((a, b) => {
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        })
        .map(element => element.id);

      return sectionsWithIds;
    };

    const handleScroll = () => {
      const sections = getAllSections();
      if (sections.length === 0) return;

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let currentIndex = 0;
      let minDistance = Infinity;

      sections.forEach((sectionId, index) => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const top = element.offsetTop;
        const bottom = top + element.offsetHeight;
        
        if (scrollPosition >= top && scrollPosition < bottom) {
          const distance = Math.abs(scrollPosition - (top + bottom) / 2);
          if (distance < minDistance) {
            minDistance = distance;
            currentIndex = index;
          }
        }

        if (sectionId === 'footer' && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
          currentIndex = sections.length - 1;
        }
      });

      setCurrentSectionIndex(currentIndex);
      setSectionIds(sections);
    };

    let scrollTimer: any;
    const debouncedScroll = () => {
      setIsScrolling(true);
      handleScroll();
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => setIsScrolling(false), 100);
    };

    const observer = new MutationObserver(handleScroll);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      clearTimeout(scrollTimer);
      observer.disconnect();
      gsapContextRef.current?.revert();
    };
  }, []);

  // Configura o GSAP para detectar os tons específicos do SharkTank
  useEffect(() => {
    if (!arrowRef.current) return;

    gsapContextRef.current = gsap.context(() => {
      
      // Tons de vermelho específicos do seu design system
      const sharkRedColors = [
        // Shark Red #B20000 e variações
        'hsl(0 100% 35%)', // --primary
        'hsl(0 100% 45%)', // --primary-glow
        'hsl(0 100% 25%)', // --primary-dark
        '#B20000', // Hex equivalente
        '#CC0000', // Mais claro
        '#990000', // Mais escuro
        '#FF0000'  // Vermelho puro como fallback
      ];

      // Função para normalizar cores HSL
      const normalizeHSL = (hslString: string): string => {
        // Converte "hsl(0 100% 35%)" para formato padrão
        const match = hslString.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%\)/);
        if (match) {
          const [, h, s, l] = match;
          return `hsl(${h} ${s}% ${l}%)`;
        }
        return hslString;
      };

      const checkRedBackground = () => {
        if (!arrowRef.current) return false;

        const arrowRect = arrowRef.current.getBoundingClientRect();
        const centerX = arrowRect.left + arrowRect.width / 2;
        const centerY = arrowRect.top + arrowRect.height / 2;
        
        // Encontra o elemento na posição da setinha
        const elementBelow = document.elementFromPoint(centerX, centerY);
        if (!elementBelow) return false;

        // Verifica se o elemento ou seus pais têm cor vermelha do SharkTank
        let currentElement: Element | null = elementBelow;
        
        while (currentElement && currentElement !== document.body) {
          const styles = window.getComputedStyle(currentElement as Element);
          const bgColor = styles.backgroundColor;
          
          // Converte rgb para hsl para comparação precisa
          const rgbToHsl = (r: number, g: number, b: number): string => {
            r /= 255;
            g /= 255;
            b /= 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0, s = 0, l = (max + min) / 2;

            if (max !== min) {
              const d = max - min;
              s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
              
              switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
              }
              h /= 6;
            }

            h = Math.round(h * 360);
            s = Math.round(s * 100);
            l = Math.round(l * 100);

            return `hsl(${h} ${s}% ${l}%)`;
          };

          // Extrai valores RGB
          const rgb = bgColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            
            const currentHsl = rgbToHsl(r, g, b);
            const normalizedHsl = normalizeHSL(currentHsl);

            // Verifica se a cor corresponde aos tons SharkTank
            const isSharkRed = sharkRedColors.some(redColor => {
              const normalizedRed = normalizeHSL(redColor);
              
              // Comparação direta
              if (normalizedHsl === normalizedRed) return true;
              
              // Fallback: verifica se é um vermelho próximo
              if (normalizedHsl.includes('hsl(0') && 
                  parseInt(normalizedHsl.match(/\d+/g)?.[1] || '0') > 80 && // Saturação > 80%
                  parseInt(normalizedHsl.match(/\d+/g)?.[2] || '0') >= 20 && // Luminosidade entre 20-50%
                  parseInt(normalizedHsl.match(/\d+/g)?.[2] || '0') <= 50) {
                return true;
              }
              
              return false;
            });

            if (isSharkRed) return true;
          }

          // Também verifica classes CSS que podem indicar fundo vermelho
          const classList = (currentElement as HTMLElement).classList;
          if (classList && (
            classList.contains('bg-primary') ||
            classList.contains('bg-red') ||
            classList.contains('bg-shark') ||
            Array.from(classList).some(className => 
              className.includes('primary') || 
              className.includes('red') ||
              className.includes('shark')
            )
          )) {
            return true;
          }

          currentElement = currentElement.parentElement;
        }

        return false;
      };

      // Animação para mudar a cor da setinha
      const updateArrowColor = () => {
        const isRedBackground = checkRedBackground();
        
        // Anima a cor do ícone
        gsap.to(arrowRef.current, {
          color: isRedBackground ? '#ffffff' : 'hsl(0 100% 35%)',
          duration: 0.3,
          ease: "power2.out"
        });

        // Anima o background do container
        gsap.to(arrowRef.current, {
          backgroundColor: isRedBackground 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(178, 0, 0, 0.1)',
          borderColor: isRedBackground 
            ? 'rgba(255, 255, 255, 0.4)' 
            : 'rgba(178, 0, 0, 0.3)',
          duration: 0.3,
          ease: "power2.out"
        });

        // Anima o badge se existir
        const badge = arrowRef.current?.parentElement?.querySelector('span');
        if (badge) {
          gsap.to(badge, {
            backgroundColor: isRedBackground 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(255, 255, 255, 0.9)',
            borderColor: isRedBackground 
              ? 'rgba(255, 255, 255, 0.3)' 
              : 'rgba(178, 0, 0, 0.2)',
            color: isRedBackground ? '#ffffff' : 'hsl(0 0% 10%)',
            duration: 0.3,
            ease: "power2.out"
          });
        }
      };

      // Verifica a cor periodicamente
      const interval = setInterval(updateArrowColor, 150);
      window.addEventListener('scroll', updateArrowColor);
      window.addEventListener('resize', updateArrowColor);

      // Verificação inicial
      setTimeout(updateArrowColor, 200);

      return () => {
        clearInterval(interval);
        window.removeEventListener('scroll', updateArrowColor);
        window.removeEventListener('resize', updateArrowColor);
      };
    });

    return () => {
      gsapContextRef.current?.revert();
    };
  }, []);

  const scrollToNext = () => {
    if (sectionIds.length === 0) return;

    const nextIndex = Math.min(currentSectionIndex + 1, sectionIds.length - 1);
    const nextSectionId = sectionIds[nextIndex];
    
    if (nextSectionId) {
      const element = document.getElementById(nextSectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  const scrollToTop = () => {
    const firstSectionId = sectionIds[0];
    if (firstSectionId) {
      const element = document.getElementById(firstSectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (sectionIds.length === 0) return null;

  const isLastSection = currentSectionIndex === sectionIds.length - 1;
  const isFirstSection = currentSectionIndex === 0;

  return (
    <>
      {/* Setinha para baixo - aparece quando NÃO está na última seção */}
      {!isLastSection && (
        <button
          onClick={scrollToNext}
          className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 transition-all duration-500 group"
          aria-label="Próxima seção"
        >
          <span className="text-xs sm:text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-700 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border transform translate-y-2 group-hover:translate-y-0">
            {currentSectionIndex + 1} / {sectionIds.length}
          </span>
          <div 
            ref={arrowRef}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 border shadow-lg group-hover:shadow-xl ${
              isScrolling ? 'opacity-70' : 'animate-bounce-slow'
            }`}
          >
            <ChevronDown 
              size={24} 
              className="group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
        </button>
      )}

      {/* Setinha para cima - aparece quando está na última seção (footer) */}
      {isLastSection && !isFirstSection && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 transition-all duration-500 group"
          aria-label="Voltar ao topo"
        >
          <span className="text-xs sm:text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-700 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border transform translate-y-2 group-hover:translate-y-0">
            Voltar ao início
          </span>
          <div 
            ref={arrowRef}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 border shadow-lg group-hover:shadow-xl ${
              isScrolling ? 'opacity-70' : 'animate-bounce-slow'
            }`}
          >
            <ChevronUp 
              size={24} 
              className="group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
        </button>
      )}
    </>
  );
};

export default ScrollIndicator;