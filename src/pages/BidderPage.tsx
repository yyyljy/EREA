import { useState, useEffect } from "react";
import { apiService } from '../services/ApiService';
import { eercService } from '../services/EERCService';
import { Property as PropertyType } from '../types/Property';

// API에서 받아온 Property 타입을 BidderPage용으로 매핑하는 인터페이스
interface BidderProperty {
  id: string;
  title: string;
  location: string;
  minimumPrice: number;
  bidDeposit: number;
  auctionDate: string;
  caseNumber: string;
  court: string;
  status: "Active" | "Pending" | "Closed";
  imageUrl: string;
  area: number;
  type: string;
}

interface DepositTransaction {
  propertyId: string;
  amount: number;
  tokenType: "wKRW" | "EERC20";
  status: "Pending" | "Confirmed" | "Failed";
  txHash?: string;
  timestamp: string;
}

interface BidSubmission {
  propertyId: string;
  bidAmount: number;
  depositConfirmed: boolean;
  bidType: "Sealed" | "Open";
  submissionTime: string;
  status: "Draft" | "Submitted" | "Confirmed";
}

interface PropertyDelivery {
  propertyId: string;
  finalPrice: number;
  remainingPayment: number;
  paymentDeadline: string;
  deliveryStatus: "Pending Payment" | "Payment Confirmed" | "Delivery Scheduled" | "Completed";
  deliveryDate?: string;
}

export function BidderPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "deposit" | "bid" | "payment" | "history">("browse");
  const [selectedProperty, setSelectedProperty] = useState<BidderProperty | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isEERCConnected, setIsEERCConnected] = useState(false);

  // User ID (실제 앱에서는 인증 시스템에서 가져와야 함)
  const [currentUserId] = useState<string>('user_demo_bidder_001');

  // EERC 관련 상태
  const [eercBalance, setEERCBalance] = useState<string>('0.00');
  const [eercSymbol, setEERCSymbol] = useState<string>('PRIV');
  const [contractAddresses, setContractAddresses] = useState<{ encryptedERC: string; registrar: string } | null>(null);
  const [systemStatus, setSystemStatus] = useState<{
    userRegistered: boolean;
    auditorSet: boolean;
    contractsLoaded: boolean;
    userAddress: string;
    auditorAddress: string;
  }>({
    userRegistered: false,
    auditorSet: false,
    contractsLoaded: false,
    userAddress: '',
    auditorAddress: ''
  });

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<string>("");
  
  // Bidding Form State
  const [bidAmount, setBidAmount] = useState<string>("");
  
  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState<string>("");

  // API에서 받아온 Property 데이터
  const [availableProperties, setAvailableProperties] = useState<BidderProperty[]>([]);

  // API Property를 BidderProperty로 변환하는 함수
  const convertToBidderProperty = (property: PropertyType): BidderProperty => {
    return {
      id: property.id,
      title: property.title,
      location: property.address || property.location,
      minimumPrice: property.minimumPrice,
      bidDeposit: property.bidDeposit,
      auctionDate: property.auctionDate,
      caseNumber: property.caseNumber,
      court: property.court,
      status: property.status as "Active" | "Pending" | "Closed",
      imageUrl: property.imageUrl,
      area: property.area,
      type: property.propertyType || property.type
    };
  };

  // API 연결 및 데이터 로드
  useEffect(() => {
    initializeConnections();
  }, []);

  // API와 EERC 서비스 초기화
  const initializeConnections = async () => {
    await Promise.all([
      initializeApiConnection(),
      initializeEERCConnection()
    ]);
  };

  // EERC 서비스 초기화
  const initializeEERCConnection = async () => {
    try {
      console.log('🔧 BidderPage: Initializing EERC connection...');
      const initialized = await eercService.initialize();
      
      if (initialized) {
        console.log('✅ BidderPage: EERC service connected');
        setIsEERCConnected(true);
        
        // Load contract addresses
        const addresses = eercService.getContractAddresses();
        setContractAddresses(addresses);
        
        // Load EERC configuration
        const config = eercService.getConfig();
        if (config) {
          setEERCSymbol(config.eerc.token_symbol);
        }
        
        // Load system status
        const status = await eercService.getSystemStatus();
        setSystemStatus(status);
        
        await loadEERCBalance();
      } else {
        throw new Error('EERC service initialization failed');
      }
    } catch (error) {
      console.error('❌ BidderPage: Failed to initialize EERC service:', error);
      setIsEERCConnected(false);
    }
  };

  // EERC 밸런스 로드
  const loadEERCBalance = async () => {
    try {
      console.log('🔍 BidderPage: Loading EERC balance...');
      const balance = await eercService.getUserBalance();
      setEERCBalance(balance.balance);
      setEERCSymbol(balance.symbol);
      console.log(`💰 BidderPage: EERC balance loaded: ${balance.balance} ${balance.symbol}`);
    } catch (error) {
      console.error('❌ BidderPage: Failed to load EERC balance:', error);
      setEERCBalance('0.00');
    }
  };

  // deposit 데이터를 API에서 로드하는 함수
  const loadDepositTransactions = async () => {
    try {
      console.log('🔍 BidderPage: Loading deposit transactions from API...');
      const deposits = await apiService.getUserDeposits(currentUserId);
      
      // BackendDeposit을 DepositTransaction으로 변환
      const depositTransactions: DepositTransaction[] = deposits.map(deposit => ({
        propertyId: deposit.property_id,
        amount: deposit.amount,
        tokenType: deposit.token_type as "wKRW" | "EERC20",
        status: deposit.status as "Pending" | "Confirmed" | "Failed",
        txHash: deposit.tx_hash,
        timestamp: deposit.created_at
      }));
      
      setDepositTransactions(depositTransactions);
      console.log(`📊 BidderPage: Loaded ${depositTransactions.length} deposit transactions`);
    } catch (error) {
      console.error('❌ BidderPage: Failed to load deposit transactions:', error);
      // 실패 시 빈 배열로 설정
      setDepositTransactions([]);
    }
  };

  // bid 데이터를 API에서 로드하는 함수
  const loadBidSubmissions = async () => {
    try {
      console.log('🔍 BidderPage: Loading bid submissions from API...');
      const bids = await apiService.getUserBids(currentUserId);
      
      // BackendBid를 BidSubmission으로 변환
      const bidSubmissions: BidSubmission[] = bids.map(bid => ({
        propertyId: bid.property_id,
        bidAmount: bid.amount,
        depositConfirmed: true, // API에서 받은 bid는 이미 deposit이 확인된 상태
        bidType: bid.is_encrypted ? "Sealed" : "Open",
        submissionTime: bid.created_at,
        status: bid.status as "Draft" | "Submitted" | "Confirmed"
      }));
      
      setBidSubmissions(bidSubmissions);
      console.log(`📊 BidderPage: Loaded ${bidSubmissions.length} bid submissions`);
    } catch (error) {
      console.error('❌ BidderPage: Failed to load bid submissions:', error);
      // 실패 시 빈 배열로 설정
      setBidSubmissions([]);
    }
  };

  const initializeApiConnection = async () => {
    try {
      const isConnected = await apiService.isConnected();
      if (isConnected) {
        const healthCheck = await apiService.healthCheck();
        console.log('✅ BidderPage: Connected to backend API:', healthCheck.message);
        setIsApiConnected(true);
        await Promise.all([loadProperties(), loadDepositTransactions(), loadBidSubmissions()]);
      } else {
        throw new Error('API server is not responding');
      }
    } catch (error) {
      console.error('❌ BidderPage: Failed to connect to backend API:', error);
      setIsApiConnected(false);
      await Promise.all([loadProperties(), loadDepositTransactions(), loadBidSubmissions()]); // 실패해도 로드 시도
    }
  };

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 BidderPage: Loading properties from API...');
      const properties = await apiService.getAllProperties();
      const bidderProperties = properties.map(convertToBidderProperty);
      setAvailableProperties(bidderProperties);
      console.log(`📊 BidderPage: Loaded ${bidderProperties.length} properties`);
    } catch (error) {
      console.error('❌ BidderPage: Failed to load properties:', error);
      // 실패 시 빈 배열로 설정
      setAvailableProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const [depositTransactions, setDepositTransactions] = useState<DepositTransaction[]>([]);

  const [bidSubmissions, setBidSubmissions] = useState<BidSubmission[]>([]);

  const [deliveryTransactions] = useState<PropertyDelivery[]>([
    {
      propertyId: "1",
      finalPrice: 1400000000,
      remainingPayment: 1265400000, // Final price - deposit
      paymentDeadline: "2025-03-01T17:00:00",
      deliveryStatus: "Pending Payment"
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

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const timeLeft = end - now;

    if (timeLeft <= 0) return "Auction Ended";

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  };

  const hasDeposit = (propertyId: string) => {
    return depositTransactions.some(d => d.propertyId === propertyId && d.status === "Confirmed");
  };

  const hasBid = (propertyId: string) => {
    return bidSubmissions.some(b => b.propertyId === propertyId && b.status !== "Draft");
  };

  const handleDepositSubmit = async () => {
    if (!selectedProperty || !depositAmount) return;
    
    setIsLoading(true);
    
    try {
      console.log('💰 Processing deposit with ZK-powered EERC token minting...');
      
      const depositAmountInKRW = parseFloat(depositAmount);
      const eercMintAmount = depositAmountInKRW; // 입력한 KRW만큼 EERC 토큰 민팅 (1 KRW = 1 EERC)
      
      console.log(`🪙 Calling ZK Service via Go backend for ${eercMintAmount} tokens...`);
      console.log(`🔗 Flow: BidderPage → EERCService → Go Backend → ZK Service → 05_mint.ts`);
      
      // 1. 먼저 EERC 토큰 민팅 시도 (실패하면 여기서 에러 발생)
      const mintResult = await eercService.mintTokensToUser(eercMintAmount);
      
      if (!mintResult.success) {
        throw new Error(`EERC token minting failed: ${mintResult.error}`);
      }
      
      console.log(`✅ EERC mint successful, now creating deposit record...`);
      
      // 2. EERC 민팅이 성공한 경우에만 API 호출로 deposit 생성
      const deposit = await apiService.createDeposit(
        selectedProperty.id,
        currentUserId,
        depositAmountInKRW,
        "EERC20" // EERC 토큰으로 기록
      );
      
      // 3. EERC 밸런스 업데이트
      await loadEERCBalance();
      
      // 4. 새로운 deposit을 로컬 상태에 추가 (실제 EERC txHash 포함)
      const newDepositTransaction: DepositTransaction = {
        propertyId: deposit.property_id,
        amount: deposit.amount,
        tokenType: "EERC20" as "wKRW" | "EERC20",
        status: "Confirmed" as "Pending" | "Confirmed" | "Failed", // EERC 성공하면 Confirmed
        txHash: mintResult.txHash!, // 실제 EERC txHash 사용
        timestamp: deposit.created_at
      };
      
      setDepositTransactions(prev => [...prev, newDepositTransaction]);
      
      alert(`✅ Deposit successful via ZK Service!\n💰 Amount: ${formatPrice(depositAmountInKRW)}\n🪙 EERC Tokens Minted: ${eercMintAmount} ${eercSymbol}\n📝 Real Blockchain Transaction: ${mintResult.txHash}\n🔗 View on Explorer: https://testnet.avascan.info/blockchain/c/tx/${mintResult.txHash}\n\n🔧 Powered by: Go Backend → ZK Service → 05_mint.ts`);
      
      setDepositAmount("");
      setSelectedProperty(null);
    } catch (error) {
      console.error('❌ Failed to submit deposit:', error);
      
      // EERC 실패 시 구체적인 에러 메시지 제공
      let errorMessage = 'Deposit failed: ';
      if (error instanceof Error) {
        if (error.message.includes('UNPREDICTABLE_GAS_LIMIT')) {
          errorMessage = '❌ Contract execution failed\n\n' +
                        'This usually means:\n' +
                        '• Invalid ZK proof structure\n' +
                        '• User not properly registered\n' +
                        '• Auditor not set correctly\n\n' +
                        '💡 Use standalone test scripts for real minting';
        } else if (error.message.includes('execution reverted')) {
          errorMessage = '❌ Transaction rejected by contract\n\n' +
                        'Please verify all prerequisites are met.';
        } else if (error.message.includes('Failed to execute ZK mint')) {
          errorMessage = '❌ ZK Service Connection Failed\n\n' +
                        'Could not connect to ZK Service for minting.\n\n' +
                        '💡 Check:\n' +
                        '• ZK Service is running on port 3001\n' +
                        '• eerc-backend-converter is properly installed\n' +
                        '• Environment variables are set correctly\n\n' +
                        'Start ZK Service: cd zk-service && node server.js';
        } else if (error.message.includes('proper ZK proof generation')) {
          errorMessage = '⚠️ ZK Service Integration\n\n' +
                        'Now using Go Backend + ZK Service architecture.\n\n' +
                        '💡 Real flow:\n' +
                        '• Frontend → Go Backend → ZK Service → 05_mint.ts\n' +
                        '• Actual blockchain transactions via ZK circuits\n\n' +
                        'Check ZK Service status: curl http://localhost:3001/health';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBidSubmit = async () => {
    console.log('🔥 handleBidSubmit 함수 호출됨!');
    console.log('selectedProperty:', selectedProperty);
    console.log('bidAmount:', bidAmount);
    
    if (!selectedProperty || !bidAmount) {
      console.log('❌ selectedProperty 또는 bidAmount가 없음');
      return;
    }
    
    const bidValue = parseFloat(bidAmount);
    console.log('bidValue:', bidValue, 'minimumPrice:', selectedProperty.minimumPrice);
    
    if (bidValue < selectedProperty.minimumPrice) {
      console.log('❌ Bid amount가 minimum price보다 작음');
      alert("Bid amount must be at least the minimum price.");
      return;
    }
    
    console.log('hasDeposit 체크:', hasDeposit(selectedProperty.id));
    if (!hasDeposit(selectedProperty.id)) {
      console.log('❌ Deposit이 없음');
      alert("Please complete deposit payment before submitting a bid.");
      return;
    }

    // EERC 밸런스 체크
    const currentEERCBalance = parseFloat(eercBalance);
    const requiredEERCAmount = bidValue; // 1:1 비율로 변환
    
    console.log('EERC Balance Check:', {
      currentBalance: currentEERCBalance,
      requiredAmount: requiredEERCAmount,
      symbol: eercSymbol
    });
    
    if (currentEERCBalance < requiredEERCAmount) {
      alert(`Insufficient EERC balance. You have ${currentEERCBalance} ${eercSymbol}, but need ${requiredEERCAmount.toFixed(2)} ${eercSymbol}`);
      return;
    }
    
    console.log('✅ 모든 검증 통과, API 및 EERC 전송 시작');
    setIsLoading(true);
    
    try {
      console.log('🔄 Processing bid with ZK-powered EERC token transfer...');
      
      // 1. 먼저 EERC 토큰 전송 시도 (실패하면 여기서 에러 발생)
      console.log(`🔄 Calling ZK Service via Go backend for ${requiredEERCAmount} tokens transfer...`);
      console.log(`🔗 Flow: BidderPage → EERCService → Go Backend → ZK Service → 07_transfer.ts`);
      
      const transferResult = await eercService.transferTokensToAdmin(requiredEERCAmount);
      
      if (!transferResult.success) {
        throw new Error(`EERC token transfer failed: ${transferResult.error}`);
      }
      
      console.log(`✅ EERC transfer successful, now creating bid record...`);
      
      // 2. EERC 전송이 성공한 경우에만 API 호출로 bid 생성
      const encryptedData = `encrypted_bid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const bid = await apiService.createBid(
        selectedProperty.id,
        currentUserId,
        bidValue,
        true, // 항상 encrypted
        encryptedData
      );
      
      // 3. EERC 밸런스 업데이트
      await loadEERCBalance();
      
      // 4. 새로운 bid를 로컬 상태에 추가 (실제 EERC txHash 포함)
      const newBidSubmission: BidSubmission = {
        propertyId: bid.property_id,
        bidAmount: bid.amount,
        depositConfirmed: true,
        bidType: "Sealed", // 항상 encrypted/sealed
        submissionTime: bid.created_at,
        status: "Confirmed" as "Draft" | "Submitted" | "Confirmed" // EERC 성공하면 Confirmed
      };
      
      setBidSubmissions(prev => [...prev, newBidSubmission]);
      
      alert(`✅ Encrypted bid submitted via ZK Service!\n💰 Bid Amount: ${formatPrice(bidValue)}\n🔄 EERC Transferred: ${requiredEERCAmount.toFixed(2)} ${eercSymbol}\n📝 Real Blockchain Transaction: ${transferResult.txHash}\n🔗 View on Explorer: https://testnet.avascan.info/blockchain/c/tx/${transferResult.txHash}\n\n🔧 Powered by: Go Backend → ZK Service → 07_transfer.ts`);
      
      setBidAmount("");
      setSelectedProperty(null);
    } catch (error) {
      console.error('❌ Failed to submit bid:', error);
      
      // EERC 실패 시 구체적인 에러 메시지 제공
      let errorMessage = 'Bid submission failed: ';
      if (error instanceof Error) {
        if (error.message.includes('UNPREDICTABLE_GAS_LIMIT')) {
          errorMessage = '❌ Contract execution failed\n\n' +
                        'This usually means:\n' +
                        '• Invalid ZK proof structure\n' +
                        '• User not properly registered\n' +
                        '• Auditor not set correctly\n\n' +
                        '💡 Use standalone test scripts for real transfers';
        } else if (error.message.includes('execution reverted')) {
          errorMessage = '❌ Transaction rejected by contract\n\n' +
                        'Please verify all prerequisites are met.';
        } else if (error.message.includes('proper ZK proof generation')) {
          errorMessage = '⚠️ ZK Proof Generation Required\n\n' +
                        'Real EERC transfers require proper zero-knowledge proof generation.\n\n' +
                        '💡 For testing:\n' +
                        '• Use standalone transfer script: 07_transfer.ts\n' +
                        '• Or implement privateTransfer() helper\n\n' +
                        'Current implementation prevents invalid contract calls.';
        } else if (error.message.includes('Insufficient balance')) {
          errorMessage = '💰 Insufficient EERC Balance\n\n' + error.message;
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error occurred';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentAmount) return;
    
    setIsLoading(true);
    
    // Simulate final payment
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    alert(`Final payment of ${formatPrice(parseFloat(paymentAmount))} confirmed! Property delivery will be scheduled within 7 business days.`);
    
    setPaymentAmount("");
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="avax-heading text-4xl mb-4">
          Bidder Portal
        </h1>
        <p className="avax-body text-lg max-w-4xl mx-auto">
          Browse auction properties, deposit bid guarantees, submit encrypted bids, and complete property purchases 
          through secure EERC20 token transactions on the Avalanche blockchain.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="avax-card">
        <div className="border-b border-avax-border">
          <nav className="flex space-x-1 p-1">
            {[
              { key: "browse", label: "Browse Properties" },
              { key: "deposit", label: "Deposit Management" },
              { key: "bid", label: "Submit Bids" },
              { key: "payment", label: "Final Payment" },
              { key: "history", label: "Transaction History" }
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
          {/* Browse Properties Tab */}
          {activeTab === "browse" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="avax-subheading text-2xl">Available Auction Properties</h2>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-erea-text-light">API:</span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${isApiConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className={`font-semibold ${isApiConnected ? 'text-green-600' : 'text-red-600'}`}>
                        {isApiConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-erea-text-light">EERC:</span>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${isEERCConnected ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}></div>
                      <span className={`font-semibold ${isEERCConnected ? 'text-blue-600' : 'text-red-600'}`}>
                        {isEERCConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Loading State */}
              {isLoading && availableProperties.length === 0 && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-erea-primary mx-auto mb-4"></div>
                  <p className="text-erea-text-light">Loading auction properties...</p>
                </div>
              )}
              
              {/* Empty State */}
              {!isLoading && availableProperties.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-lg font-semibold text-erea-text mb-2">No Properties Available</h3>
                  <p className="text-erea-text-light">
                    {isApiConnected 
                      ? "No auction properties are currently available. Please check back later."
                      : "Unable to load properties. Please check your connection and try again."
                    }
                  </p>
                  {!isApiConnected && (
                    <button
                      onClick={initializeApiConnection}
                      className="avax-button-outline mt-4"
                    >
                      Retry Connection
                    </button>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableProperties.map((property) => (
                  <div key={property.id} className="avax-card overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-avax-gray/20 overflow-hidden">
                      <img 
                        src={property.imageUrl} 
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-avax-gray/20">
                              <div class="text-center">
                                <div class="text-4xl mb-2">🏠</div>
                                <span class="text-erea-text-light text-sm">Property Image</span>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="avax-subheading text-base leading-tight mb-1">{property.title}</h3>
                          <p className="text-erea-text-light text-sm">{property.type} • {property.area}㎡</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          property.status === "Active" ? "bg-avax-success text-white" :
                          property.status === "Pending" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="avax-body text-sm text-avax-gray">Minimum Price:</span>
                          <span className="font-bold text-erea-primary">{formatPrice(property.minimumPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="avax-body text-sm text-avax-gray">Bid Deposit:</span>
                          <span className="font-semibold text-avax-red">{formatPrice(property.bidDeposit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="avax-body text-sm text-avax-gray">Auction Date:</span>
                          <span className="font-semibold">{new Date(property.auctionDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="bg-avax-light p-3 rounded mb-4 text-center">
                        <span className="text-sm text-avax-gray">Time Remaining: </span>
                        <span className="font-semibold text-avax-red">{getTimeRemaining(property.auctionDate)}</span>
                      </div>

                      <div className="space-y-2">
                        {hasDeposit(property.id) ? (
                          <div className="flex items-center space-x-2 text-sm text-avax-success">
                            <span>✓</span>
                            <span>Deposit Confirmed</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setActiveTab("deposit");
                            }}
                            className="w-full avax-button-primary"
                            disabled={property.status !== "Active"}
                          >
                            Pay Deposit
                          </button>
                        )}
                        
                        {hasBid(property.id) ? (
                          <div className="flex items-center space-x-2 text-sm text-erea-primary">
                            <span>📝</span>
                            <span>Bid Submitted</span>
                          </div>
                        ) : hasDeposit(property.id) ? (
                          <button
                            onClick={() => {
                              setSelectedProperty(property);
                              setActiveTab("bid");
                            }}
                            className="w-full avax-button-secondary"
                          >
                            Submit Bid
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full avax-button-outline opacity-50"
                          >
                            Deposit Required
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deposit Management Tab */}
          {activeTab === "deposit" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Bid Deposit Management</h2>
              
              <div className="avax-card p-6 bg-blue-50 border-l-4 border-erea-primary">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">💰</span>
                  How Deposits Work
                </h3>
                <p className="avax-body text-sm">
                  Deposit 10% of the property's minimum price using wKRW tokens. You'll receive equivalent EERC20 tokens 
                  that can be used for bidding. If you don't win the auction, your deposit is automatically refunded.
                </p>
              </div>

              {selectedProperty ? (
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">
                    Deposit for: {selectedProperty.title}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="avax-body">Required Deposit:</span>
                        <span className="font-bold text-erea-primary">{formatPrice(selectedProperty.bidDeposit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="avax-body">Minimum Bid:</span>
                        <span className="font-semibold">{formatPrice(selectedProperty.minimumPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="avax-body">Auction Date:</span>
                        <span className="font-semibold">{new Date(selectedProperty.auctionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="avax-card p-4 bg-avax-light">
                      <h4 className="avax-subheading text-sm mb-3">Token Exchange</h4>
                      <div className="text-center">
                        <div className="text-lg font-bold text-erea-primary">{formatPrice(selectedProperty.bidDeposit)}</div>
                        <div className="text-sm text-erea-text-light">wKRW → EERC20</div>
                        <div className="text-xs text-erea-text-light mt-2">1:1 Exchange Rate</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block avax-subheading text-sm mb-2">Deposit Amount (KRW)</label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder={selectedProperty.bidDeposit.toString()}
                        className="avax-input w-full"
                        min={selectedProperty.bidDeposit}
                        step="1000000"
                        required
                      />
                      <p className="text-xs text-erea-text-light mt-1">
                        Minimum required: {formatPrice(selectedProperty.bidDeposit)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setDepositAmount(selectedProperty.bidDeposit.toString())}
                        className="avax-button-outline flex-1"
                      >
                        Use Minimum Amount
                      </button>
                      <button
                        onClick={handleDepositSubmit}
                        disabled={isLoading || !depositAmount || parseFloat(depositAmount) < selectedProperty.bidDeposit}
                        className="avax-button-primary flex-1"
                      >
                        {isLoading ? "Processing..." : "Submit Deposit"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="avax-card p-6 text-center">
                  <p className="avax-body text-erea-text-light">
                    Select a property from the Browse Properties tab to manage deposits.
                  </p>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="avax-button-outline mt-4"
                  >
                    Browse Properties
                  </button>
                </div>
              )}

              {/* Deposit History */}
              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4">Deposit History</h3>
                {depositTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {depositTransactions.map((deposit, index) => {
                      const property = availableProperties.find(p => p.id === deposit.propertyId);
                      return (
                        <div key={index} className="border border-avax-border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{property?.title || "Unknown Property"}</h4>
                              <p className="text-sm text-erea-text-light">
                                {formatPrice(deposit.amount)} {deposit.tokenType} → EERC20
                              </p>
                              <p className="text-xs text-erea-text-light">
                                {new Date(deposit.timestamp).toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                deposit.status === "Confirmed" ? "bg-avax-success text-white" :
                                deposit.status === "Pending" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                              }`}>
                                {deposit.status}
                              </span>
                              {deposit.txHash && (
                                <a 
                                  href={`https://testnet.avascan.info/blockchain/c/tx/${deposit.txHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-erea-primary hover:text-erea-secondary mt-1 font-mono block underline"
                                >
                                  {deposit.txHash}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-erea-text-light text-center">No deposits made yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Submit Bids Tab */}
          {activeTab === "bid" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Submit Encrypted Bids</h2>
              
              <div className="avax-card p-6 bg-purple-50 border-l-4 border-erea-secondary">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">🔒</span>
                  Encrypted Bidding Process
                </h3>
                <p className="avax-body text-sm">
                  All bids are encrypted using EERC technology and remain sealed until the auction deadline. 
                  You can only bid on properties where you've made the required deposit.
                </p>
              </div>

              {selectedProperty ? (
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">
                    Submit Bid for: {selectedProperty.title}
                  </h3>
                  
                  {hasDeposit(selectedProperty.id) ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="avax-body">Minimum Bid:</span>
                            <span className="font-bold text-erea-primary">{formatPrice(selectedProperty.minimumPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="avax-body">Your Deposit:</span>
                            <span className="font-semibold text-avax-success">✓ Confirmed</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="avax-body">Bidding Deadline:</span>
                            <span className="font-semibold text-avax-red">{getTimeRemaining(selectedProperty.auctionDate)}</span>
                          </div>
                        </div>
                        
                        <div className="avax-card p-4 bg-avax-light">
                          <h4 className="avax-subheading text-sm mb-3">Available EERC Balance</h4>
                          <div className="text-center">
                            <div className="text-lg font-bold text-erea-primary">
                              {eercBalance} {eercSymbol}
                            </div>
                            <div className="text-sm text-erea-text-light">
                              Encrypted Private Tokens
                              {isEERCConnected ? (
                                <span className="ml-2 text-green-600">🔗 Connected</span>
                              ) : (
                                <span className="ml-2 text-red-600">❌ Disconnected</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={loadEERCBalance}
                            className="mt-2 text-xs text-erea-primary hover:text-erea-secondary"
                          >
                            🔄 Refresh Balance
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block avax-subheading text-sm mb-2">Bid Amount (KRW)</label>
                          <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={selectedProperty.minimumPrice.toString()}
                            className="avax-input w-full"
                            min={selectedProperty.minimumPrice}
                            step="1000000"
                            required
                          />
                          <div className="mt-1 space-y-1">
                            <p className="text-xs text-erea-text-light">
                              Minimum bid: {formatPrice(selectedProperty.minimumPrice)}
                            </p>
                            {bidAmount && (
                              <p className="text-xs text-erea-primary font-semibold">
                                🔄 EERC Required: {parseFloat(bidAmount).toFixed(2)} {eercSymbol}
                              </p>
                            )}
                            <p className="text-xs text-erea-text-light">
                              💰 Your EERC Balance: {eercBalance} {eercSymbol}
                            </p>
                          </div>
                        </div>
                        
                        <div className="avax-card p-4 bg-amber-50 border border-avax-warning">
                          <h4 className="avax-subheading text-sm mb-2">🔒 Encrypted Bidding Notice</h4>
                          <ul className="text-xs text-erea-text space-y-1">
                            <li>• All bids are automatically encrypted and sealed for privacy</li>
                            <li>• Encrypted bids cannot be changed after submission</li>
                            <li>• Your bid amount must not exceed your available EERC20 balance</li>
                            <li>• If you win, the remaining amount must be paid within 7 days</li>
                            <li>• Deposits are automatically refunded if you don't win</li>
                          </ul>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button
                            onClick={() => {
                              setSelectedProperty(null);
                              setBidAmount("");
                            }}
                            className="avax-button-outline flex-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              console.log('🎯 Submit Encrypted Bid 버튼 클릭됨!');
                              console.log('Button disabled 상태:', isLoading || !bidAmount || (selectedProperty && parseFloat(bidAmount) < selectedProperty.minimumPrice));
                              console.log('isLoading:', isLoading);
                              console.log('bidAmount:', bidAmount);
                              console.log('selectedProperty:', selectedProperty);
                              if (selectedProperty) {
                                console.log('bidAmount 파싱값:', parseFloat(bidAmount));
                                console.log('minimumPrice:', selectedProperty.minimumPrice);
                                console.log('bidAmount < minimumPrice:', parseFloat(bidAmount) < selectedProperty.minimumPrice);
                              }
                              handleBidSubmit();
                            }}
                            disabled={isLoading || !bidAmount || (selectedProperty && parseFloat(bidAmount) < selectedProperty.minimumPrice)}
                            className="avax-button-primary flex-1"
                          >
                            {isLoading ? "Submitting..." : "Submit Encrypted Bid"}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <p className="avax-body text-erea-text-light mb-4">
                        You must make a deposit before submitting a bid for this property.
                      </p>
                      <button
                        onClick={() => setActiveTab("deposit")}
                        className="avax-button-primary"
                      >
                        Make Deposit
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">Properties Available for Bidding</h3>
                  <div className="space-y-3">
                    {availableProperties.filter(p => hasDeposit(p.id)).map(property => (
                      <div key={property.id} className="border border-avax-border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{property.title}</h4>
                          <p className="text-sm text-erea-text-light">
                            Minimum: {formatPrice(property.minimumPrice)} • 
                            Deadline: {getTimeRemaining(property.auctionDate)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {hasBid(property.id) ? (
                            <span className="px-3 py-1 text-xs bg-erea-primary text-white rounded-full">
                              Bid Submitted
                            </span>
                          ) : (
                            <button
                              onClick={() => setSelectedProperty(property)}
                              className="avax-button-outline text-sm px-4 py-2"
                            >
                              Submit Bid
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {availableProperties.filter(p => hasDeposit(p.id)).length === 0 && (
                      <p className="text-erea-text-light text-center">
                        No properties available for bidding. Make deposits first.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Final Payment & Property Delivery</h2>
              
              <div className="avax-card p-6 bg-green-50 border-l-4 border-avax-success">
                <h3 className="avax-subheading text-lg mb-2 flex items-center">
                  <span className="mr-2">🎉</span>
                  Congratulations!
                </h3>
                <p className="avax-body text-sm">
                  Complete your final payment to secure property ownership. The remaining balance must be paid 
                  within the specified deadline to complete the transaction.
                </p>
              </div>

              {deliveryTransactions.length > 0 ? (
                <div className="space-y-4">
                  {deliveryTransactions.map((delivery, index) => {
                    const property = availableProperties.find(p => p.id === delivery.propertyId);
                    return (
                      <div key={index} className="avax-card p-6">
                        <h3 className="avax-subheading text-lg mb-4">
                          Final Payment: {property?.title}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="avax-body">Winning Bid:</span>
                              <span className="font-bold text-erea-primary">{formatPrice(delivery.finalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="avax-body">Deposit Paid:</span>
                              <span className="font-semibold text-avax-success">
                                -{formatPrice(delivery.finalPrice - delivery.remainingPayment)}
                              </span>
                            </div>
                            <div className="flex justify-between border-t border-avax-border pt-2">
                              <span className="avax-body font-semibold">Remaining Balance:</span>
                              <span className="font-bold text-avax-red">{formatPrice(delivery.remainingPayment)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="avax-body">Payment Deadline:</span>
                              <span className="font-semibold text-avax-warning">
                                {new Date(delivery.paymentDeadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="avax-card p-4 bg-avax-light">
                            <h4 className="avax-subheading text-sm mb-3">Delivery Status</h4>
                            <div className="text-center">
                              <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                                delivery.deliveryStatus === "Pending Payment" ? "bg-avax-warning text-white" :
                                delivery.deliveryStatus === "Payment Confirmed" ? "bg-avax-success text-white" :
                                delivery.deliveryStatus === "Delivery Scheduled" ? "bg-erea-primary text-white" :
                                "bg-avax-success text-white"
                              }`}>
                                {delivery.deliveryStatus}
                              </span>
                              {delivery.deliveryDate && (
                                <div className="text-sm text-erea-text-light mt-2">
                                  Delivery: {new Date(delivery.deliveryDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {delivery.deliveryStatus === "Pending Payment" && (
                          <div className="space-y-4">
                            <div>
                              <label className="block avax-subheading text-sm mb-2">Payment Amount (KRW)</label>
                              <input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                placeholder={delivery.remainingPayment.toString()}
                                className="avax-input w-full"
                                min={delivery.remainingPayment}
                                step="1000000"
                                required
                              />
                              <p className="text-xs text-erea-text-light mt-1">
                                Required amount: {formatPrice(delivery.remainingPayment)}
                              </p>
                            </div>
                            
                            <div className="avax-card p-4 bg-amber-50 border border-avax-warning">
                              <h4 className="avax-subheading text-sm mb-2">Payment Instructions</h4>
                              <ul className="text-xs text-erea-text space-y-1">
                                <li>• Payment must be made in wKRW or EERC20 tokens</li>
                                <li>• Property ownership transfer will begin after payment confirmation</li>
                                <li>• Delivery typically occurs within 7 business days</li>
                                <li>• All fees and taxes are included in the final amount</li>
                              </ul>
                            </div>
                            
                            <div className="flex space-x-4">
                              <button
                                onClick={() => setPaymentAmount(delivery.remainingPayment.toString())}
                                className="avax-button-outline flex-1"
                              >
                                Use Full Amount
                              </button>
                              <button
                                onClick={handlePaymentSubmit}
                                disabled={isLoading || !paymentAmount || parseFloat(paymentAmount) < delivery.remainingPayment}
                                className="avax-button-primary flex-1"
                              >
                                {isLoading ? "Processing..." : "Submit Payment"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="avax-card p-6 text-center">
                  <p className="avax-body text-erea-text-light">
                    No winning bids requiring payment at this time.
                  </p>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="avax-button-outline mt-4"
                  >
                    Browse More Properties
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Transaction History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Transaction History</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-erea-primary">{depositTransactions.length}</div>
                  <div className="text-erea-text-light font-semibold">Deposits Made</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-success">{bidSubmissions.length}</div>
                  <div className="text-erea-text-light font-semibold">Bids Submitted</div>
                </div>
                <div className="avax-card p-6 text-center">
                  <div className="text-3xl font-bold text-avax-accent">{deliveryTransactions.length}</div>
                  <div className="text-erea-text-light font-semibold">Properties Won</div>
                </div>
              </div>

              {/* All Transactions */}
              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4">All Transactions</h3>
                <div className="space-y-4">
                  {/* Deposits */}
                  {depositTransactions.map((deposit, index) => {
                    const property = availableProperties.find(p => p.id === deposit.propertyId);
                    return (
                      <div key={`deposit-${index}`} className="border border-avax-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-erea-primary text-white rounded-full flex items-center justify-center font-bold">
                              💰
                            </div>
                            <div>
                              <h4 className="font-semibold">Deposit Payment</h4>
                              <p className="text-sm text-erea-text-light">{property?.title}</p>
                              <p className="text-xs text-erea-text-light">
                                {new Date(deposit.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-erea-primary">{formatPrice(deposit.amount)}</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              deposit.status === "Confirmed" ? "bg-avax-success text-white" :
                              deposit.status === "Pending" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                            }`}>
                              {deposit.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Bids */}
                  {bidSubmissions.map((bid, index) => {
                    const property = availableProperties.find(p => p.id === bid.propertyId);
                    return (
                      <div key={`bid-${index}`} className="border border-avax-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-avax-success text-white rounded-full flex items-center justify-center font-bold">
                              📝
                            </div>
                            <div>
                              <h4 className="font-semibold">{bid.bidType} Bid</h4>
                              <p className="text-sm text-erea-text-light">{property?.title}</p>
                              <p className="text-xs text-erea-text-light">
                                {new Date(bid.submissionTime).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-erea-primary">{formatPrice(bid.bidAmount)}</div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              bid.status === "Submitted" ? "bg-avax-success text-white" :
                              bid.status === "Confirmed" ? "bg-erea-primary text-white" : "bg-avax-warning text-white"
                            }`}>
                              {bid.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {depositTransactions.length === 0 && bidSubmissions.length === 0 && (
                    <p className="text-erea-text-light text-center">No transactions yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EERC System Status */}
      {contractAddresses && isEERCConnected && (
        <div className={`avax-card p-6 border-l-4 ${
          systemStatus.userRegistered && systemStatus.auditorSet 
            ? 'bg-green-50 border-avax-success' 
            : 'bg-yellow-50 border-avax-warning'
        }`}>
          <h3 className="avax-subheading text-lg mb-3 flex items-center">
            <span className="mr-2">🏗️</span>
            EERC System Status
          </h3>
          
          {/* System Requirements Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${systemStatus.userRegistered ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-semibold">
                User {systemStatus.userRegistered ? 'Registered' : 'Not Registered'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${systemStatus.auditorSet ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-semibold">
                Auditor {systemStatus.auditorSet ? 'Set' : 'Not Set'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`w-3 h-3 rounded-full ${systemStatus.contractsLoaded ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm font-semibold">
                Contracts {systemStatus.contractsLoaded ? 'Loaded' : 'Not Loaded'}
              </span>
            </div>
          </div>

          {/* Status Message */}
          {(!systemStatus.userRegistered || !systemStatus.auditorSet) ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              <div className="flex">
                <div className="py-1">
                  <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">EERC Prerequisites Required</p>
                  <p className="text-sm">
                    {!systemStatus.userRegistered && "• User registration required for minting/transfers"}
                    {!systemStatus.auditorSet && "• Auditor must be set for contract operations"}
                  </p>
                  <p className="text-sm mt-1 font-semibold">
                    Real transactions are disabled. Using validated simulation mode.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <div className="flex">
                <div className="py-1">
                  <svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold">EERC System Ready</p>
                  <p className="text-sm">
                    ✅ User is registered and auditor is set
                  </p>
                  <p className="text-sm mt-1 font-semibold">
                    Real blockchain transactions are enabled!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Contract Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-erea-text">EncryptedERC Contract:</span>
              <p className="font-mono text-xs text-erea-text-light break-all mt-1">
                {contractAddresses.encryptedERC}
              </p>
            </div>
            <div>
              <span className="font-semibold text-erea-text">Registrar Contract:</span>
              <p className="font-mono text-xs text-erea-text-light break-all mt-1">
                {contractAddresses.registrar}
              </p>
            </div>
          </div>
          
          {/* User and Network Info */}
          <div className="mt-3 flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="font-semibold">Token: {eercSymbol}</span>
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="font-semibold">Network: Fuji Testnet</span>
            </span>
            {systemStatus.userAddress && (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <span className="font-semibold font-mono text-xs">
                  User: {systemStatus.userAddress.slice(0, 6)}...{systemStatus.userAddress.slice(-4)}
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="avax-card p-6 bg-blue-50 border-l-4 border-erea-primary">
        <h3 className="avax-subheading text-lg mb-2 flex items-center">
          <span className="mr-2">🔐</span>
          Security & Privacy
        </h3>
        <p className="avax-body">
          All transactions are secured using Avalanche blockchain technology with EERC encryption. 
          Your bid amounts and personal information are protected while maintaining complete 
          transparency of the auction process for regulatory compliance.
        </p>
      </div>
    </div>
  );
}
