"use client"

import { useState, useEffect } from "react"

const OnboardingButton = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Check if onboarding was skipped previously
    const hasCompletedOnboarding = localStorage.getItem("seedsafe_onboarding_completed")
    const showedGuidedTour = localStorage.getItem("seedsafe_guided_tour_shown")
    
    // Only show the button if onboarding was skipped and guided tour wasn't shown
    if (hasCompletedOnboarding === "true" && !showedGuidedTour) {
      setTimeout(() => {
        setIsVisible(true)
      }, 5000) // Show after 5 seconds
    }
  }, [])
  
  if (!isVisible) return null
  
  return (
    <div className="fixed bottom-20 left-4 z-40 animate-bounce">
      <button
        onClick={() => {
          setIsVisible(false)
          if (onClick) onClick()
        }}
        className="bg-green-600 text-white rounded-full p-2 shadow-md flex items-center justify-center hover:bg-green-700 transition-colors group"
        aria-label="Need help with SeedSafe?"
      >
        <div className="absolute right-full mr-2 px-2 py-1 bg-white rounded-lg shadow-md text-xs font-medium text-gray-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Need help?
        </div>
        <i className="fas fa-question-circle text-sm"></i>
      </button>
    </div>
  )
}

export default OnboardingButton