'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

interface ConnectWalletProps {
  className?: string;
}

export default function ConnectWallet({ className = '' }: ConnectWalletProps) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button 
                    onClick={openConnectModal} 
                    className={`px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white hover:opacity-90 transition-opacity ${className}`}
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button 
                    onClick={openChainModal} 
                    className="px-4 py-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-800/50 hover:bg-purple-800/70 transition-colors rounded-full text-white text-sm"
                  >
                    {chain.hasIcon && (
                      <div className="w-4 h-4 overflow-hidden rounded-full border border-gray-400/30">
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                  </button>

                  <button 
                    onClick={openAccountModal}
                    className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 hover:border-cyan-500/60 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-cyan-100">
                      {account.displayName}
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}