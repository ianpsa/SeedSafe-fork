import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// 🔹 Importação de Estilos
import bgPattern from "./assets/bg-pattern.svg";

// 🔹 Importação de Componentes Principais
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Benefits from "./components/Benefits";
import Products from "./components/Products";
import Testimonials from "./components/Testimonials";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import WalletModal from "./components/WalletModal";
import ChatbotWidget from "./components/ChatbotWidget";

// 🔹 Componentes Adicionais (Páginas extras)
import Marketplace from "./components/Marketplace/Index";
import RegistrationProcess from "./components/RegistrationProcess";
import Auditor from "./components/Auditor";

// 🔹 Onboarding
import Onboarding from "./components/onboarding";
import OnboardingButton from "./components/Onboardingbutton";

// 🔹 Sidebar e Mint
import SidebarWallet from "./components/sidebar/SidebarWallet";

// 🔹 Estilos Globais para Animações
const addGlobalStyles = () => {
  const style = document.createElement('style');
  style.id = 'seedsafe-global-styles';
  style.innerHTML = `
    .animation-float {
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-in-out;
    }
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
  `;

  if (!document.getElementById('seedsafe-global-styles')) {
    document.head.appendChild(style);
  }
};

// 🔹 Remove barra no final da URL
function RemoveTrailingSlash() {
  const location = useLocation();
  if (location.pathname.length > 1 && location.pathname.endsWith('/')) {
    return <Navigate to={location.pathname.slice(0, -1) + location.search} replace />;
  }
  return null;
}

function App() {
  // 🔹 Estados Globais
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // 🔹 Monitoramento do tamanho da tela
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    addGlobalStyles();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 🔹 Onboarding ao carregar a página
  useEffect(() => {
    setPageLoaded(true);
    const hasCompletedOnboarding = localStorage.getItem("seedsafe_onboarding_completed");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // 🔹 Controle do Modal de Wallet
  const openWalletModal = () => {
    setIsWalletModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
    document.body.style.overflow = "auto";
  };

  // 🔹 Background do App
  const backgroundStyle = !isMobile
    ? {
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.25)), url(${bgPattern})`,
        backgroundSize: "auto",
        backgroundPosition: "center",
      }
    : {};

  return (
    <Router>
      <div className="font-poppins text-slate-800 overflow-x-hidden max-w-screen">
        <RemoveTrailingSlash />

        {/* 🔹 Navbar Fixa */}
        <header
          className={`${
            isMobile
              ? "bg-gradient-to-r from-white/95 to-white/90"
              : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
          } relative`}
        >
          <Navbar
            openWalletModal={openWalletModal}
            isLoggedIn={isLoggedIn}
          />
        </header>

        {/* 🔹 Rotas principais */}
        <main className="w-full">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero backgroundStyle={backgroundStyle} openWalletModal={openWalletModal} />
                  <HowItWorks />
                  <Benefits />
                  <Products />
                  <Testimonials />
                  <CTASection openWalletModal={openWalletModal} />
                  
                  {/* 🔹 Sidebar com Mint e Transações */}
                  <SidebarWallet />
                </>
              }
            />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/register" element={<RegistrationProcess />} />
            <Route path="/auditor" element={<Auditor />} />
          </Routes>
        </main>

        {/* 🔹 Footer Fixo */}
        <Footer />

        {/* 🔹 Modal de Wallet */}
        <WalletModal isOpen={isWalletModalOpen} onClose={closeWalletModal} />

        {/* 🔹 Componentes Adicionais */}
        {pageLoaded && (
          <>
            <Onboarding isOpen={showOnboarding} onComplete={() => setShowOnboarding(false)} />
            <OnboardingButton onClick={() => setShowOnboarding(true)} />
            <div className="agrobot-button">
              <ChatbotWidget />
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
