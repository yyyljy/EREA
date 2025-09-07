import { Property, PropertyRegistrationForm } from '../types/Property';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://175.123.85.69:8000/api/v1';

// API 응답 타입
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// 백엔드 Property 모델 (Go 모델과 매핑)
interface BackendProperty {
  id: string;
  title: string;
  location: string;
  description: string;
  type: string;
  area: number;
  starting_price: number;
  current_price: number;
  image_url: string;
  features: string[];
  status: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

// 백엔드 Property 생성 요청 타입
interface CreatePropertyRequest {
  title: string;
  location: string;
  description: string;
  type: string;
  area: number;
  starting_price: number;
  image_url: string;
  features: string[];
  end_date: string;
  owner_id: string;
}

// 백엔드 Deposit 모델
interface BackendDeposit {
  id: string;
  property_id: string;
  user_id: string;
  amount: number;
  token_type: string;
  tx_hash: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 백엔드 Deposit 생성 요청 타입
interface CreateDepositRequest {
  property_id: string;
  user_id: string;
  amount: number;
  token_type: string;
}

// 백엔드 Bid 모델
interface BackendBid {
  id: string;
  property_id: string;
  bidder_id: string;
  amount: number;
  tx_hash: string;
  status: string;
  is_encrypted: boolean;
  encrypted_data?: string;
  created_at: string;
  updated_at: string;
}

// 백엔드 Bid 생성 요청 타입
interface CreateBidRequest {
  property_id: string;
  bidder_id: string;
  amount: number;
  is_encrypted: boolean;
  encrypted_data?: string;
}

// 백엔드 API 서비스 클래스
export class ApiService {
  private static instance: ApiService;

  private constructor() {}

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // HTTP 요청 헬퍼 메서드
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔗 API 요청 URL: ${url}`);
    console.log(`📤 API 요청 옵션:`, options);
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      console.log(`🚀 fetch 요청 시작: ${url}`);
      const response = await fetch(url, { ...defaultOptions, ...options });
      console.log(`📥 응답 상태: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log(`📋 응답 데이터:`, data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data as ApiResponse<T>;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // 프론트엔드 Property를 백엔드 형식으로 변환
  private convertToBackendProperty(property: Property): CreatePropertyRequest {
    // 날짜를 ISO 8601 형식 (RFC3339)으로 변환
    const formatDateForBackend = (dateString: string): string => {
      if (!dateString) return new Date().toISOString();
      
      // datetime-local 형식 (YYYY-MM-DDTHH:mm)을 ISO 형식으로 변환
      if (dateString.length === 16 && dateString.includes('T')) {
        return new Date(dateString + ':00.000Z').toISOString();
      }
      
      // 이미 올바른 형식인 경우 그대로 반환
      try {
        return new Date(dateString).toISOString();
      } catch {
        return new Date().toISOString();
      }
    };

    return {
      title: property.title,
      location: property.address || property.location,
      description: property.description || '',
      type: property.propertyType || property.type,
      area: property.area,
      starting_price: property.minimumPrice || property.startingPrice,
      image_url: property.imageUrl || '',
      features: property.features || [],
      end_date: formatDateForBackend(property.auctionDate || property.endDate),
      owner_id: 'default-owner' // 기본 owner_id 설정
    };
  }

  // 백엔드 Property를 프론트엔드 형식으로 변환
  private convertToFrontendProperty(backendProperty: BackendProperty): Property {
    return {
      id: backendProperty.id,
      title: backendProperty.title,
      address: backendProperty.location,
      location: backendProperty.location,
      propertyType: backendProperty.type as any,
      type: backendProperty.type,
      area: backendProperty.area,
      buildYear: new Date().getFullYear(), // 기본값
      floors: '', // 기본값
      appraisalValue: backendProperty.starting_price,
      minimumPrice: backendProperty.starting_price,
      startingPrice: backendProperty.starting_price,
      currentPrice: backendProperty.current_price,
      bidDeposit: Math.floor(backendProperty.starting_price * 0.1), // 10% 기본값
      auctionDate: backendProperty.end_date,
      endDate: backendProperty.end_date,
      registrationDate: backendProperty.created_at,
      announceDate: backendProperty.created_at,
      caseNumber: `CASE_${backendProperty.id.slice(-8)}`, // ID 기반 사건번호 생성
      court: '서울중앙지방법원', // 기본값
      propertyNumber: `PROP_${backendProperty.id.slice(-6)}`, // ID 기반 물건번호
      rightAnalysis: '',
      status: backendProperty.status as any,
      auctionCount: 1,
      isUnsold: false,
      hasResidents: false,
      residentStatus: '',
      residentDetails: '',
      ownerName: '',
      ownerContact: '',
      ownerAddress: '',
      description: backendProperty.description,
      features: backendProperty.features,
      imageUrl: backendProperty.image_url || '/default-property.png',
      createdAt: backendProperty.created_at,
      updatedAt: backendProperty.updated_at
    };
  }

  // Property CRUD 메서드들

  // 모든 부동산 조회
  async getAllProperties(): Promise<Property[]> {
    try {
      console.log('🌐 Fetching all properties from backend API...');
      const response = await this.request<BackendProperty[]>('/properties/');
      
      if (response.success && response.data) {
        const properties = response.data.map(bp => this.convertToFrontendProperty(bp));
        console.log(`✅ Loaded ${properties.length} properties from backend API`);
        return properties;
      }
      
      console.log('📭 No properties found in backend');
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch properties from backend API:', error);
      throw error;
    }
  }

  // 특정 부동산 조회
  async getProperty(id: string): Promise<Property | null> {
    try {
      console.log(`🔍 Fetching property ${id} from backend API...`);
      const response = await this.request<BackendProperty>(`/properties/${id}`);
      
      if (response.success && response.data) {
        const property = this.convertToFrontendProperty(response.data);
        console.log(`✅ Property ${id} loaded from backend API`);
        return property;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Failed to fetch property ${id} from backend API:`, error);
      return null;
    }
  }

  // 부동산 생성
  async saveProperty(property: Property): Promise<void> {
    try {
      console.log(`💾 Saving property ${property.title} to backend API...`);
      const backendProperty = this.convertToBackendProperty(property);
      
      const response = await this.request<BackendProperty>('/properties/', {
        method: 'POST',
        body: JSON.stringify(backendProperty)
      });
      
      if (response.success) {
        console.log(`✅ Property ${property.title} saved to backend API`);
      } else {
        throw new Error(response.error || 'Failed to save property');
      }
    } catch (error) {
      console.error('❌ Failed to save property to backend API:', error);
      throw error;
    }
  }

  // 부동산 업데이트
  async updateProperty(id: string, updates: Partial<Property>): Promise<void> {
    try {
      console.log(`🔄 Updating property ${id} in backend API...`);
      
      // 백엔드 업데이트 형식으로 변환
      const updateRequest: any = {};
      if (updates.title) updateRequest.title = updates.title;
      if (updates.description) updateRequest.description = updates.description;
      if (updates.imageUrl) updateRequest.image_url = updates.imageUrl;
      if (updates.features) updateRequest.features = updates.features;
      if (updates.status) updateRequest.status = updates.status;
      
      const response = await this.request(`/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateRequest)
      });
      
      if (response.success) {
        console.log(`✅ Property ${id} updated in backend API`);
      } else {
        throw new Error(response.error || 'Failed to update property');
      }
    } catch (error) {
      console.error(`❌ Failed to update property ${id} in backend API:`, error);
      throw error;
    }
  }

  // 부동산 삭제
  async deleteProperty(id: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting property ${id} from backend API...`);
      
      const response = await this.request(`/properties/${id}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        console.log(`✅ Property ${id} deleted from backend API`);
      } else {
        throw new Error(response.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error(`❌ Failed to delete property ${id} from backend API:`, error);
      throw error;
    }
  }

  // 상태별 부동산 조회
  async getPropertiesByStatus(status: string): Promise<Property[]> {
    try {
      console.log(`🔍 Fetching properties with status ${status} from backend API...`);
      const response = await this.request<BackendProperty[]>(`/properties/status?status=${status}`);
      
      if (response.success && response.data) {
        const properties = response.data.map(bp => this.convertToFrontendProperty(bp));
        console.log(`✅ Loaded ${properties.length} properties with status ${status} from backend API`);
        return properties;
      }
      
      return [];
    } catch (error) {
      console.error(`❌ Failed to fetch properties with status ${status} from backend API:`, error);
      throw error;
    }
  }

  // 등록 폼에서 Property 객체로 변환
  convertFormToProperty(form: PropertyRegistrationForm, imageUrl: string = ''): Property {
    const now = new Date().toISOString();
    const id = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      title: form.title,
      address: form.address,
      location: form.address,
      propertyType: form.propertyType,
      type: form.propertyType,
      area: form.area,
      buildYear: form.buildYear,
      floors: form.floors,
      appraisalValue: form.appraisalValue,
      minimumPrice: form.minimumPrice,
      startingPrice: form.minimumPrice,
      currentPrice: form.minimumPrice,
      bidDeposit: form.bidDeposit,
      auctionDate: form.auctionDate,
      endDate: form.auctionDate,
      registrationDate: form.registrationDate,
      announceDate: form.announceDate,
      caseNumber: form.caseNumber,
      court: form.court,
      propertyNumber: form.propertyNumber,
      rightAnalysis: form.rightAnalysis,
      status: "Active",
      auctionCount: form.auctionCount,
      isUnsold: form.isUnsold,
      hasResidents: form.hasResidents,
      residentStatus: form.residentStatus,
      residentDetails: form.residentDetails,
      ownerName: form.ownerName,
      ownerContact: form.ownerContact,
      ownerAddress: form.ownerAddress,
      description: form.description,
      features: form.features,
      imageUrl: imageUrl || '/default-property.png',
      createdAt: now,
      updatedAt: now
    };
  }

  // API 연결 상태 확인
  async isConnected(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // 헬스 체크
  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { status: 'unhealthy', message: 'API server is not responding' };
    }
  }

  // EERC 토큰 민팅 (ZK proof 포함)
  async mintEERCTokens(amount: number, userPublicKey: string[], auditorPublicKey: string[]): Promise<{
    success: boolean;
    txHash: string;
    amount: number;
    message: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/eerc/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        userPublicKey,
        auditorPublicKey
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `EERC mint failed: ${response.status}`);
    }

    return response.json();
  }

  // EERC 토큰 전송 (ZK proof 포함)
  async transferEERCTokens(
    amount: number,
    senderPublicKey: string[],
    senderPrivateKey: string,
    senderBalance: number,
    senderEncryptedBalance: string[],
    receiverPublicKey: string[],
    auditorPublicKey: string[]
  ): Promise<{
    success: boolean;
    txHash: string;
    amount: number;
    message: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/eerc/transfer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        senderPublicKey,
        senderPrivateKey,
        senderBalance,
        senderEncryptedBalance,
        receiverPublicKey,
        auditorPublicKey
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `EERC transfer failed: ${response.status}`);
    }

    return response.json();
  }

  // Deposit 관련 메서드들

  // 보증금 납부
  async createDeposit(propertyId: string, userId: string, amount: number, tokenType: string = 'wKRW'): Promise<BackendDeposit> {
    try {
      console.log(`💰 Creating deposit for property ${propertyId}, amount: ${amount}...`);
      const depositRequest: CreateDepositRequest = {
        property_id: propertyId,
        user_id: userId,
        amount: amount,
        token_type: tokenType
      };
      
      const response = await this.request<BackendDeposit>('/deposits/', {
        method: 'POST',
        body: JSON.stringify(depositRequest)
      });
      
      if (response.success && response.data) {
        console.log(`✅ Deposit created successfully:`, response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create deposit');
      }
    } catch (error) {
      console.error('❌ Failed to create deposit:', error);
      throw error;
    }
  }

  // 사용자별 보증금 조회
  async getUserDeposits(userId: string): Promise<BackendDeposit[]> {
    try {
      console.log(`🔍 Fetching deposits for user ${userId}...`);
      const response = await this.request<BackendDeposit[]>(`/deposits/user/${userId}`);
      
      if (response.success && response.data) {
        console.log(`✅ Loaded ${response.data.length} deposits for user ${userId}`);
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error(`❌ Failed to fetch deposits for user ${userId}:`, error);
      throw error;
    }
  }

  // 모든 보증금 조회
  async getAllDeposits(): Promise<BackendDeposit[]> {
    try {
      console.log('🔍 Fetching all deposits...');
      const response = await this.request<BackendDeposit[]>('/deposits/');
      
      if (response.success && response.data) {
        console.log(`✅ Loaded ${response.data.length} total deposits`);
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch all deposits:', error);
      throw error;
    }
  }

  // 특정 보증금 조회
  async getDeposit(depositId: string): Promise<BackendDeposit | null> {
    try {
      console.log(`🔍 Fetching deposit ${depositId}...`);
      const response = await this.request<BackendDeposit>(`/deposits/${depositId}`);
      
      if (response.success && response.data) {
        console.log(`✅ Deposit ${depositId} loaded`);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Failed to fetch deposit ${depositId}:`, error);
      return null;
    }
  }

  // 보증금 상태 업데이트
  async updateDepositStatus(depositId: string, status: string, txHash?: string): Promise<void> {
    try {
      console.log(`🔄 Updating deposit ${depositId} status to ${status}...`);
      const updateRequest: any = { status };
      if (txHash) {
        updateRequest.tx_hash = txHash;
      }
      
      const response = await this.request(`/deposits/${depositId}/status`, {
        method: 'PUT',
        body: JSON.stringify(updateRequest)
      });
      
      if (response.success) {
        console.log(`✅ Deposit ${depositId} status updated to ${status}`);
      } else {
        throw new Error(response.error || 'Failed to update deposit status');
      }
    } catch (error) {
      console.error(`❌ Failed to update deposit ${depositId} status:`, error);
      throw error;
    }
  }

  // Bid 관련 메서드들

  // 입찰 생성
  async createBid(propertyId: string, bidderId: string, amount: number, isEncrypted: boolean = true, encryptedData?: string): Promise<BackendBid> {
    try {
      console.log(`📝 Creating bid for property ${propertyId}, amount: ${amount}...`);
      const bidRequest: CreateBidRequest = {
        property_id: propertyId,
        bidder_id: bidderId,
        amount: amount,
        is_encrypted: isEncrypted,
        encrypted_data: encryptedData
      };
      
      const response = await this.request<BackendBid>('/bids/', {
        method: 'POST',
        body: JSON.stringify(bidRequest)
      });
      
      if (response.success && response.data) {
        console.log(`✅ Bid created successfully:`, response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create bid');
      }
    } catch (error) {
      console.error('❌ Failed to create bid:', error);
      throw error;
    }
  }

  // 사용자별 입찰 조회
  async getUserBids(userId: string): Promise<BackendBid[]> {
    try {
      console.log(`🔍 Fetching bids for user ${userId}...`);
      const response = await this.request<BackendBid[]>(`/users/${userId}/bids`);
      
      if (response.success && response.data) {
        console.log(`✅ Loaded ${response.data.length} bids for user ${userId}`);
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error(`❌ Failed to fetch bids for user ${userId}:`, error);
      throw error;
    }
  }

  // 상위 입찰 조회
  async getTopBids(limit?: number): Promise<BackendBid[]> {
    try {
      console.log('🔍 Fetching top bids...');
      const url = limit ? `/bids/?limit=${limit}` : '/bids/';
      const response = await this.request<BackendBid[]>(url);
      
      if (response.success && response.data) {
        console.log(`✅ Loaded ${response.data.length} top bids`);
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch top bids:', error);
      throw error;
    }
  }

  // 특정 입찰 조회
  async getBid(bidId: string): Promise<BackendBid | null> {
    try {
      console.log(`🔍 Fetching bid ${bidId}...`);
      const response = await this.request<BackendBid>(`/bids/${bidId}`);
      
      if (response.success && response.data) {
        console.log(`✅ Bid ${bidId} loaded`);
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Failed to fetch bid ${bidId}:`, error);
      return null;
    }
  }

  // 입찰 상태 업데이트
  async updateBidStatus(bidId: string, status: string): Promise<void> {
    try {
      console.log(`🔄 Updating bid ${bidId} status to ${status}...`);
      const updateRequest = { status };
      
      const response = await this.request(`/bids/${bidId}/status`, {
        method: 'PUT',
        body: JSON.stringify(updateRequest)
      });
      
      if (response.success) {
        console.log(`✅ Bid ${bidId} status updated to ${status}`);
      } else {
        throw new Error(response.error || 'Failed to update bid status');
      }
    } catch (error) {
      console.error(`❌ Failed to update bid ${bidId} status:`, error);
      throw error;
    }
  }

  // 모든 입찰 조회 (AdminPage용)
  async getAllBids(): Promise<BackendBid[]> {
    try {
      console.log('🔍 Fetching all bids...');
      const response = await this.request<BackendBid[]>('/bids/');
      
      if (response.success && response.data) {
        console.log(`✅ Loaded ${response.data.length} total bids`);
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch all bids:', error);
      throw error;
    }
  }

  // 특정 property의 입찰 조회
  async getPropertyBids(propertyId: string): Promise<BackendBid[]> {
    try {
      console.log(`🔍 Fetching bids for property ${propertyId}...`);
      const url = `/properties/${propertyId}/bids`;
      console.log(`🌐 API URL: ${API_BASE_URL}${url}`);
      
      // BidHistory 객체를 반환하는 API 응답 타입 정의
      interface BidHistoryResponse {
        property_id: string;
        bid_count: number;
        highest_bid: number;
        latest_bidder: string;
        bids: BackendBid[];
      }
      
      const response = await this.request<BidHistoryResponse>(url);
      console.log(`📡 API Response:`, response);
      
      if (response.success && response.data && response.data.bids) {
        console.log(`✅ Loaded ${response.data.bids.length} bids for property ${propertyId}:`, response.data.bids);
        return response.data.bids;
      } else {
        console.log(`⚠️ API response indicates failure or no bids:`, response);
        return [];
      }
    } catch (error) {
      console.error(`❌ Failed to fetch bids for property ${propertyId}:`, error);
      throw error;
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const apiService = ApiService.getInstance();
