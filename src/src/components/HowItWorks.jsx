import React from 'react';

const Step = ({ icon, title, description }) => {
  return (
    <div className="flex-1 min-w-[180px] text-center p-6 rounded-lg bg-white shadow-md transition-all hover:-translate-y-3 hover:shadow-lg">
      <div className="w-[70px] h-[70px] rounded-full bg-green-700/10 flex items-center justify-center mx-auto mb-4">
        <i className={`${icon} text-2xl text-green-700`}></i>
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: 'fas fa-user-plus',
      title: 'Cadastro Facilitado',
      description: 'Produtores entram na plataforma sem custos de gás usando nossa tecnologia Account Abstraction.'
    },
    {
      icon: 'fas fa-leaf',
      title: 'Tokenize sua Safra',
      description: 'Registre sua próxima colheita e emita tokens ERC-1155 que representam frações da sua produção.'
    },
    {
      icon: 'fas fa-hand-holding-usd',
      title: 'Receba Investimento',
      description: 'Investidores compram tokens antecipadamente, garantindo capital para o ciclo produtivo.'
    },
    {
      icon: 'fas fa-tree',
      title: 'Obtenha TCO₂',
      description: 'Práticas sustentáveis são verificadas, gerando tokens de crédito de carbono como benefício adicional.'
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Entrega Transparente',
      description: 'Após a colheita, os tokens são resgatados proporcionalmente à produção real registrada.'
    }
  ];

  return (
    <section id="como-funciona" className="py-12 px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Como Funciona</h2>
        <p className="text-lg text-gray-500">Uma jornada simples para democratizar o acesso a capital e certificação sustentável</p>
      </div>
      
      <div className="flex flex-wrap justify-between gap-6 mb-12">
        {steps.map((step, index) => (
          <Step 
            key={index}
            icon={step.icon}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <img 
          src="/assets/workflow.svg" 
          alt="Fluxo do processo SeedSafe" 
          className="max-w-[90%] rounded-md shadow-md inline-block"
        />
      </div>
    </section>
  );
};

export default HowItWorks;