import { useState } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  startingPrice: number;
  currentPrice: number;
  endDate: string;
  imageUrl: string;
  type: string;
  area: number;
  status: "Active" | "Closed" | "Pending";
  description: string;
  features: string[];
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Gangnam District Premium Officetel",
    location: "Sinsa-dong, Gangnam-gu, Seoul, South Korea",
    startingPrice: 500000000,
    currentPrice: 650000000,
    endDate: "2024-12-30T15:00:00",
    imageUrl: "/api/placeholder/300/200",
    type: "Officetel",
    area: 45.2,
    status: "Active",
    description: "Modern officetel in the heart of Gangnam district with excellent transportation access.",
    features: ["Near Subway Station", "24/7 Security", "Parking Available", "Modern Facilities"]
  },
  {
    id: "2", 
    title: "Bundang New Town Apartment Complex",
    location: "Jeongja-dong, Bundang-gu, Seongnam-si, Gyeonggi-do",
    startingPrice: 800000000,
    currentPrice: 920000000,
    endDate: "2024-12-28T14:00:00",
    imageUrl: "/api/placeholder/300/200",
    type: "Apartment",
    area: 84.3,
    status: "Active",
    description: "Spacious apartment in prestigious Bundang new town development.",
    features: ["School District", "Park View", "Underground Parking", "Elevator"]
  },
  {
    id: "3",
    title: "Hongdae Commercial Property",
    location: "Hapjeong-dong, Mapo-gu, Seoul, South Korea",
    startingPrice: 300000000,
    currentPrice: 380000000,
    endDate: "2024-12-25T16:00:00",
    imageUrl: "/api/placeholder/300/200",
    type: "Commercial",
    area: 32.1,
    status: "Closed",
    description: "Prime commercial space in vibrant Hongdae entertainment district.",
    features: ["High Foot Traffic", "Corner Location", "Restaurant Permitted", "Night Business"]
  },
  {
    id: "4",
    title: "Jeju Island Resort Villa",
    location: "Seogwipo-si, Jeju-do, South Korea",
    startingPrice: 1200000000,
    currentPrice: 1350000000,
    endDate: "2024-12-31T18:00:00",
    imageUrl: "/api/placeholder/300/200",
    type: "Villa",
    area: 150.5,
    status: "Active",
    description: "Luxury resort villa with ocean view on beautiful Jeju Island.",
    features: ["Ocean View", "Private Garden", "Resort Amenities", "Tourist Zone"]
  },
  {
    id: "5",
    title: "Busan Haeundae Beachfront Condo",
    location: "Haeundae-gu, Busan, South Korea",
    startingPrice: 700000000,
    currentPrice: 780000000,
    endDate: "2025-01-05T12:00:00",
    imageUrl: "/api/placeholder/300/200",
    type: "Condominium",
    area: 65.8,
    status: "Pending",
    description: "Modern condominium with direct beach access in Haeundae.",
    features: ["Beach Access", "Ocean View", "Resort Facilities", "Investment Property"]
  }
];

export function RealEstateAuction() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Closed" | "Pending">("All");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price / 1300); // Approximate KRW to USD conversion
  };

  const formatPriceKRW = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const timeLeft = end - now;

    if (timeLeft <= 0) return "Auction Ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const filteredProperties = filterStatus === "All" 
    ? mockProperties 
    : mockProperties.filter(p => p.status === filterStatus);

  const placeBid = () => {
    if (!selectedProperty || !bidAmount) return;
    
    const bidValue = parseFloat(bidAmount) * 1300; // Convert USD to KRW
    if (bidValue <= selectedProperty.currentPrice) {
      alert("Bid must be higher than current price");
      return;
    }

    alert(`Bid placed successfully for ${formatPrice(bidValue)}! Your bid will be processed securely on the Avalanche blockchain.`);
    setBidAmount("");
    setSelectedProperty(null);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="avax-heading text-4xl mb-4">
          Private Real Estate Auction Platform
        </h1>
        <p className="avax-body text-lg max-w-4xl mx-auto">
          Secure, transparent, and efficient real estate auctions powered by Avalanche EERC technology. 
          All transactions are encrypted and verified on the blockchain for maximum security and trust.
        </p>
      </div>

      {/* Statistics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="avax-card p-6 text-center">
          <div className="text-3xl font-bold text-erea-primary">{mockProperties.length}</div>
          <div className="text-erea-text-light font-semibold">Active Listings</div>
        </div>
        <div className="avax-card p-6 text-center">
          <div className="text-3xl font-bold text-avax-success">$2.1M</div>
          <div className="text-erea-text-light font-semibold">Total Volume</div>
        </div>
        <div className="avax-card p-6 text-center">
          <div className="text-3xl font-bold text-avax-secondary">156</div>
          <div className="text-erea-text-light font-semibold">Verified Bidders</div>
        </div>
        <div className="avax-card p-6 text-center">
          <div className="text-3xl font-bold text-avax-accent">98%</div>
          <div className="text-erea-text-light font-semibold">Success Rate</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="avax-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="avax-subheading text-2xl">Property Listings</h2>
          <div className="flex items-center space-x-4">
            <label className="avax-body font-semibold">Filter by Status:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="avax-input"
            >
              <option value="All">All Properties</option>
              <option value="Active">Active Auctions</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="avax-card overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-avax-gray/20 flex items-center justify-center">
              <span className="text-erea-text-light">Property Image</span>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="avax-subheading text-lg leading-tight">{property.title}</h3>
                <span className={`${
                  property.status === "Active" ? "status-active" :
                  property.status === "Pending" ? "status-pending" : "status-closed"
                }`}>
                  {property.status}
                </span>
              </div>
              
              <p className="text-erea-text-light text-sm mb-3">{property.location}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="avax-body text-sm">Starting Price:</span>
                  <span className="font-semibold">{formatPrice(property.startingPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="avax-body text-sm">Current Bid:</span>
                  <span className="font-bold text-erea-primary text-lg">{formatPrice(property.currentPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="avax-body text-sm">Area:</span>
                  <span className="font-semibold">{property.area} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="avax-body text-sm">Time Remaining:</span>
                  <span className="font-semibold text-avax-accent">{getTimeRemaining(property.endDate)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedProperty(property)}
                  className="w-full avax-button-primary"
                  disabled={property.status !== "Active"}
                >
                  {property.status === "Active" ? "Place Bid" : "View Details"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bid Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="avax-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="avax-heading text-2xl">{selectedProperty.title}</h2>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-erea-text-light hover:text-erea-text text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="avax-subheading text-lg mb-3">Property Details</h3>
                  <div className="space-y-2 avax-body">
                    <p><strong>Location:</strong> {selectedProperty.location}</p>
                    <p><strong>Type:</strong> {selectedProperty.type}</p>
                    <p><strong>Area:</strong> {selectedProperty.area} m²</p>
                    <p><strong>Status:</strong> {selectedProperty.status}</p>
                  </div>
                  
                  <h4 className="avax-subheading text-lg mt-4 mb-2">Features</h4>
                  <ul className="list-disc list-inside space-y-1 avax-body">
                    {selectedProperty.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="avax-subheading text-lg mb-3">Auction Information</h3>
                  <div className="space-y-3">
                    <div className="avax-card p-4 bg-avax-light">
                      <div className="text-sm text-erea-text-light">Current Highest Bid</div>
                      <div className="text-2xl font-bold text-erea-primary">
                        {formatPrice(selectedProperty.currentPrice)}
                      </div>
                      <div className="text-sm text-erea-text-light">
                        ({formatPriceKRW(selectedProperty.currentPrice)})
                      </div>
                    </div>
                    
                    <div className="avax-card p-4 bg-avax-light">
                      <div className="text-sm text-erea-text-light">Time Remaining</div>
                      <div className="text-xl font-bold text-avax-accent">
                        {getTimeRemaining(selectedProperty.endDate)}
                      </div>
                    </div>
                  </div>

                  {selectedProperty.status === "Active" && (
                    <div className="mt-4">
                      <label className="block avax-subheading text-sm mb-2">
                        Your Bid Amount (USD)
                      </label>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Minimum: ${formatPrice(selectedProperty.currentPrice + 1300)}`}
                        className="avax-input w-full mb-4"
                      />
                      <button
                        onClick={placeBid}
                        className="w-full avax-button-primary"
                        disabled={!bidAmount || parseFloat(bidAmount) <= (selectedProperty.currentPrice / 1300)}
                      >
                        Submit Encrypted Bid
                      </button>
                      <p className="text-xs text-erea-text-light mt-2 text-center">
                        All bids are encrypted and processed securely on Avalanche blockchain
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-avax-border pt-4">
                <h4 className="avax-subheading text-lg mb-2">Property Description</h4>
                <p className="avax-body">{selectedProperty.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Important Notice */}
      <div className="avax-card p-6 bg-blue-50 border-l-4 border-erea-primary">
        <h3 className="avax-subheading text-lg mb-2 flex items-center">
          <span className="mr-2">🔒</span>
          Security Notice
        </h3>
        <p className="avax-body">
          All auction transactions are processed through Avalanche EERC (Encrypted ERC) technology, 
          ensuring complete privacy and security of your bids. Your identity and bid amounts are 
          cryptographically protected while maintaining full transparency of the auction process.
        </p>
      </div>
    </div>
  );
}
