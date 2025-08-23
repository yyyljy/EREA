import { useState } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  startingPrice: number; // 최저가격
  currentPrice: number;
  appraisalValue: number; // 감정평가액
  endDate: string;
  imageUrl: string;
  type: string;
  area: number;
  status: "Active" | "Closed" | "Pending";
  description: string;
  features: string[];
  // 법적 정보
  caseNumber: string; // 사건번호
  court: string; // 법원명
  propertyNumber: string; // 물건번호
  auctionDate: string; // 경매일시
  // 물건 상세정보
  landArea?: number; // 토지면적
  buildingArea?: number; // 건물면적
  buildYear?: number; // 건축년도
  floors?: string; // 층수
  rightAnalysis: string; // 권리분석
  minimumPrice: number; // 최저낙찰가격
  bidDeposit: number; // 입찰보증금
  // 추가 정보
  auctionCount: number; // 경매차수
  registrationDate: string; // 사건접수일
  announceDate: string; // 경매개시일
}

const mockProperties: Property[] = [
  {
    id: "1",
    title: "Seoul Gangnam-gu Sinsa-dong 183, 2F-101",
    location: "Seoul Gangnam-gu Sinsa-dong 183, 2F-101 (Sinsa-dong, Gangnam Center City)",
    startingPrice: 1346000000, // Minimum price
    currentPrice: 1346000000,
    appraisalValue: 1433000000, // Appraisal value
    endDate: "2025-08-20T10:00:00",
    imageUrl: "/Gangnam_District_Premium_Officetel.png",
    type: "Commercial Facility",
    area: 45.2,
    status: "Active",
    description: "Commercial facility in Seoul Jung-gu Chungmuro, convenient transportation access",
    features: ["Near Subway", "Commercial Zone", "Parking Available"],
    // Legal information
    caseNumber: "2025Ta-Auction3170",
    court: "Seoul Central District Court",
    propertyNumber: "1",
    auctionDate: "2025-08-20T10:00:00",
    // Property details
    landArea: 183.2,
    buildingArea: 45.2,
    buildYear: 2004,
    floors: "2F/B1-21F",
          rightAnalysis: "Bid deposit 10% required",
      minimumPrice: 1346000000,
      bidDeposit: 134600000, // 10%
    // Additional information
    auctionCount: 1,
    registrationDate: "2025-06-23",
    announceDate: "2025-06-26"
  },
  {
    id: "2", 
    title: "Bundang Jeongja-dong Apartment",
    location: "Gyeonggi Seongnam Bundang-gu Jeongja-dong 178-1, Building 1234, Unit 567",
    startingPrice: 520000000,
    currentPrice: 520000000,
    appraisalValue: 650000000,
    endDate: "2024-12-28T14:00:00",
    imageUrl: "/Bundang_New_Town_Apartment_Complex.png",
    type: "Residential Complex",
    area: 84.3,
    status: "Active",
    description: "Apartment in Bundang New Town, excellent school district",
    features: ["Premium School District", "Park Adjacent", "Underground Parking"],
    // Legal information
    caseNumber: "2024Ta-Auction4521",
    court: "Suwon District Court Seongnam Branch",
    propertyNumber: "2",
    auctionDate: "2024-12-28T14:00:00",
    // Property details
    landArea: 84.3,
    buildingArea: 84.3,
    buildYear: 1995,
    floors: "12F/15F",
          rightAnalysis: "Land rights 84.30㎡, no prior tenants",
      minimumPrice: 520000000,
      bidDeposit: 52000000, // 10%
    // Additional information
    auctionCount: 2,
    registrationDate: "2024-08-15",
    announceDate: "2024-09-01"
  },
  {
    id: "3",
    title: "Jeju Seogwipo Detached House",
    location: "Jeju Seogwipo-si Daejeong-eup Hamori 1234-5",
    startingPrice: 380000000,
    currentPrice: 380000000,
    appraisalValue: 475000000,
    endDate: "2024-12-31T18:00:00",
    imageUrl: "/Jeju_Island_Villa.png",
    type: "Detached House",
    area: 150.5,
    status: "Active",
    description: "Detached house in Jeju Seogwipo, near coastal area",
    features: ["Ocean View", "Private Garden", "Tourist Area"],
    // Legal information
    caseNumber: "2024Ta-Auction2890",
    court: "Jeju District Court",
    propertyNumber: "1",
    auctionDate: "2024-12-31T18:00:00",
    // Property details
    landArea: 300.5,
    buildingArea: 150.5,
    buildYear: 2010,
    floors: "2F/2F",
          rightAnalysis: "Clear title transfer available, no prior liens",
      minimumPrice: 380000000,
      bidDeposit: 38000000, // 10%
    // Additional information
    auctionCount: 1,
    registrationDate: "2024-10-12",
    announceDate: "2024-11-05"
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
          Private Real Estate Auction
        </h1>
        <p className="avax-body text-lg max-w-4xl mx-auto">
          Secure, transparent, and efficient real estate auctions powered by Avalanche EERC technology.
        </p>
      </div>

      {/* Statistics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="avax-card p-6 text-center">
          <div className="text-3xl font-bold text-erea-primary">{mockProperties.length}</div>
          <div className="text-erea-text-light font-semibold">Active Listings</div>
        </div>
        <div className="avax-card p-6 text-center">
          <div className="text-3xl font-bold text-avax-success">{mockProperties.filter(p => p.status === 'Active').length}</div>
          <div className="text-erea-text-light font-semibold">Ending Soon</div>
        </div>
        <div className="avax-card p-6 text-center">
          <div className="text-3xl font-bold text-avax-black">156</div>
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
            <div className="h-48 bg-avax-gray/20 overflow-hidden">
              <img 
                src={property.imageUrl} 
                alt={property.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-avax-gray/20">
                      <div class="text-center">
                        <div class="text-4xl mb-2">🏠</div>
                        <span class="text-erea-text-light text-sm">Property Image</span>
                      </div>
                    </div>
                  `;
                }}
              />
            </div>
            
            <div className="p-6">
              {/* Case Number & Court */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs text-avax-gray mb-1">{property.court}</div>
                  <div className="text-sm font-semibold text-avax-red">{property.caseNumber}</div>
                </div>
                <span className={`${
                  property.status === "Active" ? "status-active" :
                  property.status === "Pending" ? "status-pending" : "status-closed"
                }`}>
                  {property.auctionCount}{property.auctionCount === 1 ? 'st' : property.auctionCount === 2 ? 'nd' : property.auctionCount === 3 ? 'rd' : 'th'}
                </span>
              </div>
              
              {/* Property Name */}
              <h3 className="avax-subheading text-base leading-tight mb-2">{property.title}</h3>
              <p className="text-erea-text-light text-sm mb-3">{property.type}</p>
              
              {/* Price Information */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="avax-body text-sm text-avax-gray">Appraisal Value:</span>
                  <span className="font-semibold">{formatPriceKRW(property.appraisalValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="avax-body text-sm text-avax-gray">Minimum Price:</span>
                  <span className="font-bold text-erea-primary text-lg">{formatPriceKRW(property.minimumPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="avax-body text-sm text-avax-gray">Bid Deposit:</span>
                  <span className="font-semibold text-avax-red">{formatPriceKRW(property.bidDeposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="avax-body text-sm text-avax-gray">Area:</span>
                  <span className="font-semibold">{property.area}㎡</span>
                </div>
              </div>

              {/* Auction Date */}
              <div className="bg-avax-light p-3 rounded mb-4">
                <div className="flex justify-between items-center">
                  <span className="avax-body text-sm font-semibold">Auction Date:</span>
                  <span className="font-bold text-avax-accent">
                    {new Date(property.auctionDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: '2-digit', 
                      day: '2-digit'
                    })} {new Date(property.auctionDate).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm text-avax-gray">Time Remaining: </span>
                  <span className="font-semibold text-avax-red">{getTimeRemaining(property.endDate)}</span>
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

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="avax-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="avax-heading text-xl mb-2">Property Details</h2>
                  <div className="text-sm text-avax-gray">{selectedProperty.court} • {selectedProperty.caseNumber}</div>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-erea-text-light hover:text-erea-text text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Basic Property Information */}
              <div className="mb-6">
                <h3 className="avax-subheading text-lg mb-3 border-b border-avax-border pb-2">Basic Property Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="avax-body text-sm text-avax-gray w-32">Case Number:</span>
                      <span className="font-semibold">{selectedProperty.caseNumber}</span>
                    </div>
                    <div className="flex">
                      <span className="avax-body text-sm text-avax-gray w-32">Property Number:</span>
                      <span className="font-semibold">{selectedProperty.propertyNumber}</span>
                    </div>
                    <div className="flex">
                      <span className="avax-body text-sm text-avax-gray w-32">Property Type:</span>
                      <span className="font-semibold">{selectedProperty.type}</span>
                    </div>
                    <div className="flex">
                      <span className="avax-body text-sm text-avax-gray w-32">Location:</span>
                      <span className="font-semibold">{selectedProperty.location}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="avax-body text-sm text-avax-gray w-32">Auction Round:</span>
                      <span className="font-semibold">{selectedProperty.auctionCount}{selectedProperty.auctionCount === 1 ? 'st' : selectedProperty.auctionCount === 2 ? 'nd' : selectedProperty.auctionCount === 3 ? 'rd' : 'th'}</span>
                    </div>
                    <div className="flex">
                      <span className="avax-body text-sm text-avax-gray w-32">Built Year:</span>
                      <span className="font-semibold">{selectedProperty.buildYear}</span>
                    </div>
                    <div className="flex">
                      <span className="avax-body text-sm text-avax-gray w-32">Floors:</span>
                      <span className="font-semibold">{selectedProperty.floors}</span>
                    </div>
                    <div className="flex">
                      <span className="avax-body text-sm text-avax-gray w-32">Area:</span>
                      <span className="font-semibold">{selectedProperty.area}㎡</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Information */}
              <div className="mb-6">
                <h3 className="avax-subheading text-lg mb-3 border-b border-avax-border pb-2">Price Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="avax-card p-4 bg-avax-light text-center">
                    <div className="text-sm text-avax-gray mb-1">Appraisal Value</div>
                    <div className="text-lg font-bold text-erea-text">
                      {formatPriceKRW(selectedProperty.appraisalValue)}
                    </div>
                  </div>
                  <div className="avax-card p-4 bg-red-50 text-center border-2 border-avax-red">
                    <div className="text-sm text-avax-gray mb-1">Minimum Price</div>
                    <div className="text-xl font-bold text-avax-red">
                      {formatPriceKRW(selectedProperty.minimumPrice)}
                    </div>
                  </div>
                  <div className="avax-card p-4 bg-avax-light text-center">
                    <div className="text-sm text-avax-gray mb-1">Bid Deposit</div>
                    <div className="text-lg font-bold text-erea-text">
                      {formatPriceKRW(selectedProperty.bidDeposit)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Auction Schedule */}
              <div className="mb-6">
                <h3 className="avax-subheading text-lg mb-3 border-b border-avax-border pb-2">Auction Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex">
                    <span className="avax-body text-sm text-avax-gray w-32">Case Registration:</span>
                    <span className="font-semibold">{selectedProperty.registrationDate}</span>
                  </div>
                  <div className="flex">
                    <span className="avax-body text-sm text-avax-gray w-32">Auction Announced:</span>
                    <span className="font-semibold">{selectedProperty.announceDate}</span>
                  </div>
                  <div className="flex">
                    <span className="avax-body text-sm text-avax-gray w-32">Auction Date:</span>
                    <span className="font-semibold text-avax-red">
                      {new Date(selectedProperty.auctionDate).toLocaleDateString('en-US')} {new Date(selectedProperty.auctionDate).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rights Analysis */}
              <div className="mb-6">
                <h3 className="avax-subheading text-lg mb-3 border-b border-avax-border pb-2">Rights Analysis</h3>
                <div className="avax-card p-4 bg-avax-light">
                  <p className="avax-body">{selectedProperty.rightAnalysis}</p>
                </div>
              </div>

              {/* Bidding Section */}
              {selectedProperty.status === "Active" && (
                <div className="border-t border-avax-border pt-6">
                  <h3 className="avax-subheading text-lg mb-4">Encrypted Bidding</h3>
                  <div className="avax-card p-6 bg-blue-50 border-l-4 border-avax-red">
                    <div className="mb-4">
                      <div className="text-center mb-4">
                        <div className="text-sm text-avax-gray">Time Remaining</div>
                        <div className="text-2xl font-bold text-avax-red">
                          {getTimeRemaining(selectedProperty.endDate)}
                        </div>
                      </div>
                      
                      <label className="block avax-subheading text-sm mb-2">
                        Bid Amount (KRW)
                      </label>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Minimum bid: ${formatPriceKRW(selectedProperty.minimumPrice)}`}
                        className="avax-input w-full mb-4"
                      />
                      <button
                        onClick={placeBid}
                        className="w-full avax-button-primary"
                        disabled={!bidAmount || parseFloat(bidAmount) < selectedProperty.minimumPrice}
                      >
                        Submit Encrypted Bid
                      </button>
                    </div>
                    <p className="text-xs text-erea-text-light text-center">
                      All bids are encrypted and securely processed on the Avalanche blockchain
                    </p>
                  </div>
                </div>
              )}
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
