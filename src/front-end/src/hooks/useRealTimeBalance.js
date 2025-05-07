import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NERO_CHAIN_CONFIG } from '../config/neroConfig';

const useRealtimeBalance = (walletAddress) => {
  const [balance, setBalance] = useState('0.0');
  const provider = new ethers.providers.JsonRpcProvider(NERO_CHAIN_CONFIG.rpcUrl);

  const fetchBalance = async () => {
    try {
      if (walletAddress) {
        const balance = await provider.getBalance(walletAddress);
        setBalance(ethers.utils.formatEther(balance));
      }
    } catch (error) {
      console.error("Erro ao buscar saldo:", error.message);
    }
  };

  // 🔄 Atualiza sempre que um novo bloco é minerado
  useEffect(() => {
    if (walletAddress) {
      fetchBalance();
      console.log("🔄 Iniciando listener de blocos...");
      provider.on('block', fetchBalance);

      // Limpa o listener ao desmontar o componente
      return () => {
        provider.off('block', fetchBalance);
        console.log("Listener de blocos removido.");
      };
    }
  }, [walletAddress]);

  return balance;
};

export default useRealtimeBalance;
