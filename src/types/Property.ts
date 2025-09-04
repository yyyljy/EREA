// 통합된 부동산 경매 데이터 인터페이스
export interface Property {
  // 기본 식별 정보
  id: string;
  title: string;
  address: string;
  location: string; // 상세 주소 (display용)
  
  // 물건 기본 정보
  propertyType: string; // "Apartment" | "Commercial Facility" | "Land" | "Villa" 등
  type: string; // 동일한 의미로 호환성 유지
  area: number; // 전용면적
  landArea?: number; // 토지면적
  buildingArea?: number; // 건물면적
  buildYear?: number; // 건축년도
  floors?: string; // 층수 정보 (예: "12F/15F")
  
  // 가격 정보
  appraisalValue: number; // 감정평가액
  minimumPrice: number; // 최저낙찰가격
  startingPrice: number; // 경매시작가 (minimumPrice와 동일)
  currentPrice: number; // 현재 입찰가
  bidDeposit: number; // 입찰보증금
  
  // 경매 일정 정보
  auctionDate: string; // 경매일시
  endDate: string; // 종료일시 (auctionDate와 동일)
  registrationDate: string; // 사건접수일
  announceDate: string; // 경매개시일
  
  // 법적 정보
  caseNumber: string; // 사건번호
  court: string; // 법원명
  propertyNumber: string; // 물건번호
  rightAnalysis: string; // 권리분석
  
  // 상태 정보
  status: "Active" | "Closed" | "Pending" | "Cancelled" | "Completed";
  auctionCount: number; // 경매차수
  isUnsold: boolean; // 유찰 여부
  
  // 거주자 정보
  hasResidents: boolean;
  residentStatus: string; // "None" | "Occupied" | "Partially Occupied"
  residentDetails?: string;
  
  // 소유자 정보
  ownerName: string;
  ownerContact: string;
  ownerAddress: string;
  
  // 설명 및 특징
  description: string;
  features: string[];
  
  // 이미지
  imageUrl: string;
  
  // 메타데이터
  createdAt: string;
  updatedAt: string;
}

// Redis에서 사용할 키 패턴
export const REDIS_KEYS = {
  PROPERTY: (id: string) => `property:${id}`,
  PROPERTIES_LIST: 'properties:list',
  PROPERTY_INDEX: 'properties:index',
  AUCTION_STATS: 'auction:stats'
} as const;

// Admin 등록 폼에서 사용하는 타입
export interface PropertyRegistrationForm {
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

// 경매 관리를 위한 인터페이스
export interface AuctionManagement {
  propertyId: string;
  status: "Active" | "Pending" | "Cancelled" | "Completed";
  currentBids: number;
  highestBid?: number;
  unsoldReason?: string;
  nextAuctionDate?: string;
}

// 통계 정보
export interface AuctionStats {
  totalProperties: number;
  activeAuctions: number;
  completedAuctions: number;
  totalVolume: number;
  averagePrice: number;
}
