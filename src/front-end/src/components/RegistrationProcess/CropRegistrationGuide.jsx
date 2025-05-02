import React, { useState, useEffect } from 'react';
import { 
  LockClosed, 
  Shield, 
  FileCheck, 
  Globe, 
  Database, 
  ArrowRight, 
  X,
  Info,
  Leaf
} from 'lucide-react';

const SimplifiedCropRegistrationGuide = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animateExit, setAnimateExit] = useState(false);
  
  // Reset the component when activated
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setAnimateExit(false);
      // Enable scrolling when onboarding is open
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleComplete = () => {
    // Mark guide as completed in localStorage
    localStorage.setItem("seedsafe_crop_guide_completed", "true");
    
    // Animate exit
    setAnimateExit(true);
    
    // Close after animation completes
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };
  
  const handleSkip = () => {
    localStorage.setItem("seedsafe_crop_guide_completed", "true");
    setAnimateExit(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };
  
  // Define the steps of the guide
  const steps = [
    {
      title: "Welcome to Crop Registration",
      description: "Discover how to tokenize your harvest and gain access to secure financing with sustainable practices.",
      icon: <FileCheck className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: null
    },
    {
      title: "Blockchain Security",
      description: "Your crop data is stored on NERO Chain using advanced cryptography. This ensures your information cannot be altered or tampered with.",
      icon: <Shield className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: "Web3 technology creates an immutable record of your registration that can be verified by anyone but modified by no one."
    },
    {
      title: "Sustainable Practices",
      description: "Select your sustainable farming methods to generate carbon credits as an additional source of income.",
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: "Each sustainable practice increases your carbon credit allocation, which is tokenized alongside your crop."
    },
    {
      title: "Smart Contracts",
      description: "Once submitted, your crop details are converted into a smart contract that automatically enforces agreements between you and investors.",
      icon: <FileCheck className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: "Smart contracts eliminate the need for intermediaries, reducing costs and increasing transparency."
    },
    {
      title: "Gasless Transactions",
      description: "Thanks to Account Abstraction, all transactions are free - no crypto experience needed.",
      icon: <Globe className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: "Our CustomPaymaster covers all blockchain fees, making the platform accessible to everyone."
    },
    {
      title: "Your Data Privacy",
      description: "You control who can access your information. Anonymous data is available publicly, but personal details require your permission.",
      icon: <LockClosed className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: "Private data is encrypted and only accessible with your digital signature."
    },
    {
      title: "Auditor Verification",
      description: "Independent auditors verify your sustainable practices, ensuring integrity and maximizing your carbon credits.",
      icon: <Database className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: "Verified crops receive a digital certificate that proves their authenticity and carbon impact."
    },
    {
      title: "You're All Set!",
      description: "Register your crop to gain access to investors around the world while helping the environment.",
      icon: <ArrowRight className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: null
    }
  ];
  
  // If no guide should be shown, render nothing
  if (!isOpen) return null;
  
  // Get current step
  const step = steps[currentStep];
  
  return (
    <div className={`fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center transition-opacity duration-500 ${animateExit ? 'opacity-0' : 'opacity-100'}`}>
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip}></div>
      
      {/* Tooltip/card for current step - center positioned */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl p-5 max-w-md transition-all duration-500 z-[120] ${
          animateExit ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 rounded-full bg-green-100">
            {step.icon}
          </div>
          <h3 className="text-xl font-bold text-green-800">{step.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-4">{step.description}</p>
        
        {/* Security information block */}
        {step.securityInfo && (
          <div className="bg-blue-50 p-3 rounded-lg mb-4 flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">{step.securityInfo}</p>
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-green-600' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip guide
          </button>
          
          <button
            onClick={handleNextStep}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 transition-all hover:translate-y-[-2px]"
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" 
          onClick={handleSkip}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CropRegistrationGuide;