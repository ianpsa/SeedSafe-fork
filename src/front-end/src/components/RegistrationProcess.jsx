import React, { useState } from 'react';
import CropForm from './RegistrationProcess/CropForm';
import { ethers } from "ethers";
import { CheckCircle, Loader2, AlertCircle, Info } from 'lucide-react';
import { parseToTokenUnits, formatFromTokenUnits, isValidEthereumAddress } from '../utils/ethersHelpers';
import { getAAWalletAddress, isAAWalletDeployed } from '../utils/aaUtils';

// NERO Chain Contract address
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
  const [txStatus, setTxStatus] = useState('');

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

  // Verificar se a conta AA está implantada
  const checkAAWalletDeployment = async () => {
    try {
      if (!walletInfo?.address) {
        throw new Error("Endereço da carteira não disponível");
      }

      const isDeployed = await isAAWalletDeployed(walletInfo.address);
      if (!isDeployed) {
        throw new Error("Conta AA ainda não está implantada. Por favor, aguarde a implantação.");
      }
      return true;
    } catch (error) {
      console.error("Erro ao verificar implantação da conta AA:", error);
      throw error;
    }
  };

  // Validação dos dados do formulário
  const validateFormData = async (data) => {
    if (!data.cropType || !data.quantity || 
        !data.pricePerUnitUSD || !data.area || 
        !data.harvestDate || !data.location) {
      throw new Error("Dados do formulário incompletos. Por favor, verifique todos os campos.");
    }

    if (!walletInfo) {
      throw new Error("Carteira não conectada. Por favor, conecte antes de continuar.");
    }

    if (walletInfo.role !== 'producer') {
      throw new Error("Apenas produtores podem registrar safras. Por favor, conecte com uma conta de produtor.");
    }

    if (!walletInfo.signer) {
      throw new Error("Assinante da carteira não inicializado corretamente");
    }

    if (!isValidEthereumAddress(walletInfo.address)) {
      throw new Error("Endereço da carteira inválido");
    }

    // Verificar implantação da conta AA
    await checkAAWalletDeployment();
  };

  // Handle form submission using the NERO AA-specific SimpleAccount
  const handleCropSubmit = async (e, submittedData = null) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setTxStatus('submitting');
    
    try {
      console.log("Iniciando processo de registro de safra com NERO AA...");
      
      const dataToProcess = submittedData || formData;
      console.log("Dados do formulário para processamento:", dataToProcess);
      
      // Validar dados
      await validateFormData(dataToProcess);
      
      // Converter preço para unidades de token usando a função utilitária
      const priceInTokens = parseToTokenUnits(dataToProcess.pricePerUnitUSD);
      console.log("Preço convertido para unidades de token:", priceInTokens);
      
      // Criar string de documentação
      const documentation = `Produtor: ${walletInfo.address}, ` +
                           `Localização: ${dataToProcess.location}, ` +
                           `Área: ${dataToProcess.area}ha, ` +
                           `Práticas: ${dataToProcess.sustainablePractices.join(',')}`;
      
      console.log("String de documentação:", documentation);
      
      // Calcular timestamp da data de colheita
      const harvestDateTimestamp = Math.floor(new Date(dataToProcess.harvestDate).getTime() / 1000);
      
      // Obter o assinante do walletInfo
      const simpleAccount = walletInfo.signer;
      
      // Interface do contrato
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
      
      console.log("CallData codificado:", callData);
      
      setTxStatus('pending');
      
      // Criar e executar a transação usando o SDK NERO AA
      let userOpHash;
      
      try {
        if (typeof simpleAccount.execute === 'function') {
          userOpHash = await simpleAccount.execute(
            HARVEST_MANAGER_ADDRESS,
            0,
            callData
          );
        } else if (typeof simpleAccount.createUnsignedUserOp === 'function' && 
                   typeof simpleAccount.sendUserOp === 'function') {
          const userOp = await simpleAccount.createUnsignedUserOp({
            target: HARVEST_MANAGER_ADDRESS,
            data: callData,
            value: 0
          });
          userOpHash = await simpleAccount.sendUserOp(userOp);
        } else {
          throw new Error("Método de execução não suportado pelo SDK NERO AA");
        }
        
        console.log("Transação enviada para NERO Chain:", userOpHash);
        setTxHash(userOpHash?.hash || userOpHash?.transactionHash || userOpHash);
        
        if (userOpHash && typeof userOpHash.wait === 'function') {
          console.log("Aguardando confirmação da transação...");
          const receipt = await userOpHash.wait();
          console.log("Transação confirmada na NERO Chain:", receipt);
          
          setTxStatus('confirmed');
          setRegistrationResult({
            success: true,
            cropId: receipt?.logs?.[0]?.topics?.[1] || Math.floor(Math.random() * 1000).toString(),
            timestamp: new Date().toISOString(),
            transactionHash: receipt?.transactionHash || userOpHash?.hash || userOpHash
          });
        } else {
          setTxStatus('confirmed');
          setRegistrationResult({
            success: true,
            cropId: Math.floor(Math.random() * 1000).toString(),
            timestamp: new Date().toISOString(),
            transactionHash: userOpHash?.hash || userOpHash
          });
        }
      } catch (txError) {
        console.error("Erro na execução da transação:", txError);
        throw new Error(`Falha na execução da transação: ${txError.message}`);
      }
      
    } catch (err) {
      console.error("Erro no registro da safra:", err);
      setError(err.message || "Falha ao registrar safra");
      setTxStatus('failed');
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