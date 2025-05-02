"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers"; // Ethers v5
import { usePublicClient, useWalletClient } from 'wagmi'; // To get provider and signer
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Leaf,
  Info,
  RefreshCw as RefreshIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import FiltersPanel from "./FiltersPanel";
import CropCard from "./CropCard";
import PurchaseModal from "./PurchaseModal";

// Import ABI and contract address
import HarvestManagerABI from '../../abi/abiHarvest.json';
const harvestManagerAddress = '0x0fC5025C764cE34df352757e82f7B5c4Df39A836';

// Fixed conversion rate provided by user
const NERO_USD_RATE = 0.000134;

// --- Helper Functions ---
const formatPrice = (priceInWei) => {
  if (!priceInWei) return '0';
  return ethers.utils.formatUnits(priceInWei, 18);
};

const formatDate = (timestamp) => {
  if (!timestamp || timestamp.isZero()) return 'N/A';
  return new Date(timestamp.toNumber() * 1000).toLocaleDateString(); 
};

const parseDocumentation = (docString) => {
  const locationMatch = docString.match(/Location: ([^,]+, [^,]+)/);
  const areaMatch = docString.match(/Area: (\d+(\.\d+)?)ha/);
  const practicesMatch = docString.match(/Practices: (.*)/);
  
  return {
    location: locationMatch ? locationMatch[1].trim() : 'Unknown Location',
    area: areaMatch ? parseFloat(areaMatch[1]) : 0,
    practicesString: practicesMatch ? practicesMatch[1].trim() : '',
    sustainablePractices: practicesMatch ? practicesMatch[1].split(',').map(p => p.trim()).filter(p => p) : []
  };
};

const calculateCarbonCredits = (practices, area) => {
    const practiceCredits = { organic: 1.2, conservation: 0.8, rotation: 0.6, water: 0.4 };
    let totalCredits = 0;
    practices.forEach(practice => {
      if (practiceCredits[practice]) {
        totalCredits += practiceCredits[practice];
      }
    });
    const numericArea = parseFloat(area) || 1;
    return (totalCredits * numericArea).toFixed(2);
};
// ----------------------

const Marketplace = ({ walletInfo }) => {
  const [listings, setListings] = useState([]);
  const [formattedListings, setFormattedListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState({ state: 'idle', message: '' }); // idle, pending, success, error
  const [filters, setFilters] = useState({
    minRating: 0,
    sustainablePractices: [],
    harvestDateBefore: null,
    cropTypes: [],
  });

  const provider = usePublicClient();
  // Get the EOA signer using Wagmi's hook for connected wallet
  const { data: walletClient } = useWalletClient(); 

  // Fetch data from blockchain
  useEffect(() => {
    const fetchHarvests = async () => {
      if (!provider) {
        setError("Blockchain provider not available. Please connect your wallet.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const contract = new ethers.Contract(harvestManagerAddress, HarvestManagerABI, provider);
        const currentId = await contract.currentHarvestId();
        const fetchedHarvests = [];
        for (let i = 0; i < currentId.toNumber(); i++) {
          try {
            const harvestData = await contract.harvests(i);
            if (harvestData.status === 1) { // Only validated harvests
              fetchedHarvests.push({ id: i, ...harvestData });
            }
          } catch (loopError) {
            console.warn(`Failed to fetch harvest ID ${i}:`, loopError);
          }
        }
        setListings(fetchedHarvests);
      } catch (err) {
        console.error("Error fetching harvests:", err);
        setError("Failed to load marketplace data. Please try again later.");
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHarvests();
  }, [provider]);

  // Format fetched data
  useEffect(() => {
    const formatted = listings.map(harvest => {
      const docInfo = parseDocumentation(harvest.documentation);
      const carbonCredits = calculateCarbonCredits(docInfo.sustainablePractices, docInfo.area);
      // Price is already in Wei from the contract
      const priceInWei = harvest.pricePerUnit;
      const displayPriceNERO = formatPrice(priceInWei); // Format Wei to NERO string
      // Calculate display price in USD using the fixed rate
      const displayPriceUSD = (parseFloat(displayPriceNERO) * NERO_USD_RATE).toFixed(2);

      return {
        id: harvest.id,
        cropType: harvest.crop, 
        quantity: harvest.quantity.toNumber(),
        pricePerUnit: priceInWei, // Keep Wei price for calculations
        displayPriceNERO: displayPriceNERO, // NERO price for display
        displayPriceUSD: displayPriceUSD, // USD price for display
        harvestDate: formatDate(harvest.deliveryDate),
        producerAddress: harvest.producer,
        farmerName: `Producer ${harvest.producer.substring(0, 6)}...`,
        location: docInfo.location,
        area: docInfo.area,
        sustainablePractices: docInfo.sustainablePractices,
        carbonCredits: parseFloat(carbonCredits),
        farmerRating: 4.5, // Placeholder
        imageUrl: `/placeholder-images/${harvest.crop.toLowerCase()}.jpg`,
      };
    });
    setFormattedListings(formatted);
  }, [listings]);

  // Apply filters and search
  useEffect(() => {
    let results = [...formattedListings];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(l =>
        l.cropType.toLowerCase().includes(query) ||
        l.farmerName.toLowerCase().includes(query) ||
        l.location.toLowerCase().includes(query)
      );
    }
    // Apply other filters (rating, practices, cropTypes) - simplified
    if (filters.minRating > 0) results = results.filter(l => l.farmerRating >= filters.minRating);
    if (filters.sustainablePractices.length > 0) results = results.filter(l => filters.sustainablePractices.every(p => l.sustainablePractices.includes(p)));
    if (filters.cropTypes.length > 0) results = results.filter(l => filters.cropTypes.includes(l.cropType));

    // Apply sorting
    if (sortOrder === "price-low") results.sort((a, b) => a.pricePerUnit.sub(b.pricePerUnit).toNumber()); 
    else if (sortOrder === "price-high") results.sort((a, b) => b.pricePerUnit.sub(a.pricePerUnit).toNumber());
    else if (sortOrder === "carbon") results.sort((a, b) => b.carbonCredits - a.carbonCredits);
    
    setFilteredListings(results);
  }, [searchQuery, filters, formattedListings, sortOrder]);

  const toggleFilters = () => setShowFilters(!showFilters);
  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleInvestClick = (listing) => {
    setSelectedListing(listing);
    setPurchaseStatus({ state: 'idle', message: '' }); // Reset status
    setShowPurchaseModal(true);
  };

  // Handle purchase confirmation - Actual Transaction Logic
  const handlePurchaseConfirm = async (purchaseAmount) => {
    // Check if investor is connected via EOA and listing is selected
    if (!walletClient || walletInfo?.role !== 'investor' || !selectedListing) {
      setPurchaseStatus({ state: 'error', message: 'Please connect as an Investor.' });
      console.error("Investor not connected or listing not selected.");
      return;
    }
    
    setPurchaseStatus({ state: 'pending', message: 'Preparing transaction...' });
    console.log(`Attempting to purchase ${purchaseAmount} units of harvest ID ${selectedListing.id}`);

    try {
      // Get the EOA signer from the wallet client
      const signer = walletClient;
      
      // Create contract instance with the signer
      const contract = new ethers.Contract(harvestManagerAddress, HarvestManagerABI, signer);
      
      // Calculate total cost in Wei (NERO)
      // pricePerUnit is already in Wei
      const amountToBuy = ethers.BigNumber.from(purchaseAmount);
      const totalCostInWei = selectedListing.pricePerUnit.mul(amountToBuy);
      
      console.log(`Calculated Total Cost: ${ethers.utils.formatUnits(totalCostInWei, 18)} NERO`);

      setPurchaseStatus({ state: 'pending', message: 'Please confirm the transaction in your wallet...' });

      // Call the buyToken function on the contract
      const tx = await contract.buyToken(selectedListing.id, amountToBuy, {
        value: totalCostInWei, // Send NERO as msg.value
        // Optional: Add gas limit estimation if needed
        // gasLimit: ethers.utils.hexlify(300000) 
      });

      setPurchaseStatus({ state: 'pending', message: `Transaction submitted: ${tx.hash}. Waiting for confirmation...` });
      console.log("Transaction submitted:", tx.hash);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      setPurchaseStatus({ state: 'success', message: `Purchase successful! Transaction Hash: ${receipt.transactionHash}` });
      // Optionally: Refresh listings or update UI after successful purchase
      // fetchHarvests(); // Re-fetch data
      setTimeout(() => setShowPurchaseModal(false), 3000); // Close modal after delay

    } catch (err) {
      console.error("Purchase failed:", err);
      // Try to extract a more user-friendly error message
      let errorMessage = "Purchase failed. Check console for details.";
      if (err.reason) {
        errorMessage = `Transaction failed: ${err.reason}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      if (err.code === 4001) { // User rejected transaction
        errorMessage = "Transaction rejected in wallet.";
      }
      setPurchaseStatus({ state: 'error', message: errorMessage });
    }
  };

  const getAnimationDelay = (index) => `${index * 50}ms`;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 bg-slate-100 min-h-screen">
      {/* Header and Register Link */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center">
          <Leaf className="mr-2 h-8 w-8 text-green-600" />
          Crop Marketplace
        </h1>
        {walletInfo?.role === 'producer' && (
          <Link to="/register" className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md flex items-center transition-colors">
            <Leaf className="mr-2 h-5 w-5" /> Register Your Crop
          </Link>
        )}
      </div>

      {/* Info Box and Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <p className="text-gray-700 mb-6">Browse sustainable farming opportunities...</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
            <input type="text" placeholder="Search by crop, producer address, or location" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300" value={searchQuery} onChange={handleSearch} />
          </div>
          <button onClick={toggleFilters} className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center justify-center transition-all duration-300 hover:shadow-md">
            <Filter className="h-5 w-5 mr-2" /> Filters {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </button>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300">
            <option value="default">Sort: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="carbon">Most Carbon Credits</option>
          </select>
        </div>
        <div className={`transition-all duration-300 overflow-hidden ${showFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          {showFilters && <FiltersPanel filters={filters} setFilters={setFilters} />}
        </div>
        <div className="mb-4 text-gray-600 flex items-center">
          {isLoading ? <><RefreshIcon className="mr-2 h-4 w-4 text-green-600 animate-spin" /> Loading listings...</> : `Showing ${filteredListings.length} results`}
        </div>
      </div>

      {/* Error Loading Message */}
      {error && (
         <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg shadow mt-6">
            <p className="text-red-700 font-medium">Error loading marketplace:</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
      )}

      {/* Listings Grid or No Results Message */}
      {!isLoading && !error && (
        <>
          {filteredListings.length > 0 ? (
            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-6">
              {filteredListings.map((listing, index) => (
                <div key={listing.id} className="opacity-0 animate-fadeIn" style={{ animationDelay: getAnimationDelay(index), animationFillMode: "forwards" }}>
                  <CropCard listing={listing} onInvestClick={handleInvestClick} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-lg shadow mt-6">
              <p className="text-gray-600">No listings match your criteria or no crops have been validated yet.</p>
            </div>
          )}
        </>
      )}

      {/* Purchase Modal */}
      {selectedListing && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          listing={selectedListing}
          onConfirm={handlePurchaseConfirm}
          walletInfo={walletInfo} // Pass wallet info
          purchaseStatus={purchaseStatus} // Pass purchase status for feedback
        />
      )}

      {/* Styles */}
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Marketplace;

