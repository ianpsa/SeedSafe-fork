import React, { useState, useEffect } from 'react';
import { ArrowDown, Info, Check } from 'lucide-react';

const FieldGuide = ({ isActive, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dismissed, setDismissed] = useState([]);
  
  // Reset the component when activated
  useEffect(() => {
    if (isActive) {
      setCurrentStep(0);
      setDismissed([]);
    }
  }, [isActive]);
  
  const steps = [
    {
      selector: 'select[name="cropType"]',
      content: "Select your crop type. This information will be stored securely on the blockchain and cannot be altered once verified.",
      position: "bottom",
      title: "Crop Type"
    },
    {
      selector: 'input[name="quantity"]',
      content: "Enter the estimated quantity of your harvest. This will be tokenized into ERC-1155 tokens that can be traded on our marketplace.",
      position: "bottom",
      title: "Quantity"
    },
    {
      selector: 'input[name="area"]',
      content: "The farm area helps calculate your carbon credits. Larger areas with sustainable practices generate more carbon tokens.",
      position: "right",
      title: "Farm Area"
    },
    {
      selector: 'input[name="harvestDate"]',
      content: "The smart contract will automatically distribute tokens on this date. All transactions are secured by blockchain technology.",
      position: "right",
      title: "Harvest Date"
    },
    {
      selector: '.sustainable-practices-container',
      content: "Each sustainable practice you select increases your carbon credit generation, providing additional income beyond your crop sales.",
      position: "top",
      title: "Sustainable Practices"
    },
    {
      selector: 'button[type="submit"]',
      content: "When you submit, your crop will be registered on the NERO blockchain. This creates an immutable record that cannot be altered.",
      position: "top",
      title: "Register on Blockchain"
    }
  ];
  
  const handleDismiss = (index) => {
    const newDismissed = [...dismissed];
    newDismissed.push(index);
    setDismissed(newDismissed);
    
    // Move to next step
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // All steps completed
      if (onComplete) onComplete();
    }
  };
  
  if (!isActive || dismissed.includes(currentStep)) return null;
  
  const step = steps[currentStep];
  if (!step) return null;
  
  return (
    <Tooltip 
      selector={step.selector} 
      position={step.position} 
      title={step.title}
      content={step.content}
      onDismiss={() => handleDismiss(currentStep)}
    />
  );
};

// Helper component to create a tooltip pointing to a specific element
const Tooltip = ({ selector, position, title, content, onDismiss }) => {
  const [style, setStyle] = useState({
    top: '50%',
    left: '50%',
    visibility: 'hidden'
  });
  
  useEffect(() => {
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;
    
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    
    // Calculate position based on the target element and specified position
    let tooltipStyle = {};
    switch (position) {
      case "top":
        tooltipStyle = {
          top: rect.top + scrollTop - 10 - 5, // 5px extra for spacing
          left: rect.left + scrollLeft + rect.width / 2,
          transform: 'translate(-50%, -100%)'
        };
        break;
      case "bottom":
        tooltipStyle = {
          top: rect.bottom + scrollTop + 10,
          left: rect.left + scrollLeft + rect.width / 2,
          transform: 'translate(-50%, 0)'
        };
        break;
      case "left":
        tooltipStyle = {
          top: rect.top + scrollTop + rect.height / 2,
          left: rect.left + scrollLeft - 10,
          transform: 'translate(-100%, -50%)'
        };
        break;
      case "right":
        tooltipStyle = {
          top: rect.top + scrollTop + rect.height / 2,
          left: rect.right + scrollLeft + 10,
          transform: 'translate(0, -50%)'
        };
        break;
      default:
        tooltipStyle = {
          top: rect.bottom + scrollTop + 10,
          left: rect.left + scrollLeft + rect.width / 2,
          transform: 'translate(-50%, 0)'
        };
    }
    
    // Apply positioning with a slight delay to ensure animation works
    setTimeout(() => {
      setStyle({
        ...tooltipStyle,
        visibility: 'visible'
      });
      
      // Highlight the element
      targetElement.classList.add('highlight-target');
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    return () => {
      // Remove highlight class when tooltip is removed
      targetElement.classList.remove('highlight-target');
    };
  }, [selector, position]);
  
  return (
    <div 
      className="fixed z-50 bg-blue-600 text-white rounded-lg shadow-xl p-4 max-w-xs animate-fadeIn"
      style={style}
    >
      {/* Arrow pointing to the element */}
      <div 
        className={`absolute w-3 h-3 bg-blue-600 transform rotate-45 ${
          position === 'top' ? 'bottom-[-6px] left-1/2 ml-[-6px]' :
          position === 'bottom' ? 'top-[-6px] left-1/2 ml-[-6px]' :
          position === 'left' ? 'right-[-6px] top-1/2 mt-[-6px]' :
          'left-[-6px] top-1/2 mt-[-6px]'
        }`}
      ></div>
      
      {/* Content */}
      <div className="relative">
        <div className="flex items-center mb-2">
          <Info className="h-5 w-5 text-blue-200 mr-2" />
          <h3 className="font-bold text-blue-50">{title}</h3>
        </div>
        <p className="text-sm text-blue-100 mb-3">{content}</p>
        <button 
          onClick={onDismiss}
          className="flex items-center justify-center gap-1 bg-white text-blue-600 text-sm py-1 px-3 rounded hover:bg-blue-50 transition-colors"
        >
          <Check className="h-4 w-4" /> Got it
        </button>
      </div>
    </div>
  );
};

export default FieldGuide;