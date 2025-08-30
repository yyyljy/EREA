import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a query client
const queryClient = new QueryClient();

interface AvalancheWalletProviderProps {
  children: ReactNode;
  network: string;
}

export function AvalancheWalletProvider({ 
  children, 
  // network 
}: AvalancheWalletProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
