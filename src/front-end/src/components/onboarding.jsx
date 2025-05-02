"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// Onboarding component with step-by-step guide
const Onboarding = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [userType, setUserType] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if this is the user's first visit
    const hasCompletedOnboarding = localStorage.getItem("seedsafe_onboarding_completed")
    
    if (!hasCompletedOnboarding) {
      // Delay the onboarding to allow the page to load first
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem("seedsafe_onboarding_completed", "true")
    setIsOpen(false)
    if (onComplete) onComplete()
  }

  const skipOnboarding = () => {
    localStorage.setItem("seedsafe_onboarding_completed", "true")
    setIsOpen(false)
    if (onComplete) onComplete()
  }

  const handleUserTypeSelection = (type) => {
    setUserType(type)
    setCurrentStep(currentStep + 1)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
      
      // Redirect based on user type
      if (userType === "producer") {
        navigate("/register")
      } else if (userType === "investor") {
        navigate("/marketplace")
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Define onboarding steps
  const steps = [
    // Step 1: Welcome & User Type Selection
    {
      title: "Welcome to SeedSafe",
      content: (
        <div className="text-center">
          <p className="mb-6">
            We're excited to help you get started with our platform for sustainable agricultural financing.
          </p>
          <p className="font-semibold mb-8">First, tell us who you are:</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleUserTypeSelection("producer")}
              className="flex flex-col items-center p-6 border-2 border-green-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-4">
                <i className="fas fa-tractor text-2xl"></i>
              </div>
              <span className="font-bold text-lg">I'm a Producer</span>
              <span className="text-sm text-gray-500 mt-2">Register crops and get funding</span>
            </button>
            
            <button
              onClick={() => handleUserTypeSelection("investor")}
              className="flex flex-col items-center p-6 border-2 border-amber-100 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 mb-4">
                <i className="fas fa-chart-pie text-2xl"></i>
              </div>
              <span className="font-bold text-lg">I'm an Investor</span>
              <span className="text-sm text-gray-500 mt-2">Support producers and earn returns</span>
            </button>
          </div>
        </div>
      )
    },
    
    // Step 2: For Producers - explaining their journey
    ...(userType === "producer" ? [
      {
        title: "How SeedSafe Works for Producers",
        content: (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-700">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Create your Smart Account</h4>
                  <p className="text-sm text-gray-600">Register with zero gas fees using our Account Abstraction technology</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-700">
                  <i className="fas fa-seedling"></i>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Register your crop</h4>
                  <p className="text-sm text-gray-600">Define type, quantity, delivery date, and price</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-700">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Get auditor validation</h4>
                  <p className="text-sm text-gray-600">Our auditors verify your sustainable farming practices</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex-shrink-0 flex items-center justify-center text-green-700">
                  <i className="fas fa-coins"></i>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Receive funding</h4>
                  <p className="text-sm text-gray-600">Get capital in advance and carbon credits for sustainable practices</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3 mb-6">
              <div className="text-green-700">
                <i className="fas fa-info-circle text-xl"></i>
              </div>
              <p className="text-sm">You earn double benefits: advance capital for your harvest plus carbon credits you can sell on our marketplace!</p>
            </div>
          </div>
        )
      }
    ] : []),
    
    // Step 2: For Investors - explaining their journey
    ...(userType === "investor" ? [
      {
        title: "How SeedSafe Works for Investors",
        content: (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700">
                  <i className="fas fa-wallet"></i>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Connect your wallet</h4>
                  <p className="text-sm text-gray-600">Use MetaMask, Coinbase Wallet, or create a Smart Account</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700">
                  <i className="fas fa-search"></i>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Browse opportunities</h4>
                  <p className="text-sm text-gray-600">Explore verified crops with transparent details and ESG impact</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700">
                  <i className="fas fa-hand-holding-usd"></i>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Invest in fractions</h4>
                  <p className="text-sm text-gray-600">Purchase tokens representing future harvests and carbon credits</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex-shrink-0 flex items-center justify-center text-amber-700">
                  <i className="fas fa-certificate"></i>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Receive ComboNFT</h4>
                  <p className="text-sm text-gray-600">Get a unique NFT that proves both your investment and its positive impact</p>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg flex items-start gap-3 mb-6">
              <div className="text-amber-700">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <p className="text-sm">Your investment is protected by our Guarantee Fund. In case of crop failure, you'll receive proportional compensation automatically!</p>
            </div>
          </div>
        )
      }
    ] : []),
    
    // Step 3: Platform Features (for both user types)
    {
      title: "Platform Features",
      content: (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                  <i className="fas fa-robot"></i>
                </div>
                <h4 className="font-semibold">AgroBot Assistant</h4>
              </div>
              <p className="text-sm text-gray-600">Our educational chatbot helps you navigate Web3 and blockchain technology, answering any questions about the platform.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
                  <i className="fas fa-gas-pump"></i>
                </div>
                <h4 className="font-semibold">Gasless Experience</h4>
              </div>
              <p className="text-sm text-gray-600">Zero transaction fees using NERO Chain with Account Abstraction and Paymaster support.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                  <i className="fas fa-leaf"></i>
                </div>
                <h4 className="font-semibold">Carbon Credits</h4>
              </div>
              <p className="text-sm text-gray-600">TCO₂ tokens issued for sustainable farming practices, verified by independent auditors.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h4 className="font-semibold">Guarantee Fund</h4>
              </div>
              <p className="text-sm text-gray-600">Protection mechanism that ensures investors receive compensation in case of production failures.</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
            <div className="text-blue-700">
              <i className="fas fa-question-circle text-xl"></i>
            </div>
            <p className="text-sm">Have questions? Click the chat icon at the bottom right of your screen to talk with AgroBot, our educational assistant!</p>
          </div>
        </div>
      )
    },
    
    // Step 4: Final step - Get Started
    {
      title: userType === "producer" ? "Ready to register your crop?" : "Ready to explore investment opportunities?",
      content: (
        <div className="text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-700 mx-auto mb-6">
            <i className="fas fa-check text-4xl"></i>
          </div>
          
          <p className="mb-6">
            {userType === "producer" 
              ? "You're all set to start your journey with SeedSafe! Register your crop and get advance capital without abusive interest rates." 
              : "You're all set to start your journey with SeedSafe! Explore verified agricultural investment opportunities with positive environmental impact."}
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className={`py-4 px-8 rounded-md text-lg font-semibold ${
                userType === "producer" 
                  ? "bg-green-700 text-white hover:bg-green-800" 
                  : "bg-amber-600 text-white hover:bg-amber-700"
              } hover:-translate-y-0.5 transition-all`}
            >
              {userType === "producer" ? "Register My Crop" : "View Marketplace"}
            </button>
          </div>
        </div>
      )
    }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-2xl transform transition-all scale-100 animate-fadeIn">
        {/* Top bar with progress indicator */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
          <button
            onClick={skipOnboarding}
            className="text-gray-400 hover:text-gray-600 focus:outline-none text-sm"
          >
            Skip
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-1 bg-gray-200">
          <div 
            className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Content */}
        <div className="p-6 min-h-[300px]">
          {steps[currentStep].content}
        </div>
        
        {/* Footer with buttons */}
        <div className="flex justify-between p-6 border-t">
          {currentStep > 0 ? (
            <button
              onClick={handlePrevious}
              className="py-2 px-6 rounded-md border border-gray-300 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          ) : (
            <div></div> // Empty div to maintain layout
          )}
          
          {currentStep < steps.length - 1 && currentStep > 0 && (
            <button
              onClick={handleNext}
              className="py-2 px-6 rounded-md bg-green-600 text-white hover:bg-green-700 transition-all flex items-center gap-2"
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Onboarding