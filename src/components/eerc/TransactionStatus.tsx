interface TransactionStatusProps {
  status: "pending" | "success" | "error";
  message: string;
  txHash?: string;
}

export function TransactionStatus({ status, message, txHash }: TransactionStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-avax-warning";
      case "success":
        return "bg-avax-success";
      case "error":
        return "bg-avax-error";
      default:
        return "bg-avax-gray";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return "⏳";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={`avax-card p-4 border-l-4 ${getStatusColor().replace('bg-', 'border-')}`}>
      <div className="flex items-center space-x-3">
        <span className="text-xl">{getStatusIcon()}</span>
        <div className="flex-1">
          <div className="font-semibold text-erea-text">{message}</div>
          {txHash && (
            <div className="text-sm text-erea-text-light mt-1">
              <span>Transaction: </span>
              <a
                href={`https://snowscan.xyz/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-erea-primary hover:underline"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </a>
            </div>
          )}
        </div>
        {status === "pending" && (
          <div className="w-6 h-6 border-2 border-avax-warning border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
    </div>
  );
}
