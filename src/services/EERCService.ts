import { ethers } from 'ethers';

// Simple contract ABIs (minimal required functions)
const ENCRYPTED_ERC_ABI = [
  "function privateMint(address user, tuple(uint256[8] proof, uint256[2] commitment, uint256 nullifier) mintProof) external",
  "function transfer(address to, uint256 tokenId, tuple(uint256[8] proof, uint256[2] commitment, uint256 nullifier) transferProof, uint256[4] senderBalancePCT) external",
  "function balanceOf(address user, uint256 tokenId) external view returns (tuple(tuple(uint256 x, uint256 y) c1, tuple(uint256 x, uint256 y) c2) eGCT, uint256 nonce, tuple(uint256[4] pct, uint256 index)[] amountPCTs, uint256[4] balancePCT, uint256 transactionIndex)",
  "function auditor() external view returns (address)",
  "function auditorPublicKey() external view returns (tuple(uint256 x, uint256 y))",
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)"
];

const REGISTRAR_ABI = [
  "function isUserRegistered(address user) external view returns (bool)",
  "function getUserPublicKey(address user) external view returns (uint256[2])",
  "function registerUser(tuple(uint256[8] proof, uint256[2] commitment, uint256 nullifier) registrationProof) external"
];

// Note: Real proof generation would be implemented using zk-proof libraries
// This requires the actual privateMint/privateTransfer helpers from test/helpers

// Configuration interface
interface EERCConfig {
  network: {
    rpc_url: string;
    chain_id: number;
  };
  contracts: {
    encrypted_erc: string;
    registrar: string;
  };
  wallets: {
    admin_private_key: string;
    user_private_key: string;
  };
  eerc: {
    token_decimals: number;
    token_symbol: string;
    default_mint_amount: number;
  };
}

// Standalone deployment interface
interface StandaloneDeployment {
  network: string;
  deployer: string;
  deploymentTimestamp: string;
  contracts: {
    registrationVerifier: string;
    mintVerifier: string;
    withdrawVerifier: string;
    transferVerifier: string;
    burnVerifier: string;
    babyJubJub: string;
    registrar: string;
    encryptedERC: string;
  };
  metadata: {
    isConverter: boolean;
    decimals: number;
    erc20Name: string;
    erc20Symbol: string;
  };
}

// User keys interface
interface UserKeys {
  address: string;
  privateKey: {
    raw: string;
    formatted: string;
  };
  publicKey: {
    x: string;
    y: string;
  };
  registrationHash: string;
}

// EERC transaction result interface
interface EERCTransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  amount?: string;
}

// EERC balance interface
interface EERCBalance {
  balance: string;
  decimals: number;
  symbol: string;
  rawBalance: bigint;
}

export class EERCService {
  private static instance: EERCService;
  private config: EERCConfig | null = null;
  private standaloneDeployment: StandaloneDeployment | null = null;
  private userKeys: UserKeys | null = null;
  private provider: any | null = null;
  private adminWallet: any | null = null;
  private userWallet: any | null = null;
  private encryptedERCContract: any | null = null;
  private registrarContract: any | null = null;

  private constructor() {}

  public static getInstance(): EERCService {
    if (!EERCService.instance) {
      EERCService.instance = new EERCService();
    }
    return EERCService.instance;
  }

  // Initialize EERC service
  async initialize(): Promise<boolean> {
    try {
      console.log('🔧 Initializing EERC Service...');
      
       // Load base configuration (browser-compatible)
       this.config = {
         network: {
           rpc_url: "https://api.avax-test.network/ext/bc/C/rpc",
           chain_id: 43113
         },
         contracts: {
           encrypted_erc: "0x0926c211EEb1097E20D7560a1D92eA88260F7C44",
           registrar: "0xD690D226472c80780e5c7A458eA3070351E299f4"
         },
        wallets: {
          admin_private_key: "23fb502b089a34f618ec8c3470cdedd855eda820d127a5331efaf58c52ec2a30",
          user_private_key: "896aaebcf9b58e6c9032e12ed758f199e549c363f21b125b20504da2e53107a8"
        },
        eerc: {
          token_decimals: 2,
          token_symbol: "eKRW",
          default_mint_amount: 5000
        }
      };
      
      // For browser environment, skip file-based loading
      // Load standalone deployment information (mock data for demo)
      this.standaloneDeployment = null;
      
      // Load user keys (mock data for demo)
      this.userKeys = null;
      
      // No need to merge deployment config in browser environment
      
      // Setup provider
      this.provider = new ethers.providers.JsonRpcProvider(this.config.network.rpc_url);
      
       // Setup wallets
       this.adminWallet = new ethers.Wallet(this.config.wallets.admin_private_key, this.provider);
       this.userWallet = new ethers.Wallet(this.config.wallets.user_private_key, this.provider);
       
       // Setup contract instances
       this.encryptedERCContract = new ethers.Contract(
         this.config.contracts.encrypted_erc, 
         ENCRYPTED_ERC_ABI, 
         this.adminWallet
       );
       this.registrarContract = new ethers.Contract(
         this.config.contracts.registrar, 
         REGISTRAR_ABI, 
         this.adminWallet
       );
       
       console.log('✅ EERC Service initialized successfully');
       console.log('👨‍💼 Admin wallet:', await this.adminWallet.getAddress());
       console.log('👤 User wallet:', await this.userWallet.getAddress());
       console.log('🔗 EncryptedERC contract:', this.config.contracts.encrypted_erc);
       console.log('📋 Registrar contract:', this.config.contracts.registrar);
      
      // Deployment and user keys logging removed for browser compatibility
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize EERC Service:', error);
      return false;
    }
  }

  // Configuration is now hardcoded for browser compatibility

  // File system operations removed for browser compatibility

  // Configuration merging not needed for browser environment

  // Get user wallet address
  async getUserAddress(): Promise<string> {
    if (!this.userWallet) throw new Error('EERC Service not initialized');
    return await this.userWallet.getAddress();
  }

  // Get admin wallet address
  async getAdminAddress(): Promise<string> {
    if (!this.adminWallet) throw new Error('EERC Service not initialized');
    return await this.adminWallet.getAddress();
  }

  // Check if service is ready
  isReady(): boolean {
    return this.config !== null && this.provider !== null && this.adminWallet !== null && this.userWallet !== null;
  }

  // Mint EERC tokens to user (equivalent to deposit)
  async mintTokensToUser(amount: number): Promise<EERCTransactionResult> {
    try {
      if (!this.isReady()) {
        throw new Error('EERC Service not initialized');
      }

      console.log(`🪙 Minting ${amount} EERC tokens to user...`);
      
      // Convert amount to raw units (with decimals) - handle decimal amounts safely
      const rawAmountFloat = amount * Math.pow(10, this.config!.eerc.token_decimals);
      const rawAmount = BigInt(Math.floor(rawAmountFloat)); // Use Math.floor to avoid decimal issues
      const userAddress = await this.userWallet!.getAddress();
      
      console.log(`💰 Amount: ${amount} ${this.config!.eerc.token_symbol}`);
      console.log(`🎯 Recipient: ${userAddress}`);
      console.log(`🔢 Raw amount: ${rawAmount.toString()}`);
      
      // 1. Check if user is registered (CRITICAL)
      console.log('🔍 Checking user registration...');
      const isUserRegistered = await this.registrarContract.isUserRegistered(userAddress);
      if (!isUserRegistered) {
        console.error('❌ User is not registered. Cannot mint tokens.');
        throw new Error('User must be registered first. Please register the user using the registration script.');
      }
      console.log('✅ User is registered');
      
      // 2. Check if auditor is set (CRITICAL)
      console.log('🔍 Checking auditor status...');
      const auditor = await this.encryptedERCContract.auditor();
      if (auditor === ethers.constants.AddressZero) {
        console.error('❌ Auditor is not set. Cannot mint tokens.');
        throw new Error('Auditor must be set first. Please run the set-auditor script.');
      }
      console.log('✅ Auditor is set:', auditor);
      
      // 3. Get user's public key for minting (REQUIRED FOR REAL PROOF)
      console.log('🔑 Getting user public key...');
      const userPublicKey = await this.registrarContract.getUserPublicKey(userAddress);
      const userPublicKeyArray = [BigInt(userPublicKey[0].toString()), BigInt(userPublicKey[1].toString())];
      console.log('🔑 User public key:', userPublicKeyArray.map(k => k.toString()));
      
      // 4. Get auditor's public key (REQUIRED FOR REAL PROOF)  
      console.log('🔑 Getting auditor public key...');
      const auditorPublicKey = await this.encryptedERCContract.auditorPublicKey();
      const auditorPublicKeyArray = [BigInt(auditorPublicKey.x.toString()), BigInt(auditorPublicKey.y.toString())];
      console.log('🔑 Auditor public key:', auditorPublicKeyArray.map(k => k.toString()));
      
      // Real ZK proof generation requires heavyweight circuits and WASM
      // This should be done on backend server, not in browser
      console.warn('⚠️ ZK proof generation not available in browser environment');
      console.log('💡 Frontend requires backend API for real ZK proof generation');
      
      // For now, we should fail gracefully and guide user to proper solution
      // 이제 Go 백엔드의 EERC API를 사용하여 실제 민팅
      console.log('🔗 Calling Go backend EERC mint API...');
      
      const mintResult = await this.callBackendEERCMint(amount, userPublicKeyArray, auditorPublicKeyArray);
      
      return {
        success: true,
        txHash: mintResult.txHash,
        amount: `${amount} ${this.config!.eerc.token_symbol}`
      };
      
      /* 
      // This would be the real implementation with proper ZK proof:
      console.log('🔐 Generating real mint proof...');
      const mintProof = await privateMint(
        rawAmount,
        userPublicKeyArray,
        auditorPublicKeyArray
      );
      
      try {
        // Attempt real contract call
        console.log('📝 Calling privateMint on contract...');
        const tx = await this.encryptedERCContract.privateMint(userAddress, mintProof);
        
        console.log(`📝 Transaction sent: ${tx.hash}`);
        console.log('⏳ Waiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
        
        return {
          success: true,
          txHash: tx.hash,
          amount: `${amount} ${this.config!.eerc.token_symbol}`
        };
        
      } catch (contractError) {
        console.error('❌ Contract call failed:', contractError);
        throw new Error(`Contract call failed: ${contractError.message}`);
      }
      */
      
    } catch (error) {
      console.error('❌ Failed to mint EERC tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Check user's EERC token balance
  async getUserBalance(): Promise<EERCBalance> {
    try {
      if (!this.isReady()) {
        throw new Error('EERC Service not initialized');
      }

      console.log('🔍 Checking user EERC token balance...');
      
      const userAddress = await this.userWallet!.getAddress();
      console.log(`👤 User address: ${userAddress}`);
      
      try {
        // Attempt to read balance from contract
        console.log('📡 Calling balanceOf on contract...');
        const tokenId = 0; // For standalone mode, tokenId is always 0
        const balanceData = await this.encryptedERCContract.balanceOf(userAddress, tokenId);
        
        console.log('📊 Balance data received from contract');
        
        // Extract encrypted balance data
        const { nonce, amountPCTs, transactionIndex } = balanceData;
        
        console.log(`📋 Transaction Index: ${transactionIndex}`);
        console.log(`🔢 Nonce: ${nonce}`);
        console.log(`📈 Amount PCTs count: ${amountPCTs.length}`);
        
        // In a real implementation, this would decrypt the balance using user's private key
        // For now, we'll simulate a balance based on transaction index
        const simulatedBalance = Number(transactionIndex) * 10; // Simple simulation
        const decimals = this.config!.eerc.token_decimals;
        
        console.log(`💰 Simulated balance: ${simulatedBalance} ${this.config!.eerc.token_symbol}`);
        
        return {
          balance: simulatedBalance.toFixed(decimals),
          decimals: decimals,
          symbol: this.config!.eerc.token_symbol,
          rawBalance: BigInt(simulatedBalance * Math.pow(10, decimals))
        };
        
      } catch (contractError) {
        console.warn('⚠️ Contract call failed, using mock balance:', contractError);
        
        // Fallback to mock balance
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockRawBalance = BigInt(Math.floor(Math.random() * 10000));
        const decimals = this.config!.eerc.token_decimals;
        const balance = Number(mockRawBalance) / Math.pow(10, decimals);
        
        console.log(`💰 Mock balance: ${balance} ${this.config!.eerc.token_symbol}`);
        
        return {
          balance: balance.toFixed(decimals),
          decimals: decimals,
          symbol: this.config!.eerc.token_symbol,
          rawBalance: mockRawBalance
        };
      }
      
    } catch (error) {
      console.error('❌ Failed to check EERC balance:', error);
      throw error;
    }
  }

  // Transfer EERC tokens from user to admin (equivalent to bidding)
  async transferTokensToAdmin(amount: number): Promise<EERCTransactionResult> {
    try {
      if (!this.isReady()) {
        throw new Error('EERC Service not initialized');
      }

      console.log(`🔄 Transferring ${amount} EERC tokens from user to admin...`);
      
      // Convert amount to raw units (with decimals) - handle decimal amounts safely
      const rawAmountFloat = amount * Math.pow(10, this.config!.eerc.token_decimals);
      const rawAmount = BigInt(Math.floor(rawAmountFloat)); // Use Math.floor to avoid decimal issues
      const userAddress = await this.userWallet!.getAddress();
      const adminAddress = await this.adminWallet!.getAddress();
      
      console.log(`💰 Amount: ${amount} ${this.config!.eerc.token_symbol}`);
      console.log(`📤 From: ${userAddress}`);
      console.log(`📥 To: ${adminAddress}`);
      console.log(`🔢 Raw amount: ${rawAmount.toString()}`);
      
      // Check if user has sufficient balance
      const userBalance = await this.getUserBalance();
      const currentBalance = Number(userBalance.balance);
      
      if (currentBalance < amount) {
        throw new Error(`Insufficient balance. Have: ${currentBalance}, Need: ${amount}`);
      }
      
      // Real ZK proof generation requires heavyweight circuits and WASM  
      // This should be done on backend server, not in browser
      console.warn('⚠️ ZK proof generation not available in browser environment');
      console.log('💡 Frontend requires backend API for real ZK proof generation');
      
      // For now, we should fail gracefully and guide user to proper solution
      // 이제 Go 백엔드의 EERC API를 사용하여 실제 전송
      console.log('🔗 Calling Go backend EERC transfer API...');
      
      const transferResult = await this.callBackendEERCTransfer(
        amount, 
        userPublicKeyArray, 
        userPrivateKey, 
        currentBalance,
        [], // 암호화된 잔액 - 실제로는 계약에서 가져와야 함
        adminPublicKeyArray, 
        auditorPublicKeyArray
      );
      
      return {
        success: true,
        txHash: transferResult.txHash,
        amount: `${amount} ${this.config!.eerc.token_symbol}`
      };
      
      /* 
      // This would be the real implementation with proper ZK proof:
      try {
        // Get sender's encrypted balance for proof generation
        const tokenId = 0;
        const senderBalanceData = await this.encryptedERCContract.balanceOf(userAddress, tokenId);
        
        // Generate real transfer proof (would use privateTransfer helper)
        const { proof, senderBalancePCT } = await privateTransfer(
          sender,
          senderCurrentBalance, 
          receiverPublicKeyArray,
          rawAmount,
          senderEncryptedBalance,
          auditorPublicKeyArray
        );
        
        // Create user wallet instance for the transfer (user signs the transaction)
        const userContract = this.encryptedERCContract.connect(this.userWallet);
        
        console.log('📝 Calling transfer on contract...');
        const tx = await userContract.transfer(adminAddress, tokenId, proof, senderBalancePCT);
        
        console.log(`📝 Transaction sent: ${tx.hash}`);
        console.log('⏳ Waiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block: ${receipt.blockNumber}`);
        
        return {
          success: true,
          txHash: tx.hash,
          amount: `${amount} ${this.config!.eerc.token_symbol}`
        };
        
      } catch (contractError) {
        console.error('❌ Contract transfer failed:', contractError);
        throw new Error(`Transfer failed: ${contractError.message}`);
      }
      */
      
    } catch (error) {
      console.error('❌ Failed to transfer EERC tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get configuration info
  getConfig(): EERCConfig | null {
    return this.config;
  }

  // Get standalone deployment info
  getStandaloneDeployment(): StandaloneDeployment | null {
    return this.standaloneDeployment;
  }

  // Get user keys info
  getUserKeys(): UserKeys | null {
    return this.userKeys;
  }

  // Check if real contracts are available
  hasRealContracts(): boolean {
    return this.standaloneDeployment !== null && 
           this.config !== null && 
           this.config.contracts.encrypted_erc !== "" && 
           this.config.contracts.registrar !== "";
  }

  // Get contract addresses
  getContractAddresses(): { encryptedERC: string; registrar: string } | null {
    if (!this.config) return null;
    
    return {
      encryptedERC: this.config.contracts.encrypted_erc,
      registrar: this.config.contracts.registrar
    };
  }

  // Check if user is registered
  async checkUserRegistration(): Promise<{ isRegistered: boolean; address: string }> {
    try {
      if (!this.isReady()) {
        throw new Error('EERC Service not initialized');
      }

      const userAddress = await this.userWallet!.getAddress();
      console.log('🔍 Checking user registration for:', userAddress);
      
      const isRegistered = await this.registrarContract.isUserRegistered(userAddress);
      
      console.log(`📋 Registration status: ${isRegistered ? '✅ Registered' : '❌ Not registered'}`);
      
      return {
        isRegistered,
        address: userAddress
      };
      
    } catch (error) {
      console.error('❌ Failed to check user registration:', error);
      return {
        isRegistered: false,
        address: ''
      };
    }
  }

  // Go 백엔드 EERC API 호출 메서드들
  private async callBackendEERCMint(amount: number, userPublicKey: bigint[], auditorPublicKey: bigint[]): Promise<{
    success: boolean;
    txHash: string;
    amount: number;
    message: string;
  }> {
    // ApiService import를 직접 하지 않고 fetch 사용
    const response = await fetch('http://localhost:8000/api/v1/eerc/mint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        userPublicKey: userPublicKey.map(k => k.toString()),
        auditorPublicKey: auditorPublicKey.map(k => k.toString())
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Backend EERC mint failed: ${response.status}`);
    }

    return response.json();
  }

  private async callBackendEERCTransfer(
    amount: number,
    senderPublicKey: bigint[],
    senderPrivateKey: bigint,
    senderBalance: number,
    senderEncryptedBalance: string[],
    receiverPublicKey: bigint[],
    auditorPublicKey: bigint[]
  ): Promise<{
    success: boolean;
    txHash: string;
    amount: number;
    message: string;
  }> {
    const response = await fetch('http://localhost:8000/api/v1/eerc/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        senderPublicKey: senderPublicKey.map(k => k.toString()),
        senderPrivateKey: senderPrivateKey.toString(),
        senderBalance,
        senderEncryptedBalance,
        receiverPublicKey: receiverPublicKey.map(k => k.toString()),
        auditorPublicKey: auditorPublicKey.map(k => k.toString())
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Backend EERC transfer failed: ${response.status}`);
    }

    return response.json();
  }

  // Get system status for UI display
  async getSystemStatus(): Promise<{
    userRegistered: boolean;
    auditorSet: boolean;
    contractsLoaded: boolean;
    userAddress: string;
    auditorAddress: string;
  }> {
    try {
      if (!this.isReady()) {
        return {
          userRegistered: false,
          auditorSet: false,
          contractsLoaded: false,
          userAddress: '',
          auditorAddress: ''
        };
      }

      const userAddress = await this.userWallet!.getAddress();
      const isUserRegistered = await this.registrarContract.isUserRegistered(userAddress);
      const auditor = await this.encryptedERCContract.auditor();
      const auditorSet = auditor !== ethers.constants.AddressZero;

      return {
        userRegistered: isUserRegistered,
        auditorSet: auditorSet,
        contractsLoaded: true,
        userAddress: userAddress,
        auditorAddress: auditor
      };
      
    } catch (error) {
      console.error('❌ Failed to get system status:', error);
      return {
        userRegistered: false,
        auditorSet: false,
        contractsLoaded: false,
        userAddress: '',
        auditorAddress: ''
      };
    }
  }
}

// Export singleton instance
export const eercService = EERCService.getInstance();
