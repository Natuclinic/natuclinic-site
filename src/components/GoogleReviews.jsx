import React, { useRef, useState } from 'react';
import Unicon from './Unicon';

const reviews = [
  {
    id: 1,
    name: 'Maria Nunes',
    info: 'Local Guide • 38 avaliações',
    text: 'Excelentes profissionais, ótimo atendimento, comprometidos com a saúde, bem estar e qualidade de vida dos pacientes tanto do ser humano interior como exterior. Deus abençoe todos vocês. Gratidão por ter conhecido essa Clínica e todo o corpo que a faz tão singular ☺️',
    avatarLetter: 'M',
  },
  {
    id: 2,
    name: 'Vinicius Justo',
    info: '3 avaliações',
    text: 'Minha experiência na NATUCLINIC foi excelente! Fui recebido com atenção em um ambiente acolhedor e por profissionais altamente competentes. Destaco o atendimento da Thalita, que, com seus retornos pelo WhatsApp, transmite uma sensação de acolhimento e está sempre disponível para esclarecer dúvidas, tornando a experiência ainda mais completa e satisfatória.',
    avatarLetter: 'V',
  },
  {
    id: 3,
    name: 'Matheus Souza Alves',
    info: '1 avaliação',
    text: 'Foi algo muito bom , a conhecer pela primeira vez fazendo limpeza de pele ,estava precisando e tive a iniciativa de procura um cuidado muito eficiente, só me sinto satisfeito pelo procedimento irei voltar mais vez , e super indico a quem estiver precisando! Grato😃',
    avatarLetter: 'M',
  },
  {
    id: 4,
    name: 'Claudia Costa',
    info: '9 avaliações',
    text: 'Amei o atendimento humanizado com profissionais altamente qualificados! Alcancei meus objetivos com muita satisfação!',
    avatarLetter: 'C',
  },
  {
    id: 5,
    name: 'La Brisa',
    info: '1 avaliação',
    text: 'Lugar incrivel, amei o atendimento, minha filha de 2 anos e 8 meses esta fazendo ozonioterapia com Dr. Julimar Menes e esta cada vez melhor, resultado incrivel super indico!',
    avatarLetter: 'L',
  },
  {
    id: 6,
    name: 'Laila Sousa',
    info: '1 avaliação',
    text: 'Conheci essa clínica esses dias e dou nota 10 fui super bem atendida pela atendente Rayssa e também pela recepção a clínica tem uma estrutura que deixa os clientes confortáveis e á vontade, ótima experiência.Parabéns!!!',
    avatarLetter: 'L',
  },
  {
    id: 7,
    name: 'Catia Keila',
    info: '1 avaliação',
    text: 'Estive na clínica com minha filha para uma consulta com o Dr Julimar e foi de excelência todo o atendimento, desde a recepção até a finalização de tudo com a atendente Rayssa. Estou muito satisfeita e tenho indicado para outras pessoas .',
    avatarLetter: 'C',
  },
  {
    id: 8,
    name: 'Eduarda Graziella',
    info: '1 avaliação',
    text: 'Um atendimento excelente, com direito até café. Questão a consulta é bem rápido e direto. As atendentes são educadas e bem humoradas, Ana muito simpática e gentil. Rayssa super engraçada e faz com que seja Extremamente confortável na finalização da consulta, Nete também é um amorzinho super delicada e engraçada. E as outras atendentes da recepção também são muito educadas, na verdade tudo é excelente, o local é bem fresquinho e com poltronas bem confortáveis. Com certeza 5 estrelas.',
    avatarLetter: 'E',
  }
];

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLong = review.text.length > 300; // Aproximadamente 10 linhas de texto nesse layout

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-200 w-[280px] md:w-[320px] min-h-[420px] flex-shrink-0 snap-start flex flex-col antialiased">
      <div className="flex flex-col items-start gap-4 mb-6">
        <div className="flex items-center gap-3 w-full">
          <div className="w-12 h-12 rounded-full bg-natu-brown/10 flex items-center justify-center text-natu-brown font-bold text-xl uppercase shrink-0">
            {review.avatarLetter}
          </div>
          <div className="flex-grow flex items-center">
            <h3 className="font-bold text-black text-sm leading-tight font-['Helvetica']">{review.name}</h3>
          </div>
        </div>
      </div>
      
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Unicon key={i} name="star" color="#fbbc05" size={16} />
        ))}
      </div>
      
      <div className="flex-grow flex flex-col">
        <p className={`text-sm font-light text-gray-600 leading-relaxed tracking-wide ${!isExpanded ? 'line-clamp-[10]' : ''}`}>
          "{review.text}"
        </p>
        {isLong && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-natu-brown font-bold text-xs mt-2 self-start hover:underline"
          >
            {isExpanded ? 'Ver menos' : 'Ver mais...'}
          </button>
        )}
      </div>
    </div>
  );
};

const GoogleReviews = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-24 bg-natu-ivory overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12 max-w-7xl mx-auto">
          <div className="max-w-2xl flex flex-col items-center">
            <a href="https://share.google/YAwph5RkZ8DJZUFMK" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/google-logo-new-history-png-9.png" alt="Google Logo" className="h-8 mb-4 object-contain" />
            </a>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-sans font-bold tracking-tight text-natu-brown leading-[0.95]">
              A satisfação de quem já viveu a experiência
            </h2>
          </div>
        </div>

        <div 
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 overflow-x-auto pb-10 px-4 -mx-4 scrollbar-hide snap-x max-w-7xl mx-auto ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-mandatory'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-8 max-w-7xl mx-auto">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border border-natu-brown/20 flex items-center justify-center text-natu-brown hover:bg-natu-brown hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label="Anterior"
          >
            <Unicon name="angle-left" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border border-natu-brown/20 flex items-center justify-center text-natu-brown hover:bg-natu-brown hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            aria-label="Próximo"
          >
            <Unicon name="angle-right" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
