import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

const StepCircles = ({ currentStep, registrationStatus }) => {
  const steps = [
    { id: 1, label: 'Registro' },
    { id: 2, label: 'Verificação' },
    { id: 3, label: 'Marketplace' }
  ];

  const getStepIcon = (stepId) => {
    if (stepId < currentStep) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    if (stepId === currentStep) {
      if (registrationStatus === 'rejected') {
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      }
      return <Circle className="h-6 w-6 text-green-500 fill-green-500" />;
    }
    return <Circle className="h-6 w-6 text-gray-300" />;
  };

  return (
    <div className="flex justify-center items-center space-x-8 mb-8">
      {steps.map((step) => (
        <div key={step.id} className="flex flex-col items-center">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
            step.id === currentStep ? 'bg-green-100' : 'bg-gray-100'
          }`}>
            {getStepIcon(step.id)}
          </div>
          <span className={`mt-2 text-sm font-medium ${
            step.id === currentStep ? 'text-green-600' : 'text-gray-500'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default StepCircles;