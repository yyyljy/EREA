import { useState, useEffect } from "react";
import { Property, PropertyRegistrationForm } from '../types/Property';
import { apiService } from '../services/ApiService';
import { validatePropertyForm, validateField } from '../utils/validation';
import { generateRandomDummyDataWithImage, getDummyDataTemplateWithImage, dummyDataTemplateNames } from '../utils/dummyData';

// 사용 가능한 이미지 목록 (logo.png 제외)
const AVAILABLE_IMAGES = [
  '/Bundang_New_Town_Apartment_Complex.png',
  '/Gangnam_District_Premium_Officetel.png',
  '/Jeju_Island_Villa.png'
];

// interface AuctionManagement {
//   propertyId: string;
//   status: "Active" | "Pending" | "Cancelled" | "Completed";
//   currentBids: number;
//   highestBid?: number;
//   unsoldReason?: string;
//   nextAuctionDate?: string;
// }

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<"register" | "manage" | "residents">("register");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedisConnected, setIsRedisConnected] = useState(false);
  
  // Property Registration Form State
  const [propertyForm, setPropertyForm] = useState<PropertyRegistrationForm>({
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
  
  // Properties from Redis
  const [registeredProperties, setRegisteredProperties] = useState<Property[]>([]);
  
  // Bid data from API
  const [bidData, setBidData] = useState<{ [propertyId: string]: number }>({});
  
  // Validation states
  const [fieldErrors, setFieldErrors] = useState<Record<keyof PropertyRegistrationForm, string>>({} as Record<keyof PropertyRegistrationForm, string>);
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  // UI states
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  // Load properties from Redis on component mount
  useEffect(() => {
    initializeApiConnection();
  }, []);

  const initializeApiConnection = async () => {
    try {
      const isConnected = await apiService.isConnected();
      if (isConnected) {
        const healthCheck = await apiService.healthCheck();
        console.log('✅ Connected to backend API:', healthCheck.message);
        setIsRedisConnected(true);
        await Promise.all([loadProperties(), loadBidData()]);
      } else {
        throw new Error('API server is not responding');
      }
    } catch (error) {
      console.error('❌ Failed to connect to backend API:', error);
      setIsRedisConnected(false);
      await Promise.all([loadProperties(), loadBidData()]); // 실패해도 로드 시도
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showTemplateDropdown && !(event.target as Element).closest('.relative')) {
        setShowTemplateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTemplateDropdown]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // No need to disconnect from REST API
    };
  }, []);

  const loadProperties = async () => {
    try {
      const properties = await apiService.getAllProperties();
      setRegisteredProperties(properties);
      console.log(`📊 Loaded ${properties.length} properties from backend API`);
    } catch (error) {
      console.error('❌ Failed to load properties from backend API:', error);
      // 실패 시 빈 배열로 설정
      setRegisteredProperties([]);
    }
  };

  const loadBidData = async () => {
    try {
      console.log('🔍 AdminPage: Loading bid data from API...');
      const allBids = await apiService.getAllBids();
      console.log('📋 AdminPage: Raw bid data received:', allBids);
      
      // 각 property별 bid 수를 계산
      const bidCounts: { [propertyId: string]: number } = {};
      allBids.forEach(bid => {
        console.log(`📝 Processing bid: ${bid.id} for property: ${bid.property_id}`);
        bidCounts[bid.property_id] = (bidCounts[bid.property_id] || 0) + 1;
      });
      
      setBidData(bidCounts);
      console.log(`📊 AdminPage: Loaded bid data for ${Object.keys(bidCounts).length} properties:`, bidCounts);
    } catch (error) {
      console.error('❌ AdminPage: Failed to load bid data:', error);
      // 실패 시 빈 객체로 설정
      setBidData({});
    }
  };

  // Mock data for demonstration (will be replaced by Redis data)
  // Mock data commented out - using Redis data instead

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // 폼 전체 검증 함수
  const validateForm = (formData?: PropertyRegistrationForm) => {
    const dataToValidate = formData || propertyForm;
    const validationResult = validatePropertyForm(dataToValidate);
    
    // 에러 맵 생성
    const errorMap: Record<keyof PropertyRegistrationForm, string> = {} as Record<keyof PropertyRegistrationForm, string>;
    validationResult.errors.forEach(error => {
      errorMap[error.field] = error.message;
    });
    
    setFieldErrors(errorMap);
    setIsFormValid(validationResult.isValid);
    
    return validationResult.isValid;
  };

  // 실시간 필드 검증
  const validateSingleField = (field: keyof PropertyRegistrationForm, value: any) => {
    const error = validateField(field, value, propertyForm);
    setFieldErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
    
    // 폼 전체 유효성 확인 (디바운스 효과)
    setTimeout(() => {
      const validationResult = validatePropertyForm({...propertyForm, [field]: value});
      setIsFormValid(validationResult.isValid);
    }, 100);
  };

  const handlePropertyFormChange = (field: keyof PropertyRegistrationForm, value: any) => {
    setPropertyForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 실시간 검증 (제출 시도 후에만)
    if (hasAttemptedSubmit) {
      validateSingleField(field, value);
    }
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
    console.log('🔥 handleSubmitProperty 시작');
    setHasAttemptedSubmit(true);
    
    // 폼 검증 실행
    const isValid = validateForm();
    console.log('📝 폼 검증 결과:', isValid);
    if (!isValid) {
      console.log('❌ 폼 검증 실패 - API 호출 중단');
      alert("Please fix the validation errors before submitting.");
      return;
    }
    
    console.log('✅ 폼 검증 통과 - API 호출 시작');
    setIsLoading(true);
    
    try {
      // 랜덤 이미지 URL 설정
      const imageUrl = AVAILABLE_IMAGES[Math.floor(Math.random() * AVAILABLE_IMAGES.length)];
      
      // 폼 데이터를 Property 객체로 변환
      console.log('🔄 Property 객체 변환 중...');
      console.log(`🖼️ Using random image: ${imageUrl}`);
      const property = apiService.convertFormToProperty(propertyForm, imageUrl);
      console.log('📄 변환된 Property 객체:', property);
      
      // 백엔드 API에 저장
      console.log(`💾 Saving to backend API: ${property.title}`);
      console.log('🌐 API 호출 시작...');
      await apiService.saveProperty(property);
      console.log(`✅ Successfully saved to backend API with case number: ${property.caseNumber}`);
      
      // 등록된 속성 목록 및 bid 데이터 새로고침
      await Promise.all([loadProperties(), loadBidData()]);
      
      alert(`Property registered successfully!\nSaved to backend API with case number: ${property.caseNumber}`);
      
      // Reset form and validation state
      const resetForm = {
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
      };
      
      setPropertyForm(resetForm);
      setFieldErrors({} as Record<keyof PropertyRegistrationForm, string>);
      setIsFormValid(false);
      setHasAttemptedSubmit(false);
      
    } catch (error) {
      console.error('Failed to register property:', error);
      alert(`Failed to register property: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 더미 데이터 채우기 함수
  const fillDummyData = (templateIndex?: number) => {
    let result: { data: PropertyRegistrationForm; imageUrl: string };
    
    if (templateIndex !== undefined) {
      result = getDummyDataTemplateWithImage(templateIndex);
    } else {
      result = generateRandomDummyDataWithImage();
    }
    
    setPropertyForm(result.data);
    
    // 더미 데이터 채운 후 검증 실행 (새로운 데이터로 즉시 검증)
    setHasAttemptedSubmit(true);
    // 새로운 dummyData를 직접 전달하여 검증
    validateForm(result.data);
    
    // 콘솔에 선택된 이미지 정보 출력 (개발용)
    console.log(`🖼️ Selected image for dummy data: ${result.imageUrl}`);
  };

  // Error display component
  const ErrorMessage = ({ field }: { field: keyof PropertyRegistrationForm }) => {
    const error = fieldErrors[field];
    if (!error) return null;
    
    return (
      <div className="text-red-600 text-sm mt-1 flex items-center">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </div>
    );
  };

  // Input field wrapper with validation
  const InputWithValidation = ({ 
    field, 
    children, 
    label, 
    required = false 
  }: { 
    field: keyof PropertyRegistrationForm;
    children: React.ReactNode;
    label: string;
    required?: boolean;
  }) => {
    const hasError = !!fieldErrors[field];
    
    return (
      <div>
        <label className="block avax-subheading text-sm mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className={hasError ? 'border-red-300' : ''}>
          {children}
        </div>
        <ErrorMessage field={field} />
      </div>
    );
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
              { key: "residents", label: "Resident Verification" }
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
              <div className="flex justify-between items-center">
                <h2 className="avax-subheading text-2xl">Register New Auction Property</h2>
                
                {/* Dummy Data Controls */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-erea-text-light font-semibold">Quick Fill:</span>
                  <button
                    type="button"
                    onClick={() => fillDummyData()}
                    className="avax-button-secondary text-sm px-4 py-2"
                    title="Fill with random valid dummy data"
                  >
                    🎲 Random Data
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                      className="avax-button-outline text-sm px-4 py-2 flex items-center"
                      title="Choose from preset templates"
                    >
                      📋 Templates
                      <svg className={`w-4 h-4 ml-1 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showTemplateDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-avax-border z-10">
                        <div className="p-2">
                          <div className="text-xs text-erea-text-light font-semibold mb-2 px-2">Select Template:</div>
                          {dummyDataTemplateNames.map((name, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                fillDummyData(index);
                                setShowTemplateDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-erea-text hover:bg-avax-light rounded-md transition-colors"
                            >
                              {name}
                            </button>
                          ))}
                          <div className="border-t border-avax-border mt-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                fillDummyData();
                                setShowTemplateDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-erea-primary hover:bg-erea-primary/10 rounded-md transition-colors font-semibold"
                            >
                              🎲 Random Template
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <form className="space-y-6">
                {/* Basic Property Information */}
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4 border-b border-avax-border pb-2">
                    Basic Property Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputWithValidation field="title" label="Property Title" required>
                      <input
                        type="text"
                        value={propertyForm.title}
                        onChange={(e) => handlePropertyFormChange("title", e.target.value)}
                        placeholder="Seoul Gangnam Premium Officetel"
                        className={`avax-input w-full ${fieldErrors.title ? 'border-red-300 focus:border-red-500' : ''}`}
                        required
                      />
                    </InputWithValidation>
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
                      <InputWithValidation field="address" label="Full Address" required>
                        <input
                          type="text"
                          value={propertyForm.address}
                          onChange={(e) => handlePropertyFormChange("address", e.target.value)}
                          placeholder="Seoul Gangnam-gu Sinsa-dong 183, 2F-101"
                          className={`avax-input w-full ${fieldErrors.address ? 'border-red-300 focus:border-red-500' : ''}`}
                          required
                        />
                      </InputWithValidation>
                    </div>
                    <InputWithValidation field="area" label="Area (㎡)" required>
                      <input
                        type="number"
                        value={propertyForm.area || ""}
                        onChange={(e) => handlePropertyFormChange("area", parseFloat(e.target.value) || 0)}
                        placeholder="84.3"
                        className={`avax-input w-full ${fieldErrors.area ? 'border-red-300 focus:border-red-500' : ''}`}
                        step="0.1"
                        required
                      />
                    </InputWithValidation>
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
                    <InputWithValidation field="caseNumber" label="Case Number" required>
                      <input
                        type="text"
                        value={propertyForm.caseNumber}
                        onChange={(e) => handlePropertyFormChange("caseNumber", e.target.value)}
                        placeholder="2025Ta-Auction3170"
                        className={`avax-input w-full ${fieldErrors.caseNumber ? 'border-red-300 focus:border-red-500' : ''}`}
                        required
                      />
                    </InputWithValidation>
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
                    <InputWithValidation field="appraisalValue" label="Appraisal Value (KRW)" required>
                      <input
                        type="number"
                        value={propertyForm.appraisalValue || ""}
                        onChange={(e) => handlePropertyFormChange("appraisalValue", parseFloat(e.target.value) || 0)}
                        placeholder="1433000000"
                        className={`avax-input w-full ${fieldErrors.appraisalValue ? 'border-red-300 focus:border-red-500' : ''}`}
                        step="1000000"
                        required
                      />
                    </InputWithValidation>
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

                {/* Quick Fill Help */}
                <div className="avax-card p-4 bg-blue-50 border-l-4 border-erea-primary">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-erea-primary mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-erea-primary mb-1">Quick Fill Options</h3>
                      <p className="text-sm text-erea-text">
                        Use the <strong>Random Data</strong> button to fill the form with valid dummy data for testing. 
                        Choose from <strong>Templates</strong> for specific property types (오피스텔, 아파트, 빌라, 상가, 단독주택). 
                        All generated data passes validation automatically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Validation Summary */}
                {hasAttemptedSubmit && !isFormValid && (
                  <div className="avax-card p-4 bg-red-50 border-l-4 border-red-500">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-lg font-semibold text-red-800">Please fix the following errors:</h3>
                    </div>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {Object.entries(fieldErrors).map(([field, error]) => 
                        error ? <li key={field}>{error}</li> : null
                      )}
                    </ul>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-between items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {hasAttemptedSubmit && (
                      <>
                        {isFormValid ? (
                          <div className="flex items-center text-green-600">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold">Form is valid</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-semibold">{Object.values(fieldErrors).filter(Boolean).length} errors found</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Are you sure you want to reset the form?")) {
                          const resetForm = {
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
                          };
                          setPropertyForm(resetForm);
                          setFieldErrors({} as Record<keyof PropertyRegistrationForm, string>);
                          setIsFormValid(false);
                          setHasAttemptedSubmit(false);
                        }
                      }}
                      className="avax-button-outline"
                    >
                      Reset Form
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmitProperty}
                      disabled={isLoading || (hasAttemptedSubmit && !isFormValid)}
                      className={`avax-button-primary ${(hasAttemptedSubmit && !isFormValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? "Registering..." : "Register Property"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Auction Management Tab */}
          {activeTab === "manage" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="avax-subheading text-2xl">Auction Management</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-erea-text-light">API Status:</span>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${isRedisConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={`font-semibold ${isRedisConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {isRedisConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>
              
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
                    {Object.values(bidData).reduce((sum, count) => sum + count, 0)}
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
                          Case Number
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
                            <div>
                              <div className="font-semibold">{property.title}</div>
                              <div className="text-xs text-erea-text-light">{property.court}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-mono text-erea-primary font-semibold">
                              {property.caseNumber}
                            </div>
                            <div className="text-xs text-erea-text-light">
                              API ID: {property.id}
                            </div>
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
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{bidData[property.id] || 0}</span>
                              {(bidData[property.id] || 0) > 0 && (
                                <span className="px-2 py-1 text-xs bg-erea-primary text-white rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex space-x-2">
                              <button className="avax-button-outline text-xs px-3 py-1">
                                Edit
                              </button>
                              <button 
                                className="avax-button-secondary text-xs px-3 py-1"
                                onClick={async () => {
                                  try {
                                    console.log(`🔍 Loading bids for property: ${property.id} (${property.title})`);
                                    const bids = await apiService.getPropertyBids(property.id);
                                    console.log(`📋 Received bids:`, bids);
                                    
                                    if (!Array.isArray(bids)) {
                                      console.error('❌ Bids is not an array:', bids);
                                      alert('Invalid bid data format received');
                                      return;
                                    }
                                    
                                    const bidDetails = bids.map((bid, index) => {
                                      console.log(`📝 Processing bid ${index}:`, bid);
                                      try {
                                        return `Bidder: ${bid.bidder_id}\nAmount: ${formatPrice(bid.amount)}\nTime: ${new Date(bid.created_at).toLocaleString()}`;
                                      } catch (formatError) {
                                        console.error(`❌ Error formatting bid ${index}:`, formatError, bid);
                                        return `Bidder: ${bid.bidder_id || 'Unknown'}\nAmount: Error formatting\nTime: ${bid.created_at || 'Unknown'}`;
                                      }
                                    }).join('\n\n');
                                    
                                    if (bids.length > 0) {
                                      alert(`Bids for ${property.title}:\n\n${bidDetails}`);
                                    } else {
                                      alert(`No bids found for ${property.title}`);
                                    }
                                  } catch (error) {
                                    console.error('❌ Failed to load bids for property:', property.id, error);
                                    alert(`Failed to load bid details: ${error instanceof Error ? error.message : 'Unknown error'}`);
                                  }
                                }}
                              >
                                View Bids ({bidData[property.id] || 0})
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
