import React from 'react';
// Temporarily removing lucide-react imports
// import { Leaf, FileText, Shield, DollarSign, Check } from 'lucide-react';

const HeroSection = ({ setCurrentPage }) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-12 py-12">
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-green-50">
          Tokenize your harvest, <br />
          <span className="text-amber-400">Cultivate the future</span>
        </h1>
        <p className="text-lg text-green-100 max-w-xl mb-8">
          Early funding for farmers and investment in future crops with a positive environmental impact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button 
            onClick={() => setCurrentPage('userTypeSelection')}
            className="py-4 px-8 rounded-md text-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            I'm a Producer
          </button>
          <button 
            onClick={() => setCurrentPage('userTypeSelection')}
            className="py-4 px-8 rounded-md text-lg font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-all"
          >
            I'm an Investor
          </button>
        </div>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-amber-400">120+</span>
            <span className="text-sm text-green-100">Active Producers</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-amber-400">X NERO</span>
            <span className="text-sm text-green-100">Captured in 2025</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-amber-400">5.8K</span>
            <span className="text-sm text-green-100">TCO₂ tokenized</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-md bg-green-700 rounded-xl p-6 shadow-lg border border-green-600">
          <h2 className="text-2xl font-semibold text-green-50 mb-6">How it works</h2>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-50 mb-1">Easy Registration</h3>
                <p className="text-green-100 text-sm">Producers join the platform with no gas costs.</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-50 mb-1">Tokenize your Harvest</h3>
                <p className="text-green-100 text-sm">Register your next crop and issue tokens representing fractions of your production.</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-green-50 mb-1">Receive Investment</h3>
                <p className="text-green-100 text-sm">Investors buy tokens in advance, securing capital for your production cycle.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <button 
              onClick={() => setCurrentPage('register')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;