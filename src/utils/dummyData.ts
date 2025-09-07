import { PropertyRegistrationForm } from '../types/Property';

// 사용 가능한 이미지 목록 (logo.png 제외)
const availableImages = [
  '/Bundang_New_Town_Apartment_Complex.png',
  '/Gangnam_District_Premium_Officetel.png',
  '/Jeju_Island_Villa.png'
];

// 랜덤 이미지 선택 함수
const getRandomImage = (): string => {
  return availableImages[Math.floor(Math.random() * availableImages.length)];
};

// 더미 데이터 템플릿들
export const dummyDataTemplates: PropertyRegistrationForm[] = [
  // 강남 오피스텔
  {
    title: "Seoul Gangnam Premium Officetel",
    address: "Seoul Gangnam-gu Sinsa-dong 183-2, Premium Tower 15F-1503",
    propertyType: "Commercial",
    area: 45.2,
    buildYear: 2018,
    floors: "15F/25F",
    caseNumber: "2025Ta-Auction3170",
    court: "Seoul Central District Court",
    propertyNumber: "1",
    appraisalValue: 1433000000,
    minimumPrice: 1346000000,
    bidDeposit: 134600000, // 10%
    auctionDate: "2025-03-15T10:00",
    registrationDate: "2025-01-20",
    announceDate: "2025-02-10",
    hasResidents: false,
    residentStatus: "None",
    ownerName: "Kim Jong-hyun",
    ownerContact: "02-555-1234",
    ownerAddress: "Seoul Gangnam-gu Sinsa-dong 183-2, Premium Tower 15F-1503",
    description: "Premium commercial officetel located in the heart of Gangnam district. Excellent transportation access with Sinsa Station (Line 3) within 5 minutes walking distance. Modern building with premium amenities including 24/7 security, underground parking, and high-speed internet infrastructure. Perfect for business operations or investment purposes.",
    features: ["Near Subway", "Commercial Zone", "Parking Available", "24/7 Security", "High-speed Internet"],
    rightAnalysis: "Clear title with no outstanding liens or encumbrances. Building management fee: ₩180,000/month. Property tax current and up to date. No prior tenant rights or opposing claims.",
    auctionCount: 1,
    isUnsold: false
  },
  
  // 분당 아파트
  {
    title: "Bundang Jeongja New Town Apartment",
    address: "Gyeonggi Seongnam-si Bundang-gu Jeongja-dong 178-1, Hyundai Hillstate 1동 1205호",
    propertyType: "Apartment",
    area: 84.3,
    buildYear: 2019,
    floors: "12F/15F",
    caseNumber: "2025Ta-Auction4521",
    court: "Suwon District Court Seongnam Branch",
    propertyNumber: "2",
    appraisalValue: 1850000000,
    minimumPrice: 1665000000,
    bidDeposit: 166500000, // 10%
    auctionDate: "2025-03-22T14:00",
    registrationDate: "2025-01-25",
    announceDate: "2025-02-15",
    hasResidents: true,
    residentStatus: "Tenant",
    residentDetails: "Current tenant with valid lease contract until December 2025. Monthly rent: ₩1,500,000 with ₩50,000,000 deposit. Tenant has expressed willingness to cooperate with new ownership transition.",
    ownerName: "Lee Min-jung",
    ownerContact: "031-777-8890",
    ownerAddress: "Gyeonggi Yongin-si Giheung-gu Dongbaek-dong 456-78",
    description: "Spacious 3-bedroom apartment in prestigious Bundang New Town. Located in premium school district with excellent educational facilities nearby. Modern apartment complex with extensive amenities including fitness center, swimming pool, and children's playground. Great investment opportunity in high-demand area.",
    features: ["Premium School District", "Park Adjacent", "Underground Parking", "Fitness Center", "Swimming Pool"],
    rightAnalysis: "Property subject to existing lease agreement. Tenant deposit of ₩50,000,000 must be returned upon lease termination. No other liens or encumbrances. Management fee: ₩280,000/month including maintenance and utilities.",
    auctionCount: 1,
    isUnsold: false
  },
  
  // 제주 빌라
  {
    title: "Jeju Seogwipo Ocean View Villa",
    address: "Jeju Seogwipo-si Daejeong-eup Hamori 1234-5",
    propertyType: "Villa",
    area: 165.8,
    buildYear: 2015,
    floors: "2F/2F",
    caseNumber: "2025Ta-Auction7820",
    court: "Jeju District Court",
    propertyNumber: "3",
    appraisalValue: 1280000000,
    minimumPrice: 1024000000,
    bidDeposit: 102400000, // 10%
    auctionDate: "2025-04-05T11:00",
    registrationDate: "2025-01-30",
    announceDate: "2025-02-20",
    hasResidents: false,
    residentStatus: "None",
    ownerName: "Park Sung-ho",
    ownerContact: "064-123-5678",
    ownerAddress: "Jeju Jeju-si Ido-dong 789-12",
    description: "Stunning 2-story villa with panoramic ocean views in Jeju Seogwipo. Traditional Korean architecture blended with modern amenities. Large private garden with direct beach access. Perfect for vacation home or pension business. Popular tourist area with high rental potential year-round.",
    features: ["Ocean View", "Private Garden", "Beach Access", "Traditional Architecture", "Tourist Area"],
    rightAnalysis: "Freehold property with clear oceanfront rights. No building restrictions or environmental limitations. Tourism business license available. Property tax and local fees current. High rental yield potential in premium location.",
    auctionCount: 2,
    isUnsold: true
  },
  
  // 부산 상가
  {
    title: "Busan Haeundae Commercial Building",
    address: "Busan Haeundae-gu Haeundae-ro 456, Marine City Complex B동 1층 101호",
    propertyType: "Commercial",
    area: 78.5,
    buildYear: 2020,
    floors: "1F/12F",
    caseNumber: "2025Ta-Auction9988",
    court: "Busan District Court",
    propertyNumber: "1",
    appraisalValue: 980000000,
    minimumPrice: 882000000,
    bidDeposit: 88200000, // 10%
    auctionDate: "2025-04-12T15:30",
    registrationDate: "2025-02-01",
    announceDate: "2025-02-25",
    hasResidents: true,
    residentStatus: "Owner-Occupant",
    residentDetails: "Current business owner operating small restaurant. Business established for 3 years with stable customer base. Owner willing to negotiate lease-back arrangement or gradual transition.",
    ownerName: "Choi Young-min",
    ownerContact: "051-999-7777",
    ownerAddress: "Busan Haeundae-gu Haeundae-ro 456, Marine City Complex B동 1층 101호",
    description: "Prime commercial space in Haeundae Marine City, one of Busan's most prestigious areas. Ground floor location with excellent foot traffic and visibility. Currently operating as successful restaurant with established customer base. High tourist area with consistent year-round business potential.",
    features: ["Prime Location", "High Foot Traffic", "Tourist Area", "Established Business", "Marine City"],
    rightAnalysis: "Commercial zoning with restaurant/retail permits in place. Current business license transferable. No outstanding commercial liens. Building management cooperative. Monthly maintenance: ₩350,000.",
    auctionCount: 1,
    isUnsold: false
  },
  
  // 대전 단독주택
  {
    title: "Daejeon Yuseong Traditional House",
    address: "Daejeon Yuseong-gu Bongmyeong-dong 567-89",
    propertyType: "Detached House",
    area: 128.6,
    buildYear: 2010,
    floors: "2F/2F",
    caseNumber: "2025Ta-Auction5566",
    court: "Daejeon District Court",
    propertyNumber: "2",
    appraisalValue: 650000000,
    minimumPrice: 520000000,
    bidDeposit: 52000000, // 10%
    auctionDate: "2025-04-18T13:00",
    registrationDate: "2025-02-05",
    announceDate: "2025-03-01",
    hasResidents: false,
    residentStatus: "None",
    ownerName: "Jung Hye-jin",
    ownerContact: "042-666-3333",
    ownerAddress: "Daejeon Seo-gu Dunsan-dong 123-45",
    description: "Beautiful 2-story detached house in quiet residential neighborhood. Modern Korean traditional style with spacious rooms and private yard. Near Yuseong Hot Springs and KAIST university. Excellent for family residence or guest house business. Well-maintained property with recent renovations.",
    features: ["Private Yard", "Traditional Style", "Near University", "Hot Springs Area", "Quiet Neighborhood"],
    rightAnalysis: "Individual housing with clear title deed. No shared facilities or common areas. Property boundaries clearly marked. Local development restrictions comply with residential zoning. Recent structural inspection completed.",
    auctionCount: 3,
    isUnsold: true
  }
];

// 랜덤 더미 데이터 생성기
export const generateRandomDummyData = (): PropertyRegistrationForm => {
  const template = dummyDataTemplates[Math.floor(Math.random() * dummyDataTemplates.length)];
  
  // 기본 템플릿을 복사하고 일부 값들을 랜덤하게 변경
  const randomData: PropertyRegistrationForm = { ...template };
  
  // 날짜를 현재 기준으로 조정
  const today = new Date();
  const registrationDate = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // 0-30일 후
  const announceDate = new Date(registrationDate.getTime() + (7 + Math.random() * 14) * 24 * 60 * 60 * 1000); // 7-21일 후
  const auctionDate = new Date(announceDate.getTime() + (7 + Math.random() * 14) * 24 * 60 * 60 * 1000); // 7-21일 후
  
  randomData.registrationDate = registrationDate.toISOString().split('T')[0];
  randomData.announceDate = announceDate.toISOString().split('T')[0];
  randomData.auctionDate = auctionDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM 형식
  
  // 사건번호를 랜덤하게 생성
  const year = new Date().getFullYear();
  const caseNum = Math.floor(Math.random() * 9000) + 1000;
  randomData.caseNumber = `${year}Ta-Auction${caseNum}`;
  
  // 물건번호 랜덤 생성
  randomData.propertyNumber = (Math.floor(Math.random() * 9) + 1).toString();
  
  // 가격 약간 변동 (±10%)
  const priceVariation = 0.9 + Math.random() * 0.2; // 0.9 ~ 1.1
  randomData.appraisalValue = Math.round(randomData.appraisalValue * priceVariation);
  randomData.minimumPrice = Math.round(randomData.appraisalValue * (0.8 + Math.random() * 0.2)); // 80-100%
  randomData.bidDeposit = Math.round(randomData.minimumPrice * 0.1); // 10%
  
  return randomData;
};

// 특정 템플릿 가져오기
export const getDummyDataTemplate = (index: number): PropertyRegistrationForm => {
  if (index < 0 || index >= dummyDataTemplates.length) {
    return dummyDataTemplates[0];
  }
  return { ...dummyDataTemplates[index] };
};

// 랜덤 이미지를 포함한 더미 데이터 생성 (AdminPage에서 사용)
export const generateRandomDummyDataWithImage = (): { data: PropertyRegistrationForm; imageUrl: string } => {
  const data = generateRandomDummyData();
  const imageUrl = getRandomImage();
  return { data, imageUrl };
};

// 특정 템플릿 + 랜덤 이미지 (AdminPage에서 사용)
export const getDummyDataTemplateWithImage = (index: number): { data: PropertyRegistrationForm; imageUrl: string } => {
  const data = getDummyDataTemplate(index);
  const imageUrl = getRandomImage();
  return { data, imageUrl };
};

// 템플릿 이름들
export const dummyDataTemplateNames = [
  "강남 프리미엄 오피스텔",
  "분당 신도시 아파트", 
  "제주 바다전망 빌라",
  "부산 해운대 상가",
  "대전 전통한옥"
];
