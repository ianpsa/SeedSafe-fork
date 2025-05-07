"use client"
import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const VerificationStatus = ({ registrationStatus, simulateAuditorDecision }) => {
  const getStatusContent = () => {
    switch (registrationStatus) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          title: 'Safra Aprovada!',
          message: 'Sua safra foi verificada e aprovada. Agora está disponível na marketplace.',
          buttonText: 'Ir para Marketplace',
          buttonAction: () => simulateAuditorDecision('approved')
        };
      case 'rejected':
        return {
          icon: <AlertCircle className="h-12 w-12 text-red-500" />,
          title: 'Safra Rejeitada',
          message: 'Infelizmente sua safra não atendeu aos critérios de verificação. Por favor, revise os dados e tente novamente.',
          buttonText: 'Tentar Novamente',
          buttonAction: () => simulateAuditorDecision('pending')
        };
      default:
        return {
          icon: <Clock className="h-12 w-12 text-yellow-500 animate-pulse" />,
          title: 'Verificação em Andamento',
          message: 'Sua safra está sendo verificada por nossos auditores. Isso pode levar alguns minutos.',
          buttonText: 'Simular Aprovação',
          buttonAction: () => simulateAuditorDecision('approved')
        };
    }
  };

  const status = getStatusContent();

  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        {status.icon}
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {status.title}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {status.message}
      </p>
      
      <button
        onClick={status.buttonAction}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md transition duration-300"
      >
        {status.buttonText}
      </button>
    </div>
  );
};

export default VerificationStatus;
