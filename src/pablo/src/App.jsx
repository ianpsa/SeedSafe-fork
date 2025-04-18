import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import RegistrationProcess from './components/RegistrationProcess';
import UserTypeSection from './components/UserTypeSection';
import Marketplace from './components/Marketplace/Index';
import AuditorDashboard from './components/Auditor';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null); // 'farmer', 'investor', or 'auditor'
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Effect to simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoaded(true);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Return to home and reset user type
  const handleLogoClick = () => {
    setCurrentPage('home');
    setUserType(null);
  };
  
  // Render the appropriate page content
  const renderPageContent = () => {
    switch(currentPage) {
      case 'userTypeSelection':
        return <UserTypeSection setUserType={setUserType} setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegistrationProcess setCurrentPage={setCurrentPage} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
      case 'marketplace':
        return <Marketplace />;
      case 'auditor':
        return <AuditorDashboard />;
      default:
        return (
          <div className="max-w-screen-xl mx-auto px-4">
            <HeroSection setCurrentPage={setCurrentPage} />
            
            {/* User Type Selection Section */}
            <div className="mt-16 bg-green-700 rounded-xl p-8 shadow-lg border border-green-600">
              <h2 className="text-2xl font-semibold text-center text-green-50 mb-8">
                Choose your profile to get started
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {/* Farmer Option */}
                <div 
                  className="bg-green-600 rounded-xl p-6 shadow-md border border-green-500 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg"
                  onClick={() => {
                    setUserType('farmer');
                    setCurrentPage('register');
                  }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                      🌱
                    </div>
                    <h3 className="text-xl font-semibold text-green-50 mb-2">Farmer</h3>
                    <p className="text-green-100 text-sm mb-4">
                      Register your crops and receive funding.
                    </p>
                    <button className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                      I am a Farmer
                    </button>
                  </div>
                </div>
                
                {/* Investor Option */}
                <div 
                  className="bg-green-600 rounded-xl p-6 shadow-md border border-green-500 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg"
                  onClick={() => {
                    setUserType('investor');
                    setCurrentPage('marketplace');
                  }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                      💰
                    </div>
                    <h3 className="text-xl font-semibold text-green-50 mb-2">Investor</h3>
                    <p className="text-green-100 text-sm mb-4">
                      Invest in sustainable crops and diversify your portfolio.
                    </p>
                    <button className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                      I am an Investor
                    </button>
                  </div>
                </div>
                
                {/* Auditor Option */}
                <div 
                  className="bg-green-600 rounded-xl p-6 shadow-md border border-green-500 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg"
                  onClick={() => {
                    setUserType('auditor');
                    setCurrentPage('auditor');
                  }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                      ✓
                    </div>
                    <h3 className="text-xl font-semibold text-green-50 mb-2">Auditor</h3>
                    <p className="text-green-100 text-sm mb-4">
                      Verify sustainable practices and certify farmers.
                    </p>
                    <button className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors">
                      I am an Auditor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className={`min-h-screen bg-green-800 text-gray-100 flex flex-col ${pageLoaded ? 'animate-fadeIn' : 'opacity-0'}`}>
      <Header 
        setCurrentPage={setCurrentPage} 
        isLoggedIn={isLoggedIn}
        handleLogoClick={handleLogoClick}
      />
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="w-full">
          {renderPageContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;