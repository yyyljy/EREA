# EREA - Private Real Estate Auction Platform

![EREA Logo](./logo.png)

A secure, blockchain-based private real estate auction platform powered by Avalanche EERC (Encrypted ERC) technology.

## 🏛️ Overview

EREA (Encrypted Real Estate Auction) is an platform that revolutionizes real estate auctions by combining blockchain technology with advanced encryption protocols. It provides transparent, secure, and efficient property transactions while maintaining complete privacy through zero-knowledge proofs.

## 🚀 Features

### 🔒 Security & Privacy
- **Avalanche EERC Integration**: Encrypted ERC standards for private transactions
- **Zero-Knowledge Proofs**: Bid privacy with auction integrity
- **End-to-End Encryption**: Complete data protection
- **Multi-Signature Verification**: Enhanced security protocols

### 🏢 Real Estate Platform
- **Private Auctions**: Secure bidding environment
- **Korean Property Listings**: Properties located in South Korea
- **Real-Time Bidding**: Instant transaction confirmations

### 📊 Dashboard Features
- **Portfolio Management**: Track your real estate assets
- **Transaction History**: Complete audit trail
- **Analytics**: Performance metrics and insights
- **Wallet Integration**: Seamless Avalanche wallet connection

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Blockchain**: Avalanche Network (Fuji Testnet)
- **Encryption**: EERC SDK, Zero-Knowledge Proofs
- **Wallet**: Avalanche Wallet SDK, WalletConnect

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Avalanche wallet (Core, MetaMask with Avalanche)

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/erea.git
   cd erea
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Add your WalletConnect Project ID
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Usage

### For Buyers
1. **Connect Wallet**: Link your Avalanche wallet
2. **Browse Properties**: Explore available Korean real estate
3. **Place Encrypted Bids**: Submit private, secure bids
4. **Track Status**: Monitor auction progress in real-time

### For Sellers
1. **List Properties**: Add verified property information
2. **Set Auction Parameters**: Configure starting price and duration
3. **Monitor Bids**: View encrypted bid activity
4. **Complete Sales**: Automated smart contract execution

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── eerc/           # EERC-specific components
│   ├── layout/         # Layout components
│   └── index.ts        # Component exports
├── pages/              # Main application pages
│   ├── RealEstateAuction.tsx
│   ├── About.tsx
│   └── EERCDashboard.tsx
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── config/             # Configuration files
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🔗 Blockchain Integration

### Avalanche EERC
- **Network**: Avalanche Fuji (Testnet)
- **Protocol**: EERC (Encrypted ERC) standards
- **Gas Token**: AVAX
- **Smart Contracts**: Automated auction logic

### Security Features
- **Encrypted Transactions**: All sensitive data encrypted
- **Zero-Knowledge Proofs**: Bid privacy preservation
- **Immutable Records**: Blockchain-based audit trail
- **Multi-Signature**: Enhanced transaction security

## 📊 Property Information

All properties feature Korean addresses with English descriptions:

- **Location**: Seoul, Busan, Jeju, and other major Korean cities
- **Types**: Apartments, Officetels, Commercial, Villas
- **Documentation**: Verified property records
- **Legal**: Compliant with Korean real estate laws

## 📄 License

This project is in the public domain. See [LICENSE](LICENSE) for details.

---
