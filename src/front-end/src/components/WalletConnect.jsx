import React, { useState } from "react";
import { getSigner, getAAWalletAddress, isAAWalletDeployed } from "../utils/aaUtils";

const WalletConnect = () => {
  const [eoa, setEoa] = useState("");
  const [aa, setAa] = useState("");
  const [deployed, setDeployed] = useState(null);

  const connect = async () => {
    try {
      const signer = await getSigner();
      const eoaAddr = await signer.getAddress();
      const aaAddr = await getAAWalletAddress(signer);
      const isDeployed = await isAAWalletDeployed(aaAddr);

      setEoa(eoaAddr);
      setAa(aaAddr);
      setDeployed(isDeployed);
    } catch (err) {
      console.error("Erro ao conectar wallet:", err);
    }
  };

  return (
    <div className="p-4">
      <button onClick={connect} className="bg-blue-600 text-white px-4 py-2 rounded">
        Conectar Wallet
      </button>

      {eoa && (
        <div className="mt-4 text-sm">
          <p><strong>EOA:</strong> {eoa}</p>
          <p><strong>AA Wallet:</strong> {aa}</p>
          <p><strong>Deploy Status:</strong> {deployed ? "✅ Implantada" : "❌ Ainda não"}</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
