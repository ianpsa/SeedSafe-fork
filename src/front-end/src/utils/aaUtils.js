// src/utils/aaUtils.js
import { ethers } from "ethers";
import { Presets } from "userop";
import { NERO_CHAIN_CONFIG, CONTRACT_ADDRESSES, AA_PLATFORM_CONFIG } from "../config/neroConfig";

export const getSigner = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("Nenhuma wallet Web3 encontrada. Instale a MetaMask.");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
};

export const getAAWalletAddress = async (signer) => {
  const builder = await Presets.Builder.SimpleAccount.init(signer, NERO_CHAIN_CONFIG.rpcUrl, {
    overrideBundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
    entryPoint: CONTRACT_ADDRESSES.entryPoint,
    factory: CONTRACT_ADDRESSES.accountFactory,
  });

  return await builder.getSender();
};

export const isAAWalletDeployed = async (aaAddress) => {
  const provider = new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);
  const code = await provider.getCode(aaAddress);
  return code && code !== "0x";
};



