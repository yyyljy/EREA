import { useState } from "react";

interface EERCTransaction {
  id: string;
  type: "Bid" | "Transfer" | "Verification";
  amount: number;
  property: string;
  timestamp: string;
  status: "Completed" | "Pending" | "Failed";
  txHash: string;
}

interface EERCAsset {
  id: string;
  propertyTitle: string;
  location: string;
  tokenId: string;
  value: number;
  acquired: string;
  status: "Active" | "Pending Sale" | "Sold";
}

const mockTransactions: EERCTransaction[] = [
  {
    id: "1",
    type: "Bid",
    amount: 650000,
    property: "Gangnam District Premium Officetel",
    timestamp: "2024-12-20T14:30:00",
    status: "Completed",
    txHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12"
  },
  {
    id: "2",
    type: "Transfer",
    amount: 920000,
    property: "Bundang New Town Apartment",
    timestamp: "2024-12-19T10:15:00",
    status: "Completed",
    txHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234"
  },
  {
    id: "3",
    type: "Verification",
    amount: 0,
    property: "Jeju Island Resort Villa",
    timestamp: "2024-12-18T16:45:00",
    status: "Pending",
    txHash: "0x3c4d5e6f7890abcdef1234567890abcdef123456"
  }
];

const mockAssets: EERCAsset[] = [
  {
    id: "1",
    propertyTitle: "Bundang New Town Apartment",
    location: "Jeongja-dong, Bundang-gu, Seongnam-si",
    tokenId: "EREA-001",
    value: 920000,
    acquired: "2024-12-19",
    status: "Active"
  },
];

export function EERCDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "assets" | "analytics">("overview");
  const [isConnected, setIsConnected] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const connectWallet = () => {
    // Simulate wallet connection
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="avax-heading text-4xl mb-4">
          EERC Dashboard
        </h1>
        <p className="avax-body text-lg max-w-4xl mx-auto">
          Manage your encrypted real estate assets and monitor blockchain transactions 
          securely through the Avalanche EERC protocol.
        </p>
      </div>

      {/* Wallet Connection */}
      <div className="avax-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="avax-subheading text-xl mb-2">Avalanche Wallet Connection</h2>
            <p className="avax-body text-sm text-erea-text-light">
              {isConnected 
                ? "Your wallet is securely connected to the Avalanche network" 
                : "Connect your Avalanche wallet to access EERC features"}
            </p>
          </div>
          <div>
            {isConnected ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-avax-success rounded-full"></div>
                  <span className="avax-body text-sm font-semibold">Connected</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="avax-button-outline"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="avax-button-primary"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="avax-card">
        <div className="border-b border-avax-border">
          <nav className="flex space-x-1 p-1">
            {[
              { key: "overview", label: "Overview" },
              { key: "transactions", label: "Transactions" },
              { key: "assets", label: "My Assets" },
              { key: "analytics", label: "Analytics" }
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
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Portfolio Overview</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="avax-card p-6 bg-avax-light text-center">
                  <div className="text-3xl font-bold text-erea-primary">$1.3M</div>
                  <div className="text-erea-text-light font-semibold">Total Portfolio Value</div>
                </div>
                <div className="avax-card p-6 bg-avax-light text-center">
                  <div className="text-3xl font-bold text-avax-success">2</div>
                  <div className="text-erea-text-light font-semibold">Active Assets</div>
                </div>
                <div className="avax-card p-6 bg-avax-light text-center">
                  <div className="text-3xl font-bold text-avax-secondary">5</div>
                  <div className="text-erea-text-light font-semibold">Total Transactions</div>
                </div>
                <div className="avax-card p-6 bg-avax-light text-center">
                  <div className="text-3xl font-bold text-avax-accent">+12.5%</div>
                  <div className="text-erea-text-light font-semibold">30-Day Return</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="avax-card p-6">
                <h3 className="avax-subheading text-xl mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {mockTransactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between border-b border-avax-border pb-3 last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          tx.type === "Bid" ? "bg-erea-primary" :
                          tx.type === "Transfer" ? "bg-avax-success" : "bg-avax-warning"
                        }`}>
                          {tx.type === "Bid" ? "B" : tx.type === "Transfer" ? "T" : "V"}
                        </div>
                        <div>
                          <div className="font-semibold text-erea-text">{tx.type}: {tx.property}</div>
                          <div className="text-sm text-erea-text-light">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-erea-primary">
                          {tx.amount > 0 ? formatPrice(tx.amount) : "—"}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          tx.status === "Completed" ? "bg-avax-success text-white" :
                          tx.status === "Pending" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Transaction History</h2>
              
              <div className="avax-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-avax-light">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-erea-text uppercase tracking-wider">
                          Transaction Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-avax-border">
                      {mockTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-avax-light/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              tx.type === "Bid" ? "bg-erea-primary text-white" :
                              tx.type === "Transfer" ? "bg-avax-success text-white" : "bg-avax-warning text-white"
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-erea-text">
                            {tx.property}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-erea-text">
                            {tx.amount > 0 ? formatPrice(tx.amount) : "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-erea-text-light">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              tx.status === "Completed" ? "bg-avax-success text-white" :
                              tx.status === "Pending" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-erea-text-light">
                            <a 
                              href={`https://snowscan.xyz/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-erea-primary transition-colors"
                            >
                              {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === "assets" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">My Real Estate Assets</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockAssets.map((asset) => (
                  <div key={asset.id} className="avax-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="avax-subheading text-lg">{asset.propertyTitle}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        asset.status === "Active" ? "bg-avax-success text-white" :
                        asset.status === "Pending Sale" ? "bg-avax-warning text-white" : "bg-avax-error text-white"
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="avax-body text-sm text-erea-text-light">Location:</span>
                        <span className="avax-body text-sm font-semibold">{asset.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="avax-body text-sm text-erea-text-light">Token ID:</span>
                        <span className="avax-body text-sm font-mono font-semibold">{asset.tokenId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="avax-body text-sm text-erea-text-light">Current Value:</span>
                        <span className="avax-body text-lg font-bold text-erea-primary">{formatPrice(asset.value)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="avax-body text-sm text-erea-text-light">Acquired:</span>
                        <span className="avax-body text-sm font-semibold">{new Date(asset.acquired).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-avax-border">
                      <div className="flex space-x-2">
                        <button className="flex-1 avax-button-outline text-sm py-2">
                          View Details
                        </button>
                        <button className="flex-1 avax-button-secondary text-sm py-2">
                          List for Sale
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="avax-subheading text-2xl">Portfolio Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="avax-body">Total ROI</span>
                      <span className="font-bold text-avax-success text-lg">+12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="avax-body">Average Hold Time</span>
                      <span className="font-semibold">45 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="avax-body">Transaction Success Rate</span>
                      <span className="font-semibold text-avax-success">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="avax-body">Gas Fees Saved</span>
                      <span className="font-semibold">$2,150</span>
                    </div>
                  </div>
                </div>
                
                <div className="avax-card p-6">
                  <h3 className="avax-subheading text-lg mb-4">Network Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="avax-body">Network</span>
                      <span className="font-semibold">Avalanche Fuji</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="avax-body">Block Height</span>
                      <span className="font-mono font-semibold">2,847,591</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="avax-body">Gas Price</span>
                      <span className="font-semibold">25 nAVAX</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="avax-body">Network Status</span>
                      <span className="font-semibold text-avax-success">Healthy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="avax-card p-6">
                <h3 className="avax-subheading text-lg mb-4">EERC Protocol Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-erea-primary">99.9%</div>
                    <div className="text-erea-text-light">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-avax-success">1,247</div>
                    <div className="text-erea-text-light">Total EERC Tokens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-avax-accent">$4.2B</div>
                    <div className="text-erea-text-light">Total Value Locked</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="avax-card p-6 bg-blue-50 border-l-4 border-erea-primary">
        <h3 className="avax-subheading text-lg mb-2 flex items-center">
          <span className="mr-2">🔐</span>
          EERC Security Features
        </h3>
        <p className="avax-body">
          Your assets are protected by advanced encryption protocols on the Avalanche blockchain. 
          All transactions use zero-knowledge proofs to ensure privacy while maintaining 
          complete transparency and auditability for regulatory compliance.
        </p>
      </div>
    </div>
  );
}
