import React, { useState, useEffect } from 'react';
import { 
  LockClosed, 
  Shield, 
  FileCheck, 
  Globe, 
  Database, 
  ArrowRight, 
  XCircle,
  Info,
  Leaf
} from 'lucide-react';

const CropRegistrationGuide = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animateExit, setAnimateExit] = useState(false);
  
  // Set up the guide to show only on first visit
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("seedsafe_crop_guide_completed");
    if (!hasSeenGuide && isOpen) {
      setCurrentStep(0);
    } else {
      // If already seen, don't show
      handleComplete();
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
      if (onComplete) onComplete();
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
      highlightSelector: null,
      position: "center"
    },
    {
      title: "Blockchain Security",
      description: "Your crop data is stored on NERO Chain using advanced cryptography. This ensures your information cannot be altered or tampered with.",
      icon: <Shield className="h-8 w-8 text-green-600" />,
      highlightSelector: ".form-container",
      position: "top-center",
      securityInfo: "Web3 technology creates an immutable record of your registration that can be verified by anyone but modified by no one."
    },
    {
      title: "Sustainable Practices",
      description: "Select your sustainable farming methods to generate carbon credits as an additional source of income.",
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      highlightSelector: "[name='sustainablePractices']",
      position: "left"
    },
    {
      title: "Smart Contracts",
      description: "Once submitted, your crop details are converted into a smart contract that automatically enforces agreements between you and investors.",
      icon: <FileCheck className="h-8 w-8 text-green-600" />,
      highlightSelector: "button[type='submit']",
      position: "bottom",
      securityInfo: "Smart contracts eliminate the need for intermediaries, reducing costs and increasing transparency."
    },
    {
      title: "Gasless Transactions",
      description: "Thanks to Account Abstraction, all transactions are free - no crypto experience needed.",
      icon: <Globe className="h-8 w-8 text-green-600" />,
      highlightSelector: null,
      position: "center",
      securityInfo: "Our CustomPaymaster covers all blockchain fees, making the platform accessible to everyone."
    },
    {
      title: "Your Data Privacy",
      description: "You control who can access your information. Anonymous data is available publicly, but personal details require your permission.",
      icon: <LockClosed className="h-8 w-8 text-green-600" />,
      highlightSelector: "form",
      position: "right",
      securityInfo: "Private data is encrypted and only accessible with your digital signature."
    },
    {
      title: "Auditor Verification",
      description: "Independent auditors verify your sustainable practices, ensuring integrity and maximizing your carbon credits.",
      icon: <Database className="h-8 w-8 text-green-600" />,
      highlightSelector: "[name='area']",
      position: "right"
    },
    {
      title: "You're All Set!",
      description: "Register your crop to gain access to investors around the world while helping the environment.",
      icon: <ArrowRight className="h-8 w-8 text-green-600" />,
      highlightSelector: null,
      position: "center"
    }
  ];
  
  // If no guide should be shown, render nothing
  if (!isOpen) return null;
  
  // Get current step
  const step = steps[currentStep];
  
  return (
    <div className={`fixed inset-0 z-[100] pointer-events-auto transition-opacity duration-500 ${animateExit ? 'opacity-0' : 'opacity-100'}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip}></div>
      
      {/* Highlight area if needed */}
      {step.highlightSelector && (
        <HighlightArea selector={step.highlightSelector} position={step.position} />
      )}
      
      {/* Tooltip/card for current step */}
      <div 
        className={`absolute bg-white rounded-xl shadow-2xl p-5 max-w-md transition-all duration-500 ${getPositionClasses(step.position, step.highlightSelector)}`}
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
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Helper component to highlight an area of the page
const HighlightArea = ({ selector, position }) => {
  const [highlightStyle, setHighlightStyle] = useState({
    top: '50%',
    left: '50%',
    width: '0px',
    height: '0px',
    transform: 'translate(-50%, -50%)'
  });
  
  useEffect(() => {
    // Find the element to highlight
    if (selector) {
      const element = document.querySelector(selector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightStyle({
          top: `${rect.top + window.scrollY}px`,
          left: `${rect.left + window.scrollX}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          transform: 'none'
        });
        
        // Scroll into view if needed
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selector]);
  
  return (
    <div 
      className="absolute border-2 border-green-500 rounded-md pointer-events-none z-50 animate-pulse"
      style={highlightStyle}
    >
      {/* Highlight glow effect */}
      <div className="absolute inset-0 bg-green-500/20 rounded-md"></div>
    </div>
  );
};

// Helper function to position the tooltip based on highlighted element
const getPositionClasses = (position, selector) => {
  if (!selector) {
    return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
  }
  
  switch(position) {
    case 'top':
      return "top-20 left-1/2 transform -translate-x-1/2";
    case 'bottom':
      return "bottom-20 left-1/2 transform -translate-x-1/2";
    case 'left':
      return "top-1/2 left-20 transform -translate-y-1/2";
    case 'right':
      return "top-1/2 right-20 transform -translate-y-1/2";
    case 'top-left':
      return "top-20 left-20";
    case 'top-right':
      return "top-20 right-20";
    case 'bottom-left':
      return "bottom-20 left-20";
    case 'bottom-right':
      return "bottom-20 right-20";
    case 'top-center':
      return "top-20 left-1/2 transform -translate-x-1/2";
    default:
      return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
  }
};

export default CropRegistrationGuide;