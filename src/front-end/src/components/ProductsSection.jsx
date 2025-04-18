import React, { useState } from 'react';
import { Leaf, BarChart3, ImagePlus, Store, Shield, Repeat2, QrCode, Star, CheckCheck, ArrowLeftRight, Certificate, Trophy, Box, Fingerprint, Share2, Search, MapPin, LineChart, UserCheck } from 'lucide-react';

const ProductTab = ({ title, isActive, onClick }) => {
  return (
    <button
      className={`py-3 px-6 rounded-md font-semibold transition-all ${
        isActive
          ? "bg-green-600 text-white"
          : "bg-green-700 text-green-100 hover:bg-green-600/50"
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
        isActive ? "block" : "hidden"
      } bg-green-700 p-6 rounded-lg shadow-md border border-green-600`}
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {children}
    </div>
  );
};

const FeatureList = ({ features }) => {
  return (
    <ul className="my-6 space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2 text-green-100">
          {feature.icon}
          {feature.text}
        </li>
      ))}
    </ul>
  );
};

const ProductsSection = () => {
  const [activeTab, setActiveTab] = useState("future-harvest");

  const tabs = [
    { id: "future-harvest", title: "FutureHarvest Tokens" },
    { id: "tco2", title: "AgroCarbon TCO₂" },
    { id: "combo-nft", title: "Combo NFT" },
    { id: "marketplace", title: "Marketplace" },
  ];

  const products = {
    "future-harvest": {
      title: "FutureHarvest Tokens (ERC-1155)",
      description:
        "Tokens que representam frações de colheitas futuras, permitindo que produtores levantem fundos antecipadamente e investidores diversifiquem seu portfólio com exposição a commodities agrícolas.",
      features: [
        { icon: <Shield className="h-5 w-5 text-amber-400 mr-1" />, text: "Fundo de garantia integrado" },
        { icon: <Repeat2 className="h-5 w-5 text-amber-400 mr-1" />, text: "Distribuição proporcional automática" },
        { icon: <QrCode className="h-5 w-5 text-amber-400 mr-1" />, text: "Rastreabilidade completa" },
        { icon: <Star className="h-5 w-5 text-amber-400 mr-1" />, text: "Sistema de reputação on-chain" },
      ],
      buttonText: "Explorar Colheitas",
    },
    tco2: {
      title: "AgroCarbon TCO₂ (ERC-20)",
      description:
        "Tokens que representam 1 tonelada de CO₂ sequestrado ou não emitido, gerados através de práticas agrícolas sustentáveis verificadas por terceiros independentes.",
      features: [
        { icon: <CheckCheck className="h-5 w-5 text-amber-400 mr-1" />, text: "Verificação por terceiros" },
        { icon: <ArrowLeftRight className="h-5 w-5 text-amber-400 mr-1" />, text: "Totalmente negociável" },
        { icon: <Leaf className="h-5 w-5 text-amber-400 mr-1" />, text: "Rastreabilidade de origem" },
        { icon: <Certificate className="h-5 w-5 text-amber-400 mr-1" />, text: "Certificação on-chain" },
      ],
      buttonText: "Explorar Créditos",
    },
    "combo-nft": {
      title: "Combo NFT (ERC-721)",
      description:
        "Certificados digitais exclusivos que comprovam participação em colheitas futuras E impacto ambiental positivo, combinando frações de colheita e créditos de carbono em um único token.",
      features: [
        { icon: <Trophy className="h-5 w-5 text-amber-400 mr-1" />, text: "Prova de impacto ESG" },
        { icon: <Box className="h-5 w-5 text-amber-400 mr-1" />, text: "Colecionáveis digitais" },
        { icon: <Fingerprint className="h-5 w-5 text-amber-400 mr-1" />, text: "Certificado de autenticidade" },
        { icon: <Share2 className="h-5 w-5 text-amber-400 mr-1" />, text: "Compartilhável em redes sociais" },
      ],
      buttonText: "Ver Coleção",
    },
    marketplace: {
      title: "Marketplace Integrado",
      description:
        "Um mercado digital onde produtores podem listar suas colheitas futuras e créditos de carbono, e investidores podem explorar oportunidades com total transparência sobre origem e impacto.",
      features: [
        { icon: <Search className="h-5 w-5 text-amber-400 mr-1" />, text: "Filtros por tipo de cultura" },
        { icon: <MapPin className="h-5 w-5 text-amber-400 mr-1" />, text: "Visualização geográfica" },
        { icon: <LineChart className="h-5 w-5 text-amber-400 mr-1" />, text: "Histórico de transações" },
        { icon: <UserCheck className="h-5 w-5 text-amber-400 mr-1" />, text: "Avaliações de produtores" },
      ],
      buttonText: "Acessar Marketplace",
    },
  };

  return (
    <section id="products" className="py-12 bg-green-800">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4 text-green-50">Nossos Produtos</h2>
        <p className="text-lg text-green-100">
          Soluções blockchain inovadoras para o agronegócio sustentável
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-4">
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
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                      {productId === 'future-harvest' && <Leaf className="h-8 w-8 text-green-50" />}
                      {productId === 'tco2' && <BarChart3 className="h-8 w-8 text-green-50" />}
                      {productId === 'combo-nft' && <ImagePlus className="h-8 w-8 text-green-50" />}
                      {productId === 'marketplace' && <Store className="h-8 w-8 text-green-50" />}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-green-50">{product.title}</h3>
                    <p className="text-green-100">{product.description}</p>
                  </div>
                  <div className="flex-1 min-w-[300px]">
                    <FeatureList features={product.features} />
                    <button className="py-3 px-6 rounded-md font-semibold bg-amber-500 text-white hover:bg-amber-600 hover:-translate-y-0.5 transition-all">
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

export default ProductsSection;