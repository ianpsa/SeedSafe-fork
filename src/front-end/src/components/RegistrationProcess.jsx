import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CropForm from './RegistrationProcess/CropForm';
import { parseToTokenUnits } from '../utils/ethersHelpers';

// Import contract ABI
import HarvestManagerABI from '../abi/abiHarvest.json';

// Import icons
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

// Contract address
const HARVEST_MANAGER_ADDRESS = '0x0fC5025C764cE34df352757e82f7B5c4Df39A836';

const RegistrationProcess = ({ walletInfo }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    pricePerUnitUSD: '',
    area: '',
    harvestDate: '',
    location: '',
    sustainablePractices: []
  });
  const [registrationResult, setRegistrationResult] = useState(null);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState(''); // 'submitting', 'pending', 'confirmed', 'failed'
  const [signerInfo, setSignerInfo] = useState(null);

  // Extract and check signer on component mount
  useEffect(() => {
    const checkSigner = async () => {
      console.log("Checking wallet info:", walletInfo);
      
      try {
        if (!walletInfo) {
          console.log("No wallet info available");
          return;
        }
        
        // For Account Abstraction (Smart Account)
        if (walletInfo.isSmartAccount && walletInfo.signer) {
          console.log("Smart Account signer found");
          setSignerInfo({
            type: "Smart Account",
            signer: walletInfo.signer,
            address: walletInfo.address
          });
          return;
        }
        
        // For regular EOA with provider/signer
        if (walletInfo.signer) {
          console.log("Direct signer found");
          setSignerInfo({
            type: "Direct Signer",
            signer: walletInfo.signer,
            address: walletInfo.address
          });
          return;
        }
        
        // For WAGMI/RainbowKit connection where only address is available
        if (walletInfo.address) {
          console.log("Only address available, attempting to get signer from window.ethereum");
          
          // Try to get provider from window.ethereum
          if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            
            setSignerInfo({
              type: "Window Provider",
              signer: signer,
              address: address
            });
            return;
          }
        }
        
        console.log("No valid signer could be determined");
      } catch (err) {
        console.error("Error checking signer:", err);
      }
    };
    
    checkSigner();
  }, [walletInfo]);

  // Form event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'sustainablePractices') {
      setFormData(prev => {
        let updatedPractices = [...prev.sustainablePractices];
        if (checked) {
          updatedPractices.push(value);
        } else {
          updatedPractices = updatedPractices.filter(practice => practice !== value);
        }
        return { ...prev, sustainablePractices: updatedPractices };
      });
    }
  };

  // Form submission handler with blockchain interaction
  const handleCropSubmit = async (e, submittedData = null) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setTxStatus('submitting');
    
    try {
      console.log("Starting crop registration process");
      
      // Use passed data or fall back to formData
      const dataToProcess = submittedData || formData;
      console.log("Form data for processing:", dataToProcess);
      
      // Check if we have wallet and signer information
      if (!signerInfo || !signerInfo.signer) {
        throw new Error("No valid signer available. Please make sure your wallet is properly connected.");
      }
      
      console.log("Using signer type:", signerInfo.type);
      console.log("Signer address:", signerInfo.address);
      
      // Validate critical data
      if (!dataToProcess.cropType || !dataToProcess.quantity || 
          !dataToProcess.pricePerUnitUSD || !dataToProcess.area || 
          !dataToProcess.harvestDate || !dataToProcess.location) {
        throw new Error("Incomplete form data. Please check all fields.");
      }
      
      // Convert price to token units (NERO)
      let priceInTokens;
      try {
        priceInTokens = parseToTokenUnits(dataToProcess.pricePerUnitUSD);
        console.log("Price converted to token units:", priceInTokens);
      } catch (convError) {
        console.error("Error converting price:", convError);
        throw new Error("Failed to convert price. Please check the value and try again.");
      }
      
      // Create documentation string for on-chain storage
      const documentation = `Producer: ${signerInfo.address}, ` +
                           `Location: ${dataToProcess.location}, ` +
                           `Area: ${dataToProcess.area}ha, ` +
                           `Practices: ${dataToProcess.sustainablePractices.join(',')}`;
      
      console.log("Documentation string:", documentation);
      
      // Calculate harvest date timestamp
      const harvestDateTimestamp = Math.floor(new Date(dataToProcess.harvestDate).getTime() / 1000);
      
      // Connect to the contract
      console.log("Connecting to HarvestManager contract at", HARVEST_MANAGER_ADDRESS);
      const harvestManager = new ethers.Contract(
        HARVEST_MANAGER_ADDRESS,
        HarvestManagerABI,
        signerInfo.signer
      );
      
      // Prepare transaction parameters
      const quantity = parseInt(dataToProcess.quantity);
      const registerParams = [
        dataToProcess.cropType,                 // crop name
        ethers.BigNumber.from(quantity), // quantity
        ethers.BigNumber.from(priceInTokens),  // pricePerUnit
        ethers.BigNumber.from(harvestDateTimestamp), // deliveryDate
        documentation                           // documentation
      ];
      
      console.log("Register params:", registerParams);
      
      // Send transaction
      console.log("Sending transaction to register crop");
      const tx = await harvestManager.registerHarvest(...registerParams);
      setTxHash(tx.hash);
      setTxStatus('pending');
      console.log("Transaction sent, hash:", tx.hash);
      
      // Wait for confirmation
      console.log("Waiting for transaction confirmation...");
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);
      setTxStatus('confirmed');
      
      // Try to extract harvest ID from events
      let harvestId = "Unknown";
      try {
        const harvestCreatedEvent = receipt.events.find(e => e.event === 'HarvestCreated');
        if (harvestCreatedEvent && harvestCreatedEvent.args) {
          harvestId = harvestCreatedEvent.args.harvestId.toString();
          console.log("Extracted Harvest ID:", harvestId);
        }
      } catch (eventError) {
        console.warn("Could not extract harvest ID from event:", eventError);
      }
      
      // Store registration result
      setRegistrationResult({
        success: true,
        cropId: harvestId,
        timestamp: new Date().toISOString(),
        transactionHash: receipt.transactionHash
      });
      
      // Move to next step
      setCurrentStep(2);
      
    } catch (error) {
      console.error("Error registering crop:", error);
      setTxStatus('failed');
      setError(error.message || "An error occurred while processing the registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-[70vh]">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
        Crop Registration
      </h1>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div 
          className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${currentStep === 1 ? '50%' : '100%'}` }}
        ></div>
      </div>
      
      {/* Wallet/Signer Status */}
      {!signerInfo?.signer && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Wallet Connection Required:</p>
          <p>Please connect your wallet as a producer to register a crop.</p>
        </div>
      )}
      
      {/* Global error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* Transaction status message */}
      {txStatus && txStatus !== 'confirmed' && (
        <div className={`mb-6 p-4 rounded-md flex items-start gap-3 ${
          txStatus === 'submitting' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
          txStatus === 'pending' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
          'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {txStatus === 'submitting' && <Loader2 className="h-5 w-5 animate-spin text-blue-500 mt-0.5" />}
          {txStatus === 'pending' && <Loader2 className="h-5 w-5 animate-spin text-yellow-500 mt-0.5" />}
          {txStatus === 'failed' && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />}
          <div>
            <p className="font-medium">
              {txStatus === 'submitting' ? 'Preparing Transaction' :
               txStatus === 'pending' ? 'Transaction Pending' :
               'Transaction Failed'}
            </p>
            {txHash && (
              <p className="text-sm mt-1 break-all">
                Transaction Hash: {txHash}
              </p>
            )}
            {txStatus === 'pending' && (
              <p className="text-sm mt-1">
                Please wait while the transaction is being confirmed on the blockchain.
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Step 1: Registration Form */}
      {currentStep === 1 && (
        <CropForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleCheckboxChange={handleCheckboxChange}
          handleStepOneSubmit={handleCropSubmit}
          isSubmitting={isSubmitting}
        />
      )}
      
      {/* Step 2: Confirmation and receipt */}
      {currentStep === 2 && registrationResult && (
        <div className="bg-green-50 rounded-lg p-6 border border-green-200 animate-fadeIn">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">Registration Completed Successfully!</h2>
            <p className="text-green-700 mt-2">
              Your crop has been registered and is now pending verification by an auditor.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-100 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Transaction Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Harvest ID</p>
                <p className="font-medium">{registrationResult.cropId}</p>
              </div>
              <div>
                <p className="text-gray-500">Date/Time</p>
                <p className="font-medium">{new Date(registrationResult.timestamp).toLocaleString()}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Transaction Hash</p>
                <p className="font-medium break-all">{registrationResult.transactionHash}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 mb-6">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Next Steps
            </h3>
            <p className="text-amber-700 text-sm">
              Your crop registration has been submitted to the blockchain and is awaiting verification by an auditor. 
              After verification, your crop will be listed on the marketplace and available for investors.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={() => window.location.href = '/marketplace'} 
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300 flex-1"
            >
              Go to Marketplace
            </button>
            <button 
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  cropType: '',
                  quantity: '',
                  pricePerUnitUSD: '',
                  area: '',
                  harvestDate: '',
                  location: '',
                  sustainablePractices: []
                });
                setRegistrationResult(null);
                setTxHash('');
                setTxStatus('');
              }} 
              className="bg-white hover:bg-gray-50 text-green-700 border border-green-300 py-2 px-4 rounded-md transition duration-300 flex-1"
            >
              Register Another Crop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationProcess;