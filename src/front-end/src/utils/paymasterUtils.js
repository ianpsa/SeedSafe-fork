import { ethers } from 'ethers';
import { AA_PLATFORM_CONFIG, CONTRACT_ADDRESSES } from '../config/neroConfig';
import { Presets } from 'userop';

export const executeMintOperation = async (signer) => {
  const provider = new ethers.providers.JsonRpcProvider(AA_PLATFORM_CONFIG.bundlerRpc);

  // Inicializando o Builder para UserOp
  const builder = await Presets.Builder.SimpleAccount.init(signer, provider.connection.url, {
    overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    entryPoint: CONTRACT_ADDRESSES.entryPoint,
    factory: CONTRACT_ADDRESSES.accountFactory,
  });

  const sender = await builder.getSender();
  console.log("Wallet Address:", sender);

  // Dados do contrato de NFT
  const contractAddress = "0xSeuNFTContractAddress";
  const abi = [
    "function mint(address to) public"
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);

  // Preparando UserOperation
  const userOp = await builder.setCallData(contract, "mint", [sender]);
  await builder.setPaymasterAndData(AA_PLATFORM_CONFIG.apiKey);

  // Executando a transação
  const result = await builder.send();
  await result.wait();
};


