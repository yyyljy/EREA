import { useState } from "react";

interface WalletConnectProps {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  address?: string;
}

export function WalletConnect({ 
  isConnected, 
  onConnect, 
  onDisconnect, 
  address 
}: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected) {
    return (
      <div className="avax-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-avax-success rounded-full animate-pulse"></div>
            <div>
              <div className="font-semibold text-erea-text">Wallet Connected</div>
              {address && (
                <div className="text-sm text-erea-text-light font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onDisconnect}
            className="avax-button-outline"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="avax-card p-6 border-dashed border-2 border-avax-border">
      <div className="text-center">
        <div className="w-16 h-16 bg-avax-light rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔗</span>
        </div>
        <h3 className="avax-subheading text-lg mb-2">Connect Your Avalanche Wallet</h3>
        <p className="avax-body text-sm text-erea-text-light mb-6">
          Connect your wallet to access EERC features and participate in auctions
        </p>
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="avax-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}
