import { useState } from "react";

interface PropertyRegistration {
  // Basic Information
  title: string;
  address: string;
  propertyType: string;
  area: number;
  buildYear: number;
  floors: string;
  
  // Legal Information
  caseNumber: string;
  court: string;
  propertyNumber: string;
  
  // Pricing Information
  appraisalValue: number;
  minimumPrice: number;
  bidDeposit: number;
  
  // Auction Schedule
  auctionDate: string;
  registrationDate: string;
  announceDate: string;
  
  // Resident Information
  hasResidents: boolean;
  residentStatus: string;
  residentDetails?: string;
  
  // Owner Information
  ownerName: string;
  ownerContact: string;
  ownerAddress: string;
  
  // Additional Information
  description: string;
  features: string[];
  rightAnalysis: string;
  auctionCount: number;
  isUnsold: boolean;
}

// interface AuctionManagement {
//   propertyId: string;
//   status: "Active" | "Pending" | "Cancelled" | "Completed";
//   currentBids: number;
//   highestBid?: number;
//   unsoldReason?: string;
//   nextAuctionDate?: string;
// }

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<"register" | "manage" | "residents" | "analytics">("register");
  const [isLoading, setIsLoading] = useState(false);
  
  // Property Registration Form State
  const [propertyForm, setPropertyForm] = useState<PropertyRegistration>({
    title: "",
    address: "",
    propertyType: "Apartment",
    area: 0,
    buildYear: new Date().getFullYear(),
    floors: "",
    caseNumber: "",
    court: "",
    propertyNumber: "",
    appraisalValue: 0,
    minimumPrice: 0,
    bidDeposit: 0,
    auctionDate: "",
    registrationDate: new Date().toISOString().split('T')[0],
    announceDate: "",
    hasResidents: false,
    residentStatus: "None",
    ownerName: "",
    ownerContact: "",
    ownerAddress: "",
    description: "",
    features: [],
    rightAnalysis: "",
    auctionCount: 1,
    isUnsold: false
  });

  const [newFeature, setNewFeature] = useState("");

  // Mock data for demonstration
  const [registeredProperties] = useState([
    {
      id: "1",
      title: "Seoul Gangnam Premium Officetel",
      status: "Active" as const,
      auctionDate: "2025-02-15",
      minimumPrice: 1346000000,
      currentBids: 3
    },
    {
      id: "2", 
      title: "Bundang Apartment Complex",
      status: "Pending" as const,
      auctionDate: "2025-02-20",
      minimumPrice: 520000000,
      currentBids: 1
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

  const handlePropertyFormChange = (field: keyof PropertyRegistration, value: any) => {
    setPropertyForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !propertyForm.features.includes(newFeature.trim())) {
      setPropertyForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setPropertyForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const calculateBidDeposit = () => {
    const deposit = propertyForm.minimumPrice * 0.1;
    setPropertyForm(prev => ({
      ...prev,
      bidDeposit: deposit
    }));
  };

  const handleSubmitProperty = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert("Property registered successfully! The listing will be published after verification.");
    
    // Reset form
    setPropertyForm({
      title: "",
      address: "",
      propertyType: "Apartment",
      area: 0,
      buildYear: new Date().getFullYear(),
      floors: "",
      caseNumber: "",
      court: "",
      propertyNumber: "",
      appraisalValue: 0,
      minimumPrice: 0,
      bidDeposit: 0,
      auctionDate: "",
      registrationDate: new Date().toISOString().split('T')[0],
      announceDate: "",
      hasResidents: false,
      residentStatus: "None",
      ownerName: "",
      ownerContact: "",
      ownerAddress: "",
      description: "",
      features: [],
      rightAnalysis: "",
      auctionCount: 1,
      isUnsold: false
    });
    
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="avax-heading text-4xl mb-4">
          Admin Dashboard
        </h1>
        <p className="avax-body text-lg max-w-4xl mx-auto">
          Manage auction properties, monitor resident status, and oversee the EREA platform operations.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="avax-card">
        <div className="border-b border-avax-border">
          <nav className="flex space-x-1 p-1">
            {[
              { key: "register", label: "Property Registration" },
              { key: "manage", label: "Auction Management" },
              { key: "residents", label: "Resident Verification" },
              { key: "analytics", label: "Platform Analytics" }
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
          {/* Property Registration Tab */}
          {activeTab === "register" && (
            <div className="space-y-8">
              <h2 className="avax-subheading text-2xl">Register New Auction Property</h2>
              
              <form className="space-y-6">
                {/* Basic Property Information */}
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                    Basic Property Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Property Title</label>
                      <input
                        type="text"
                        value={propertyForm.title}
                        onChange={(e) => handlePropertyFormChange("title", e.target.value)}
                        placeholder="Seoul Gangnam Premium Officetel"
                        className="avax-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Property Type</label>
                      <select
                        value={propertyForm.propertyType}
                        onChange={(e) => handlePropertyFormChange("propertyType", e.target.value)}
                        className="avax-input w-full"
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="Officetel">Officetel</option>
                        <option value="Commercial">Commercial Building</option>
                        <option value="Detached House">Detached House</option>
                        <option value="Villa">Villa</option>
                        <option value="Land">Land</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block avax-subheading text-sm mb-2">Full Address</label>
                      <input
                        type="text"
                        value={propertyForm.address}
                        onChange={(e) => handlePropertyFormChange("address", e.target.value)}
                        placeholder="Seoul Gangnam-gu Sinsa-dong 183, 2F-101"
                        className="avax-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Area (㎡)</label>
                      <input
                        type="number"
                        value={propertyForm.area || ""}
                        onChange={(e) => handlePropertyFormChange("area", parseFloat(e.target.value) || 0)}
                        placeholder="84.3"
                        className="avax-input w-full"
                        step="0.1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Build Year</label>
                      <input
                        type="number"
                        value={propertyForm.buildYear || ""}
                        onChange={(e) => handlePropertyFormChange("buildYear", parseInt(e.target.value) || new Date().getFullYear())}
                        placeholder="2010"
                        className="avax-input w-full"
                        min="1900"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Floors</label>
                      <input
                        type="text"
                        value={propertyForm.floors}
                        onChange={(e) => handlePropertyFormChange("floors", e.target.value)}
                        placeholder="12F/15F"
                        className="avax-input w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Legal Information */}
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                    Legal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Case Number</label>
                      <input
                        type="text"
                        value={propertyForm.caseNumber}
                        onChange={(e) => handlePropertyFormChange("caseNumber", e.target.value)}
                        placeholder="2025Ta-Auction3170"
                        className="avax-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Court</label>
                      <input
                        type="text"
                        value={propertyForm.court}
                        onChange={(e) => handlePropertyFormChange("court", e.target.value)}
                        placeholder="Seoul Central District Court"
                        className="avax-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Property Number</label>
                      <input
                        type="text"
                        value={propertyForm.propertyNumber}
                        onChange={(e) => handlePropertyFormChange("propertyNumber", e.target.value)}
                        placeholder="1"
                        className="avax-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Auction Count</label>
                      <select
                        value={propertyForm.auctionCount}
                        onChange={(e) => handlePropertyFormChange("auctionCount", parseInt(e.target.value))}
                        className="avax-input w-full"
                      >
                        <option value={1}>1st Auction</option>
                        <option value={2}>2nd Auction</option>
                        <option value={3}>3rd Auction</option>
                        <option value={4}>4th+ Auction</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                    Pricing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Appraisal Value (KRW)</label>
                      <input
                        type="number"
                        value={propertyForm.appraisalValue || ""}
                        onChange={(e) => handlePropertyFormChange("appraisalValue", parseFloat(e.target.value) || 0)}
                        placeholder="1433000000"
                        className="avax-input w-full"
                        step="1000000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Minimum Price (KRW)</label>
                      <input
                        type="number"
                        value={propertyForm.minimumPrice || ""}
                        onChange={(e) => handlePropertyFormChange("minimumPrice", parseFloat(e.target.value) || 0)}
                        placeholder="1346000000"
                        className="avax-input w-full"
                        step="1000000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Bid Deposit (KRW)</label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={propertyForm.bidDeposit || ""}
                          onChange={(e) => handlePropertyFormChange("bidDeposit", parseFloat(e.target.value) || 0)}
                          placeholder="134600000"
                          className="avax-input flex-1"
                          step="1000000"
                          required
                        />
                        <button
                          type="button"
                          onClick={calculateBidDeposit}
                          className="avax-button-outline px-4"
                        >
                          Calculate 10%
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auction Schedule */}
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                    Auction Schedule
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Registration Date</label>
                      <input
                        type="date"
                        value={propertyForm.registrationDate}
                        onChange={(e) => handlePropertyFormChange("registrationDate", e.target.value)}
                        className="avax-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Announcement Date</label>
                      <input
                        type="date"
                        value={propertyForm.announceDate}
                        onChange={(e) => handlePropertyFormChange("announceDate", e.target.value)}
                        className="avax-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Auction Date & Time</label>
                      <input
                        type="datetime-local"
                        value={propertyForm.auctionDate}
                        onChange={(e) => handlePropertyFormChange("auctionDate", e.target.value)}
                        className="avax-input w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Resident Information */}
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                    Resident & Opposing Rights Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={propertyForm.hasResidents}
                          onChange={(e) => handlePropertyFormChange("hasResidents", e.target.checked)}
                          className="rounded border-avax-border"
                        />
                        <span className="avax-body">Property has current residents</span>
                      </label>
                    </div>
                    
                    {propertyForm.hasResidents && (
                      <>
                        <div>
                          <label className="block avax-subheading text-sm mb-2">Resident Status</label>
                          <select
                            value={propertyForm.residentStatus}
                            onChange={(e) => handlePropertyFormChange("residentStatus", e.target.value)}
                            className="avax-input w-full"
                          >
                            <option value="None">No Residents</option>
                            <option value="Tenant">Tenant with Lease Rights</option>
                            <option value="Owner-Occupant">Owner-Occupant</option>
                            <option value="Opposing Rights">Has Opposing Rights</option>
                            <option value="Unclear">Status Unclear</option>
                          </select>
                        </div>
                        <div>
                          <label className="block avax-subheading text-sm mb-2">Resident Details</label>
                          <textarea
                            value={propertyForm.residentDetails || ""}
                            onChange={(e) => handlePropertyFormChange("residentDetails", e.target.value)}
                            placeholder="Describe resident situation, lease terms, opposing rights, etc."
                            className="avax-input w-full h-24"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Owner Information */}
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                    Property Owner Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Owner Name</label>
                      <input
                        type="text"
                        value={propertyForm.ownerName}
                        onChange={(e) => handlePropertyFormChange("ownerName", e.target.value)}
                        placeholder="John Kim"
                        className="avax-input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Contact Information</label>
                      <input
                        type="text"
                        value={propertyForm.ownerContact}
                        onChange={(e) => handlePropertyFormChange("ownerContact", e.target.value)}
                        placeholder="02-123-4567 or john@email.com"
                        className="avax-input w-full"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block avax-subheading text-sm mb-2">Owner Address</label>
                      <input
                        type="text"
                        value={propertyForm.ownerAddress}
                        onChange={(e) => handlePropertyFormChange("ownerAddress", e.target.value)}
                        placeholder="Seoul Gangnam-gu Sinsa-dong 123-45"
                        className="avax-input w-full"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                    Additional Property Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Property Description</label>
                      <textarea
                        value={propertyForm.description}
                        onChange={(e) => handlePropertyFormChange("description", e.target.value)}
                        placeholder="Describe the property location, condition, and notable features..."
                        className="avax-input w-full h-24"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Property Features</label>
                      <div className="flex space-x-2 mb-2">
                        <input
                          type="text"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="e.g., Near Subway, Parking Available"
                          className="avax-input flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        />
                        <button
                          type="button"
                          onClick={addFeature}
                          className="avax-button-outline px-4"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {propertyForm.features.map((feature, index) => (
                          <span
                            key={index}
                            className="bg-erea-primary text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                          >
                            <span>{feature}</span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              className="text-white hover:text-red-200"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Rights Analysis</label>
                      <textarea
                        value={propertyForm.rightAnalysis}
                        onChange={(e) => handlePropertyFormChange("rightAnalysis", e.target.value)}
                        placeholder="Analyze property rights, liens, restrictions, etc."
                        className="avax-input w-full h-24"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Unsold Management */}
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                    Unsold Property Management
                  </h3>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={propertyForm.isUnsold}
                        onChange={(e) => handlePropertyFormChange("isUnsold", e.target.checked)}
                        className="rounded border-avax-border"
                      />
                      <span className="avax-body">This property was previously unsold</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Are you sure you want to reset the form?")) {
                        setPropertyForm({
                          title: "",
                          address: "",
                          propertyType: "Apartment",
                          area: 0,
                          buildYear: new Date().getFullYear(),
                          floors: "",
                          caseNumber: "",
                          court: "",
                          propertyNumber: "",
                          appraisalValue: 0,
                          minimumPrice: 0,
                          bidDeposit: 0,
                          auctionDate: "",
                          registrationDate: new Date().toISOString().split('T')[0],
                          announceDate: "",
                          hasResidents: false,
                          residentStatus: "None",
                          ownerName: "",
                          ownerContact: "",
                          ownerAddress: "",
                          description: "",
                          features: [],
                          rightAnalysis: "",
                          auctionCount: 1,
                          isUnsold: false
                        });
                      }
                    }}
                    className="avax-button-outline"
                  >
                    Reset Form
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitProperty}
                    disabled={isLoading}
                    className="avax-button-primary"
                  >
                    {isLoading ? "Registering..." : "Register Property"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Auction Management Tab */}
          {activeTab === "manage" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Auction Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-erea-primary">{registeredProperties.length}</div>
                  <div className="text-erea-text-light font-semibold">Total Properties</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-success">
                    {registeredProperties.filter(p => p.status === 'Active').length}
                  </div>
                  <div className="text-erea-text-light font-semibold">Active Auctions</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-warning">
                    {registeredProperties.reduce((sum, p) => sum + p.currentBids, 0)}
                  </div>
                  <div className="text-erea-text-light font-semibold">Total Bids</div>
                </div>
              </div>

              <div className="avax-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-avax-light">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Auction Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Minimum Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Current Bids
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-avax-border">
                      {registeredProperties.map((property) => (
                        <tr key={property.id} className="hover:bg-avax-light/50">
                          <td className="px-6 py-4 text-sm text-erea-text">
                            {property.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              property.status === "Active" ? "bg-avax-success text-white" :
                              property.status === "Pending" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                            }`}>
                              {property.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-erea-text-light">
                            {new Date(property.auctionDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-erea-text">
                            {formatPrice(property.minimumPrice)}
                          </td>
                          <td className="px-6 py-4 text-sm text-erea-text">
                            {property.currentBids}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex space-x-2">
                              <button className="avax-button-outline text-xs px-3 py-1">
                                Edit
                              </button>
                              <button className="avax-button-secondary text-xs px-3 py-1">
                                View Bids
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Resident Verification Tab */}
          {activeTab === "residents" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Resident Verification Management</h2>
              
              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4">Pending Resident Verifications</h3>
                <div className="space-y-4">
                  <div className="border border-avax-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-erea-text">Bundang Apartment Complex - Unit 567</h4>
                        <p className="text-sm text-erea-text-light">Submitted: 2025-01-15 14:30</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-avax-warning text-white rounded-full">Pending Review</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-erea-text-light">Resident Name:</span>
                        <span className="font-semibold ml-2">Lee Min-su</span>
                      </div>
                      <div>
                        <span className="text-erea-text-light">Residency Period:</span>
                        <span className="font-semibold ml-2">2019-03 ~ Present</span>
                      </div>
                      <div>
                        <span className="text-erea-text-light">Lease Status:</span>
                        <span className="font-semibold ml-2">Valid Lease Contract</span>
                      </div>
                      <div>
                        <span className="text-erea-text-light">Documents:</span>
                        <span className="font-semibold ml-2">Lease, ID, Residence Certificate</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button className="avax-button-primary text-sm px-4 py-2">
                        Approve Verification
                      </button>
                      <button className="avax-button-outline text-sm px-4 py-2">
                        Request Additional Documents
                      </button>
                      <button className="avax-button-secondary text-sm px-4 py-2">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4">Verified Residents</h3>
                <div className="space-y-3">
                  <div className="border border-avax-border rounded-lg p-4 bg-avax-success/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-erea-text">Seoul Gangnam Officetel - 2F-101</h4>
                        <p className="text-sm text-erea-text-light">Resident: Park Ji-hoon | Verified: 2025-01-10</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-avax-success text-white rounded-full">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Platform Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Platform Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-erea-primary">$4.2M</div>
                  <div className="text-erea-text-light font-semibold">Total Transaction Value</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-success">156</div>
                  <div className="text-erea-text-light font-semibold">Registered Users</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-accent">98%</div>
                  <div className="text-erea-text-light font-semibold">Success Rate</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-warning">24</div>
                  <div className="text-erea-text-light font-semibold">Active Properties</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">Recent Platform Activity</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-avax-border pb-2">
                      <span className="text-sm">New property registered</span>
                      <span className="text-xs text-erea-text-light">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-avax-border pb-2">
                      <span className="text-sm">Resident verification approved</span>
                      <span className="text-xs text-erea-text-light">4 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-avax-border pb-2">
                      <span className="text-sm">Auction completed successfully</span>
                      <span className="text-xs text-erea-text-light">1 day ago</span>
                    </div>
                  </div>
                </div>

                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">System Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avalanche Network</span>
                      <span className="text-xs bg-avax-success text-white px-2 py-1 rounded-full">Healthy</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">EERC Protocol</span>
                      <span className="text-xs bg-avax-success text-white px-2 py-1 rounded-full">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database</span>
                      <span className="text-xs bg-avax-success text-white px-2 py-1 rounded-full">Operational</span>
                    </div>
                  </div>
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
          Admin Security Notice
        </h3>
        <p className="avax-body">
          All administrative actions are logged and secured through multi-signature authentication. 
          Property registrations and modifications require additional verification for security and compliance.
        </p>
      </div>
    </div>
  );
}
