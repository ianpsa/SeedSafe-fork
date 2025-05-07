import React from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../../config/neroConfig';

const MintNFTButton = ({ signer }) => {
  const handleMint = async () => {
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESSES.nftCombo.address,
        CONTRACT_ADDRESSES.nftCombo.abi,
        signer
      );

      // Executando o Mint
      const tx = await contract.mintCombo(
        await signer.getAddress(),
        "Milho",        // Cultura
        1000,           // Quantidade em kg
        10,             // Créditos de Carbono
        "Validado"      // Status
      );

      await tx.wait();
      alert("NFT Combo Mintado com sucesso!");
    } catch (error) {
      console.error("Erro ao mintar NFT:", error.message);
      alert("Erro ao mintar NFT. Verifique os logs.");
    }
  };

  return (
    <button className="mint-nft-btn" onClick={handleMint}>
      Mintar NFT Combo (Gasless)
    </button>
  );
};

export default MintNFTButton;

