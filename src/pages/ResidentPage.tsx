import { useState } from "react";

interface ResidentVerification {
  propertyId: string;
  propertyAddress: string;
  residentName: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  residencyStartDate: string;
  leaseType: "Owned" | "Lease" | "Monthly" | "Other";
  leaseEndDate?: string;
  depositAmount?: number;
  monthlyRent?: number;
  hasOpposingRights: boolean;
  opposingRightsDetails?: string;
  documents: string[];
}

interface InspectionSchedule {
  propertyId: string;
  preferredDates: string[];
  timeSlots: string[];
  specialRequests: string;
  contactMethod: "Phone" | "Email" | "SMS";
}

interface PropertyStatus {
  propertyId: string;
  photos: File[];
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  damages: string[];
  maintenanceNeeds: string[];
  description: string;
  photoUploadDate: string;
}

interface BiddingParticipation {
  propertyId: string;
  participationIntent: "Participate" | "Not Participate" | "Undecided";
  expectedMoveOutDate?: string;
  preferredResidencyEndDate?: string;
  negotiationWillingness: boolean;
  additionalComments: string;
}

export function ResidentPage() {
  const [activeTab, setActiveTab] = useState<"verification" | "inspection" | "photos" | "bidding" | "status">("verification");
  const [isLoading, setIsLoading] = useState(false);

  // Verification Form State
  const [verificationForm, setVerificationForm] = useState<ResidentVerification>({
    propertyId: "",
    propertyAddress: "",
    residentName: "",
    idNumber: "",
    phoneNumber: "",
    email: "",
    residencyStartDate: "",
    leaseType: "Lease",
    hasOpposingRights: false,
    documents: []
  });

  // Inspection Schedule State
  const [inspectionForm, setInspectionForm] = useState<InspectionSchedule>({
    propertyId: "",
    preferredDates: [],
    timeSlots: [],
    specialRequests: "",
    contactMethod: "Phone"
  });

  // Property Status State
  const [statusForm, setStatusForm] = useState<PropertyStatus>({
    propertyId: "",
    photos: [],
    condition: "Good",
    damages: [],
    maintenanceNeeds: [],
    description: "",
    photoUploadDate: new Date().toISOString().split('T')[0]
  });

  // Bidding Participation State
  const [biddingForm, setBiddingForm] = useState<BiddingParticipation>({
    propertyId: "",
    participationIntent: "Undecided",
    negotiationWillingness: false,
    additionalComments: ""
  });

  // Available properties (mock data)
  const [availableProperties] = useState([
    {
      id: "1",
      address: "Seoul Gangnam-gu Sinsa-dong 183, 2F-101",
      auctionDate: "2025-02-15",
      caseNumber: "2025Ta-Auction3170"
    },
    {
      id: "2",
      address: "Gyeonggi Seongnam Bundang-gu Jeongja-dong 178-1, Unit 567",
      auctionDate: "2025-02-20",
      caseNumber: "2024Ta-Auction4521"
    }
  ]);

  const [newDamage, setNewDamage] = useState("");
  const [newMaintenance, setNewMaintenance] = useState("");

  const handleVerificationFormChange = (field: keyof ResidentVerification, value: any) => {
    setVerificationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInspectionFormChange = (field: keyof InspectionSchedule, value: any) => {
    setInspectionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusFormChange = (field: keyof PropertyStatus, value: any) => {
    setStatusForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBiddingFormChange = (field: keyof BiddingParticipation, value: any) => {
    setBiddingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addPreferredDate = () => {
    const today = new Date().toISOString().split('T')[0];
    if (!inspectionForm.preferredDates.includes(today)) {
      setInspectionForm(prev => ({
        ...prev,
        preferredDates: [...prev.preferredDates, today]
      }));
    }
  };

  const removePreferredDate = (index: number) => {
    setInspectionForm(prev => ({
      ...prev,
      preferredDates: prev.preferredDates.filter((_, i) => i !== index)
    }));
  };

  const addTimeSlot = (timeSlot: string) => {
    if (!inspectionForm.timeSlots.includes(timeSlot)) {
      setInspectionForm(prev => ({
        ...prev,
        timeSlots: [...prev.timeSlots, timeSlot]
      }));
    }
  };

  const removeTimeSlot = (timeSlot: string) => {
    setInspectionForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(t => t !== timeSlot)
    }));
  };

  const addDamage = () => {
    if (newDamage.trim() && !statusForm.damages.includes(newDamage.trim())) {
      setStatusForm(prev => ({
        ...prev,
        damages: [...prev.damages, newDamage.trim()]
      }));
      setNewDamage("");
    }
  };

  const removeDamage = (index: number) => {
    setStatusForm(prev => ({
      ...prev,
      damages: prev.damages.filter((_, i) => i !== index)
    }));
  };

  const addMaintenance = () => {
    if (newMaintenance.trim() && !statusForm.maintenanceNeeds.includes(newMaintenance.trim())) {
      setStatusForm(prev => ({
        ...prev,
        maintenanceNeeds: [...prev.maintenanceNeeds, newMaintenance.trim()]
      }));
      setNewMaintenance("");
    }
  };

  const removeMaintenance = (index: number) => {
    setStatusForm(prev => ({
      ...prev,
      maintenanceNeeds: prev.maintenanceNeeds.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setStatusForm(prev => ({
        ...prev,
        photos: [...prev.photos, ...fileArray]
      }));
    }
  };

  const removePhoto = (index: number) => {
    setStatusForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const submitVerification = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert("Resident verification submitted successfully! You will receive a confirmation within 24 hours.");
    setIsLoading(false);
  };

  const submitInspectionSchedule = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Inspection schedule submitted successfully! The court will contact you to confirm the appointment.");
    setIsLoading(false);
  };

  const submitPropertyStatus = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert("Property status and photos uploaded successfully! Thank you for maintaining transparency.");
    setIsLoading(false);
  };

  const submitBiddingParticipation = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Bidding participation preference submitted successfully!");
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="avax-heading text-4xl mb-4">
          Resident Portal
        </h1>
        <p className="avax-body text-lg max-w-4xl mx-auto">
          Verify your residency, schedule inspections, document property status, and manage your participation in the auction process.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="avax-card">
        <div className="border-b border-avax-border">
          <nav className="flex space-x-1 p-1">
            {[
              { key: "verification", label: "Residency Verification" },
              { key: "inspection", label: "Inspection Schedule" },
              { key: "photos", label: "Property Status" },
              { key: "bidding", label: "Bidding Participation" },
              { key: "status", label: "My Status" }
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
          {/* Residency Verification Tab */}
          {activeTab === "verification" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Residency Verification</h2>
              
              <div className="avax-card p-6 bg-blue-50 border-l-4 border-erea-primary">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">ℹ️</span>
                  Important Notice
                </h3>
                <p className="avax-body text-sm">
                  As a current resident of an auction property, you may have opposing rights (대항력) that protect your tenancy. 
                  Complete verification helps ensure your rights are properly recognized during the auction process.
                </p>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Property Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Select Property</label>
                    <select
                      value={verificationForm.propertyId}
                      onChange={(e) => {
                        const selectedProperty = availableProperties.find(p => p.id === e.target.value);
                        handleVerificationFormChange("propertyId", e.target.value);
                        if (selectedProperty) {
                          handleVerificationFormChange("propertyAddress", selectedProperty.address);
                        }
                      }}
                      className="avax-input w-full"
                      required
                    >
                      <option value="">Select your property</option>
                      {availableProperties.map(property => (
                        <option key={property.id} value={property.id}>
                          {property.address} ({property.caseNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Property Address</label>
                    <input
                      type="text"
                      value={verificationForm.propertyAddress}
                      onChange={(e) => handleVerificationFormChange("propertyAddress", e.target.value)}
                      placeholder="Full property address"
                      className="avax-input w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      value={verificationForm.residentName}
                      onChange={(e) => handleVerificationFormChange("residentName", e.target.value)}
                      placeholder="Kim Min-su"
                      className="avax-input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block avax-subheading text-sm mb-2">ID Number (Last 7 digits)</label>
                    <input
                      type="password"
                      value={verificationForm.idNumber}
                      onChange={(e) => handleVerificationFormChange("idNumber", e.target.value)}
                      placeholder="*******"
                      className="avax-input w-full"
                      maxLength={7}
                      required
                    />
                  </div>
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={verificationForm.phoneNumber}
                      onChange={(e) => handleVerificationFormChange("phoneNumber", e.target.value)}
                      placeholder="010-1234-5678"
                      className="avax-input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Email Address</label>
                    <input
                      type="email"
                      value={verificationForm.email}
                      onChange={(e) => handleVerificationFormChange("email", e.target.value)}
                      placeholder="resident@email.com"
                      className="avax-input w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Residency Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Residency Start Date</label>
                    <input
                      type="date"
                      value={verificationForm.residencyStartDate}
                      onChange={(e) => handleVerificationFormChange("residencyStartDate", e.target.value)}
                      className="avax-input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Lease Type</label>
                    <select
                      value={verificationForm.leaseType}
                      onChange={(e) => handleVerificationFormChange("leaseType", e.target.value)}
                      className="avax-input w-full"
                    >
                      <option value="Owned">Property Owner</option>
                      <option value="Lease">Long-term Lease (전세)</option>
                      <option value="Monthly">Monthly Rent (월세)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  {verificationForm.leaseType !== "Owned" && (
                    <>
                      <div>
                        <label className="block avax-subheading text-sm mb-2">Lease End Date</label>
                        <input
                          type="date"
                          value={verificationForm.leaseEndDate || ""}
                          onChange={(e) => handleVerificationFormChange("leaseEndDate", e.target.value)}
                          className="avax-input w-full"
                        />
                      </div>
                      <div>
                        <label className="block avax-subheading text-sm mb-2">
                          {verificationForm.leaseType === "Lease" ? "Deposit Amount (KRW)" : "Monthly Rent (KRW)"}
                        </label>
                        <input
                          type="number"
                          value={verificationForm.leaseType === "Lease" ? verificationForm.depositAmount || "" : verificationForm.monthlyRent || ""}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            if (verificationForm.leaseType === "Lease") {
                              handleVerificationFormChange("depositAmount", value);
                            } else {
                              handleVerificationFormChange("monthlyRent", value);
                            }
                          }}
                          placeholder={verificationForm.leaseType === "Lease" ? "300000000" : "1200000"}
                          className="avax-input w-full"
                          step="100000"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Opposing Rights (대항력)
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={verificationForm.hasOpposingRights}
                        onChange={(e) => handleVerificationFormChange("hasOpposingRights", e.target.checked)}
                        className="rounded border-avax-border"
                      />
                      <span className="avax-body">I believe I have opposing rights (대항력) for this property</span>
                    </label>
                  </div>
                  
                  {verificationForm.hasOpposingRights && (
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Opposing Rights Details</label>
                      <textarea
                        value={verificationForm.opposingRightsDetails || ""}
                        onChange={(e) => handleVerificationFormChange("opposingRightsDetails", e.target.value)}
                        placeholder="Describe your opposing rights situation (e.g., registered resident, lease registration, etc.)"
                        className="avax-input w-full h-24"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Required Documents
                </h3>
                <div className="space-y-3">
                  <p className="avax-body text-sm text-erea-text-light">
                    Please prepare the following documents for verification (upload will be available after form submission):
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <span className="text-erea-primary">•</span>
                      <span>Copy of National ID Card or Alien Registration Card</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-erea-primary">•</span>
                      <span>Residence Certificate (주민등록등본)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-erea-primary">•</span>
                      <span>Lease Contract or Property Ownership Certificate</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-erea-primary">•</span>
                      <span>Utility Bills (last 3 months)</span>
                    </li>
                    {verificationForm.hasOpposingRights && (
                      <li className="flex items-center space-x-2">
                        <span className="text-erea-primary">•</span>
                        <span>Lease Registration Certificate (전월세신고확인서)</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={submitVerification}
                  disabled={isLoading || !verificationForm.propertyId || !verificationForm.residentName}
                  className="avax-button-primary"
                >
                  {isLoading ? "Submitting..." : "Submit Verification"}
                </button>
              </div>
            </div>
          )}

          {/* Inspection Schedule Tab */}
          {activeTab === "inspection" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Inspection Schedule Registration</h2>
              
              <div className="avax-card p-6 bg-amber-50 border-l-4 border-avax-warning">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">📅</span>
                  Inspection Information
                </h3>
                <p className="avax-body text-sm">
                  Register your available dates for property inspection. The court and potential buyers will 
                  coordinate with you to schedule visits at mutually convenient times.
                </p>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Property Selection
                </h3>
                <div>
                  <label className="block avax-subheading text-sm mb-2">Select Property for Inspection</label>
                  <select
                    value={inspectionForm.propertyId}
                    onChange={(e) => handleInspectionFormChange("propertyId", e.target.value)}
                    className="avax-input w-full"
                    required
                  >
                    <option value="">Select property</option>
                    {availableProperties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.address} (Auction: {new Date(property.auctionDate).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Available Dates
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Add Preferred Dates</label>
                    <div className="flex space-x-2 mb-3">
                      <input
                        type="date"
                        className="avax-input flex-1"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          if (e.target.value && !inspectionForm.preferredDates.includes(e.target.value)) {
                            setInspectionForm(prev => ({
                              ...prev,
                              preferredDates: [...prev.preferredDates, e.target.value]
                            }));
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {inspectionForm.preferredDates.map((date, index) => (
                        <span
                          key={index}
                          className="bg-erea-primary text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{new Date(date).toLocaleDateString()}</span>
                          <button
                            type="button"
                            onClick={() => removePreferredDate(index)}
                            className="text-white hover:text-red-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Preferred Time Slots
                </h3>
                <div className="space-y-4">
                  <p className="avax-body text-sm text-erea-text-light">
                    Select your preferred time slots for inspections:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      "09:00-11:00",
                      "11:00-13:00", 
                      "13:00-15:00",
                      "15:00-17:00",
                      "17:00-19:00",
                      "19:00-21:00",
                      "Weekend Morning",
                      "Weekend Afternoon"
                    ].map(timeSlot => (
                      <label key={timeSlot} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={inspectionForm.timeSlots.includes(timeSlot)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addTimeSlot(timeSlot);
                            } else {
                              removeTimeSlot(timeSlot);
                            }
                          }}
                          className="rounded border-avax-border"
                        />
                        <span className="text-sm">{timeSlot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Contact Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Preferred Contact Method</label>
                    <select
                      value={inspectionForm.contactMethod}
                      onChange={(e) => handleInspectionFormChange("contactMethod", e.target.value)}
                      className="avax-input w-full"
                    >
                      <option value="Phone">Phone Call</option>
                      <option value="Email">Email</option>
                      <option value="SMS">SMS Text</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block avax-subheading text-sm mb-2">Special Requests or Notes</label>
                  <textarea
                    value={inspectionForm.specialRequests}
                    onChange={(e) => handleInspectionFormChange("specialRequests", e.target.value)}
                    placeholder="Any special considerations, access instructions, or scheduling constraints..."
                    className="avax-input w-full h-24"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={submitInspectionSchedule}
                  disabled={isLoading || !inspectionForm.propertyId || inspectionForm.preferredDates.length === 0}
                  className="avax-button-primary"
                >
                  {isLoading ? "Submitting..." : "Submit Schedule"}
                </button>
              </div>
            </div>
          )}

          {/* Property Status Tab */}
          {activeTab === "photos" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Property Status Documentation</h2>
              
              <div className="avax-card p-6 bg-green-50 border-l-4 border-avax-success">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">📸</span>
                  Photo Documentation
                </h3>
                <p className="avax-body text-sm">
                  Document the current condition of the property with photos. This helps maintain transparency 
                  and protects both residents and potential buyers by providing accurate property status information.
                </p>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Property Selection
                </h3>
                <div>
                  <label className="block avax-subheading text-sm mb-2">Select Property</label>
                  <select
                    value={statusForm.propertyId}
                    onChange={(e) => handleStatusFormChange("propertyId", e.target.value)}
                    className="avax-input w-full"
                    required
                  >
                    <option value="">Select property to document</option>
                    {availableProperties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.address}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Photo Upload
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Property Photos</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="avax-input w-full"
                    />
                    <p className="text-xs text-erea-text-light mt-1">
                      Upload multiple photos showing different areas and conditions of the property
                    </p>
                  </div>
                  
                  {statusForm.photos.length > 0 && (
                    <div>
                      <h4 className="avax-subheading text-sm mb-2">Uploaded Photos ({statusForm.photos.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {statusForm.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <div className="aspect-square bg-avax-light rounded-lg flex items-center justify-center">
                              <span className="text-xs text-erea-text-light text-center px-2">
                                {photo.name}
                              </span>
                            </div>
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-avax-error text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Property Condition Assessment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Overall Condition</label>
                    <select
                      value={statusForm.condition}
                      onChange={(e) => handleStatusFormChange("condition", e.target.value)}
                      className="avax-input w-full"
                    >
                      <option value="Excellent">Excellent - Like new condition</option>
                      <option value="Good">Good - Well maintained</option>
                      <option value="Fair">Fair - Some wear and minor issues</option>
                      <option value="Poor">Poor - Needs significant repairs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Photo Upload Date</label>
                    <input
                      type="date"
                      value={statusForm.photoUploadDate}
                      onChange={(e) => handleStatusFormChange("photoUploadDate", e.target.value)}
                      className="avax-input w-full"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Damage and Maintenance Documentation
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Existing Damages</label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newDamage}
                        onChange={(e) => setNewDamage(e.target.value)}
                        placeholder="e.g., Cracked tile in bathroom, Water stain on ceiling"
                        className="avax-input flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDamage())}
                      />
                      <button
                        type="button"
                        onClick={addDamage}
                        className="avax-button-outline px-4"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statusForm.damages.map((damage, index) => (
                        <span
                          key={index}
                          className="bg-avax-error text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{damage}</span>
                          <button
                            type="button"
                            onClick={() => removeDamage(index)}
                            className="text-white hover:text-red-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Maintenance Needs</label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={newMaintenance}
                        onChange={(e) => setNewMaintenance(e.target.value)}
                        placeholder="e.g., HVAC filter replacement, Touch-up paint needed"
                        className="avax-input flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaintenance())}
                      />
                      <button
                        type="button"
                        onClick={addMaintenance}
                        className="avax-button-outline px-4"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statusForm.maintenanceNeeds.map((maintenance, index) => (
                        <span
                          key={index}
                          className="bg-avax-warning text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                        >
                          <span>{maintenance}</span>
                          <button
                            type="button"
                            onClick={() => removeMaintenance(index)}
                            className="text-white hover:text-yellow-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Additional Comments
                </h3>
                <div>
                  <label className="block avax-subheading text-sm mb-2">Property Description & Notes</label>
                  <textarea
                    value={statusForm.description}
                    onChange={(e) => handleStatusFormChange("description", e.target.value)}
                    placeholder="Provide additional details about the property condition, recent improvements, or any other relevant information..."
                    className="avax-input w-full h-32"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={submitPropertyStatus}
                  disabled={isLoading || !statusForm.propertyId || statusForm.photos.length === 0}
                  className="avax-button-primary"
                >
                  {isLoading ? "Uploading..." : "Submit Property Status"}
                </button>
              </div>
            </div>
          )}

          {/* Bidding Participation Tab */}
          {activeTab === "bidding" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Bidding Participation</h2>
              
              <div className="avax-card p-6 bg-purple-50 border-l-4 border-erea-secondary">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">🏷️</span>
                  Participation Options
                </h3>
                <p className="avax-body text-sm">
                  As a current resident, you can choose to participate in the auction or indicate your 
                  preference for move-out timing. Your input helps coordinate the transition process.
                </p>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Property Selection
                </h3>
                <div>
                  <label className="block avax-subheading text-sm mb-2">Select Property</label>
                  <select
                    value={biddingForm.propertyId}
                    onChange={(e) => handleBiddingFormChange("propertyId", e.target.value)}
                    className="avax-input w-full"
                    required
                  >
                    <option value="">Select property</option>
                    {availableProperties.map(property => (
                      <option key={property.id} value={property.id}>
                        {property.address} (Auction: {new Date(property.auctionDate).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Auction Participation Intent
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Your Participation Intention</label>
                    <select
                      value={biddingForm.participationIntent}
                      onChange={(e) => handleBiddingFormChange("participationIntent", e.target.value)}
                      className="avax-input w-full"
                    >
                      <option value="Undecided">Undecided</option>
                      <option value="Participate">I plan to participate in bidding</option>
                      <option value="Not Participate">I will not participate in bidding</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={biddingForm.negotiationWillingness}
                        onChange={(e) => handleBiddingFormChange("negotiationWillingness", e.target.checked)}
                        className="rounded border-avax-border"
                      />
                      <span className="avax-body">I am open to negotiating with the winning bidder</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Move-out Planning
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Expected Move-out Date (if auction succeeds)</label>
                    <input
                      type="date"
                      value={biddingForm.expectedMoveOutDate || ""}
                      onChange={(e) => handleBiddingFormChange("expectedMoveOutDate", e.target.value)}
                      className="avax-input w-full"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-erea-text-light mt-1">
                      When you realistically expect to move out if the property is sold
                    </p>
                  </div>
                  <div>
                    <label className="block avax-subheading text-sm mb-2">Preferred Residency End Date</label>
                    <input
                      type="date"
                      value={biddingForm.preferredResidencyEndDate || ""}
                      onChange={(e) => handleBiddingFormChange("preferredResidencyEndDate", e.target.value)}
                      className="avax-input w-full"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-xs text-erea-text-light mt-1">
                      Your ideal timeline for ending residency
                    </p>
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                  Additional Comments
                </h3>
                <div>
                  <label className="block avax-subheading text-sm mb-2">Comments & Special Circumstances</label>
                  <textarea
                    value={biddingForm.additionalComments}
                    onChange={(e) => handleBiddingFormChange("additionalComments", e.target.value)}
                    placeholder="Any additional information about your situation, special circumstances, or requests..."
                    className="avax-input w-full h-24"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={submitBiddingParticipation}
                  disabled={isLoading || !biddingForm.propertyId}
                  className="avax-button-primary"
                >
                  {isLoading ? "Submitting..." : "Submit Participation Preference"}
                </button>
              </div>
            </div>
          )}

          {/* Status Tab */}
          {activeTab === "status" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">My Verification Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-success">1</div>
                  <div className="text-erea-text-light font-semibold">Verified Properties</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-warning">2</div>
                  <div className="text-erea-text-light font-semibold">Pending Reviews</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-erea-primary">3</div>
                  <div className="text-erea-text-light font-semibold">Documents Submitted</div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4">Current Verification Status</h3>
                <div className="space-y-4">
                  <div className="border border-avax-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Seoul Gangnam Premium Officetel</h4>
                      <span className="px-2 py-1 text-xs bg-avax-success text-white rounded-full">Verified</span>
                    </div>
                    <p className="text-sm text-erea-text-light">Verification completed on 2025-01-10</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>✅ Residency Verified</div>
                      <div>✅ Inspection Scheduled</div>
                      <div>✅ Photos Uploaded</div>
                      <div>✅ Bidding Preference Set</div>
                    </div>
                  </div>
                  
                  <div className="border border-avax-border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Bundang Apartment Complex</h4>
                      <span className="px-2 py-1 text-xs bg-avax-warning text-white rounded-full">Under Review</span>
                    </div>
                    <p className="text-sm text-erea-text-light">Submitted on 2025-01-15, review in progress</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                      <div>⏳ Residency Under Review</div>
                      <div>❌ Inspection Pending</div>
                      <div>❌ Photos Pending</div>
                      <div>❌ Bidding Preference Pending</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4">Required Actions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-amber-50 p-3 rounded-lg">
                    <div>
                      <span className="font-semibold">Upload additional lease documents</span>
                      <p className="text-sm text-erea-text-light">Bundang Apartment Complex verification</p>
                    </div>
                    <button className="avax-button-outline text-sm px-4 py-2">
                      Upload Now
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <div>
                      <span className="font-semibold">Schedule property inspection</span>
                      <p className="text-sm text-erea-text-light">Complete the inspection scheduling process</p>
                    </div>
                    <button className="avax-button-outline text-sm px-4 py-2">
                      Schedule Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="avax-card p-6 bg-blue-50 border-l-4 border-erea-primary">
        <h3 className="avax-subheading text-lg mb-2 flex items-center">
          <span className="mr-2">⚖️</span>
          Legal Notice
        </h3>
        <p className="avax-body">
          As a current resident, you may have legal rights that are protected during the auction process. 
          Completing verification helps ensure your rights are properly recognized and respected. 
          All information provided is encrypted and securely stored on the Avalanche blockchain.
        </p>
      </div>
    </div>
  );
}
