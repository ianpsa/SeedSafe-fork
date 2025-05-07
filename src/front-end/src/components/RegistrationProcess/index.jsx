import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Ethers v5
import StepCircles from './StepCircles';
import CropForm from './CropForm';
import VerificationStatus from './VerificationStatus';
import MarketplaceStatus from './MarketplaceStatus';
import WalletConnect from '../WalletConnect';
import { getSigner } from "../../utils/aaUtils";
import { registerHarvestUserOp } from "../../utils/userOp/registerHarvestUserOp";
// Import ABI and contract address
import HarvestManagerABI from '../../abi/abiHarvest.json';
const harvestManagerAddress = '0x0fC5025C764cE34df352757e82f7B5c4Df39A836';

// Fixed conversion rate provided by user
const NERO_USD_RATE = 0.000134;

const RegistrationProcess = ({ walletInfo }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    pricePerUnitUSD: '', // Input price in USD
    harvestDate: '',
    location: '',
    area: '',
    sustainablePractices: []
  });
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [salesProgress, setSalesProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  const isProducer = walletInfo?.role === 'producer' && walletInfo?.isSmartAccount;

  useEffect(() => {
    if (!isProducer) {
      setCurrentStep(1);
      setRegistrationStatus(null);
      setFormData({
        cropType: '', quantity: '', pricePerUnitUSD: '', harvestDate: '', location: '', area: '', sustainablePractices: []
      });
      setSubmitError(null);
      setTransactionHash(null);
      setIsSubmitting(false);
    }
  }, [isProducer]);

  // Handle form submission - Step 1: Submit to Blockchain
  const handleCropSubmit = async (e) => {
    e.preventDefault();
    if (!isProducer || !walletInfo.signer) {
      setSubmitError("Producer not connected with a Smart Account.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setTransactionHash(null);

    try {
      const aaSigner = walletInfo.signer;
      const provider = walletInfo.provider;

      const harvestManagerContract = new ethers.Contract(
        harvestManagerAddress,
        HarvestManagerABI,
        provider
      );

      // Convert USD price to NERO using the fixed rate
      const priceUSD = parseFloat(formData.pricePerUnitUSD);
      if (isNaN(priceUSD) || priceUSD <= 0) {
        throw new Error("Invalid USD price provided.");
      }
      const priceNERO = priceUSD / NERO_USD_RATE;

      // Convert NERO price to Wei (assuming 18 decimals for NERO)
      const priceInWei = ethers.utils.parseUnits(priceNERO.toFixed(18), 18); // Use toFixed to avoid floating point issues

      const crop = formData.cropType;
      const quantity = ethers.BigNumber.from(formData.quantity);
      const deliveryTimestamp = Math.floor(new Date(formData.harvestDate).getTime() / 1000);
      const doc = `Location: ${formData.location}, Area: ${formData.area}ha, Practices: ${formData.sustainablePractices.join(', ')}`;

      console.log("Submitting UserOperation to createHarvest...");
      console.log("Args:", { crop, quantity, price: priceInWei.toString(), deliveryTimestamp, doc });
      console.log(`(USD Price: ${priceUSD}, NERO Price: ${priceNERO}, Wei Price: ${priceInWei.toString()})`);

      const userOp = await aaSigner.buildUserOp([
        {
          to: harvestManagerAddress,
          value: ethers.constants.Zero,
          data: harvestManagerContract.interface.encodeFunctionData("createHarvest", [
            crop,
            quantity,
            priceInWei, // Send price in Wei (converted from USD via fixed rate)
            deliveryTimestamp,
            doc
          ])
        }
      ]);

      console.log("Built UserOperation:", userOp);
      const userOpResponse = await aaSigner.sendUserOp(userOp);
      console.log("Sent UserOperation response:", userOpResponse);

      console.log("Waiting for transaction receipt...");
      const txReceipt = await userOpResponse.wait();
      console.log("Transaction Receipt:", txReceipt);
      setTransactionHash(txReceipt.transactionHash || txReceipt.userOpHash);

      setCurrentStep(2);
      setRegistrationStatus('pending');

    } catch (err) {
      console.error("Error submitting crop registration:", err);
      setSubmitError(err.message || "Failed to submit transaction. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate auditor decision
  const simulateAuditorDecision = (decision) => {
    setRegistrationStatus(decision);
    if (decision === 'approved') {
      setCurrentStep(3);
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10);
        if (progress > 100) progress = 100;
        setSalesProgress(progress);
        if (progress === 100) clearInterval(interval);
      }, 2000);
    }
  };

  useEffect(() => {
    const testProvider = async () => {
      try {
        const { JsonRpcProvider } = await import("ethers");

        const provider = new ethers.providers.JsonRpcProvider("https://rpc-testnet.nerochain.io");

        const network = await provider.getNetwork();
        console.log("🔍 Resultado do getNetwork():", network);
      } catch (err) {
        console.error("❌ Erro ao testar a RPC da NERO:", err);
      }
    };
  
    testProvider();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { value: practiceId, checked } = e.target;
    let updatedPractices = [...formData.sustainablePractices];
    if (checked) {
      if (!updatedPractices.includes(practiceId)) {
         updatedPractices.push(practiceId);
      }
    } else {
      updatedPractices = updatedPractices.filter(practice => practice !== practiceId);
    }
    setFormData({
      ...formData,
      sustainablePractices: updatedPractices
    });
  };

  // Calculate carbon credits
  const calculateCarbonCredits = () => {
    const practiceCredits = { organic: 1.2, conservation: 0.8, rotation: 0.6, water: 0.4 };
    let totalCredits = 0;
    formData.sustainablePractices.forEach(practice => {
      if (practiceCredits[practice]) {
        totalCredits += practiceCredits[practice];
      }
    });
    const area = parseFloat(formData.area) || 1;
    return (totalCredits * area).toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-0">
    
    <WalletConnect />

    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center animate-fadeIn">
      Register Your Crop
    </h1>
      <StepCircles currentStep={currentStep} registrationStatus={registrationStatus} />
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 border border-gray-100 animate-fadeIn mt-6">
        {!isProducer ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">Please connect as a Producer using a Smart Account to register a crop.</p>
          </div>
        ) : currentStep === 1 ? (
          <CropForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            handleStepOneSubmit={handleCropSubmit}
            isSubmitting={isSubmitting}
          />
        ) : currentStep === 2 ? (
          <VerificationStatus
            registrationStatus={registrationStatus}
            simulateAuditorDecision={simulateAuditorDecision}
            transactionHash={transactionHash}
          />
        ) : currentStep === 3 ? (
          <MarketplaceStatus
            formData={formData} // Pass formData which now includes pricePerUnitUSD
            salesProgress={salesProgress}
            carbonCredits={calculateCarbonCredits()}
          />
        ) : null}
        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <strong>Error:</strong> {submitError}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationProcess;

