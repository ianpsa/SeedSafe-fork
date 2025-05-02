import React, { useState, useEffect } from "react"
import { HelpCircle, FileText } from "lucide-react"

const RegistrationHowItWorksButton = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    // Check screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  const handleHelpClick = () => {
    // Call the provided onClick handler to show registration onboarding
    if (onClick) onClick()
  }
  
  if (!isVisible) return null
  
  return (
    <>
      {/* Tooltip bubble that appears when hovering */}
      <div 
        className={`fixed z-[60] left-4 ${
          isMobile ? 'bottom-56' : 'bottom-52'
        } bg-white p-2 rounded-lg shadow-lg transition-all duration-300 ${
          isHovered ? "opacity-100 transform translate-x-0" : "opacity-0 transform -translate-x-4 pointer-events-none"
        }`}
      >
        <div className="text-sm font-medium text-gray-700 max-w-[150px]">
          Learn how crop registration works on the blockchain
        </div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rotate-45"></div>
      </div>

      {/* Registration Help button - positioned ABOVE the general OnboardingButton */}
      <button
        onClick={handleHelpClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed left-4 z-[60] w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-all duration-300 ${
          isMobile ? 'bottom-44' : 'bottom-40'
        } ${isHovered ? 'scale-110' : 'scale-100'}`}
        aria-label="Learn how crop registration works"
      >
        <FileText className="h-5 w-5" />

        {/* Pulsing ring animation */}
        <span className="absolute w-full h-full rounded-full border-4 border-green-400/30 animate-ping"></span>
      </button>
    </>
  )
}

export default RegistrationHowItWorksButton;