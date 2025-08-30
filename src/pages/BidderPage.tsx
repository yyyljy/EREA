import { useState } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  minimumPrice: number;
  bidDeposit: number;
  auctionDate: string;
  caseNumber: string;
  court: string;
  status: "Active" | "Pending" | "Closed";
  imageUrl: string;
  area: number;
  type: string;
}

interface DepositTransaction {
  propertyId: string;
  amount: number;
  tokenType: "wKRW" | "EERC20";
  status: "Pending" | "Confirmed" | "Failed";
  txHash?: string;
  timestamp: string;
}

interface BidSubmission {
  propertyId: string;
  bidAmount: number;
  depositConfirmed: boolean;
  bidType: "Sealed" | "Open";
  submissionTime: string;
  status: "Draft" | "Submitted" | "Confirmed";
}

interface PropertyDelivery {
  propertyId: string;
  finalPrice: number;
  remainingPayment: number;
  paymentDeadline: string;
  deliveryStatus: "Pending Payment" | "Payment Confirmed" | "Delivery Scheduled" | "Completed";
  deliveryDate?: string;
}

export function BidderPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "deposit" | "bid" | "payment" | "history">("browse");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [selectedTokenType, setSelectedTokenType] = useState<"wKRW" | "EERC20">("wKRW");
  
  // Bidding Form State
  const [bidAmount, setBidAmount] = useState<string>("");
  const [bidType, setBidType] = useState<"Sealed" | "Open">("Sealed");
  
  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  // Mock Data
  const [availableProperties] = useState<Property[]>([
    {
      id: "1",
      title: "Seoul Gangnam Premium Officetel",
      location: "Seoul Gangnam-gu Sinsa-dong 183, 2F-101",
      minimumPrice: 1346000000,
      bidDeposit: 134600000,
      auctionDate: "2025-02-15T10:00:00",
      caseNumber: "2025Ta-Auction3170",
      court: "Seoul Central District Court",
      status: "Active",
      imageUrl: "/Gangnam_District_Premium_Officetel.png",
      area: 45.2,
      type: "Commercial Facility"
    },
    {
      id: "2",
      title: "Bundang New Town Apartment",
      location: "Gyeonggi Seongnam Bundang-gu Jeongja-dong 178-1, Unit 567",
      minimumPrice: 520000000,
      bidDeposit: 52000000,
      auctionDate: "2025-02-20T14:00:00",
      caseNumber: "2024Ta-Auction4521",
      court: "Suwon District Court Seongnam Branch",
      status: "Active",
      imageUrl: "/Bundang_New_Town_Apartment_Complex.png",
      area: 84.3,
      type: "Residential Complex"
    },
    {
      id: "3",
      title: "Jeju Seogwipo Detached House",
      location: "Jeju Seogwipo-si Daejeong-eup Hamori 1234-5",
      minimumPrice: 380000000,
      bidDeposit: 38000000,
      auctionDate: "2025-02-25T16:00:00",
      caseNumber: "2024Ta-Auction2890",
      court: "Jeju District Court",
      status: "Active",
      imageUrl: "/Jeju_Island_Villa.png",
      area: 150.5,
      type: "Detached House"
    }
  ]);

  const [depositTransactions, setDepositTransactions] = useState<DepositTransaction[]>([
    {
      propertyId: "1",
      amount: 134600000,
      tokenType: "wKRW",
      status: "Confirmed",
      txHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      timestamp: "2025-01-15T14:30:00"
    }
  ]);

  const [bidSubmissions, setBidSubmissions] = useState<BidSubmission[]>([
    {
      propertyId: "1",
      bidAmount: 1400000000,
      depositConfirmed: true,
      bidType: "Sealed",
      submissionTime: "2025-01-16T10:00:00",
      status: "Submitted"
    }
  ]);

  const [deliveryTransactions] = useState<PropertyDelivery[]>([
    {
      propertyId: "1",
      finalPrice: 1400000000,
      remainingPayment: 1265400000, // Final price - deposit
      paymentDeadline: "2025-03-01T17:00:00",
      deliveryStatus: "Pending Payment"
    }
  ]);

  const formatPrice = (price: number) => {
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

  const hasDeposit = (propertyId: string) => {
    return depositTransactions.some(d => d.propertyId === propertyId && d.status === "Confirmed");
  };

  const hasBid = (propertyId: string) => {
    return bidSubmissions.some(b => b.propertyId === propertyId && b.status !== "Draft");
  };

  const handleDepositSubmit = async () => {
    if (!selectedProperty || !depositAmount) return;
    
    setIsLoading(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newDeposit: DepositTransaction = {
      propertyId: selectedProperty.id,
      amount: parseFloat(depositAmount),
      tokenType: selectedTokenType,
      status: "Confirmed",
      txHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      timestamp: new Date().toISOString()
    };
    
    setDepositTransactions(prev => [...prev, newDeposit]);
    
    alert(`Deposit of ${formatPrice(parseFloat(depositAmount))} confirmed! You received ${formatPrice(parseFloat(depositAmount))} EERC20 tokens for bidding.`);
    
    setDepositAmount("");
    setSelectedProperty(null);
    setIsLoading(false);
  };

  const handleBidSubmit = async () => {
    if (!selectedProperty || !bidAmount) return;
    
    const bidValue = parseFloat(bidAmount);
    if (bidValue < selectedProperty.minimumPrice) {
      alert("Bid amount must be at least the minimum price.");
      return;
    }
    
    if (!hasDeposit(selectedProperty.id)) {
      alert("Please complete deposit payment before submitting a bid.");
      return;
    }
    
    setIsLoading(true);
    
    // Simulate encrypted bid submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newBid: BidSubmission = {
      propertyId: selectedProperty.id,
      bidAmount: bidValue,
      depositConfirmed: true,
      bidType,
      submissionTime: new Date().toISOString(),
      status: "Submitted"
    };
    
    setBidSubmissions(prev => [...prev, newBid]);
    
    alert(`Encrypted bid of ${formatPrice(bidValue)} submitted successfully! Your bid is sealed until the auction deadline.`);
    
    setBidAmount("");
    setSelectedProperty(null);
    setIsLoading(false);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentAmount) return;
    
    setIsLoading(true);
    
    // Simulate final payment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    alert(`Final payment of ${formatPrice(parseFloat(paymentAmount))} confirmed! Property delivery will be scheduled within 7 business days.`);
    
    setPaymentAmount("");
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="avax-heading text-4xl mb-4">
          Bidder Portal
        </h1>
        <p className="avax-body text-lg max-w-4xl mx-auto">
          Browse auction properties, deposit bid guarantees, submit encrypted bids, and complete property purchases 
          through secure EERC20 token transactions on the Avalanche blockchain.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="avax-card">
        <div className="border-b border-avax-border">
          <nav className="flex space-x-1 p-1">
            {[
              { key: "browse", label: "Browse Properties" },
              { key: "deposit", label: "Deposit Management" },
              { key: "bid", label: "Submit Bids" },
              { key: "payment", label: "Final Payment" },
              { key: "history", label: "Transaction History" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 text-sm ${
                  activeTab === tab.key
                    ? "bg-erea-primary text-white"
                    : "text-erea-text hover:bg-avax-light"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8">
          {/* Browse Properties Tab */}
          {activeTab === "browse" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Available Auction Properties</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableProperties.map((property) => (
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
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="avax-subheading text-base leading-tight mb-1">{property.title}</h3>
                          <p className="text-erea-text-light text-sm">{property.type} • {property.area}㎡</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          property.status === "Active" ? "bg-avax-success text-white" :
                          property.status === "Pending" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="avax-body text-sm text-avax-gray">Minimum Price:</span>
                          <span className="font-bold text-erea-primary">{formatPrice(property.minimumPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="avax-body text-sm text-avax-gray">Bid Deposit:</span>
                          <span className="font-semibold text-avax-red">{formatPrice(property.bidDeposit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="avax-body text-sm text-avax-gray">Auction Date:</span>
                          <span className="font-semibold">{new Date(property.auctionDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="bg-avax-light p-3 rounded mb-4 text-center">
                        <span className="text-sm text-avax-gray">Time Remaining: </span>
                        <span className="font-semibold text-avax-red">{getTimeRemaining(property.auctionDate)}</span>
                      </div>

                      <div className="space-y-2">
                        {hasDeposit(property.id) ? (
                          <div className="flex items-center space-x-2 text-sm text-avax-success">
                            <span>✓</span>
                            <span>Deposit Confirmed</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setActiveTab("deposit");
                            }}
                            className="w-full avax-button-primary"
                            disabled={property.status !== "Active"}
                          >
                            Pay Deposit
                          </button>
                        )}
                        
                        {hasBid(property.id) ? (
                          <div className="flex items-center space-x-2 text-sm text-erea-primary">
                            <span>📝</span>
                            <span>Bid Submitted</span>
                          </div>
                        ) : hasDeposit(property.id) ? (
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setActiveTab("bid");
                            }}
                            className="w-full avax-button-secondary"
                          >
                            Submit Bid
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full avax-button-outline opacity-50"
                          >
                            Deposit Required
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deposit Management Tab */}
          {activeTab === "deposit" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Bid Deposit Management</h2>
              
              <div className="avax-card p-6 bg-blue-50 border-l-4 border-erea-primary">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">💰</span>
                  How Deposits Work
                </h3>
                <p className="avax-body text-sm">
                  Deposit 10% of the property's minimum price using wKRW tokens. You'll receive equivalent EERC20 tokens 
                  that can be used for bidding. If you don't win the auction, your deposit is automatically refunded.
                </p>
              </div>

              {selectedProperty ? (
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">
                    Deposit for: {selectedProperty.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="avax-body">Required Deposit:</span>
                        <span className="font-bold text-erea-primary">{formatPrice(selectedProperty.bidDeposit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="avax-body">Minimum Bid:</span>
                        <span className="font-semibold">{formatPrice(selectedProperty.minimumPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="avax-body">Auction Date:</span>
                        <span className="font-semibold">{new Date(selectedProperty.auctionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="avax-card p-4 bg-avax-light">
                      <h4 className="avax-subheading text-sm mb-3">Token Exchange</h4>
                      <div className="text-center">
                        <div className="text-lg font-bold text-erea-primary">{formatPrice(selectedProperty.bidDeposit)}</div>
                        <div className="text-sm text-erea-text-light">wKRW → EERC20</div>
                        <div className="text-xs text-erea-text-light mt-2">1:1 Exchange Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Token Type</label>
                      <select
                        value={selectedTokenType}
                        onChange={(e) => setSelectedTokenType(e.target.value as "wKRW" | "EERC20")}
                        className="avax-input w-full"
                      >
                        <option value="wKRW">wKRW (Wrapped Korean Won)</option>
                        <option value="EERC20">EERC20 (Direct Transfer)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Deposit Amount (KRW)</label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder={selectedProperty.bidDeposit.toString()}
                        className="avax-input w-full"
                        min={selectedProperty.bidDeposit}
                        step="1000000"
                        required
                      />
                      <p className="text-xs text-erea-text-light mt-1">
                        Minimum required: {formatPrice(selectedProperty.bidDeposit)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setDepositAmount(selectedProperty.bidDeposit.toString())}
                        className="avax-button-outline flex-1"
                      >
                        Use Minimum Amount
                      </button>
                      <button
                        onClick={handleDepositSubmit}
                        disabled={isLoading || !depositAmount || parseFloat(depositAmount) < selectedProperty.bidDeposit}
                        className="avax-button-primary flex-1"
                      >
                        {isLoading ? "Processing..." : "Submit Deposit"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="avax-card p-6 text-center">
                  <p className="avax-body text-erea-text-light">
                    Select a property from the Browse Properties tab to manage deposits.
                  </p>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="avax-button-outline mt-4"
                  >
                    Browse Properties
                  </button>
                </div>
              )}

              {/* Deposit History */}
              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4">Deposit History</h3>
                {depositTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {depositTransactions.map((deposit, index) => {
                      const property = availableProperties.find(p => p.id === deposit.propertyId);
                      return (
                        <div key={index} className="border border-avax-border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{property?.title || "Unknown Property"}</h4>
                              <p className="text-sm text-erea-text-light">
                                {formatPrice(deposit.amount)} {deposit.tokenType} → EERC20
                              </p>
                              <p className="text-xs text-erea-text-light">
                                {new Date(deposit.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                deposit.status === "Confirmed" ? "bg-avax-success text-white" :
                                deposit.status === "Pending" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                              }`}>
                                {deposit.status}
                              </span>
                              {deposit.txHash && (
                                <p className="text-xs text-erea-text-light mt-1 font-mono">
                                  {deposit.txHash.slice(0, 10)}...{deposit.txHash.slice(-8)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-erea-text-light text-center">No deposits made yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Bids Tab */}
          {activeTab === "bid" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Submit Encrypted Bids</h2>
              
              <div className="avax-card p-6 bg-purple-50 border-l-4 border-erea-secondary">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">🔒</span>
                  Encrypted Bidding Process
                </h3>
                <p className="avax-body text-sm">
                  All bids are encrypted using EERC technology and remain sealed until the auction deadline. 
                  You can only bid on properties where you've made the required deposit.
                </p>
              </div>

              {selectedProperty ? (
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">
                    Submit Bid for: {selectedProperty.title}
                  </h3>
                  
                  {hasDeposit(selectedProperty.id) ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="avax-body">Minimum Bid:</span>
                            <span className="font-bold text-erea-primary">{formatPrice(selectedProperty.minimumPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="avax-body">Your Deposit:</span>
                            <span className="font-semibold text-avax-success">✓ Confirmed</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="avax-body">Bidding Deadline:</span>
                            <span className="font-semibold text-avax-red">{getTimeRemaining(selectedProperty.auctionDate)}</span>
                          </div>
                        </div>
                        
                        <div className="avax-card p-4 bg-avax-light">
                          <h4 className="avax-subheading text-sm mb-3">Available EERC20</h4>
                          <div className="text-center">
                            <div className="text-lg font-bold text-erea-primary">
                              {formatPrice(depositTransactions.find(d => d.propertyId === selectedProperty.id)?.amount || 0)}
                            </div>
                            <div className="text-sm text-erea-text-light">EERC20 Tokens</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block avax-subheading text-sm mb-2">Bid Type</label>
                          <select
                            value={bidType}
                            onChange={(e) => setBidType(e.target.value as "Sealed" | "Open")}
                            className="avax-input w-full"
                          >
                            <option value="Sealed">Sealed Bid (Encrypted)</option>
                            <option value="Open">Open Bid (Visible)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block avax-subheading text-sm mb-2">Bid Amount (KRW)</label>
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={selectedProperty.minimumPrice.toString()}
                            className="avax-input w-full"
                            min={selectedProperty.minimumPrice}
                            step="1000000"
                            required
                          />
                          <p className="text-xs text-erea-text-light mt-1">
                            Minimum bid: {formatPrice(selectedProperty.minimumPrice)}
                          </p>
                        </div>
                        
                        <div className="avax-card p-4 bg-amber-50 border border-avax-warning">
                          <h4 className="avax-subheading text-sm mb-2">Important Notice</h4>
                          <ul className="text-xs text-erea-text space-y-1">
                            <li>• Sealed bids are encrypted and cannot be changed after submission</li>
                            <li>• Your bid amount must not exceed your available EERC20 balance</li>
                            <li>• If you win, the remaining amount must be paid within 7 days</li>
                            <li>• Deposits are automatically refunded if you don't win</li>
                          </ul>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button
                            onClick={() => {
                              setSelectedProperty(null);
                              setBidAmount("");
                            }}
                            className="avax-button-outline flex-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleBidSubmit}
                            disabled={isLoading || !bidAmount || parseFloat(bidAmount) < selectedProperty.minimumPrice}
                            className="avax-button-primary flex-1"
                          >
                            {isLoading ? "Submitting..." : "Submit Encrypted Bid"}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <p className="avax-body text-erea-text-light mb-4">
                        You must make a deposit before submitting a bid for this property.
                      </p>
                      <button
                        onClick={() => setActiveTab("deposit")}
                        className="avax-button-primary"
                      >
                        Make Deposit
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">Properties Available for Bidding</h3>
                  <div className="space-y-3">
                    {availableProperties.filter(p => hasDeposit(p.id)).map(property => (
                      <div key={property.id} className="border border-avax-border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{property.title}</h4>
                          <p className="text-sm text-erea-text-light">
                            Minimum: {formatPrice(property.minimumPrice)} • 
                            Deadline: {getTimeRemaining(property.auctionDate)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {hasBid(property.id) ? (
                            <span className="px-3 py-1 text-xs bg-erea-primary text-white rounded-full">
                              Bid Submitted
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedProperty(property)}
                              className="avax-button-outline text-sm px-4 py-2"
                            >
                              Submit Bid
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {availableProperties.filter(p => hasDeposit(p.id)).length === 0 && (
                      <p className="text-erea-text-light text-center">
                        No properties available for bidding. Make deposits first.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Final Payment & Property Delivery</h2>
              
              <div className="avax-card p-6 bg-green-50 border-l-4 border-avax-success">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">🎉</span>
                  Congratulations!
                </h3>
                <p className="avax-body text-sm">
                  Complete your final payment to secure property ownership. The remaining balance must be paid 
                  within the specified deadline to complete the transaction.
                </p>
              </div>

              {deliveryTransactions.length > 0 ? (
                <div className="space-y-4">
                  {deliveryTransactions.map((delivery, index) => {
                    const property = availableProperties.find(p => p.id === delivery.propertyId);
                    return (
                      <div key={index} className="avax-card p-6">
                        <h3 className="avax-subheading text-lg mb-4">
                          Final Payment: {property?.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="avax-body">Winning Bid:</span>
                              <span className="font-bold text-erea-primary">{formatPrice(delivery.finalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="avax-body">Deposit Paid:</span>
                              <span className="font-semibold text-avax-success">
                                -{formatPrice(delivery.finalPrice - delivery.remainingPayment)}
                              </span>
                            </div>
                            <div className="flex justify-between border-t border-avax-border pt-2">
                              <span className="avax-body font-semibold">Remaining Balance:</span>
                              <span className="font-bold text-avax-red">{formatPrice(delivery.remainingPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="avax-body">Payment Deadline:</span>
                              <span className="font-semibold text-avax-warning">
                                {new Date(delivery.paymentDeadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="avax-card p-4 bg-avax-light">
                            <h4 className="avax-subheading text-sm mb-3">Delivery Status</h4>
                            <div className="text-center">
                              <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                                delivery.deliveryStatus === "Pending Payment" ? "bg-avax-warning text-white" :
                                delivery.deliveryStatus === "Payment Confirmed" ? "bg-avax-success text-white" :
                                delivery.deliveryStatus === "Delivery Scheduled" ? "bg-erea-primary text-white" :
                                "bg-avax-success text-white"
                              }`}>
                                {delivery.deliveryStatus}
                              </span>
                              {delivery.deliveryDate && (
                                <div className="text-sm text-erea-text-light mt-2">
                                  Delivery: {new Date(delivery.deliveryDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {delivery.deliveryStatus === "Pending Payment" && (
                          <div className="space-y-4">
                            <div>
                              <label className="block avax-subheading text-sm mb-2">Payment Amount (KRW)</label>
                              <input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                placeholder={delivery.remainingPayment.toString()}
                                className="avax-input w-full"
                                min={delivery.remainingPayment}
                                step="1000000"
                                required
                              />
                              <p className="text-xs text-erea-text-light mt-1">
                                Required amount: {formatPrice(delivery.remainingPayment)}
                              </p>
                            </div>
                            
                            <div className="avax-card p-4 bg-amber-50 border border-avax-warning">
                              <h4 className="avax-subheading text-sm mb-2">Payment Instructions</h4>
                              <ul className="text-xs text-erea-text space-y-1">
                                <li>• Payment must be made in wKRW or EERC20 tokens</li>
                                <li>• Property ownership transfer will begin after payment confirmation</li>
                                <li>• Delivery typically occurs within 7 business days</li>
                                <li>• All fees and taxes are included in the final amount</li>
                              </ul>
                            </div>
                            
                            <div className="flex space-x-4">
                              <button
                                onClick={() => setPaymentAmount(delivery.remainingPayment.toString())}
                                className="avax-button-outline flex-1"
                              >
                                Use Full Amount
                              </button>
                              <button
                                onClick={handlePaymentSubmit}
                                disabled={isLoading || !paymentAmount || parseFloat(paymentAmount) < delivery.remainingPayment}
                                className="avax-button-primary flex-1"
                              >
                                {isLoading ? "Processing..." : "Submit Payment"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="avax-card p-6 text-center">
                  <p className="avax-body text-erea-text-light">
                    No winning bids requiring payment at this time.
                  </p>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="avax-button-outline mt-4"
                  >
                    Browse More Properties
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Transaction History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Transaction History</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-erea-primary">{depositTransactions.length}</div>
                  <div className="text-erea-text-light font-semibold">Deposits Made</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-success">{bidSubmissions.length}</div>
                  <div className="text-erea-text-light font-semibold">Bids Submitted</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-accent">{deliveryTransactions.length}</div>
                  <div className="text-erea-text-light font-semibold">Properties Won</div>
                </div>
              </div>

              {/* All Transactions */}
              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4">All Transactions</h3>
                <div className="space-y-4">
                  {/* Deposits */}
                  {depositTransactions.map((deposit, index) => {
                    const property = availableProperties.find(p => p.id === deposit.propertyId);
                    return (
                      <div key={`deposit-${index}`} className="border border-avax-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-erea-primary text-white rounded-full flex items-center justify-center font-bold">
                              💰
                            </div>
                            <div>
                              <h4 className="font-semibold">Deposit Payment</h4>
                              <p className="text-sm text-erea-text-light">{property?.title}</p>
                              <p className="text-xs text-erea-text-light">
                                {new Date(deposit.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-erea-primary">{formatPrice(deposit.amount)}</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              deposit.status === "Confirmed" ? "bg-avax-success text-white" :
                              deposit.status === "Pending" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                            }`}>
                              {deposit.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Bids */}
                  {bidSubmissions.map((bid, index) => {
                    const property = availableProperties.find(p => p.id === bid.propertyId);
                    return (
                      <div key={`bid-${index}`} className="border border-avax-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-avax-success text-white rounded-full flex items-center justify-center font-bold">
                              📝
                            </div>
                            <div>
                              <h4 className="font-semibold">{bid.bidType} Bid</h4>
                              <p className="text-sm text-erea-text-light">{property?.title}</p>
                              <p className="text-xs text-erea-text-light">
                                {new Date(bid.submissionTime).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-erea-primary">{formatPrice(bid.bidAmount)}</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              bid.status === "Submitted" ? "bg-avax-success text-white" :
                              bid.status === "Confirmed" ? "bg-erea-primary text-white" : "bg-avax-warning text-white"
                            }`}>
                              {bid.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {depositTransactions.length === 0 && bidSubmissions.length === 0 && (
                    <p className="text-erea-text-light text-center">No transactions yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="avax-card p-6 bg-blue-50 border-l-4 border-erea-primary">
        <h3 className="avax-subheading text-lg mb-2 flex items-center">
          <span className="mr-2">🔐</span>
          Security & Privacy
        </h3>
        <p className="avax-body">
          All transactions are secured using Avalanche blockchain technology with EERC20 encryption. 
          Your bid amounts and personal information are protected while maintaining complete 
          transparency of the auction process for regulatory compliance.
        </p>
      </div>
    </div>
  );
}
