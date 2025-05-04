'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import { useZoraCoins } from "./components/ZoraCoinsService";

// Define interface for meme coin data structure
interface MemeCoin {
  id: number;
  name: string;
  image: string;
  currentStage?: number;
  stage?: number;
  culturalPoints: number;
  votes?: number;
  description?: string;
  tags?: string[];
  contractAddress?: string;
}

// Mock trending memes to use if no local data is found
const mockTrendingMemes: MemeCoin[] = [
  {
    id: 1,
    name: 'Distracted Boyfriend',
    image: '/meme-coin.png',
    stage: 2,
    culturalPoints: 450,
    votes: 32,
    description: 'The classic meme evolved into a Base content coin. Now with added metaverse context!',
    tags: ['classic', 'evolution', 'metaverse'],
  },
  {
    id: 2,
    name: 'Doge',
    image: '/meme-coin.png',
    stage: 3,
    culturalPoints: 780,
    votes: 45,
    description: 'From humble beginnings to cultural phenomenon. The OG meme coin mascot.',
    tags: ['doge', 'classic', 'crypto'],
  },
  {
    id: 3,
    name: 'Wojak',
    image: '/meme-coin.png',
    stage: 2,
    culturalPoints: 520,
    votes: 28,
    description: 'The emotional reaction meme that perfectly captures the rollercoaster of Web3.',
    tags: ['wojak', 'emotion', 'reaction'],
  },
  {
    id: 4,
    name: 'Pepe',
    image: '/meme-coin.png',
    stage: 3,
    culturalPoints: 967,
    votes: 53,
    description: 'The infamous frog that&apos;s become a cultural icon',
    tags: ['pepe', 'frog', 'classic'],
  },
  {
    id: 5,
    name: 'Disaster Girl',
    image: '/meme-coin.png',
    stage: 2,
    culturalPoints: 610,
    votes: 37,
    description: 'That smile. That damned smile. NFT history in the making.',
    tags: ['disaster', 'girl', 'smile'],
  }
];

export default function Home() {
  const { isConnected, address } = useZoraCoins();
  const [featuredMemes, setFeaturedMemes] = useState<MemeCoin[]>([]);
  
  // Load meme coins from localStorage and combine with mock data
  useEffect(() => {
    // First, add our mock trending memes
    let allMemes = [...mockTrendingMemes];
    
    // Try to get user-created memes from localStorage
    try {
      // Get memes for the current user if connected
      if (isConnected && address) {
        const userStorageKey = `memeCoins-${address}`;
        const userMemeCoinsJson = localStorage.getItem(userStorageKey);
        
        if (userMemeCoinsJson) {
          const userMemeCoins = JSON.parse(userMemeCoinsJson) as MemeCoin[];
          allMemes = [...allMemes, ...userMemeCoins];
        }
      }
      
      // Also try to get global memes from other users
      const globalMemeKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('memeCoins-')) {
          globalMemeKeys.push(key);
        }
      }
      
      // Add unique global memes to our collection
      globalMemeKeys.forEach(key => {
        if (isConnected && address && key === `memeCoins-${address}`) return; // Skip current user's memes as we already added them
        
        const globalMemeCoinsJson = localStorage.getItem(key);
        if (globalMemeCoinsJson) {
          const globalMemeCoins = JSON.parse(globalMemeCoinsJson) as MemeCoin[];
          // Only add memes with unique IDs
          globalMemeCoins.forEach(meme => {
            if (!allMemes.some(existing => existing.id === meme.id)) {
              allMemes.push(meme);
            }
          });
        }
      });
      
      // Sort by cultural points descending and take top 6
      allMemes.sort((a, b) => b.culturalPoints - a.culturalPoints);
      setFeaturedMemes(allMemes.slice(0, 6));
      
    } catch (error) {
      console.error('Error loading meme coins:', error);
      // Fallback to mock data
      setFeaturedMemes(mockTrendingMemes.slice(0, 6));
    }
  }, [isConnected, address]);

  return (
    <div className="grid grid-rows-[80px_1fr_60px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-b from-purple-900 to-blue-900 text-white">
      <header className="w-full flex justify-between items-center">
        <Header hideBackButton={true} />
      </header>

      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-yellow-400 to-cyan-400 bg-clip-text text-transparent">
            Create. Evolve. Trade.
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Turn viral internet moments into tokenized cultural artifacts on the Base blockchain.
            Embark on a gamified journey through the meme-verse!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-purple-800/50 p-6 rounded-xl backdrop-blur-sm border border-purple-600/30 hover:border-purple-500/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Mint Seed Memes</h3>
            <p className="text-gray-300">
              Create your own &quot;Seed Meme&quot; coin on the Base blockchain. Add your meme&apos;s origin story and make it unique.
            </p>
            <Link href="/create" className="block mt-4 text-pink-400 hover:text-pink-300 font-medium">
              Start Creating &rarr;
            </Link>
          </div>

          <div className="bg-purple-800/50 p-6 rounded-xl backdrop-blur-sm border border-purple-600/30 hover:border-purple-500/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Journey Through Odyssey Map</h3>
            <p className="text-gray-300">
              Evolve your meme through themed stages like &quot;Viral Volcano&quot; and &quot;TikTok Tundra&quot; while earning rewards.
            </p>
            <Link href="/odyssey" className="block mt-4 text-cyan-400 hover:text-cyan-300 font-medium">
              Start Journey &rarr;
            </Link>
          </div>

          <div className="bg-purple-800/50 p-6 rounded-xl backdrop-blur-sm border border-purple-600/30 hover:border-purple-500/50 transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enter Viral Arena</h3>
            <p className="text-gray-300">
              Showcase your evolved meme coins, vote on the best creations, and earn Cultural Points in the community.
            </p>
            <Link href="/arena" className="block mt-4 text-yellow-400 hover:text-yellow-300 font-medium">
              Enter Arena &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl max-w-5xl w-full backdrop-blur-sm border border-pink-500/30">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Hall of Memes
            </span>
            <span className="text-lg ml-2 font-normal text-gray-300">Top Cultural Icons</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredMemes.slice(0, 6).map((meme, index) => (
              <div 
                key={meme.id} 
                className={`
                  bg-gradient-to-br ${index === 0 ? 'from-yellow-700/50 to-yellow-900/50 border-yellow-500/50' 
                    : index === 1 ? 'from-gray-500/50 to-gray-700/50 border-gray-400/50' 
                    : index === 2 ? 'from-amber-800/50 to-amber-900/50 border-amber-700/50' 
                    : 'from-purple-700/40 to-purple-900/40 border-purple-600/30'} 
                  rounded-lg p-5 flex flex-col items-center border transition-all hover:-translate-y-1
                `}
              >
                {index < 3 && (
                  <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-yellow-900' : 
                    index === 1 ? 'bg-gray-400 text-gray-900' : 
                    'bg-amber-700 text-amber-100'
                  }`}>
                    {index + 1}
                  </div>
                )}
                <div className="h-36 w-full bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                  <Image
                    src={meme.image || "/meme-coin.png"}
                    alt={meme.name}
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
                <h4 className="font-medium text-lg">{meme.name}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm bg-purple-600/50 px-2 py-0.5 rounded-full">
                    Stage {meme.currentStage || meme.stage || 1}
                  </span>
                  <span className="text-sm bg-pink-600/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    {meme.culturalPoints}
                  </span>
                </div>
                {meme.tags && meme.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {meme.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs text-gray-300 bg-gray-700/50 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/arena" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:opacity-90 transition-opacity font-medium inline-flex items-center gap-2">
              <span>Explore All Memes</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-purple-800/30 rounded-xl max-w-4xl w-full border border-purple-600/30 text-center">
          <h3 className="text-2xl font-semibold mb-2">Powered by Base Content Coins</h3>
          <p className="text-gray-300 mb-4">
            Experience the fusion of meme culture and blockchain technology with Base Builder Quest 4.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="px-3 py-1 bg-purple-700/50 rounded-full text-sm">@zoralabs Coins SDK</div>
            <div className="px-3 py-1 bg-purple-700/50 rounded-full text-sm">@flaunchgg SDK</div>
            <div className="px-3 py-1 bg-purple-700/50 rounded-full text-sm">@clankeronbase SDK</div>
            <div className="px-3 py-1 bg-purple-700/50 rounded-full text-sm">MiniKit</div>
          </div>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-gray-400">
        <span className="flex items-center gap-2">
          Built for Base Builder Quest 4
        </span>
        <span>|</span>
        <span className="flex items-center gap-2">
          Powered by Content Coins
        </span>
      </footer>
    </div>
  );
}
