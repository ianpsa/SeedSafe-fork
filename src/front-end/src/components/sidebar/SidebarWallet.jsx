import React, { useState, useEffect } from 'react';
import '../../UI/SidebarWallet.css';
import { getSigner } from '../../utils/aaUtils';
import MintNFTButton from './MintNFTButton';
import MintTCO2Button from './MintTCO2Button';
import AgroLogo from '../../assets/agro.svg';


const SidebarWallet = () => {
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Deixando aberta por padrão
  const [activeTab, setActiveTab] = useState('tokens'); // Default active tab

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const signer = await getSigner();
        setSigner(signer);

        const address = await signer.getAddress();
        setWalletAddress(address);
      } catch (error) {
        console.error("❌ Erro ao conectar com a Wallet:", error);
      }
    };
    fetchWalletDetails();
  }, []);

  // Helper function to format wallet address
  const formatAddress = (address) => {
    if (!address) return "Conecte sua wallet";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      {/* Toggle button outside the sidebar for better accessibility */}
      {/* Toggle button sempre visível quando a sidebar está fechada */}
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        style={{ 
          display: isOpen ? 'none' : 'flex',
          left: '-40px',
          top: '20px',
          position: 'fixed'
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <rect x="7" y="7" width="10" height="10" rx="1" />
        </svg>
      </button>
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Close button inside the sidebar */}
        <button 
          className="sidebar-toggle" 
          onClick={toggleSidebar}
          style={{ 
            left: '10px', 
            top: '10px', 
            position: 'absolute', 
            display: isOpen ? 'flex' : 'none',
            zIndex: 1002
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Left sidebar navigation */}
        <div className="sidebar-nav">
          <div className="nav-item active">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <rect x="7" y="7" width="10" height="10" rx="1" />
            </svg>
          </div>
          <div className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="12" x2="2" y2="12"></line>
              <polyline points="13 5 22 12 13 19"></polyline>
            </svg>
          </div>
          <div className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 18a5 5 0 0 0-10 0"></path>
              <line x1="12" y1="2" x2="12" y2="9"></line>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
          <div className="nav-item" style={{ marginTop: 'auto', marginBottom: '20px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
        </div>

        {/* Main wallet info */}
        <div className="wallet-info">
          {/* Wallet header */}
          <div className="wallet-header">
            <div className="wallet-header-left">
              <img src={AgroLogo} alt="Agro Logo" className="wallet-logo" />
              <div className="wallet-address">
                <h4>Minha Wallet</h4>
                <p className="address-text">{formatAddress(walletAddress)}</p>
              </div>
            </div>
            <div className="wallet-status">testnet</div>
            <div className="wallet-header-right">
              <div className="header-icon copy-icon" onClick={() => navigator.clipboard.writeText(walletAddress)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </div>
              <div className="header-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </div>
            </div>
          </div>

          {/* Wallet balance */}
          <div className="wallet-balance">
            <div className="balance-label">Balance</div>
            <div className="balance-amount">0.000 NERO</div>
            <div className="wallet-actions">
              <button className="action-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Send
              </button>
              <button className="action-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="8 9 12 5 16 9"></polyline>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                </svg>
                Receive
              </button>
            </div>
          </div>

          {/* Wallet tabs */}
          <div className="wallet-tabs">
            <div 
              className={`wallet-tab ${activeTab === 'tokens' ? 'active' : ''}`}
              onClick={() => setActiveTab('tokens')}
            >
              Tokens
            </div>
            <div 
              className={`wallet-tab ${activeTab === 'nfts' ? 'active' : ''}`}
              onClick={() => setActiveTab('nfts')}
            >
              NFTs
            </div>
            <div 
              className={`wallet-tab ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              Activity
            </div>
          </div>

          {/* Token List (shown when tokens tab is active) */}
          {activeTab === 'tokens' && (
            <div className="token-list">
              <div className="token-item">
                <div className="token-info">
                  <div className="token-icon nero">
                    <span>N</span>
                  </div>
                  <div className="token-name">NERO</div>
                </div>
                <div className="token-balance">0.000 NERO</div>
              </div>
              <div className="token-item">
                <div className="token-info">
                  <div className="token-icon dai">
                    <span>DAI</span>
                  </div>
                  <div className="token-name">DAI</div>
                </div>
                <div className="token-balance">0.000 DAI</div>
              </div>
              <div className="token-item">
                <div className="token-info">
                  <div className="token-icon usdt">
                    <span>T</span>
                  </div>
                  <div className="token-name">USDT</div>
                </div>
                <div className="token-balance">0.000 USDT</div>
              </div>
            </div>
          )}

          {/* Operations (shown in all tabs) */}
          <div className="operations-section">
            <h5>Operações</h5>
            <MintNFTButton signer={signer} className="operation-button" />
            <MintTCO2Button signer={signer} className="operation-button" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarWallet;