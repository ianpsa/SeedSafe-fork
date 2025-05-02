"use client";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// Importação direta dos assets
import bgPattern from "./assets/bg-pattern.svg";

// Importação dos componentes principais
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

// Novas rotas de telas adicionais
import Marketplace from "./components/Marketplace/Index";
import RegistrationProcess from "./components/RegistrationProcess";
import Auditor from "./components/Auditor";

// Import new onboarding components
import Onboarding from "./components/Onboarding";
import GuidedTour from "./components/GuidedTour";
import OnboardingButton from "./components/OnboardingButton";
import WelcomeBack from "./components/WelcomeBack";
import ButtonTooltips from "./components/ButtonTooltips";

function App() {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [userRole, setUserRole] = useState(null); // 'producer', 'investor', 'auditor'
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showGuidedTour, setShowGuidedTour] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if onboarding should be shown on mount
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("seedsafe_onboarding_completed");
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const openWalletModal = () => {
    setIsWalletModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeWalletModal = () => {
    setIsWalletModalOpen(false);
    document.body.style.overflow = "auto";
  };

  // Simular login para demonstração
  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    
    // If onboarding was just completed and user logged in, 
    // show the guided tour after a short delay
    const hasCompletedGuidedTour = localStorage.getItem("seedsafe_guided_tour_shown");
    if (!hasCompletedGuidedTour) {
      setTimeout(() => {
        setShowGuidedTour(true);
      }, 1000);
    }
  };

  // Simular logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };
  
  const handleGuidedTourComplete = () => {
    setShowGuidedTour(false);
  };
  
  const handleStartOnboarding = () => {
    // Remove the completion flag to show onboarding again
    localStorage.removeItem("seedsafe_onboarding_completed");
    setShowOnboarding(true);
  };

  const backgroundStyle = !isMobile ? {
    backgroundImage: `url(${bgPattern})`,
    backgroundSize: "auto",
    backgroundPosition: "center",
  } : {};

  return (
    <Router>
      <div className="font-poppins text-slate-800 overflow-x-hidden max-w-screen">
        <header
          className={`${
            isMobile
              ? "bg-gradient-to-r from-white/95 to-white/90"
              : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
          } pb-12 md:pb-24 relative`}
          style={{
            backgroundImage: isMobile ? "none" : `url(${bgPattern})`,
            backgroundSize: "auto",
            backgroundPosition: "center",
          }}
        >
          <Navbar
            openWalletModal={openWalletModal}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            onLogout={handleLogout}
          />

          {/* Renderizar Hero apenas na página inicial */}
          <Routes>
            <Route
              path="/"
              element={<Hero openWalletModal={openWalletModal} />}
            />
          </Routes>
        </header>

        <main className="w-full">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HowItWorks />
                  <Benefits />
                  <Products />
                  <Testimonials />
                  <CTASection openWalletModal={openWalletModal} />
                </>
              }
            />
            <Route
              path="/marketplace"
              element={
                <div
                  className={`${
                    isMobile
                      ? "bg-gradient-to-r from-white/95 to-white/90"
                      : "bg-gradient-to-r from-white/95 to-white/80 bg-cover"
                  }`}
                  style={backgroundStyle}
                >
                  <Marketplace />
                </div>
              }
            />{" "}
            <Route
              path="/register"
              element={
                <RegistrationProcess
                  setCurrentPage={setCurrentPage}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
            <Route
              path="/auditor"
              element={
                isLoggedIn && userRole === "auditor" ? (
                  <Auditor />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </main>

        <Footer />

        <WalletModal
          isOpen={isWalletModalOpen}
          onClose={closeWalletModal}
          onLogin={handleLogin}
        />

        {/* Onboarding Components */}
        <Onboarding 
          onComplete={handleOnboardingComplete} 
        />
        
        {/* Guided Tour - only shown after onboarding and login */}
        <GuidedTour 
          userType={userRole} 
          isActive={showGuidedTour} 
          onComplete={handleGuidedTourComplete} 
        />
        
        {/* Onboarding Button - for users who skipped onboarding */}
        <OnboardingButton onClick={handleStartOnboarding} />
        
        {/* Welcome Back notification for returning users */}
        <WelcomeBack userRole={userRole} />
        
        {/* Button tooltips for first-time users */}
        <ButtonTooltips />

        {/* Chatbot Widget - give it a class name for the Guided Tour to target */}
        <div className="agrobot-button">
          <ChatbotWidget />
        </div>
      </div>
    </Router>
  );
}

export default App;