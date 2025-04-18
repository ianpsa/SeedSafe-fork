import React, { useState, useEffect } from 'react';
// Importação direta dos assets
import bgPattern from './assets/bg-pattern.svg';

// Importação dos componentes
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Benefits from './components/Benefits';
import Products from './components/Products';
import Testimonials from './components/Testimonials';
import ChatbotFeature from './components/ChatbotFeature';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import WalletModal from './components/WalletModal';

function App() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Função para detectar se o dispositivo é móvel
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar o tamanho inicial da tela
    handleResize();
    
    // Adicionar event listener para mudanças de tamanho de tela
    window.addEventListener('resize', handleResize);
    
    // Remover event listener na limpeza
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
    // Desabilitar scroll quando o modal estiver aberto
    document.body.style.overflow = 'hidden';
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
    // Restaurar scroll quando o modal for fechado
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="font-poppins text-slate-800 overflow-x-hidden max-w-screen">
      <header
        className={`${
          isMobile 
            ? 'bg-gradient-to-r from-white/95 to-white/90' 
            : 'bg-gradient-to-r from-white/95 to-white/80 bg-cover'
        } pb-12 md:pb-24 relative`}
        style={{
          backgroundImage: isMobile ? 'none' : `url(${bgPattern})`,
          backgroundSize: 'auto',
          backgroundPosition: 'center'
        }}
      >
        <Navbar openWalletModal={openWalletModal} />
        <Hero openWalletModal={openWalletModal} />
      </header>

      <main className="w-full">
        <HowItWorks />
        <Benefits />
        <Products />
        <Testimonials />
        <ChatbotFeature />
        <CTASection openWalletModal={openWalletModal} />
      </main>

      <Footer />
      
      {/* O modal de carteira será renderizado apenas quando isWalletModalOpen for true */}
      <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />
    </div>
  );
}

export default App;