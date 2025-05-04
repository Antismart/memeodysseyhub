'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import ConnectWallet from '../components/ConnectWallet';
import { useZoraCoins } from '../components/ZoraCoinsService';
import { Address } from 'viem';

// Interface for meme coins
interface MemeCoin {
  id: number;
  name: string;
  image: string;
  creator?: string;
  stage: number;
  culturalPoints: number;
  votes: number;
  description: string;
  tags: string[];
  contractAddress: Address;
  symbol?: string;
  currentStage?: number;
  supply?: number; // Add supply field to interface
}

// Mock data for meme coins in the arena
const mockMemesInArena = [
  {
    id: 1,
    name: 'Distracted Boyfriend',
    image: '/meme-coin.png',
    creator: '0x1a2...3b4c',
    stage: 2,
    culturalPoints: 450,
    votes: 32,
    description: 'The classic meme evolved into a Base content coin. Now with added metaverse context!',
    tags: ['classic', 'evolution', 'metaverse'],
    contractAddress: '0x1234567890123456789012345678901234567890' as Address
  },
  {
    id: 2,
    name: "Doge",
    description: "Very wow. Much coin. Such meme.",
    image: "/meme-coin.png", // Reusing image just for the prototype
    culturalPoints: 1876,
    votes: 42,
    tags: ['doge', 'classic', 'wow'],
    stage: 3,
    contractAddress: "0x2222222222222222222222222222222222222222" as Address,
    creator: "0x9876543210abcdef9876543210abcdef98765432"
  },
  {
    id: 3,
    name: "Wojak",
    description: "The feel guy that knows that feel",
    image: "/meme-coin.png", // Reusing image just for the prototype
    culturalPoints: 1243,
    votes: 28,
    tags: ['wojak', 'feel', 'emotion'],
    stage: 2,
    contractAddress: "0x3333333333333333333333333333333333333333" as Address,
    creator: "0xfedcba987654321fedcba987654321fedcba9876"
  },
  {
    id: 4,
    name: "Pepe",
    description: "The infamous frog that's become a cultural icon",
    image: "/meme-coin.png", // Reusing image just for the prototype
    culturalPoints: 967,
    votes: 19,
    tags: ['pepe', 'frog', 'classic'],
    stage: 2,
    contractAddress: "0x4444444444444444444444444444444444444444" as Address,
    creator: "0x1234abcdef5678abcdef9012abcdef3456abcdef"
  }
];

// User's own meme entries for the arena
const myMemeEntries = [
  {
    id: 101,
    name: 'Distracted Boyfriend',
    image: '/meme-coin.png',
    stage: 2,
    culturalPoints: 340,
    votes: 24,
    submissionDate: '2025-04-29',
    dailyReward: 12,
    contractAddress: '0x1234567890123456789012345678901234567890' as Address
  }
];

export default function ArenaPage() {
  const { voteMeme, isConnected, address } = useZoraCoins();
  const [memes, setMemes] = useState<MemeCoin[]>(mockMemesInArena);
  const [filter, setFilter] = useState('trending'); // trending, newest, stage
  const [selectedMeme, setSelectedMeme] = useState<MemeCoin | null>(null);
  const [userMemeEntries] = useState(myMemeEntries); // Removed setUserMemeEntries as it's not used
  const [hasVoted, setHasVoted] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Load user meme coins from localStorage
  useEffect(() => {
    if (address) {
      try {
        const storageKey = `memeCoins-${address}`;
        const userMemeCoinsJson = localStorage.getItem(storageKey);
        
        if (userMemeCoinsJson) {
          const userMemeCoins = JSON.parse(userMemeCoinsJson) as MemeCoin[];
          
          // Transform user meme coins to match the arena format
          const formattedUserMemeCoins = userMemeCoins.map((coin: MemeCoin) => ({
            id: coin.id,
            name: coin.name,
            image: coin.image,
            creator: address || 'Unknown Creator', // Ensure creator is never undefined
            stage: coin.currentStage || coin.stage || 1,
            culturalPoints: coin.culturalPoints || 0,
            votes: 0,
            description: coin.description || "",
            tags: coin.tags || [],
            contractAddress: coin.contractAddress as Address,
            supply: coin.supply || 1000000 // Add default supply if not provided
          }));
          
          // Combine mock memes with user memes, avoiding duplicates
          const combinedMemes = [...mockMemesInArena];
          
          formattedUserMemeCoins.forEach((userCoin) => {
            // Check if the coin already exists in the combined memes by contractAddress
            const exists = combinedMemes.some(
              coin => coin.contractAddress === userCoin.contractAddress
            );
            
            // Only add if it doesn't exist
            if (!exists) {
              combinedMemes.push(userCoin);
            }
          });
          
          setMemes(combinedMemes);
          console.log('Loaded user meme coins:', formattedUserMemeCoins);
        }
      } catch (error) {
        console.error('Error loading user meme coins:', error);
      }
    }
  }, [address]);

  useEffect(() => {
    // Initialize voted state
    const initialVotedState: Record<number, boolean> = {};
    const initialLoadingState: Record<number, boolean> = {};
    memes.forEach(meme => {
      initialVotedState[meme.id] = false;
      initialLoadingState[meme.id] = false;
    });
    setHasVoted(initialVotedState);
    setLoading(initialLoadingState);
  }, [memes]);

  const handleVote = async (memeId: number) => {
    if (hasVoted[memeId] || !isConnected) return;
    
    // Find the meme to vote on
    const meme = memes.find(m => m.id === memeId);
    if (!meme || !meme.contractAddress) {
      alert('Could not find meme contract address');
      return;
    }
    
    // Set loading state for this meme
    setLoading(prev => ({
      ...prev,
      [memeId]: true
    }));
    
    try {
      // Call voteMeme from our ZoraCoinsService - with proper typing
      const result = await voteMeme(meme.contractAddress);
      
      console.log('Vote result:', result);
      setTransactionHash(result.receipt.transactionHash);
      
      // Update the UI
      setHasVoted(prev => ({
        ...prev,
        [memeId]: true
      }));
      
      setMemes(prev => prev.map(meme => {
        if (meme.id === memeId) {
          return {
            ...meme,
            votes: meme.votes + 1,
            culturalPoints: meme.culturalPoints + result.pointsAdded
          };
        }
        return meme;
      }));
      
      // Show success message (could use a toast notification in a real app)
      if (selectedMeme?.id === memeId) {
        setSelectedMeme({
          ...selectedMeme,
          votes: selectedMeme.votes + 1,
          culturalPoints: selectedMeme.culturalPoints + result.pointsAdded
        });
      }
      
    } catch (error) {
      console.error('Error voting for meme:', error);
      alert('Voting failed. Please try again.');
    } finally {
      setLoading(prev => ({
        ...prev,
        [memeId]: false
      }));
    }
  };

  const handleSort = (sortType: string) => {
    setFilter(sortType);
    
    const sortedMemes = [...memes];
    
    if (sortType === 'trending') {
      sortedMemes.sort((a, b) => b.votes - a.votes);
    } else if (sortType === 'newest') {
      // For mock data, we'll just reverse the order as a proxy for "newest"
      sortedMemes.reverse();
    } else if (sortType === 'stage') {
      sortedMemes.sort((a, b) => b.stage - a.stage);
    }
    
    setMemes(sortedMemes);
  };

  const handleMemeSelect = (meme: MemeCoin) => {
    setSelectedMeme(meme);
  };

  const closeModal = () => {
    setSelectedMeme(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 text-white p-8">
      {/* Navigation header */}
      <Header />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          Viral Arena
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Showcase your meme coins, vote for your favorites, and earn Cultural Points!
        </p>
        
        {!isConnected ? (
          <div className="text-center py-16 bg-purple-800/30 rounded-xl backdrop-blur-sm">
            <h2 className="text-xl font-medium mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">You need to connect your wallet to access the Viral Arena and vote for memes.</p>
            <div className="flex justify-center">
              <ConnectWallet className="px-8 py-3 text-lg" />
            </div>
          </div>
        ) : (
          <>
            {/* Your entries section */}
            <div className="mb-12">
              <h2 className="text-xl font-medium mb-4">Your Entries</h2>
              
              <div className="bg-purple-800/30 p-6 rounded-xl backdrop-blur-sm border border-purple-600/30">
                {userMemeEntries.length > 0 ? (
                  <div className="space-y-6">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Meme</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Votes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cultural Points</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submission Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Daily Reward</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                          {userMemeEntries.map(entry => (
                            <tr key={entry.id} className="hover:bg-purple-700/30 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border border-yellow-400/50">
                                    <Image
                                      src={entry.image}
                                      alt={entry.name}
                                      width={40}
                                      height={40}
                                    />
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{entry.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                                  Stage {entry.stage}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.votes}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-300">{entry.culturalPoints} CP</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.submissionDate}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-300">+{entry.dailyReward} CP/day</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="flex justify-end">
                      <Link href="/odyssey" className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full hover:opacity-90 transition-opacity text-sm font-medium">
                        Evolve Your Meme
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-300 mb-4">You haven&apos;t submitted any memes to the Viral Arena yet.</p>
                    <Link href="/odyssey" className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full hover:opacity-90 transition-opacity inline-block">
                      Submit Your Meme
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Arena voting section */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-medium">Viral Arena</h2>
                
                <div className="flex border border-gray-600 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleSort('trending')}
                    className={`px-4 py-2 text-sm ${filter === 'trending' ? 'bg-purple-600 text-white' : 'bg-transparent hover:bg-purple-800/30'}`}
                  >
                    Trending
                  </button>
                  <button
                    onClick={() => handleSort('newest')}
                    className={`px-4 py-2 text-sm ${filter === 'newest' ? 'bg-purple-600 text-white' : 'bg-transparent hover:bg-purple-800/30'}`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => handleSort('stage')}
                    className={`px-4 py-2 text-sm ${filter === 'stage' ? 'bg-purple-600 text-white' : 'bg-transparent hover:bg-purple-800/30'}`}
                  >
                    Highest Stage
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {memes.map((meme) => (
                  <div
                    key={meme.id}
                    className="bg-purple-800/30 rounded-xl overflow-hidden backdrop-blur-sm border border-purple-600/30 hover:border-purple-500/50 transition-all hover:-translate-y-1 cursor-pointer"
                    onClick={() => handleMemeSelect(meme)}
                  >
                    <div className="relative h-48 w-full bg-gradient-to-b from-gray-800 to-gray-900">
                      <Image
                        src={meme.image}
                        alt={meme.name}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                      <div className="absolute top-2 right-2 bg-purple-900/80 px-2 py-1 rounded-lg backdrop-blur-sm text-xs font-medium">
                        Stage {meme.stage}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-medium">{meme.name}</h3>
                        <div className="flex items-center gap-1 text-yellow-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                          </svg>
                          {meme.culturalPoints} CP
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 mb-3">
                        By {meme.creator}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {meme.tags.map(tag => (
                          <span key={tag} className="text-xs bg-purple-700/50 px-2 py-0.5 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="border-t border-purple-600/30 pt-3 mt-3 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          <span>{meme.votes} votes</span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(meme.id);
                          }}
                          disabled={hasVoted[meme.id] || loading[meme.id]}
                          className={`text-sm px-3 py-1 rounded-full transition-colors ${
                            hasVoted[meme.id]
                              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                          }`}
                        >
                          {loading[meme.id] ? (
                            <svg className="animate-spin h-4 w-4 mx-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : hasVoted[meme.id] ? (
                            'Voted'
                          ) : (
                            'Vote'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Meme detail modal */}
      {selectedMeme && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-purple-900/90 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/50 shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold">{selectedMeme.name}</h2>
                <button
                  onClick={closeModal}
                  className="bg-purple-800/80 rounded-full w-8 h-8 flex items-center justify-center hover:bg-purple-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="relative h-64 w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-purple-500/50">
                    <Image
                      src={selectedMeme.image}
                      alt={selectedMeme.name}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {selectedMeme.tags.map((tag: string) => (
                      <span key={tag} className="text-sm bg-purple-700/50 px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Creator</h3>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                      <span>{selectedMeme.creator}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Stage</h3>
                    <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                      Stage {selectedMeme.stage}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Cultural Points</h3>
                    <div className="flex items-center gap-1 text-yellow-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                      </svg>
                      {selectedMeme.culturalPoints} CP
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Description</h3>
                    <p className="text-gray-300">{selectedMeme.description}</p>
                  </div>
                  
                  {transactionHash && (
                    <div className="mb-6 bg-purple-700/30 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-300 mb-1">Transaction Hash:</p>
                      <a 
                        href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 break-all hover:underline"
                      >
                        {transactionHash}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span>{selectedMeme.votes} votes</span>
                    </div>

                    <button
                      onClick={() => handleVote(selectedMeme.id)}
                      disabled={hasVoted[selectedMeme.id] || loading[selectedMeme.id]}
                      className={`px-6 py-2 rounded-full transition-colors flex items-center gap-2 ${
                        hasVoted[selectedMeme.id]
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                      }`}
                    >
                      {loading[selectedMeme.id] ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Voting...
                        </>
                      ) : hasVoted[selectedMeme.id] ? (
                        'Voted'
                      ) : (
                        'Vote for this Meme'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}