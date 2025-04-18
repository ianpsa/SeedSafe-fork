import React from 'react';

const CTASection = ({ openWalletModal }) => {
  return (
    <section className="py-12 px-8 bg-gray-100 text-center">
      <div className="max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Pronto para revolucionar o agro?</h2>
        <p className="text-lg mb-8">
          Junte-se a centenas de produtores e investidores na plataforma que está transformando o financiamento agrícola sustentável
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button 
            onClick={openWalletModal}
            className="py-4 px-8 rounded-md text-lg font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all"
          >
            Começar Agora
          </button>
          <button className="py-4 px-8 rounded-md text-lg font-semibold border-2 border-gray-300 hover:border-green-700 hover:text-green-700 hover:-translate-y-0.5 transition-all">
            Agendar Demonstração
          </button>
        </div>
      </div>
      
      <div className="partners">
        <h4 className="text-gray-600 mb-6 font-medium">Parceiros e Apoiadores</h4>
        <div className="flex justify-center flex-wrap gap-8 items-center">
          <img 
            src="/assets/partner-1.svg" 
            alt="NERO Chain" 
            className="h-10 opacity-70 hover:opacity-100 transition-opacity"
          />
          <img 
            src="/assets/partner-2.svg" 
            alt="Cooperativa Agrícola" 
            className="h-10 opacity-70 hover:opacity-100 transition-opacity"
          />
          <img 
            src="/assets/partner-3.svg" 
            alt="Verificadora Ambiental" 
            className="h-10 opacity-70 hover:opacity-100 transition-opacity"
          />
          <img 
            src="/assets/partner-4.svg" 
            alt="Investidora ESG" 
            className="h-10 opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;