import React, { useState } from "react";
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
  HelpCircle,
  Lock,
  Shield,
  Loader,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import SecurityInfoCard from "./SecurityInfoCard";

// Tooltip component
const Tooltip = ({ children, content, position = "top" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          className={`absolute ${positions[position]} z-50 bg-gray-800 text-white text-xs rounded py-1 px-2 max-w-xs shadow-lg`}
        >
          {content}
          <div
            className={`absolute ${
              position === "top"
                ? "top-full left-1/2 transform -translate-x-1/2 -mt-1"
                : position === "bottom"
                ? "bottom-full left-1/2 transform -translate-x-1/2 mb-1"
                : position === "left"
                ? "left-full top-1/2 transform -translate-y-1/2 ml-1"
                : "right-full top-1/2 transform -translate-y-1/2 mr-1"
            } border-4 ${
              position === "top"
                ? "border-t-gray-800 border-r-transparent border-b-transparent border-l-transparent"
                : position === "bottom"
                ? "border-b-gray-800 border-r-transparent border-t-transparent border-l-transparent"
                : position === "left"
                ? "border-l-gray-800 border-r-transparent border-t-transparent border-b-transparent"
                : "border-r-gray-800 border-l-transparent border-t-transparent border-b-transparent"
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

const SustainablePracticeCard = ({
  id,
  title,
  description,
  icon: Icon,
  isSelected,
  onChange,
}) => {
  return (
    <div
      className={`cursor-pointer rounded-lg p-4 transition-all duration-300 border ${
        isSelected
          ? "border-green-500 bg-green-50 shadow-[0_0_15px_rgba(74,222,128,0.5)]"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
      onClick={() => onChange(id, !isSelected)}
    >
      <div className="flex items-start">
        <div
          className={`p-2 rounded-full ${
            isSelected ? "bg-green-100" : "bg-gray-100"
          } mr-3`}
        >
          <Icon
            className={`h-5 w-5 ${
              isSelected ? "text-green-600 animate-pulse" : "text-gray-500"
            }`}
          />
        </div>
        <div>
          <h4
            className={`font-medium mb-1 ${
              isSelected ? "text-green-700" : "text-gray-800"
            }`}
          >
            {title}
          </h4>
          <p
            className={`text-xs ${
              isSelected ? "text-green-600" : "text-gray-500"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const CropForm = ({
  formData,
  handleInputChange,
  handleCheckboxChange,
  handleStepOneSubmit,
  isProcessing,
  transactionHash,
  registrationComplete,
  handleNextStep,
}) => {
  // Map to track which cards are selected
  const [selectedPractices, setSelectedPractices] = useState(
    formData.sustainablePractices || []
  );

  // Form validation state
  const [dateError, setDateError] = useState("");
  const [areaError, setAreaError] = useState("");

  // State for copy feedback
  const [copyStatus, setCopyStatus] = useState("");

  // Function to copy hash to clipboard
  const copyToClipboard = (hash, e) => {
    // Pare a propagação do evento para evitar que o formulário seja submetido
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    navigator.clipboard
      .writeText(hash)
      .then(() => {
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus(""), 2000);
      })
      .catch(() => {
        setCopyStatus("Failed to copy");
        setTimeout(() => setCopyStatus(""), 2000);
      });
  };

  // Handle card selection
  const handlePracticeSelection = (practiceId, isSelected) => {
    let updatedPractices = [...selectedPractices];

    if (isSelected) {
      updatedPractices.push(practiceId);
    } else {
      updatedPractices = updatedPractices.filter((id) => id !== practiceId);
    }

    setSelectedPractices(updatedPractices);

    // Update the form data via the parent component's handler
    const mockEvent = {
      target: {
        name: "sustainablePractices",
        value: practiceId,
        checked: isSelected,
      },
    };
    handleCheckboxChange(mockEvent);
  };

  // Validate harvest date is in the future
  const validateDate = (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();

    // Clear hours, minutes, seconds for comparison
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError("Harvest date must be in the future");
    } else {
      setDateError("");
    }

    // Still update the form data
    handleInputChange(e);
  };

  // Validate farm area is a positive number
  const validateArea = (e) => {
    const area = parseFloat(e.target.value);

    if (isNaN(area) || area <= 0) {
      setAreaError("Farm area must be a positive number");
    } else {
      setAreaError("");
    }

    // Still update the form data
    handleInputChange(e);
  };

  // Override submit to check validation
  const onSubmit = (e) => {
    e.preventDefault();

    // Check validation errors before submitting
    if (dateError || areaError) {
      return;
    }

    // If registration is complete and user clicks "Next Step"
    if (registrationComplete) {
      handleNextStep();
      return;
    }

    handleStepOneSubmit(e);
  };

  // Function to display a shortened version of the transaction hash
  const shortenHash = (hash) => {
    if (!hash) return "";
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  // List of sustainable practices with descriptions
  const sustainablePractices = [
    {
      id: "organic",
      title: "Organic Farming",
      description:
        "No synthetic pesticides or fertilizers, increasing carbon sequestration",
      icon: Sprout,
    },
    {
      id: "conservation",
      title: "Conservation Tillage",
      description:
        "Minimal soil disturbance, preserving soil carbon and reducing emissions",
      icon: Recycle,
    },
    {
      id: "rotation",
      title: "Crop Rotation",
      description:
        "Diverse planting cycles that enhance soil health and carbon storage",
      icon: Wind,
    },
    {
      id: "water",
      title: "Water Conservation",
      description:
        "Efficient irrigation systems reducing water use and energy consumption",
      icon: Droplets,
    },
  ];

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold text-green-800 mb-4">
        Crop Details
      </h2>

      {/* Security information card - expandable */}
      <SecurityInfoCard />

      <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
        <div className="flex items-start gap-2">
          <div className="mt-0.5">
            <Lock className="h-5 w-5 text-green-700" />
          </div>
          <div>
            <p className="text-green-700 text-sm font-medium">
              Blockchain Secured Registration Process
            </p>
            <p className="text-green-700 text-xs mt-1">
              All data is encrypted and stored on NERO Chain. Your crop
              information can only be accessed by authorized participants and
              can never be tampered with or modified.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 rounded-lg p-4 mb-6 border border-amber-100">
        <p className="text-amber-700 text-sm">
          <span className="font-semibold">Token Combo:</span> For each crop
          token, you'll receive a Carbon Credit token based on your sustainable
          practices. These tokens form an NFT Combo that can be traded in our
          marketplace.
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Crop Type
              </label>
              <Tooltip
                content="Selecting your crop type helps investors understand what they're supporting and determines the optimal sustainable practices."
                position="right"
              >
                <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
              </Tooltip>
            </div>
            <select
              name="cropType"
              value={formData.cropType}
              onChange={handleInputChange}
              className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
              disabled={isProcessing || registrationComplete}
            >
              <option value="">Select crop type</option>
              <option value="Coffee">Coffee</option>
              <option value="Soybean">Soybean</option>
              <option value="Corn">Corn</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
            </select>
          </div>

          <div>
            <div className="flex items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Estimated Quantity (kg)
              </label>
              <Tooltip
                content="This will determine how many tokens are generated. Each token represents 1kg of your harvest."
                position="right"
              >
                <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
              </Tooltip>
            </div>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. 1000"
              required
              disabled={isProcessing || registrationComplete}
            />
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Shield className="h-3 w-3 text-green-600" />
              <span>Verified by a smart contract on the blockchain</span>
            </p>
          </div>

          <div>
            <div className="flex items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                <Info className="h-4 w-4 inline mr-1 text-green-600" />
                Farm Area (hectares)
              </label>
              <Tooltip
                content="Your farm area is used to calculate carbon credits. Larger areas with sustainable practices generate more carbon tokens."
                position="right"
              >
                <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
              </Tooltip>
            </div>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={validateArea}
              className={`w-full p-2 bg-white text-gray-800 border ${
                areaError ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              placeholder="e.g. 5.5"
              step="0.1"
              min="0.1"
              required
              disabled={isProcessing || registrationComplete}
            />
            {areaError && (
              <p className="text-red-500 text-xs mt-1">{areaError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This information is needed to calculate carbon credits
            </p>
          </div>

          <div>
            <div className="flex items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4 inline mr-1 text-green-600" />
                Expected Harvest Date
              </label>
              <Tooltip
                content="This determines when investors will receive their share of the harvest. The smart contract will automatically distribute tokens on this date."
                position="right"
              >
                <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
              </Tooltip>
            </div>
            <input
              type="date"
              name="harvestDate"
              value={formData.harvestDate}
              onChange={validateDate}
              className={`w-full p-2 bg-white text-gray-800 border ${
                dateError ? "border-red-500" : "border-gray-300"
              } rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
              required
              disabled={isProcessing || registrationComplete}
            />
            {dateError && (
              <p className="text-red-500 text-xs mt-1">{dateError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Shield className="h-3 w-3 text-green-600" />
              <span>Blockchain enforced delivery date</span>
            </p>
          </div>

          <div>
            <div className="flex items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 inline mr-1 text-green-600" />
                Farm Location
              </label>
              <Tooltip
                content="Your location is stored securely and used to verify regional sustainability practices. Only public data is visible to investors."
                position="right"
              >
                <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
              </Tooltip>
            </div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 bg-white text-gray-800 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="City, State"
              required
              disabled={isProcessing || registrationComplete}
            />
          </div>

          <div className="sustainable-practices-container">
            <div className="flex items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">
                <Leaf className="h-4 w-4 inline mr-1 text-green-600" />
                Sustainable Practices (Select all that apply)
              </label>
              <Tooltip
                content="Each sustainable practice increases your carbon credit generation, providing additional income beyond your crop sales."
                position="right"
              >
                <HelpCircle className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Each practice increases your carbon credit allocation and improves
              your NFT value.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sustainablePractices.map((practice) => (
                <SustainablePracticeCard
                  key={practice.id}
                  id={practice.id}
                  title={practice.title}
                  description={practice.description}
                  icon={practice.icon}
                  isSelected={selectedPractices.includes(practice.id)}
                  onChange={handlePracticeSelection}
                  disabled={isProcessing || registrationComplete}
                />
              ))}
            </div>
          </div>

          <div className="pt-4">
            {/* Transaction hash display */}
            {transactionHash && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-green-700 font-medium">
                      Registration Successful!
                    </p>
                    <div className="mt-1 flex items-center text-sm text-green-600">
                      <span className="font-medium mr-1">Transaction:</span>
                      <code
                        className="bg-green-100 px-2 py-0.5 rounded cursor-pointer hover:bg-green-200 transition-colors"
                        onClick={(e) => copyToClipboard(transactionHash, e)}
                        title="Click to copy transaction hash"
                      >
                        {shortenHash(transactionHash)}
                      </code>

                      <div className="flex items-center space-x-1 ml-2">
                        <Tooltip
                          content={copyStatus || "Copy transaction hash"}
                        >
                          <button
                            onClick={(e) => copyToClipboard(transactionHash, e)}
                            className="p-1 rounded-full hover:bg-green-100 transition-colors"
                            aria-label="Copy transaction hash"
                            type="button" // Adicione type="button" para evitar que seja tratado como botão de submissão
                          >
                            {copyStatus ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4 text-green-600" />
                            )}
                          </button>
                        </Tooltip>
                      </div>

                      {copyStatus && (
                        <span className="ml-2 text-xs font-medium text-green-600 animate-fadeIn">
                          {copyStatus}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      Your crop has been registered on the blockchain. Click
                      Next Step to continue.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={`w-full ${
                isProcessing
                  ? "bg-yellow-500 cursor-wait"
                  : registrationComplete
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              } text-white py-3 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center`}
              disabled={isProcessing || !!dateError || !!areaError}
            >
              {isProcessing ? (
                <>
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  <span>Processing Transaction...</span>
                </>
              ) : registrationComplete ? (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  <span className="relative z-10">
                    Register Crop on Blockchain
                  </span>
                  <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
                </>
              )}
            </button>

            {!isProcessing && !registrationComplete && (
              <p className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" />
                Secured by NERO Chain | Zero gas fees
              </p>
            )}

            {isProcessing && (
              <p className="text-center text-xs text-amber-600 mt-2 flex items-center justify-center gap-1">
                <Loader className="h-3 w-3 animate-spin" />
                <span>
                  Please wait while we register your crop on the blockchain...
                </span>
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CropForm;
