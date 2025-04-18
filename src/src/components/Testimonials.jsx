import React, { useState, useEffect } from 'react';

const TestimonialCard = ({ avatar, quote, name, role }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 flex gap-6 items-start border border-white/20">
      <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white flex-shrink-0">
        <img 
          src={avatar} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="italic mb-4">{quote}</p>
        <div>
          <h4 className="font-bold mb-0">{name}</h4>
          <p className="text-sm opacity-80 mb-0">{role}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialSlider = ({ testimonials }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);
  
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };
  
  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };
  
  const handleDotClick = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };
  
  return (
    <div 
      className="max-w-2xl mx-auto"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="mb-6">
        {testimonials.map((testimonial, index) => (
          <div 
            key={index}
            className="transition-opacity duration-300"
            style={{ 
              display: currentSlide === index ? 'block' : 'none',
              opacity: currentSlide === index ? 1 : 0 
            }}
          >
            <TestimonialCard {...testimonial} />
          </div>
        ))}
      </div>
      
      <div className="flex justify-center items-center gap-6">
        <button 
          className="w-10 h-10 rounded-full bg-white/20 border-none text-white flex items-center justify-center transition-all hover:bg-white/40"
          onClick={handlePrev}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <span 
              key={index}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                currentSlide === index ? 'bg-white' : 'bg-white/30'
              }`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
        
        <button 
          className="w-10 h-10 rounded-full bg-white/20 border-none text-white flex items-center justify-center transition-all hover:bg-white/40"
          onClick={handleNext}
        >
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      avatar: '/assets/avatar-1.jpg',
      quote: "Consegui antecipar o valor da minha safra de café sem juros absurdos. O melhor é que ainda ganhei tokens de carbono pelas práticas que já faço na minha propriedade.",
      name: "João Silva",
      role: "Produtor de Café, Minas Gerais"
    },
    {
      avatar: '/assets/avatar-2.jpg',
      quote: "Como investidor sempre tive interesse no agro, mas nunca tive capital para grandes investimentos. Com a SeedSafe consigo comprar frações de safras e ainda contribuir com o meio ambiente.",
      name: "Maria Oliveira",
      role: "Investidora, São Paulo"
    },
    {
      avatar: '/assets/avatar-3.jpg',
      quote: "Implementamos a compra de créditos de carbono via SeedSafe em nossa estratégia ESG. A transparência do blockchain e a conexão direta com produtores rurais trouxe credibilidade às nossas iniciativas sustentáveis.",
      name: "Carlos Mendes",
      role: "Diretor de Sustentabilidade, Empresa XYZ"
    }
  ];

  return (
    <section id="depoimentos" className="py-12 px-8 bg-gradient-to-br from-amber-700 to-amber-500 text-white">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Depoimentos</h2>
        <p className="text-lg text-white/80">O que nossos usuários estão dizendo</p>
      </div>
      
      <TestimonialSlider testimonials={testimonials} />
    </section>
  );
};

export default Testimonials;