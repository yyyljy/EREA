import { Property, PropertyRegistrationForm } from '../types/Property';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8000/api/v1';

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
    return {
      title: property.title,
      location: property.address || property.location,
      description: property.description || '',
      type: property.propertyType || property.type,
      area: property.area,
      starting_price: property.minimumPrice || property.startingPrice,
      image_url: property.imageUrl || '',
      features: property.features || [],
      end_date: property.auctionDate || property.endDate,
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
      const response = await this.request<BackendProperty[]>('/properties');
      
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
      
      const response = await this.request<BackendProperty>('/properties', {
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
}

// 싱글톤 인스턴스 내보내기
export const apiService = ApiService.getInstance();
