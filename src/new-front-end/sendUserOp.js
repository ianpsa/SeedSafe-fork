import axios from 'axios';

// === CONFIGURAÇÕES ===
const BUNDLER_RPC = 'https://bundler.service.nerochain.io';
const ENTRY_POINT = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';  // Substituir com o EntryPoint correto da NERO
const PAYMASTER_ADDRESS = process.env.PAYMASTER_ADDRESS;
const SENDER_ADDRESS = process.env.SENDER_ADDRESS;

const userOp = {
  sender: SENDER_ADDRESS,
  nonce: '0x0',
  initCode: '0x',
  callData: '0x',
  callGasLimit: '0x186A0',
  verificationGasLimit: '0x186A0',
  preVerificationGas: '0x186A0',
  maxFeePerGas: '0x3B9ACA00',
  maxPriorityFeePerGas: '0x3B9ACA00',
  paymasterAndData: PAYMASTER_ADDRESS,
  signature: '0x'
};

async function sendUserOperation() {
  const payload = {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_sendUserOperation',
    params: [userOp, ENTRY_POINT]
  };

  try {
    const response = await axios.post(BUNDLER_RPC, payload);
    console.log('✅ UserOperation enviada via Bundler!');
    console.log(response.data);
  } catch (error) {
    console.error('❌ Erro ao enviar:', error.response ? error.response.data : error.message);
  }
}

sendUserOperation();

