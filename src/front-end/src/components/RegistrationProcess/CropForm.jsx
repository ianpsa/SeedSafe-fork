import React, { useState } from 'react';
import { 
  Leaf, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Droplets, 
  Sprout, 
  Recycle, 
  Wind,
  Info,
  DollarSign,
  FileText 
} from 'lucide-react';

const SustainablePracticeCard = ({ id, title, description, icon: Icon, isSelected, onChange }) => {
  return (
    <div 
      className={`cursor-pointer rounded-lg p-4 transition-all duration-300 border ${
        isSelected 
          ? 'border-green-500 bg-green-50 shadow-[0_0_15px_rgba(74,222,128,0.5)]' 
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
      onClick={() => onChange(id, !isSelected)}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-full ${isSelected ? 'bg-green-100' : 'bg-gray-100'} mr-3`}>
          <Icon className={`h-5 w-5 ${isSelected ? 'text-green-600 animate-pulse' : 'text-gray-500'}`} />
        </div>
        <div>
          <h4 className={`font-medium mb-1 ${isSelected ? 'text-green-700' : 'text-gray-800'}`}>
            {title}
          </h4>
          <p className={`text-xs ${isSelected ? 'text-green-600' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

// Component for the Crop Registration Form
const CropForm = ({ formData, handleInputChange, handleCheckboxChange, handleStepOneSubmit, isSubmitting }) => {
  const [selectedPractices, setSelectedPractices] = useState(
    formData.sustainablePractices || []
  );
  const [dateError, setDateError] = useState('');
  const [areaError, setAreaError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [quantityError, setQuantityError] = useState('');

  // Handle selection of sustainable practice cards
  const handlePracticeSelection = (practiceId, isSelected) => {
    let updatedPractices = [...selectedPractices];
    if (isSelected) {
      updatedPractices.push(practiceId);
    } else {
      updatedPractices = updatedPractices.filter(id => id !== practiceId);
    }
    setSelectedPractices(updatedPractices);
    const mockEvent = {
      target: {
        name: 'sustainablePractices',
        value: practiceId,
        checked: isSelected
      }
    };
    handleCheckboxChange(mockEvent);
  };

  // Validate harvest date (must be in the future)
  const validateDate = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setDateError('The harvest date must be in the future');
    } else {
      setDateError('');
    }
    handleInputChange(e);
  };

  // Validate farm area (must be positive)
  const validateArea = (e) => {
    const area = parseFloat(e.target.value);
    if (isNaN(area) || area <= 0) {
      setAreaError('The farm area must be a positive number');
    } else {
      setAreaError('');
    }
    handleInputChange(e);
  };

  // Validate price (must be positive)
  const validatePrice = (e) => {
    const price = parseFloat(e.target.value);
    if (isNaN(price) || price <= 0) {
      setPriceError('Price must be a positive number');
    } else {
      setPriceError('');
    }
    handleInputChange(e);
  };

  // Validate quantity (must be positive integer)
  const validateQuantity = (e) => {
    const quantity = parseInt(e.target.value, 10);
    if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(Number(e.target.value))) {
      setQuantityError('Quantity must be a positive whole number');
    } else {
      setQuantityError('');
    }
    handleInputChange(e);
  };

  // Handle form submission, including validation checks
  const onSubmit = (e) => {
    e.preventDefault();
    
    // Log formData for diagnostic
    console.log("Form submission. FormData:", formData);
    
    // Validation checks
    let hasError = false;
    
    if (!formData.harvestDate) {
      setDateError('Harvest date is required');
      hasError = true;
    }
    
    if (!formData.area || parseFloat(formData.area) <= 0) {
      setAreaError('Farm area must be a positive number');
      hasError = true;
    }
    
    // Use 'pricePerUnitUSD' for validation check
    if (!formData.pricePerUnitUSD || parseFloat(formData.pricePerUnitUSD) <= 0) {
      setPriceError('Price must be a positive number');
      hasError = true;
    }
    
    if (!formData.quantity || parseInt(formData.quantity, 10) <= 0) {
      setQuantityError('Quantity must be a positive whole number');
      hasError = true;
    }
    
    if (!formData.cropType) {
      console.error("Missing cropType");
      hasError = true;
    }
    
    if (!formData.location) {
      console.error("Missing location");
      hasError = true;
    }

    if (hasError) {
      console.error("Validation errors:", { 
        dateError, 
        areaError, 
        priceError, 
        quantityError,
        cropType: !formData.cropType,
        location: !formData.location
      });
      return; 
    }
    
    try {
      // Log we're about to call handleStepOneSubmit
      console.log("Calling handleStepOneSubmit with valid data");
      
      // Ensure the price is a string (to avoid issues with parseUnits)
      const dataToSubmit = {
        ...formData,
        pricePerUnitUSD: formData.pricePerUnitUSD.toString()
      };
      
      // Call the submission function with validated data
      handleStepOneSubmit(e, dataToSubmit);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  // Define sustainable practices
  const sustainablePractices = [
    {
      id: 'organic',
      title: 'Organic Agriculture',
      description: 'No pesticides or synthetic fertilizers, increasing carbon sequestration',
      icon: Sprout
    },
    {
      id: 'conservation',
      title: 'Direct Planting',
      description: 'Minimal soil disturbance, preserving carbon and reducing emissions',
      icon: Recycle
    },
    {
      id: 'rotation',
      title: 'Crop Rotation',
      description: 'Different planting cycles that improve soil health and carbon storage',
      icon: Wind
    },
    {
      id: 'water',
      title: 'Water Conservation',
      description: 'Efficient irrigation systems reducing water use and energy consumption',
      icon: Droplets
    }
  ];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Crop Details</h2>
      <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
        <p className="text-green-700 text-sm">
          <span className="font-semibold">Combo of Tokens:</span> For each crop token, you will receive a Carbon Credit token based on your sustainable practices. These tokens form a Combo NFT that can be traded on our marketplace.
        </p>
      </div>
      
      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crop Type
            </label>
            <select 
              name="cropType"
              value={formData.cropType}
              onChange={handleInputChange}
              className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Selecione o tipo de safra</option>
              <option value="Café">Café</option>
              <option value="Soja">Soja</option>
              <option value="Milho">Milho</option>
              <option value="Trigo">Trigo</option>
              <option value="Arroz">Arroz</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Quantity (kg)
            </label>
            <input 
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={validateQuantity}
              className={`w-full p-2 bg-white text-gray-800 border ${quantityError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              placeholder="ex: 1000"
              required
            />
            {quantityError && <p className="text-red-500 text-xs mt-1">{quantityError}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Info className="h-4 w-4 inline mr-1 text-green-600" />
              Farm Area (hectares)
            </label>
            <input 
              type="number"
              name="area"
              value={formData.area}
              onChange={validateArea}
              className={`w-full p-2 bg-white text-gray-800 border ${areaError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              placeholder="ex: 5.5"
              step="0.1"
              min="0.1"
              required
            />
            {areaError && (
              <p className="text-red-500 text-xs mt-1">{areaError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This information is required to calculate the carbon credits
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1 text-green-600" />
              Harvest Date
            </label>
            <input 
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={validateDate}
              className={`w-full p-2 bg-white text-gray-800 border ${dateError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              required
            />
            {dateError && (
              <p className="text-red-500 text-xs mt-1">{dateError}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="h-4 w-4 inline mr-1 text-green-600" />
              Farm Location
            </label>
            <input 
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Cidade, Estado"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Leaf className="h-4 w-4 inline mr-1 text-green-600" />
              Sustainable Practices (Select all that apply)
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Each practice increases your carbon credit allocation and improves the value of your NFT.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sustainablePractices.map(practice => (
                <SustainablePracticeCard
                  key={practice.id}
                  id={practice.id}
                  title={practice.title}
                  description={practice.description}
                  icon={practice.icon}
                  isSelected={selectedPractices.includes(practice.id)}
                  onChange={handlePracticeSelection}
                />
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit"
              className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting || !!dateError || !!areaError || !!priceError || !!quantityError}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Register Crop
                  <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CropForm;