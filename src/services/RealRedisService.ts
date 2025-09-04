import { Property, PropertyRegistrationForm } from '../types/Property';

// 실제 Redis 연결을 위한 인터페이스
interface RedisClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  hset(key: string, field: string, value: string): Promise<number>;
  hget(key: string, field: string): Promise<string | null>;
  hgetall(key: string): Promise<Record<string, string>>;
  sadd(key: string, member: string): Promise<number>;
  smembers(key: string): Promise<string[]>;
  srem(key: string, member: string): Promise<number>;
}

// Mock Redis Client (실제 환경에서는 redis 패키지의 createClient() 사용)
class MockRedisClient implements RedisClient {
  private storage: Map<string, string> = new Map();
  private connected: boolean = false;

  async connect(): Promise<void> {
    console.log('🔌 Connecting to Redis at localhost:6379...');
    // 실제로는 Redis 서버에 연결
    this.connected = true;
    console.log('✅ Connected to Redis successfully');
  }

  async disconnect(): Promise<void> {
    console.log('🔌 Disconnecting from Redis...');
    this.connected = false;
    console.log('✅ Disconnected from Redis');
  }

  async set(key: string, value: string): Promise<void> {
    if (!this.connected) throw new Error('Redis not connected');
    this.storage.set(key, value);
    console.log(`🔄 Redis SET: ${key}`);
  }

  async get(key: string): Promise<string | null> {
    if (!this.connected) throw new Error('Redis not connected');
    const value = this.storage.get(key) || null;
    console.log(`🔍 Redis GET: ${key} => ${value ? 'Found' : 'Not found'}`);
    return value;
  }

  async del(key: string): Promise<number> {
    if (!this.connected) throw new Error('Redis not connected');
    const deleted = this.storage.delete(key) ? 1 : 0;
    console.log(`🗑️ Redis DEL: ${key} => ${deleted ? 'Deleted' : 'Not found'}`);
    return deleted;
  }

  async keys(pattern: string): Promise<string[]> {
    if (!this.connected) throw new Error('Redis not connected');
    const keys = Array.from(this.storage.keys());
    let filteredKeys: string[];
    
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      filteredKeys = keys.filter(key => key.startsWith(prefix));
    } else {
      filteredKeys = keys.filter(key => key === pattern);
    }
    
    console.log(`🔍 Redis KEYS: ${pattern} => ${filteredKeys.length} keys found`);
    return filteredKeys;
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    if (!this.connected) throw new Error('Redis not connected');
    const hashKey = `${key}:${field}`;
    const isNew = !this.storage.has(hashKey);
    this.storage.set(hashKey, value);
    console.log(`🔄 Redis HSET: ${key}.${field}`);
    return isNew ? 1 : 0;
  }

  async hget(key: string, field: string): Promise<string | null> {
    if (!this.connected) throw new Error('Redis not connected');
    const hashKey = `${key}:${field}`;
    const value = this.storage.get(hashKey) || null;
    console.log(`🔍 Redis HGET: ${key}.${field} => ${value ? 'Found' : 'Not found'}`);
    return value;
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (!this.connected) throw new Error('Redis not connected');
    const result: Record<string, string> = {};
    const prefix = `${key}:`;
    
    for (const [storageKey, value] of this.storage.entries()) {
      if (storageKey.startsWith(prefix)) {
        const field = storageKey.slice(prefix.length);
        result[field] = value;
      }
    }
    
    console.log(`🔍 Redis HGETALL: ${key} => ${Object.keys(result).length} fields`);
    return result;
  }

  async sadd(key: string, member: string): Promise<number> {
    if (!this.connected) throw new Error('Redis not connected');
    const setKey = `set:${key}`;
    const existing = this.storage.get(setKey);
    const members = existing ? JSON.parse(existing) : [];
    
    if (!members.includes(member)) {
      members.push(member);
      this.storage.set(setKey, JSON.stringify(members));
      console.log(`🔄 Redis SADD: ${key} += ${member}`);
      return 1;
    }
    return 0;
  }

  async smembers(key: string): Promise<string[]> {
    if (!this.connected) throw new Error('Redis not connected');
    const setKey = `set:${key}`;
    const existing = this.storage.get(setKey);
    const members = existing ? JSON.parse(existing) : [];
    console.log(`🔍 Redis SMEMBERS: ${key} => ${members.length} members`);
    return members;
  }

  async srem(key: string, member: string): Promise<number> {
    if (!this.connected) throw new Error('Redis not connected');
    const setKey = `set:${key}`;
    const existing = this.storage.get(setKey);
    
    if (existing) {
      const members = JSON.parse(existing);
      const filtered = members.filter((m: string) => m !== member);
      
      if (filtered.length < members.length) {
        this.storage.set(setKey, JSON.stringify(filtered));
        console.log(`🔄 Redis SREM: ${key} -= ${member}`);
        return 1;
      }
    }
    return 0;
  }
}

// 실제 Redis 서비스 클래스
export class RealRedisService {
  private static instance: RealRedisService;
  private client: RedisClient;

  private constructor() {
    // 실제 환경에서는: this.client = createClient({ host: 'localhost', port: 6379 });
    this.client = new MockRedisClient();
  }

  public static getInstance(): RealRedisService {
    if (!RealRedisService.instance) {
      RealRedisService.instance = new RealRedisService();
    }
    return RealRedisService.instance;
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  // 사건번호를 키로 사용하여 부동산 데이터 저장
  async savePropertyByCaseNumber(property: Property): Promise<void> {
    try {
      const caseNumberKey = `case:${property.caseNumber}`;
      await this.client.set(caseNumberKey, JSON.stringify(property));
      
      // 사건번호 목록에도 추가
      await this.client.sadd('case_numbers', property.caseNumber);
      
      // 추가 인덱싱을 위한 메타데이터 저장
      await this.client.hset('case_metadata', property.caseNumber, JSON.stringify({
        id: property.id,
        title: property.title,
        court: property.court,
        auctionDate: property.auctionDate,
        status: property.status,
        createdAt: property.createdAt
      }));
      
      console.log(`💾 Property saved with case number: ${property.caseNumber}`);
    } catch (error) {
      console.error('Error saving property to Redis:', error);
      throw error;
    }
  }

  // 사건번호로 부동산 데이터 조회
  async getPropertyByCaseNumber(caseNumber: string): Promise<Property | null> {
    try {
      const caseNumberKey = `case:${caseNumber}`;
      const data = await this.client.get(caseNumberKey);
      
      if (!data) {
        return null;
      }
      
      return JSON.parse(data) as Property;
    } catch (error) {
      console.error(`Error getting property by case number ${caseNumber}:`, error);
      return null;
    }
  }

  // 모든 사건번호 목록 조회
  async getAllCaseNumbers(): Promise<string[]> {
    try {
      return await this.client.smembers('case_numbers');
    } catch (error) {
      console.error('Error getting all case numbers:', error);
      return [];
    }
  }

  // 모든 부동산 데이터 조회
  async getAllProperties(): Promise<Property[]> {
    try {
      const caseNumbers = await this.getAllCaseNumbers();
      const properties: Property[] = [];
      
      for (const caseNumber of caseNumbers) {
        const property = await this.getPropertyByCaseNumber(caseNumber);
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

  // 사건번호로 부동산 데이터 삭제
  async deletePropertyByCaseNumber(caseNumber: string): Promise<void> {
    try {
      const caseNumberKey = `case:${caseNumber}`;
      await this.client.del(caseNumberKey);
      await this.client.srem('case_numbers', caseNumber);
      await this.client.hget('case_metadata', caseNumber); // 메타데이터도 삭제
      
      console.log(`🗑️ Property deleted with case number: ${caseNumber}`);
    } catch (error) {
      console.error(`Error deleting property ${caseNumber}:`, error);
      throw error;
    }
  }

  // 사건번호로 부동산 데이터 업데이트
  async updatePropertyByCaseNumber(caseNumber: string, updates: Partial<Property>): Promise<void> {
    try {
      const existing = await this.getPropertyByCaseNumber(caseNumber);
      if (!existing) {
        throw new Error(`Property with case number ${caseNumber} not found`);
      }
      
      const updated: Property = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      await this.savePropertyByCaseNumber(updated);
    } catch (error) {
      console.error(`Error updating property ${caseNumber}:`, error);
      throw error;
    }
  }

  // 등록 폼에서 Property 객체로 변환 (사건번호 기반)
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

  // 사건번호로 검색
  async searchByCaseNumber(partialCaseNumber: string): Promise<Property[]> {
    try {
      const allCaseNumbers = await this.getAllCaseNumbers();
      const matchingCaseNumbers = allCaseNumbers.filter(caseNumber => 
        caseNumber.toLowerCase().includes(partialCaseNumber.toLowerCase())
      );
      
      const properties: Property[] = [];
      for (const caseNumber of matchingCaseNumbers) {
        const property = await this.getPropertyByCaseNumber(caseNumber);
        if (property) {
          properties.push(property);
        }
      }
      
      return properties;
    } catch (error) {
      console.error('Error searching by case number:', error);
      return [];
    }
  }

  // Redis 연결 상태 확인
  async isConnected(): Promise<boolean> {
    try {
      await this.client.get('test');
      return true;
    } catch {
      return false;
    }
  }
}

// 싱글톤 인스턴스 내보내기
export const realRedisService = RealRedisService.getInstance();
