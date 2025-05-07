import React from 'react';
import { Check, Archive, ClipboardCheck, FileText, DollarSign, Leaf, Award, MapPin, Calendar, TrendingUp } from 'lucide-react';

const MarketplaceStatus = ({ formData, salesProgress, carbonCredits, setCurrentPage }) => {
  // Format the date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Generate sustainable practices badges
  const renderPractices = (practices) => {
    const practiceLabels = {
      organic: 'Organic Farming',
      conservation: 'Conservation Tillage',
      rotation: 'Crop Rotation',
      water: 'Water Conservation'
    };
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {practices.map(practice => (
          <span 
            key={practice} 
            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800"
          >
            <Leaf className="h-2.5 w-2.5 mr-0.5" />
            {practiceLabels[practice]}
          </span>
        ))}
      </div>
    );
  };

  // Handle navigation to marketplace
  const handleGoToMarketplace = () => {
    if (setCurrentPage) {
      setCurrentPage('marketplace');
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Sua Safra na Marketplace
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Progresso de Vendas */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Progresso de Vendas</h3>
          </div>
          
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  {salesProgress}% Vendido
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  {salesProgress}/100
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
              <div
                style={{ width: `${salesProgress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>

        {/* Créditos de Carbono */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <Leaf className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Créditos de Carbono</h3>
          </div>
          
          <div className="text-center">
            <span className="text-3xl font-bold text-green-600">
              {carbonCredits}
            </span>
            <p className="text-sm text-gray-600 mt-1">toneladas de CO₂</p>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Baseado nas práticas sustentáveis selecionadas e área da fazenda
          </p>
        </div>
      </div>

      {/* Detalhes da Safra */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mb-8">
        <div className="flex items-center mb-4">
          <DollarSign className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Detalhes da Safra</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tipo de Safra</p>
            <p className="font-medium">{formData.cropType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quantidade</p>
            <p className="font-medium">{formData.quantity} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Área</p>
            <p className="font-medium">{formData.area} hectares</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Localização</p>
            <p className="font-medium">{formData.location}</p>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => setCurrentPage('marketplace')}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md transition duration-300"
        >
          Ver na Marketplace
        </button>
        <button
          onClick={() => setCurrentPage('dashboard')}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-md transition duration-300"
        >
          Ir para Dashboard
        </button>
      </div>
    </div>
  );
};

export default MarketplaceStatus;