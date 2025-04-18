import React from 'react';
import { Leaf, DollarSign, Building } from 'lucide-react';

const BenefitCard = ({ icon, title, benefits, buttonText, onClick }) => {
  return (
    <div className="bg-green-700/80 backdrop-blur-lg rounded-lg p-6 w-full max-w-[350px] border border-green-600 transition-all hover:-translate-y-3 hover:shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-green-50">{title}</h3>
      </div>
      <ul className="mb-6 space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center gap-2 text-green-100">
            <span className="text-amber-400">✓</span>
            {benefit}
          </li>
        ))}
      </ul>
      <button 
        onClick={onClick}
        className="w-full py-2 px-4 rounded-md font-semibold bg-green-600 text-white border-2 border-green-600/40 hover:bg-green-500 hover:-translate-y-0.5 transition-all"
      >
        {buttonText}
      </button>
    </div>
  );
};

const BenefitsSection = ({ setCurrentPage }) => {
  const handleProducerClick = () => {
    setCurrentPage('userTypeSelection');
  };

  const handleInvestorClick = () => {
    setCurrentPage('userTypeSelection');
  };

  const handleCompanyClick = () => {
    setCurrentPage('userTypeSelection');
  };

  const benefitCards = [
    {
      icon: <Leaf className="h-6 w-6 text-green-50" />,
      title: "Para Produtores",
      benefits: [
        "Capital antecipado sem juros abusivos",
        "Renda extra com créditos de carbono",
        "Zero taxas de transação (gasless)",
        "Construção de reputação on-chain",
        "Acesso a mercado sustentável premium"
      ],
      buttonText: "Sou Produtor",
      onClick: handleProducerClick
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-50" />,
      title: "Para Investidores",
      benefits: [
        "Exposição a commodities fracionadas",
        "NFT Combo de impacto ESG",
        "Proteção por Fundo de Garantia",
        "Rastreabilidade completa on-chain",
        "Compensação de pegada de carbono"
      ],
      buttonText: "Sou Investidor",
      onClick: handleInvestorClick
    },
    {
      icon: <Building className="h-6 w-6 text-green-50" />,
      title: "Para Empresas",
      benefits: [
        "TCO₂ verificado e rastreável",
        "Verificação de metas ESG",
        "Apoio direto a pequenos produtores",
        "Cadeia de suprimentos transparente",
        "Relatórios de impacto automáticos"
      ],
      buttonText: "Sou uma Empresa",
      onClick: handleCompanyClick
    }
  ];

  return (
    <section id="benefits" className="py-12 bg-gradient-to-br from-green-800 to-green-700 text-white">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Benefícios para todos</h2>
        <p className="text-lg text-white/80">Uma plataforma que equilibra ganhos financeiros e impacto positivo</p>
      </div>
      <div className="flex flex-wrap gap-6 justify-center">
        {benefitCards.map((card, index) => (
          <BenefitCard
            key={index}
            icon={card.icon}
            title={card.title}
            benefits={card.benefits}
            buttonText={card.buttonText}
            onClick={card.onClick}
          />
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;