    'use client';

import Link from 'next/link';
import Image from 'next/image';
import ConnectWallet from './ConnectWallet';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  hideBackButton?: boolean;
}

export default function Header({ hideBackButton = false }: HeaderProps) {
  const pathname = usePathname();
  
  return (
    <div className="w-full max-w-6xl mx-auto mb-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {!hideBackButton && pathname !== '/' && (
          <Link href="/" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        )}

        {pathname === '/' && (
          <div className="flex items-center gap-2">
            <Image
              src="/meme-coin.png"
              alt="Meme Odyssey Logo"
              width={48}
              height={48}
              className="rounded-full"
              priority
            />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              Meme Odyssey Hub
            </h1>
          </div>
        )}
      </div>
      
      <div className="flex gap-4">
        <ConnectWallet />
      </div>
    </div>
  );
}