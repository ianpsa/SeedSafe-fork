import React, { useState, useEffect } from 'react';
import StepCircles from './StepCircles';
import CropForm from './CropForm';
import LoginForm from './LoginForm';
import VerificationStatus from './VerificationStatus';
import MarketplaceStatus from './MarketplaceStatus';
import WalletConnect from '../WalletConnect';
import { useWeb3Auth } from '../Web3AuthContext';
import { registerHarvestUserOp } from '../../utils/userOp/registerHarvestUserOp';

const RegistrationProcess = ({ setCurrentPage }) => {
  const { web3authProvider, userAddress, isLoggedIn } = useWeb3Auth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    harvestDate: '',
    location: '',
    area: '',
    sustainablePractices: []
  });
  const [registrationStatus, setRegistrationStatus] = useState(null); // 'pending', 'approved', 'rejected'
  const [salesProgress, setSalesProgress] = useState(0); // Percentage of crop sold
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Simula login local (pode ser integrado com backend futuramente)
    setShowLogin(false);
  };

  // Function to handle form submission for step 1
  const handleStepOneSubmit = async (e) => {
    e.preventDefault();
    if (!web3authProvider || !userAddress) {
      alert('Conecte sua carteira Web3Auth para registrar a safra.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Monta os dados para o UserOp
      const crop = formData.cropType;
      const quantity = parseInt(formData.quantity);
      const price = 25; // Valor fixo para exemplo
      const deliveryDate = Math.floor(new Date(formData.harvestDate).getTime() / 1000);
      const doc = formData.location || "doc://placeholder";
      // Envia UserOp via helper
      const userOpHash = await registerHarvestUserOp(web3authProvider, {
        crop,
        quantity,
        price,
        deliveryDate,
        doc,
      });
      console.log("✅ Safra registrada com UserOperation:", userOpHash);
      setShowLogin(true);
    } catch (err) {
      console.error("Erro ao registrar safra:", err);
      alert("Erro ao registrar safra:\n" + (err?.message || "sem mensagem"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Continue to verification after login
  useEffect(() => {
    if (isLoggedIn && showLogin === false && currentStep === 1) {
      setCurrentStep(2);
      setRegistrationStatus('pending');
    }
  }, [isLoggedIn, showLogin, currentStep]);

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

  return (
    <div className="max-w-4xl mx-auto py-8">
      <WalletConnect />
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center animate-fadeIn">
        Register Your Crop
      </h1>
      {/* Step Progress Circles */}
      <StepCircles currentStep={currentStep} registrationStatus={registrationStatus} />
      {/* Step content based on current step */}
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn">
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
            isSubmitting={isSubmitting}
          />
        )}
        {currentStep === 2 && !showLogin && (
          <VerificationStatus 
            registrationStatus={registrationStatus} 
            simulateAuditorDecision={simulateAuditorDecision} 
          />
        )}
        {currentStep === 3 && !showLogin && (
          <MarketplaceStatus 
            formData={formData} 
            salesProgress={salesProgress} 
            carbonCredits={calculateCarbonCredits()} 
            setCurrentPage={setCurrentPage} 
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationProcess;

