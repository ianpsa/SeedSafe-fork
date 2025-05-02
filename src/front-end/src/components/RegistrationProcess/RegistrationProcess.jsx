import React, { useState, useEffect } from 'react';
import StepCircles from './StepCircles';
import CropForm from './CropForm';
import LoginForm from './LoginForm';
import VerificationStatus from './VerificationStatus';
import MarketplaceStatus from './MarketplaceStatus';
import CropRegistrationGuide from './CropRegistrationGuide';

const RegistrationProcess = ({ setCurrentPage, isLoggedIn, setIsLoggedIn }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [showGuide, setShowGuide] = useState(false); // State for showing the initial guide
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    harvestDate: '',
    location: '',
    area: '',  // Campo adicional para área da fazenda
    sustainablePractices: []
  });
  const [registrationStatus, setRegistrationStatus] = useState(null); // 'pending', 'approved', 'rejected'
  const [salesProgress, setSalesProgress] = useState(0); // Percentage of crop sold
  
  // Check if it's the first visit to show the guide
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem("seedsafe_crop_guide_completed");
    if (!hasSeenGuide) {
      // Show guide immediately
      setShowGuide(true);
    }
  }, []);
  
  // Function to handle login form changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };
  
  // Function to handle login submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd validate credentials here
    setIsLoggedIn(true);
    setShowLogin(false);
  };
  
  // Function to handle form submission for step 1
  const handleStepOneSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd validate the form here
    
    // Show login form after submission
    setShowLogin(true);
  };
  
  // Continue to verification after login
  useEffect(() => {
    if (isLoggedIn && showLogin === false && currentStep === 1) {
      setCurrentStep(2);
      setRegistrationStatus('pending');
    }
  }, [isLoggedIn, showLogin, currentStep]);
  
  // Handle guide completion
  const handleGuideComplete = () => {
    localStorage.setItem("seedsafe_crop_guide_completed", "true");
    setShowGuide(false);
  };
  
  // Handle guide closure
  const handleGuideClose = () => {
    setShowGuide(false);
  };
  
  // Simulate auditor decision (approve/reject)
  const simulateAuditorDecision = (decision) => {
    setRegistrationStatus(decision);
    if (decision === 'approved') {
      setCurrentStep(3);
      // Simulate sales progress over time
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10);
        if (progress > 100) progress = 100;
        setSalesProgress(progress);
        if (progress === 100) clearInterval(interval);
      }, 2000);
    }
  };
  
  // This would be called by the form to handle changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedPractices = [...formData.sustainablePractices];
    
    if (checked) {
      updatedPractices.push(value);
    } else {
      updatedPractices = updatedPractices.filter(practice => practice !== value);
    }
    
    setFormData({
      ...formData,
      sustainablePractices: updatedPractices
    });
  };
  
  // Calcular os créditos de carbono com base nas práticas sustentáveis
  const calculateCarbonCredits = () => {
    // Base de crédito por prática (toneladas por hectare)
    const practiceCredits = {
      organic: 1.2,
      conservation: 0.8,
      rotation: 0.6,
      water: 0.4
    };
    
    // Calcular com base nas práticas e área da fazenda
    let totalCredits = 0;
    formData.sustainablePractices.forEach(practice => {
      if (practiceCredits[practice]) {
        totalCredits += practiceCredits[practice];
      }
    });
    
    // Multiplicar pela área total da fazenda
    const area = parseFloat(formData.area) || 1; // Fallback para 1 se não houver área
    return (totalCredits * area).toFixed(2);
  };
  
  // Add CSS for the interactive guide visualization
  useEffect(() => {
    // Add global styles for interactive guides
    const style = document.createElement('style');
    style.innerHTML = `
      .highlight-target {
        box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.5);
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
        70% { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
        100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      }
      
      .animation-float {
        animation: float 3s ease-in-out infinite;
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center animate-fadeIn">
        Register Your Crop
      </h1>
      
      {/* Step Progress Circles */}
      <StepCircles currentStep={currentStep} registrationStatus={registrationStatus} />
      
      {/* Step content based on current step */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn form-container">
        {showLogin && (
          <LoginForm 
            loginData={loginData} 
            handleLoginChange={handleLoginChange} 
            handleLoginSubmit={handleLoginSubmit} 
          />
        )}
        
        {currentStep === 1 && !showLogin && (
          <CropForm 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleCheckboxChange={handleCheckboxChange} 
            handleStepOneSubmit={handleStepOneSubmit} 
          />
        )}
        
        {currentStep === 2 && (
          <VerificationStatus 
            registrationStatus={registrationStatus} 
            simulateAuditorDecision={simulateAuditorDecision} 
          />
        )}
        
        {currentStep === 3 && (
          <MarketplaceStatus 
            formData={formData} 
            salesProgress={salesProgress}
            carbonCredits={calculateCarbonCredits()}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
      
      {/* Registration Guide - Full screen walkthrough */}
      <CropRegistrationGuide 
        isOpen={showGuide} 
        onClose={handleGuideClose} 
        onComplete={handleGuideComplete} 
      />
      
      {/* Blockchain security information banner */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 text-blue-800 text-sm shadow-sm border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div>
            <h4 className="font-medium mb-1">Secure Blockchain Registration</h4>
            <p>Your crop registration is protected by NERO Chain blockchain technology. All data is encrypted, immutable, and visible only to authorized participants.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationProcess;