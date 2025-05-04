'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useWalletClient, usePublicClient } from 'wagmi';
import { Address, getAddress, WalletClient } from 'viem';

// Since we're in a demo environment and don't have an actual deployed factory contract,
// we'll use this approach to simulate minting while generating valid transaction hashes
const simulateContractInteraction = async (walletClient: WalletClient, address: string) => {
  // Send a transaction to the user's own address (a self-transfer of 0 ETH)
  // This will generate a real transaction hash but won't actually deploy a contract
  const hash = await walletClient.sendTransaction({
    account: walletClient.account!,
    to: address as `0x${string}`,
    value: BigInt(0),
    data: '0x', // Empty data
    chain: null
  });
  
  return hash;
};

interface ContentCoinParams {
  name: string;
  symbol: string;
  description: string;
  imageURI: string;
  originStory: string;
  tags: string[];
}

interface EvolutionResult {
  success: boolean;
  receipt: {
    transactionHash: string;
  };
  evolutionDate: string;
}

interface MintResult {
  success: boolean;
  token: {
    address: string;
  };
  receipt: {
    transactionHash: string;
  };
}

interface VoteResult {
  success: boolean;
  receipt: {
    transactionHash: string;
  };
  pointsAdded: number;
}

interface ZoraCoinsContextType {
  isConnected: boolean;
  address: string | undefined;
  voteMeme: (contractAddress: Address) => Promise<VoteResult>;
  mintContentCoin: (params: ContentCoinParams) => Promise<MintResult>;
  evolveMeme: (contractAddress: Address, stage: number, variant: string) => Promise<EvolutionResult>;
  loading: boolean;
  error: string | null;
}

const ZoraCoinsContext = createContext<ZoraCoinsContextType | null>(null);

export function ZoraCoinsProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset error state when wallet connection changes
  useEffect(() => {
    setError(null);
  }, [isConnected, address]);

  // Mint a new content coin using the factory contract
  const mintContentCoin = async (params: ContentCoinParams): Promise<MintResult> => {
    if (!isConnected || !address || !walletClient) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Minting content coin with params:', params);
      
      // For demo purposes, instead of trying to interact with a non-existent contract,
      // we'll create a real transaction to generate a valid hash
      const hash = await simulateContractInteraction(walletClient, address);
      
      console.log('Transaction submitted:', hash);
      
      // Wait for the transaction to be mined
      if (!publicClient) {
        throw new Error("Public client not available");
      }
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction receipt:', receipt);
      
      // Generate a deterministic address based on the transaction hash
      // This is just for demo - in a real app this would come from contract events
      const tokenAddress = getAddress(`0x${hash.slice(2, 42)}`) as Address;
      
      return {
        success: true,
        token: {
          address: tokenAddress
        },
        receipt: {
          transactionHash: hash
        }
      };
    } catch (err) {
      console.error('Error minting content coin:', err);
      setError(err instanceof Error ? err.message : "Failed to mint content coin");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Evolve a meme to the next stage
  const evolveMeme = async (contractAddress: Address, stage: number, variant: string): Promise<EvolutionResult> => {
    if (!isConnected || !address || !walletClient) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Evolving meme ${contractAddress} to stage ${stage} with variant ${variant}`);
      
      // For demo purposes, instead of trying to interact with a non-existent contract,
      // we'll create a real transaction to generate a valid hash
      const hash = await simulateContractInteraction(walletClient, address);
      
      console.log('Transaction submitted:', hash);
      
      // Wait for the transaction to be mined
      if (!publicClient) {
        throw new Error("Public client not available");
      }
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction receipt:', receipt);
      
      // Create a formatted date for today
      const today = new Date();
      const evolutionDate = today.toISOString().split('T')[0];
      
      return {
        success: true,
        receipt: {
          transactionHash: hash
        },
        evolutionDate
      };
    } catch (err) {
      console.error('Error evolving meme:', err);
      setError(err instanceof Error ? err.message : "Failed to evolve meme");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Vote for a meme coin (add cultural points)
  const voteMeme = async (contractAddress: Address): Promise<VoteResult> => {
    if (!isConnected || !address || !walletClient) {
      throw new Error("Wallet not connected");
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`Voting for meme at address ${contractAddress}`);
      
      // For demo purposes, instead of trying to interact with a non-existent contract,
      // we'll create a real transaction to generate a valid hash
      const hash = await simulateContractInteraction(walletClient, address);
      
      console.log('Transaction submitted:', hash);
      
      // Wait for the transaction to be mined
      if (!publicClient) {
        throw new Error("Public client not available");
      }
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log('Transaction receipt:', receipt);
      
      // In a real implementation, we would get the pointsAdded from the transaction logs
      // For now, let's use a simulated value
      const pointsAdded = Math.floor(Math.random() * 10) + 5; // Random points between 5-15
      
      return {
        success: true,
        receipt: {
          transactionHash: hash
        },
        pointsAdded
      };
    } catch (err) {
      console.error('Error voting for meme:', err);
      setError(err instanceof Error ? err.message : "Failed to vote for meme");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ZoraCoinsContext.Provider 
      value={{ 
        isConnected, 
        address, 
        mintContentCoin,
        evolveMeme,
        voteMeme,
        loading, 
        error 
      }}
    >
      {children}
    </ZoraCoinsContext.Provider>
  );
}

export function useZoraCoins() {
  const context = useContext(ZoraCoinsContext);
  
  if (!context) {
    throw new Error('useZoraCoins must be used within a ZoraCoinsProvider');
  }
  
  return context;
}