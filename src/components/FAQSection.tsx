import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plus, Minus } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FAQSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const faqs = [
    {
      question: "Quem pode participar do SharkTank DSM?",
      answer: "Apenas alunos regularmente matriculados. As inscrições das equipes devem ser realizadas exclusivamente por um professor orientador vinculado à instituição, através do Portal do Professor."
    },
    {
      question: "Como funciona a divisão de fases?",
      answer: "O evento é dividido em duas fases. A Fase 1 foca na ideação e prototipação básica. Os projetos mais promissores são classificados para a Fase 2, onde passam por mentorias e finalizam o desenvolvimento para o grande Pitch aos Tubarões."
    },
    {
      question: "O que os jurados avaliam no projeto?",
      answer: "A avaliação cobre quatro pilares principais: Inovação e Criatividade, Viabilidade Técnica (Qualidade do Código e Arquitetura), Experiência do Usuário (UI/UX) e o Modelo de Negócio apresentado durante o Pitch."
    },
    {
      question: "Os direitos sobre o projeto pertencem à instituição?",
      answer: "Não! A Propriedade Intelectual do que for desenvolvido durante o SharkTank DSM pertence integralmente à sua equipe. A instituição tem direito apenas de divulgar os projetos como cases de sucesso."
    },
    {
      question: "Podemos usar ferramentas No-Code / Low-Code?",
      answer: "O foco principal do evento é avaliar a capacidade de engenharia de software da equipe. Embora ferramentas Low-Code possam ser usadas para MVPs rápidos, a arquitetura e o código desenvolvido do zero terão pontuação significativamente maior."
    }
  ];

  useGSAP(() => {
    if (!sectionRef.current) return;

    // Header Reveal
    gsap.fromTo('.faq-header',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%"
        }
      }
    );

    // Accordion items staggered reveal
    const items = gsap.utils.toArray('.faq-item');
    gsap.fromTo(items,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.faq-list',
          start: "top 80%"
        }
      }
    );

  }, { scope: sectionRef });

  const toggleAccordion = (index: number) => {
    const isOpening = openIndex !== index;
    setOpenIndex(isOpening ? index : null);

    // Close all other items
    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      if (i === index && isOpening) {
        gsap.to(el, {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        });
      } else {
        gsap.to(el, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut"
        });
      }
    });
  };

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-gray-50 relative overflow-hidden">
      <div className="absolute left-0 top-1/4 w-[400px] h-[400px] bg-red-100 rounded-full blur-[100px] mix-blend-multiply opacity-50 pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="faq-header text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 text-slate-900 tracking-tight">
            PERGUNTAS <span className="text-red-600">FREQUENTES</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            Tudo o que você precisa saber antes de mergulhar no tanque.
          </p>
        </div>

        <div className="faq-list space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index} 
                className={`faq-item bg-white rounded-2xl border transition-colors duration-300 overflow-hidden ${isOpen ? 'border-red-200 shadow-lg shadow-red-500/5' : 'border-gray-200 hover:border-red-100'}`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className={`text-lg font-bold pr-8 transition-colors ${isOpen ? 'text-red-600' : 'text-slate-900 group-hover:text-red-500'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-red-600 text-white rotate-180' : 'bg-red-50 text-red-600 group-hover:bg-red-100'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </div>
                </button>
                
                <div 
                  ref={el => contentRefs.current[index] = el}
                  className="px-6 overflow-hidden"
                  style={{ height: index === 0 ? 'auto' : 0, opacity: index === 0 ? 1 : 0 }}
                >
                  <div className="pb-6 text-slate-600 leading-relaxed font-medium">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
