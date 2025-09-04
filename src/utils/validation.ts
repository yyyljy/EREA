import { PropertyRegistrationForm } from '../types/Property';

export interface ValidationError {
  field: keyof PropertyRegistrationForm;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// 개별 필드 검증 함수들
export const validateTitle = (title: string): string | null => {
  if (!title.trim()) {
    return "Property title is required";
  }
  if (title.length < 5) {
    return "Property title must be at least 5 characters long";
  }
  if (title.length > 100) {
    return "Property title must not exceed 100 characters";
  }
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (!address.trim()) {
    return "Property address is required";
  }
  if (address.length < 10) {
    return "Please provide a complete address (minimum 10 characters)";
  }
  if (address.length > 200) {
    return "Address must not exceed 200 characters";
  }
  return null;
};

export const validateArea = (area: number): string | null => {
  if (!area || area <= 0) {
    return "Property area must be greater than 0";
  }
  if (area > 10000) {
    return "Property area seems unusually large (maximum 10,000㎡)";
  }
  return null;
};

export const validateBuildYear = (buildYear: number): string | null => {
  const currentYear = new Date().getFullYear();
  if (!buildYear) {
    return "Build year is required";
  }
  if (buildYear < 1900) {
    return "Build year must be after 1900";
  }
  if (buildYear > currentYear) {
    return "Build year cannot be in the future";
  }
  return null;
};

export const validateFloors = (floors: string): string | null => {
  if (!floors.trim()) {
    return "Floor information is required";
  }
  // 간단한 층 정보 패턴 검증 (예: "12F", "2F/15F", "B1-10F" 등)
  const floorPattern = /^([B]?\d+[F]?)(\/([B]?\d+[F]?))?(-([B]?\d+[F]?))?$/i;
  if (!floorPattern.test(floors)) {
    return "Please enter valid floor format (e.g., '12F', '2F/15F', 'B1-10F')";
  }
  return null;
};

export const validateCaseNumber = (caseNumber: string): string | null => {
  if (!caseNumber.trim()) {
    return "Case number is required";
  }
  // 사건번호 패턴 검증 (예: "2025Ta-Auction3170")
  const casePattern = /^\d{4}[가-힣a-zA-Z]+-[a-zA-Z]+\d+$/;
  if (!casePattern.test(caseNumber)) {
    return "Please enter valid case number format (e.g., '2025Ta-Auction3170')";
  }
  return null;
};

export const validateCourt = (court: string): string | null => {
  if (!court.trim()) {
    return "Court name is required";
  }
  if (court.length < 5) {
    return "Please provide complete court name";
  }
  return null;
};

export const validatePropertyNumber = (propertyNumber: string): string | null => {
  if (!propertyNumber.trim()) {
    return "Property number is required";
  }
  if (!/^\d+$/.test(propertyNumber)) {
    return "Property number must contain only numbers";
  }
  return null;
};

export const validateAppraisalValue = (value: number): string | null => {
  if (!value || value <= 0) {
    return "Appraisal value must be greater than 0";
  }
  if (value < 1000000) {
    return "Appraisal value seems too low (minimum ₩1,000,000)";
  }
  if (value > 100000000000) {
    return "Appraisal value seems too high (maximum ₩100,000,000,000)";
  }
  return null;
};

export const validateMinimumPrice = (minimumPrice: number, appraisalValue: number): string | null => {
  if (!minimumPrice || minimumPrice <= 0) {
    return "Minimum price must be greater than 0";
  }
  if (minimumPrice < 1000000) {
    return "Minimum price seems too low (minimum ₩1,000,000)";
  }
  if (appraisalValue > 0 && minimumPrice > appraisalValue * 1.2) {
    return "Minimum price should not exceed 120% of appraisal value";
  }
  return null;
};

export const validateBidDeposit = (bidDeposit: number, minimumPrice: number): string | null => {
  if (!bidDeposit || bidDeposit <= 0) {
    return "Bid deposit must be greater than 0";
  }
  if (minimumPrice > 0) {
    const percentage = (bidDeposit / minimumPrice) * 100;
    if (percentage < 5) {
      return "Bid deposit should be at least 5% of minimum price";
    }
    if (percentage > 20) {
      return "Bid deposit should not exceed 20% of minimum price";
    }
  }
  return null;
};

export const validateDate = (date: string, fieldName: string): string | null => {
  if (!date) {
    return `${fieldName} is required`;
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }
  return null;
};

export const validateAuctionDate = (auctionDate: string, announceDate: string): string | null => {
  const baseError = validateDate(auctionDate, "Auction date");
  if (baseError) return baseError;
  
  const auction = new Date(auctionDate);
  const now = new Date();
  
  // 경매일은 미래여야 함
  if (auction <= now) {
    return "Auction date must be in the future";
  }
  
  // 경매일은 공고일보다 나중이어야 함
  if (announceDate) {
    const announce = new Date(announceDate);
    if (auction <= announce) {
      return "Auction date must be after announcement date";
    }
  }
  
  return null;
};

export const validateOwnerName = (name: string): string | null => {
  if (!name.trim()) {
    return "Owner name is required";
  }
  if (name.length < 2) {
    return "Owner name must be at least 2 characters";
  }
  if (name.length > 50) {
    return "Owner name must not exceed 50 characters";
  }
  return null;
};

export const validateOwnerContact = (contact: string): string | null => {
  if (!contact.trim()) {
    return "Owner contact information is required";
  }
  // 전화번호, 이메일, 또는 기타 연락처 형식 검증
  const phonePattern = /^(\d{2,3}-\d{3,4}-\d{4}|\d{10,11})$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!phonePattern.test(contact) && !emailPattern.test(contact)) {
    return "Please enter valid phone number (02-123-4567) or email address";
  }
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description.trim()) {
    return "Property description is required";
  }
  if (description.length < 20) {
    return "Please provide a more detailed description (minimum 20 characters)";
  }
  if (description.length > 1000) {
    return "Description must not exceed 1000 characters";
  }
  return null;
};

export const validateRightAnalysis = (rightAnalysis: string): string | null => {
  if (!rightAnalysis.trim()) {
    return "Rights analysis is required";
  }
  if (rightAnalysis.length < 10) {
    return "Please provide a more detailed rights analysis (minimum 10 characters)";
  }
  if (rightAnalysis.length > 500) {
    return "Rights analysis must not exceed 500 characters";
  }
  return null;
};

// 전체 폼 검증 함수
export const validatePropertyForm = (form: PropertyRegistrationForm): ValidationResult => {
  const errors: ValidationError[] = [];

  // 각 필드 검증
  const titleError = validateTitle(form.title);
  if (titleError) errors.push({ field: 'title', message: titleError });

  const addressError = validateAddress(form.address);
  if (addressError) errors.push({ field: 'address', message: addressError });

  const areaError = validateArea(form.area);
  if (areaError) errors.push({ field: 'area', message: areaError });

  const buildYearError = validateBuildYear(form.buildYear);
  if (buildYearError) errors.push({ field: 'buildYear', message: buildYearError });

  const floorsError = validateFloors(form.floors);
  if (floorsError) errors.push({ field: 'floors', message: floorsError });

  const caseNumberError = validateCaseNumber(form.caseNumber);
  if (caseNumberError) errors.push({ field: 'caseNumber', message: caseNumberError });

  const courtError = validateCourt(form.court);
  if (courtError) errors.push({ field: 'court', message: courtError });

  const propertyNumberError = validatePropertyNumber(form.propertyNumber);
  if (propertyNumberError) errors.push({ field: 'propertyNumber', message: propertyNumberError });

  const appraisalValueError = validateAppraisalValue(form.appraisalValue);
  if (appraisalValueError) errors.push({ field: 'appraisalValue', message: appraisalValueError });

  const minimumPriceError = validateMinimumPrice(form.minimumPrice, form.appraisalValue);
  if (minimumPriceError) errors.push({ field: 'minimumPrice', message: minimumPriceError });

  const bidDepositError = validateBidDeposit(form.bidDeposit, form.minimumPrice);
  if (bidDepositError) errors.push({ field: 'bidDeposit', message: bidDepositError });

  const registrationDateError = validateDate(form.registrationDate, "Registration date");
  if (registrationDateError) errors.push({ field: 'registrationDate', message: registrationDateError });

  const announceDateError = validateDate(form.announceDate, "Announcement date");
  if (announceDateError) errors.push({ field: 'announceDate', message: announceDateError });

  const auctionDateError = validateAuctionDate(form.auctionDate, form.announceDate);
  if (auctionDateError) errors.push({ field: 'auctionDate', message: auctionDateError });

  const ownerNameError = validateOwnerName(form.ownerName);
  if (ownerNameError) errors.push({ field: 'ownerName', message: ownerNameError });

  const ownerContactError = validateOwnerContact(form.ownerContact);
  if (ownerContactError) errors.push({ field: 'ownerContact', message: ownerContactError });

  const ownerAddressError = validateAddress(form.ownerAddress);
  if (ownerAddressError) errors.push({ field: 'ownerAddress', message: ownerAddressError });

  const descriptionError = validateDescription(form.description);
  if (descriptionError) errors.push({ field: 'description', message: descriptionError });

  const rightAnalysisError = validateRightAnalysis(form.rightAnalysis);
  if (rightAnalysisError) errors.push({ field: 'rightAnalysis', message: rightAnalysisError });

  // 특별 조건 검증
  if (form.hasResidents && form.residentStatus === "None") {
    errors.push({ field: 'residentStatus', message: 'Please specify resident status when residents are present' });
  }

  if (form.features.length === 0) {
    errors.push({ field: 'features', message: 'Please add at least one property feature' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 실시간 필드 검증 함수
export const validateField = (
  field: keyof PropertyRegistrationForm, 
  value: any, 
  form: PropertyRegistrationForm
): string | null => {
  switch (field) {
    case 'title':
      return validateTitle(value);
    case 'address':
      return validateAddress(value);
    case 'area':
      return validateArea(value);
    case 'buildYear':
      return validateBuildYear(value);
    case 'floors':
      return validateFloors(value);
    case 'caseNumber':
      return validateCaseNumber(value);
    case 'court':
      return validateCourt(value);
    case 'propertyNumber':
      return validatePropertyNumber(value);
    case 'appraisalValue':
      return validateAppraisalValue(value);
    case 'minimumPrice':
      return validateMinimumPrice(value, form.appraisalValue);
    case 'bidDeposit':
      return validateBidDeposit(value, form.minimumPrice);
    case 'registrationDate':
      return validateDate(value, "Registration date");
    case 'announceDate':
      return validateDate(value, "Announcement date");
    case 'auctionDate':
      return validateAuctionDate(value, form.announceDate);
    case 'ownerName':
      return validateOwnerName(value);
    case 'ownerContact':
      return validateOwnerContact(value);
    case 'ownerAddress':
      return validateAddress(value);
    case 'description':
      return validateDescription(value);
    case 'rightAnalysis':
      return validateRightAnalysis(value);
    default:
      return null;
  }
};
