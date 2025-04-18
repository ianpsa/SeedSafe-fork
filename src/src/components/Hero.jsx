import React from 'react';

const Hero = ({ openWalletModal }) => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center gap-12 px-8 py-12">
      <div className="flex-1">
        <h1 className="text-5xl font-bold mb-6">
          Tokenize sua safra, <br />
          <span className="text-green-700">cultive seu futuro</span>
        </h1>
        <p className="text-lg max-w-xl mb-8">
          Captação antecipada para produtores rurais e investimento em safras futuras com impacto ambiental positivo, tudo sem taxas na NERO Chain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button className="py-4 px-8 rounded-md text-lg font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
            <i className="fas fa-seedling"></i> Sou Produtor
          </button>
          <button className="py-4 px-8 rounded-md text-lg font-semibold bg-amber-600 text-white hover:bg-amber-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
            <i className="fas fa-chart-line"></i> Sou Investidor
          </button>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-800">120+</span>
            <span className="text-sm text-gray-600">Produtores ativos</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-800">R$ 2.4M</span>
            <span className="text-sm text-gray-600">Captados em 2024</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-green-800">5.8K</span>
            <span className="text-sm text-gray-600">TCO₂ tokenizados</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <img 
          src="../../assets/hero-image.jpg" 
          alt="Agricultura tokenizada sustentável" 
          className="max-w-[90%] rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Hero;