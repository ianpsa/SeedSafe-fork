import React from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../../config/neroConfig';

const MintTCO2Button = ({ signer }) => {
  const handleMint = async () => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.tco2Token.address,
        CONTRACT_ADDRESSES.tco2Token.abi,
        signer
      );

      // Mint 1000 TCO2 tokens para o endereço conectado
      const tx = await contract.mint(await signer.getAddress(), ethers.utils.parseUnits("1000", 18));
      await tx.wait();
      alert("1000 TCO2 Tokens Mintados com sucesso!");
    } catch (error) {
      console.error("Erro ao mintar TCO2 Tokens:", error.message);
      alert("Erro ao mintar TCO2. Verifique os logs.");
    }
  };

  return (
    <button className="mint-tco2-btn" onClick={handleMint}>
      Mintar TCO2 Tokens (Gasless)
    </button>
  );
};

export default MintTCO2Button;
