'use client';

import { ReactNode } from 'react';
import { 
  RainbowKitProvider, 
  darkTheme 
} from '@rainbow-me/rainbowkit';
import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { base, baseSepolia } from 'viem/chains';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Get the WalletConnect project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID';

// Create QueryClient instance
const queryClient = new QueryClient();

// Create wagmi config with RainbowKit
const config = getDefaultConfig({
  appName: 'Meme Odyssey Hub',
  projectId: projectId,
  chains: [baseSepolia, base],
  ssr: true, // For Next.js Server Components
});

interface WalletProviderProps {
  children: ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#8b5cf6', // Purple accent color
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
          appInfo={{
            appName: 'Meme Odyssey Hub',
            learnMoreUrl: 'https://memeodysseyhub.xyz', // Replace with actual URL in production
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}