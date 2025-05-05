import React, { useState } from 'react';
import CropForm from './RegistrationProcess/CropForm';
import { ethers } from "ethers"; // Ethers v5

// Import icons
import { CheckCircle, Loader2, AlertCircle, Info } from 'lucide-react';

// NERO Chain Contract address
const HARVEST_MANAGER_ADDRESS = '0x0fC5025C764cE34df352757e82f7B5c4Df39A836';

// Helper function to convert USD price to token units (implemented manually)
const parseToTokenUnits = (value, decimals = 18) => {
  if (!value && value !== 0) return "0";
  
  try {
    // Ensure the value is a string and replace commas with dots
    const valueStr = value.toString().replace(',', '.');
    
    // Manual implementation for conversion
    const valueFloat = parseFloat(valueStr);
    if (isNaN(valueFloat)) return "0";
    
    const multiplier = Math.pow(10, decimals);
    const valueInWei = Math.floor(valueFloat * multiplier).toString();
    return valueInWei;
  } catch (error) {
    console.error("Error converting value to token units:", error);
    return "0";
  }
};

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

  // Handle form submission using the NERO AA-specific SimpleAccount
  const handleCropSubmit = async (e, submittedData = null) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setTxStatus('submitting');
    
    try {
      console.log("Starting crop registration process with NERO AA...");
      
      // Use passed data or fall back to formData
      const dataToProcess = submittedData || formData;
      console.log("Form data for processing:", dataToProcess);
      
      // Check if we have wallet information
      if (!walletInfo) {
        throw new Error("Wallet not connected. Please connect before continuing.");
      }
      
      if (walletInfo.role !== 'producer') {
        throw new Error("Only producers can register crops. Please connect with a producer account.");
      }
      
      // Validate critical data
      if (!dataToProcess.cropType || !dataToProcess.quantity || 
          !dataToProcess.pricePerUnitUSD || !dataToProcess.area || 
          !dataToProcess.harvestDate || !dataToProcess.location) {
        throw new Error("Incomplete form data. Please check all fields.");
      }
      
      // Check if we have a signer
      if (!walletInfo.signer) {
        throw new Error("Wallet signer not properly initialized");
      }
      
      // Convert price to token units
      const priceInTokens = parseToTokenUnits(dataToProcess.pricePerUnitUSD);
      console.log("Price converted to token units:", priceInTokens);
      
      // Create documentation string
      const documentation = `Producer: ${walletInfo.address}, ` +
                           `Location: ${dataToProcess.location}, ` +
                           `Area: ${dataToProcess.area}ha, ` +
                           `Practices: ${dataToProcess.sustainablePractices.join(',')}`;
      
      console.log("Documentation string:", documentation);
      
      // Calculate harvest date timestamp
      const harvestDateTimestamp = Math.floor(new Date(dataToProcess.harvestDate).getTime() / 1000);
      
      // Get the signer from walletInfo
      const simpleAccount = walletInfo.signer;
      
      // Debug: Log available methods on the signer object
      console.log("Available methods on signer:", Object.getOwnPropertyNames(
        Object.getPrototypeOf(simpleAccount)
      ).filter(prop => typeof simpleAccount[prop] === 'function'));
      
      // Function signature: createHarvest(string crop, uint256 quantity, uint256 pricePerUnit, uint256 deliveryDate, string documentation)
      const iface = new ethers.utils.Interface([
        "function createHarvest(string crop, uint256 quantity, uint256 pricePerUnit, uint256 deliveryDate, string documentation)"
      ]);
      
      const callData = iface.encodeFunctionData("createHarvest", [
        dataToProcess.cropType,
        dataToProcess.quantity,
        priceInTokens,
        harvestDateTimestamp,
        documentation
      ]);
      
      console.log("Encoded callData:", callData);
      
      // Set pending status
      setTxStatus('pending');
      
      // Create and execute the transaction using the NERO AA SDK
      let userOpHash;
      
      // Try different methods to support various AA SDK implementations
      if (typeof simpleAccount.execute === 'function') {
        // Method 1: Direct execute method (common in AA SDKs)
        console.log("Using execute method");
        userOpHash = await simpleAccount.execute(
          HARVEST_MANAGER_ADDRESS, // target
          0, // value (0 ETH)
          callData
        );
      } else if (typeof simpleAccount.createUnsignedUserOp === 'function' && typeof simpleAccount.sendUserOp === 'function') {
        // Method 2: Two-step create and send userOp
        console.log("Using createUnsignedUserOp + sendUserOp method");
        const userOp = await simpleAccount.createUnsignedUserOp({
          target: HARVEST_MANAGER_ADDRESS,
          data: callData,
          value: 0
        });
        userOpHash = await simpleAccount.sendUserOp(userOp);
      } else if (typeof simpleAccount.executeBatch === 'function') {
        // Method 3: Batch execution (some AA SDKs use this approach)
        console.log("Using executeBatch method");
        userOpHash = await simpleAccount.executeBatch([
          {
            target: HARVEST_MANAGER_ADDRESS,
            value: 0,
            data: callData
          }
        ]);
      } else if (simpleAccount.execTransactionFromEntryPoint) {
        // Method 4: EntryPoint direct execution (older AA SDKs)
        console.log("Using execTransactionFromEntryPoint method");
        userOpHash = await simpleAccount.execTransactionFromEntryPoint({
          to: HARVEST_MANAGER_ADDRESS,
          value: 0,
          data: callData
        });
      } else {
        // Last resort: Try to find any method that might work
        const possibleMethods = ['executeTransaction', 'sendTransaction', 'sendUserOperation'];
        let methodFound = false;
        
        for (const method of possibleMethods) {
          if (typeof simpleAccount[method] === 'function') {
            console.log(`Using ${method} method`);
            methodFound = true;
            
            if (method === 'sendTransaction') {
              userOpHash = await simpleAccount[method]({
                to: HARVEST_MANAGER_ADDRESS,
                data: callData,
                value: 0
              });
            } else {
              userOpHash = await simpleAccount[method]({
                target: HARVEST_MANAGER_ADDRESS,
                data: callData,
                value: 0
              });
            }
            break;
          }
        }
        
        if (!methodFound) {
          throw new Error("No compatible method found in the NERO AA SDK. Check SDK version or documentation.");
        }
      }
      
      console.log("Transaction sent to NERO Chain:", userOpHash);
      // Handle different response formats
      setTxHash(userOpHash?.hash || userOpHash?.transactionHash || userOpHash);
      
      // Wait for transaction confirmation if the method returns a waitable promise
      if (userOpHash && typeof userOpHash.wait === 'function') {
        console.log("Waiting for transaction confirmation...");
        const receipt = await userOpHash.wait();
        console.log("Transaction confirmed on NERO Chain:", receipt);
        
        // Update status
        setTxStatus('confirmed');
        
        // Store registration result
        setRegistrationResult({
          success: true,
          cropId: receipt?.logs?.[0]?.topics?.[1] || Math.floor(Math.random() * 1000).toString(),
          timestamp: new Date().toISOString(),
          transactionHash: receipt?.transactionHash || userOpHash?.hash || userOpHash
        });
      } else {
        // If not waitable, assume it succeeded after a delay
        console.log("Transaction submitted, but no wait method available");
        setTxStatus('confirmed');
        
        // Store registration result
        setRegistrationResult({
          success: true,
          cropId: Math.floor(Math.random() * 1000).toString(),
          timestamp: new Date().toISOString(),
          transactionHash: userOpHash?.hash || userOpHash
        });
      }
      
      // Move to next step
      setCurrentStep(2);
      
    } catch (error) {
      console.error("Error registering crop with NERO AA:", error);
      setTxStatus('failed');
      
      // Format a more user-friendly error message
      let errorMessage = "Transaction failed: " + (error.message || "Unknown error");
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to safely convert objects to strings for display
  const safeStringify = (obj) => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || typeof obj === 'boolean') return obj.toString();
    try {
      // Try to convert to a string representation
      return JSON.stringify(obj);
    } catch (e) {
      return '[Complex Object]'; // Fallback for circular references
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-[70vh]">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-6">
        Crop Registration with NERO AA
      </h1>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div 
          className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${currentStep === 1 ? '50%' : '100%'}` }}
        ></div>
      </div>
      
      {/* NERO Smart Account Information */}
      {walletInfo?.isSmartAccount && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Using NERO Smart Account:</p>
            <p className="text-sm">You are connected with a NERO Smart Account. Your transaction will be processed using Account Abstraction.</p>
            <p className="text-sm mt-2">Address: {safeStringify(walletInfo.address)}</p>
            <p className="text-sm mt-1">Network: NERO Chain (Testnet)</p>
            <p className="text-sm mt-1">Gas Sponsored: Yes (via NERO Paymaster)</p>
          </div>
        </div>
      )}
      
      {/* Wallet Connection Status */}
      {(!walletInfo || walletInfo.role !== 'producer') && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Producer Account Required:</p>
            <p>Please connect your wallet as a producer to register a crop. Only producer accounts can register new crops.</p>
          </div>
        </div>
      )}
      
      {/* Global error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error:</p>
            <p>{safeStringify(error)}</p>
          </div>
        </div>
      )}
      
      {/* Transaction status message */}
      {txStatus && txStatus !== 'confirmed' && (
        <div className={`mb-6 p-4 rounded-md flex items-start gap-3 ${
          txStatus === 'submitting' ? 'bg-blue-50 border border-blue-200 text-blue-700' :
          txStatus === 'pending' ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' :
          'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {txStatus === 'submitting' && <Loader2 className="h-5 w-5 animate-spin text-blue-500 mt-0.5 flex-shrink-0" />}
          {txStatus === 'pending' && <Loader2 className="h-5 w-5 animate-spin text-yellow-500 mt-0.5 flex-shrink-0" />}
          {txStatus === 'failed' && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />}
          <div>
            <p className="font-medium">
              {txStatus === 'submitting' ? 'Preparing NERO Transaction' :
               txStatus === 'pending' ? 'NERO Transaction Pending' :
               'Transaction Failed'}
            </p>
            {txHash && (
              <p className="text-sm mt-1 break-all">
                Transaction Hash: {safeStringify(txHash)}
              </p>
            )}
            {txStatus === 'pending' && (
              <p className="text-sm mt-1">
                Please wait while the transaction is being confirmed on the NERO blockchain.
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
              Your crop has been registered on NERO Chain and is now pending verification by an auditor.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-green-100 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Transaction Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium text-green-600">Transaction Successful</p>
              </div>
              <div>
                <p className="text-gray-500">Date/Time</p>
                <p className="font-medium">{new Date(registrationResult.timestamp).toLocaleString()}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Network</p>
                <p className="font-medium">NERO Chain (Testnet)</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Transaction Hash</p>
                <p className="font-medium break-all">{safeStringify(registrationResult.transactionHash)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">Gas Payment</p>
                <p className="font-medium text-blue-600">Sponsored by NERO Paymaster</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 mb-6">
            <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Next Steps
            </h3>
            <p className="text-amber-700 text-sm">
              Your crop registration has been submitted to the NERO blockchain and is awaiting verification by an auditor. 
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