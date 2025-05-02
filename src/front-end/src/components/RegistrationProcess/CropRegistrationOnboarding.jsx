import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Wallet,
  Leaf,
  ArrowRight,
  X,
  Info,
  DollarSign,
  FileCheck,
  Sprout,
  Calendar,
  Globe,
  Database,
  Award
} from 'lucide-react';

const CropRegistrationOnboarding = ({ isOpen, onComplete }) => {
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
  
  // Always define this effect for scrolling
  useEffect(() => {
    // Step tracking only, no element highlighting
  }, [currentStep, isOpen]);
  
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handleComplete = () => {
    // Mark guide as completed in localStorage
    localStorage.setItem("seedsafe_registration_guide_completed", "true");
    
    // Animate exit
    setAnimateExit(true);
    
    // Close after animation completes
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500);
  };
  
  const handleSkip = () => {
    localStorage.setItem("seedsafe_registration_guide_completed", "true");
    setAnimateExit(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500);
  };
  
  // Define the steps of the guide
  const steps = [
    {
      title: "Welcome to Crop Registration",
      description: "Learn how to tokenize your harvests, access secure financing, and earn extra income from sustainable practices.",
      icon: <Sprout className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: null
    },
    {
      title: "Blockchain Technology",
      description: "Your crop data is stored on NERO Chain with advanced cryptography. This creates a permanent, secure record of your harvest.",
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      position: "center",
      securityInfo: "Your information cannot be altered or tampered with once verified, ensuring maximum security and trust."
    },
    {
      title: "Sustainable Practices",
      description: "Select your eco-friendly farming methods to generate carbon credits alongside your crop tokens.",
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      position: "center",
      securityInfo: "Each sustainable practice increases your carbon credit allocation, providing an additional revenue stream."
    },
    {
      title: "Smart Contract Registration",
      description: "When you register, a smart contract is created that automatically enforces agreements between you and investors.",
      icon: <FileCheck className="h-8 w-8 text-purple-600" />,
      position: "center",
      securityInfo: "Smart contracts eliminate intermediaries, reducing costs and increasing transparency for all parties."
    },
    {
      title: "Harvest Timeline",
      description: "Set your expected harvest date for investors to know when they'll receive returns. The contract enforces this deadline.",
      icon: <Calendar className="h-8 w-8 text-amber-600" />,
      position: "center",
      securityInfo: "The smart contract will automatically distribute tokens on the harvest date, ensuring timely payments."
    },
    {
      title: "Zero Gas Fees",
      description: "Thanks to Account Abstraction and our CustomPaymaster, all transactions are completely free.",
      icon: <Wallet className="h-8 w-8 text-purple-600" />,
      position: "center",
      securityInfo: "You never need to pay blockchain fees or manage cryptocurrency - we handle all technical aspects."
    },
    {
      title: "Global Access",
      description: "Your crops are visible to investors worldwide, giving you access to international funding opportunities.",
      icon: <Globe className="h-8 w-8 text-blue-600" />,
      position: "center",
      securityInfo: "Connect directly with investors who value sustainable agriculture while maintaining control of your data."
    },
    {
      title: "Verification Process",
      description: "Independent auditors verify your sustainable practices, ensuring integrity and maximizing your carbon credits.",
      icon: <Database className="h-8 w-8 text-gray-600" />,
      position: "center",
      securityInfo: "After registration, auditors review your submission and approve it for listing on the marketplace."
    },
    {
      title: "NFT Combo Token",
      description: "Upon approval, you'll receive a unique NFT combining your crop tokens and carbon credits that can be traded in our marketplace.",
      icon: <Award className="h-8 w-8 text-amber-600" />,
      position: "center",
      securityInfo: "Your NFT is backed by real agricultural assets and verified carbon impact, making it uniquely valuable."
    },
    {
      title: "You're Ready to Register!",
      description: "Start the registration process to gain access to investors while contributing to a more sustainable agricultural future.",
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
    <div className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center">
      {/* Semi-transparent overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip}></div>
      
      {/* Tooltip/card for current step - center positioned */}
      <div 
        className={`relative bg-white rounded-xl shadow-2xl p-4 max-w-md transition-all duration-500 z-[120] ${
          animateExit ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-gray-100">
            {step.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
        </div>
        
        <p className="text-gray-600 mb-3 text-sm">{step.description}</p>
        
        {/* Security information block */}
        {step.securityInfo && (
          <div className="bg-blue-50 p-2 rounded-lg mb-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">{step.securityInfo}</p>
          </div>
        )}
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full ${i === currentStep ? 'bg-green-600' : 'bg-gray-300'}`}
              ></div>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 text-xs"
          >
            Skip tour
          </button>
          
          <button
            onClick={handleNextStep}
            className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all hover:translate-y-[-2px] text-sm"
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        
        {/* Close button */}
        <button 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" 
          onClick={handleSkip}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CropRegistrationOnboarding;