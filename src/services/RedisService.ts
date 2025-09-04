import { Property, PropertyRegistrationForm, REDIS_KEYS, AuctionStats } from '../types/Property';

// Redis 클라이언트 Mock 구현 (실제 환경에서는 redis 패키지 사용)
class MockRedisClient {
  private storage: Map<string, string> = new Map();

  async set(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async del(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.storage.has(key);
  }

  async keys(pattern: string): Promise<string[]> {
    const keys = Array.from(this.storage.keys());
    // 간단한 패턴 매칭 구현
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return keys.filter(key => key.startsWith(prefix));
    }
    return keys.filter(key => key === pattern);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    const hashKey = `${key}:${field}`;
    this.storage.set(hashKey, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    const hashKey = `${key}:${field}`;
    return this.storage.get(hashKey) || null;
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    const prefix = `${key}:`;
    
    for (const [storageKey, value] of this.storage.entries()) {
      if (storageKey.startsWith(prefix)) {
        const field = storageKey.slice(prefix.length);
        result[field] = value;
      }
    }
    
    return result;
  }

  async sadd(key: string, member: string): Promise<void> {
    const setKey = `set:${key}`;
    const existing = this.storage.get(setKey);
    const members = existing ? JSON.parse(existing) : [];
    if (!members.includes(member)) {
      members.push(member);
      this.storage.set(setKey, JSON.stringify(members));
    }
  }

  async smembers(key: string): Promise<string[]> {
    const setKey = `set:${key}`;
    const existing = this.storage.get(setKey);
    return existing ? JSON.parse(existing) : [];
  }

  async srem(key: string, member: string): Promise<void> {
    const setKey = `set:${key}`;
    const existing = this.storage.get(setKey);
    if (existing) {
      const members = JSON.parse(existing);
      const filtered = members.filter((m: string) => m !== member);
      this.storage.set(setKey, JSON.stringify(filtered));
    }
  }
}

// Redis 서비스 클래스
export class RedisService {
  private static instance: RedisService;
  private client: MockRedisClient;

  private constructor() {
    this.client = new MockRedisClient();
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  // Property CRUD operations
  async saveProperty(property: Property): Promise<void> {
    try {
      const propertyKey = REDIS_KEYS.PROPERTY(property.id);
      await this.client.set(propertyKey, JSON.stringify(property));
      
      // 속성 리스트에 추가
      await this.client.sadd(REDIS_KEYS.PROPERTIES_LIST, property.id);
      
      console.log(`Property ${property.id} saved to Redis`);
    } catch (error) {
      console.error('Error saving property to Redis:', error);
      throw error;
    }
  }

  async getProperty(id: string): Promise<Property | null> {
    try {
      const propertyKey = REDIS_KEYS.PROPERTY(id);
      const data = await this.client.get(propertyKey);
      
      if (!data) {
        return null;
      }
      
      return JSON.parse(data) as Property;
    } catch (error) {
      console.error(`Error getting property ${id} from Redis:`, error);
      return null;
    }
  }

  async getAllProperties(): Promise<Property[]> {
    try {
      const propertyIds = await this.client.smembers(REDIS_KEYS.PROPERTIES_LIST);
      const properties: Property[] = [];
      
      for (const id of propertyIds) {
        const property = await this.getProperty(id);
        if (property) {
          properties.push(property);
        }
      }
      
      return properties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error getting all properties from Redis:', error);
      return [];
    }
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<void> {
    try {
      const existing = await this.getProperty(id);
      if (!existing) {
        throw new Error(`Property ${id} not found`);
      }
      
      const updated: Property = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await this.saveProperty(updated);
    } catch (error) {
      console.error(`Error updating property ${id}:`, error);
      throw error;
    }
  }

  async deleteProperty(id: string): Promise<void> {
    try {
      const propertyKey = REDIS_KEYS.PROPERTY(id);
      await this.client.del(propertyKey);
      await this.client.srem(REDIS_KEYS.PROPERTIES_LIST, id);
      
      console.log(`Property ${id} deleted from Redis`);
    } catch (error) {
      console.error(`Error deleting property ${id}:`, error);
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
      location: form.address, // 동일하게 설정
      propertyType: form.propertyType,
      type: form.propertyType, // 호환성을 위해
      area: form.area,
      buildYear: form.buildYear,
      floors: form.floors,
      appraisalValue: form.appraisalValue,
      minimumPrice: form.minimumPrice,
      startingPrice: form.minimumPrice, // 시작가격은 최저가격과 동일
      currentPrice: form.minimumPrice, // 초기에는 최저가격
      bidDeposit: form.bidDeposit,
      auctionDate: form.auctionDate,
      endDate: form.auctionDate, // 동일하게 설정
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

  // 통계 계산
  async getAuctionStats(): Promise<AuctionStats> {
    try {
      const properties = await this.getAllProperties();
      
      const stats: AuctionStats = {
        totalProperties: properties.length,
        activeAuctions: properties.filter(p => p.status === 'Active').length,
        completedAuctions: properties.filter(p => p.status === 'Completed').length,
        totalVolume: properties.reduce((sum, p) => sum + p.currentPrice, 0),
        averagePrice: 0
      };
      
      if (properties.length > 0) {
        stats.averagePrice = stats.totalVolume / properties.length;
      }
      
      return stats;
    } catch (error) {
      console.error('Error calculating auction stats:', error);
      return {
        totalProperties: 0,
        activeAuctions: 0,
        completedAuctions: 0,
        totalVolume: 0,
        averagePrice: 0
      };
    }
  }

  // 필터링된 속성 조회
  async getPropertiesByStatus(status: Property['status']): Promise<Property[]> {
    const allProperties = await this.getAllProperties();
    return allProperties.filter(property => property.status === status);
  }

  async getPropertiesByType(type: string): Promise<Property[]> {
    const allProperties = await this.getAllProperties();
    return allProperties.filter(property => property.propertyType === type || property.type === type);
  }

  // 검색 기능
  async searchProperties(query: string): Promise<Property[]> {
    const allProperties = await this.getAllProperties();
    const lowercaseQuery = query.toLowerCase();
    
    return allProperties.filter(property => 
      property.title.toLowerCase().includes(lowercaseQuery) ||
      property.address.toLowerCase().includes(lowercaseQuery) ||
      property.location.toLowerCase().includes(lowercaseQuery) ||
      property.description.toLowerCase().includes(lowercaseQuery)
    );
  }
}

// 싱글톤 인스턴스 내보내기
export const redisService = RedisService.getInstance();
