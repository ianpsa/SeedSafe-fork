import React from 'react';

const CTASection = ({ setCurrentPage }) => {
  return (
    <section className="py-12 bg-green-700 text-center">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-green-50">Pronto para revolucionar a agricultura?</h2>
          <p className="text-lg mb-8 text-green-100">
            Junte-se a centenas de produtores e investidores na plataforma que está transformando o financiamento agrícola sustentável
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => setCurrentPage('userTypeSelection')}
              className="py-4 px-8 rounded-md text-lg font-semibold bg-amber-500 text-white hover:bg-amber-600 hover:-translate-y-0.5 transition-all"
            >
              Começar Agora
            </button>
          </div>
        </div>
        <div className="partners">
          <h4 className="text-green-100 mb-6 font-medium text-xl">Desenvolvido com</h4>
          <div className="flex justify-center flex-wrap gap-8 items-center">
            <div className="bg-green-600 px-6 py-3 rounded-lg border border-green-500 hover:scale-105 transition-all cursor-pointer">
              <span className="text-amber-400 font-bold text-2xl">NERO</span>
              <span className="text-green-50 font-semibold text-xl ml-1">Chain</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;