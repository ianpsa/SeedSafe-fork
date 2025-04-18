import React, { useState } from 'react';

const ProductTab = ({ title, isActive, onClick }) => {
  return (
    <button 
      className={`py-3 px-6 rounded-md font-semibold transition-all ${
        isActive 
          ? 'bg-green-700 text-white'
          : 'bg-white text-gray-500 hover:bg-green-700/10 hover:text-green-700'
      }`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

const TabContent = ({ id, isActive, children }) => {
  return (
    <div 
      id={id} 
      className={`${
        isActive ? 'block' : 'hidden'
      } bg-white p-6 rounded-lg shadow-md`}
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
    >
      {children}
    </div>
  );
};

const FeatureList = ({ features }) => {
  return (
    <ul className="my-6">
      {features.map((feature, index) => (
        <li key={index} className="mb-2 flex items-center gap-2">
          <i className={`${feature.icon} text-green-700`}></i>
          {feature.text}
        </li>
      ))}
    </ul>
  );
};

const Products = () => {
  const [activeTab, setActiveTab] = useState('futura-safra');

  const tabs = [
    { id: 'futura-safra', title: 'FuturaSafra Tokens' },
    { id: 'tco2', title: 'AgroCarbon TCO₂' },
    { id: 'combo-nft', title: 'Combo NFT' },
    { id: 'marketplace', title: 'Marketplace' },
  ];

  const products = {
    'futura-safra': {
      title: 'FuturaSafra Tokens (ERC-1155)',
      description: 'Tokens que representam frações de safras futuras, permitindo que produtores captem recursos antecipadamente e que investidores diversifiquem seu portfólio com exposição a commodities agrícolas.',
      image: '/assets/futura-safra.png',
      features: [
        { icon: 'fas fa-shield-alt', text: 'Fundo de garantia integrado' },
        { icon: 'fas fa-sync-alt', text: 'Distribuição proporcional automática' },
        { icon: 'fas fa-qrcode', text: 'Rastreabilidade completa' },
        { icon: 'fas fa-star', text: 'Sistema de reputação on-chain' }
      ],
      buttonText: 'Explorar Safras'
    },
    'tco2': {
      title: 'AgroCarbon TCO₂ (ERC-20)',
      description: 'Tokens que representam 1 tonelada de CO₂ sequestrada ou não emitida, gerados através de práticas agrícolas sustentáveis verificadas por terceiros independentes.',
      image: '/assets/tco2.png',
      features: [
        { icon: 'fas fa-check-double', text: 'Verificação por terceiros' },
        { icon: 'fas fa-exchange-alt', text: 'Totalmente negociáveis' },
        { icon: 'fas fa-leaf', text: 'Rastreabilidade da origem' },
        { icon: 'fas fa-certificate', text: 'Certificação on-chain' }
      ],
      buttonText: 'Explorar Créditos'
    },
    'combo-nft': {
      title: 'Combo NFT (ERC-721)',
      description: 'Certificados digitais exclusivos que comprovam a participação em safras futuras E o impacto ambiental positivo, combinando frações de safra e créditos de carbono em um único token.',
      image: '/assets/combo-nft.png',
      features: [
        { icon: 'fas fa-trophy', text: 'Comprovação de impacto ESG' },
        { icon: 'fas fa-cubes', text: 'Colecionáveis digitais' },
        { icon: 'fas fa-fingerprint', text: 'Certificado de autenticidade' },
        { icon: 'fas fa-share-alt', text: 'Compartilhável em redes sociais' }
      ],
      buttonText: 'Ver Coleção'
    },
    'marketplace': {
      title: 'Marketplace Integrado',
      description: 'Um mercado digital onde produtores podem listar suas safras futuras e créditos de carbono, e investidores podem explorar oportunidades com transparência total sobre origem e impacto.',
      image: '/assets/marketplace.png',
      features: [
        { icon: 'fas fa-search', text: 'Filtros por tipo de cultura' },
        { icon: 'fas fa-map-marker-alt', text: 'Visualização geográfica' },
        { icon: 'fas fa-chart-line', text: 'Histórico de transações' },
        { icon: 'fas fa-user-check', text: 'Avaliações de produtores' }
      ],
      buttonText: 'Acessar Marketplace'
    }
  };

  return (
    <section id="produtos" className="py-12 px-8 bg-gray-100">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Nossos Produtos</h2>
        <p className="text-lg text-gray-500">Soluções inovadoras em blockchain para o agronegócio sustentável</p>
      </div>
      
      <div className="max-w-[1100px] mx-auto">
        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {tabs.map((tab) => (
            <ProductTab 
              key={tab.id}
              title={tab.title}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
        
        <div className="tabs-content">
          {Object.keys(products).map((productId) => {
            const product = products[productId];
            return (
              <TabContent 
                key={productId}
                id={productId}
                isActive={activeTab === productId}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1 min-w-[300px]">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="rounded-lg shadow-sm w-full"
                    />
                  </div>
                  <div className="flex-1 min-w-[300px]">
                    <h3 className="text-xl font-bold mb-4">{product.title}</h3>
                    <p>{product.description}</p>
                    <FeatureList features={product.features} />
                    <button className="py-2 px-6 rounded-md font-semibold bg-green-700 text-white hover:bg-green-800 hover:-translate-y-0.5 transition-all">
                      {product.buttonText}
                    </button>
                  </div>
                </div>
              </TabContent>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;