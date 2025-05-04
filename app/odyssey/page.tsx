'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import { useZoraCoins } from '../components/ZoraCoinsService';
import ConnectWallet from '../components/ConnectWallet';
import { Address } from 'viem';

// Define the stages of the meme journey
const odysseyStages = [
  {
    id: 1,
    name: 'Viral Volcano',
    description: 'Where memes erupt into cultural consciousness',
    color: 'from-red-500 to-orange-600',
    bgColor: 'bg-red-900/20',
    borderColor: 'border-red-500/30',
    icon: '🌋',
    unlocked: true,
  },
  {
    id: 2,
    name: 'TikTok Tundra',
    description: 'Navigate the icy plains of short-form viral content',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-blue-900/20',
    borderColor: 'border-blue-500/30',
    icon: '❄️',
    unlocked: false,
  },
  {
    id: 3,
    name: 'Reddit Rainforest',
    description: 'Dense and diverse ecosystem of community-driven memes',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-900/20',
    borderColor: 'border-green-500/30',
    icon: '🌴',
    unlocked: false,
  },
  {
    id: 4,
    name: 'X Space Station',
    description: 'The orbital platform where memes achieve escape velocity',
    color: 'from-indigo-500 to-purple-600',
    bgColor: 'bg-indigo-900/20',
    borderColor: 'border-indigo-500/30',
    icon: '🚀',
    unlocked: false,
  },
  {
    id: 5,
    name: 'Meme Multiverse',
    description: 'The final frontier where legendary memes transcend platforms',
    color: 'from-pink-500 to-yellow-400',
    bgColor: 'bg-pink-900/20',
    borderColor: 'border-pink-500/30',
    icon: '✨',
    unlocked: false,
  },
];

// Define the type for a meme
interface Meme {
  id: number;
  name: string;
  image: string;
  currentStage: number;
  culturalPoints: number;
  evolutionHistory: {
    stage: number;
    date: string;
    variant: string;
  }[];
  contractAddress?: Address;
}

// Default mock meme to use if no memes are found
const mockUserMeme: Meme = {
  id: 1,
  name: 'Distracted Boyfriend',
  image: '/meme-coin.png',
  currentStage: 1,
  culturalPoints: 340,
  evolutionHistory: [
    { stage: 1, date: '2025-04-28', variant: 'Original' }
  ],
  contractAddress: '0x1234567890123456789012345678901234567890'
};

export default function OdysseyPage() {
  const { evolveMeme, isConnected, address } = useZoraCoins();
  const [userMemes, setUserMemes] = useState<Meme[]>([]);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [isEvolvingMeme, setIsEvolvingMeme] = useState(false);
  const [evolvedImagePreview, setEvolvedImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Load user memes from localStorage
  useEffect(() => {
    if (isConnected && address) {
      try {
        // Try to load memes from localStorage
        const storageKey = `memeCoins-${address}`;
        const storedMemes = localStorage.getItem(storageKey);
        
        if (storedMemes) {
          const parsedMemes = JSON.parse(storedMemes);
          console.log('Loaded memes from localStorage:', parsedMemes);
          setUserMemes(parsedMemes);
        } else {
          console.log('No memes found in localStorage');
          // If you want to use mock data when no memes are found, uncomment this
          // setUserMemes([mockUserMeme]);
        }
      } catch (error) {
        console.error('Error loading memes from localStorage:', error);
      }
    }
  }, [isConnected, address]);

  // Set first meme as selected by default
  useEffect(() => {
    if (userMemes.length > 0 && !selectedMeme) {
      setSelectedMeme(userMemes[0]);
      setActiveStage(userMemes[0].currentStage);
    }
  }, [userMemes, selectedMeme]);

  const handleMemeSelect = (meme: Meme) => {
    setSelectedMeme(meme);
    setActiveStage(meme.currentStage);
    setIsEvolvingMeme(false);
  };

  const handleStageSelect = (stageId: number) => {
    if (stageId <= (selectedMeme?.currentStage ?? 0) + 1) {
      setActiveStage(stageId);
    }
  };

  const handleStartEvolution = () => {
    setIsEvolvingMeme(true);
    // In a real implementation, we would fetch available evolution options
    setEvolvedImagePreview('/meme-coin.png');
  };

  const handleConfirmEvolution = async () => {
    if (!selectedMeme || !isConnected) return;
    
    setLoading(true);
    
    try {
      // Use the evolveMeme function from our ZoraCoinsService
      const nextStage = selectedMeme.currentStage + 1;
      const newVariant = `Evolution ${nextStage}`;
      
      if (!selectedMeme.contractAddress) {
        throw new Error("Contract address missing from meme");
      }
      
      const result = await evolveMeme(
        selectedMeme.contractAddress, 
        nextStage, 
        newVariant
      );
      
      console.log('Evolution result:', result);
      setTransactionHash(result.receipt.transactionHash);
      
      // Update the user's meme to the next stage
      const updatedMemes = userMemes.map(meme => {
        if (meme.id === selectedMeme.id) {
          return {
            ...meme,
            currentStage: nextStage,
            culturalPoints: meme.culturalPoints + 150,
            evolutionHistory: [
              ...meme.evolutionHistory,
              { stage: nextStage, date: result.evolutionDate, variant: newVariant }
            ]
          };
        }
        return meme;
      });
      
      setUserMemes(updatedMemes);
      
      // Also update the selected meme
      setSelectedMeme({
        ...selectedMeme,
        currentStage: nextStage,
        culturalPoints: selectedMeme.culturalPoints + 150,
        evolutionHistory: [
          ...selectedMeme.evolutionHistory,
          { stage: nextStage, date: result.evolutionDate, variant: newVariant }
        ]
      });
      
      // Save updated memes back to localStorage
      if (address) {
        localStorage.setItem(`memeCoins-${address}`, JSON.stringify(updatedMemes));
      }
      
      setIsEvolvingMeme(false);
      
      // Show success message (could use a toast notification in a real app)
      alert(`Meme successfully evolved to Stage ${nextStage}!`);
      
    } catch (error) {
      console.error('Error evolving meme:', error);
      alert('Evolution failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 text-white p-8">
      {/* Navigation header */}
      <Header />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent">
          Meme Odyssey Map
        </h1>
        
        {!isConnected ? (
          <div className="text-center py-16 bg-purple-800/30 rounded-xl backdrop-blur-sm">
            <h2 className="text-xl font-medium mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">You need to connect your wallet to access your meme collection and evolve your memes.</p>
            <div className="flex justify-center">
              <ConnectWallet className="px-8 py-3 text-lg" />
            </div>
          </div>
        ) : userMemes.length === 0 ? (
          <div className="text-center py-16 bg-purple-800/30 rounded-xl backdrop-blur-sm">
            <h2 className="text-xl font-medium mb-4">No Meme Coins Found</h2>
            <p className="text-gray-300 mb-6">You haven't created any meme coins yet. Start your journey by minting your first Seed Meme Coin.</p>
            <Link href="/create" className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:opacity-90 transition-opacity inline-block">
              Create Seed Meme Coin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left sidebar - Meme collection */}
            <div className="bg-purple-800/30 p-6 rounded-xl backdrop-blur-sm border border-purple-600/30 lg:col-span-1">
              <h2 className="text-xl font-medium mb-4">Your Meme Collection</h2>
              <div className="space-y-4">
                {userMemes.map(meme => (
                  <div 
                    key={meme.id}
                    onClick={() => handleMemeSelect(meme)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedMeme?.id === meme.id 
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50' 
                        : 'bg-purple-700/30 hover:bg-purple-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400/60">
                        <Image
                          src={meme.image}
                          alt={meme.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{meme.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-300">
                          <span className="text-cyan-400">Stage {meme.currentStage}</span>
                          <span>•</span>
                          <span>{meme.culturalPoints} CP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Link 
                  href="/create"
                  className="block p-4 rounded-lg bg-purple-700/30 hover:bg-purple-700/50 border border-dashed border-purple-500/50 text-center"
                >
                  <div className="flex flex-col items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">Create New</span>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Main content - Odyssey map */}
            <div className="lg:col-span-3 space-y-8">
              {selectedMeme && (
                <div className="bg-purple-800/30 p-6 rounded-xl backdrop-blur-sm border border-purple-600/30">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400">
                        <Image
                          src={selectedMeme.image}
                          alt={selectedMeme.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{selectedMeme.name}</h2>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">
                            Stage {selectedMeme.currentStage}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                            </svg>
                            <span className="text-yellow-300">{selectedMeme.culturalPoints} CP</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      href="/arena"
                      className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full hover:opacity-90 transition-opacity text-sm font-medium"
                    >
                      Enter Viral Arena
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Rest of the Odyssey Map UI here */}
              {/* ... */}
              
              {selectedMeme && (
                <div className="bg-purple-800/30 p-6 rounded-xl backdrop-blur-sm border border-purple-600/30">
                  <h2 className="text-xl font-medium mb-6">Meme Odyssey Journey</h2>
                  
                  <div className="relative">
                    {/* Odyssey path connector */}
                    <div className="absolute top-12 left-6 right-6 h-0.5 bg-gray-700 z-0">
                      <div 
                        className={`h-full bg-gradient-to-r from-red-500 to-orange-600`} 
                        style={{ width: `${(selectedMeme.currentStage - 1) * 25}%` }}
                      ></div>
                    </div>
                    
                    {/* Odyssey stages */}
                    <div className="flex justify-between relative z-10">
                      {odysseyStages.map((stage) => (
                        <div 
                          key={stage.id} 
                          onClick={() => handleStageSelect(stage.id)}
                          className={`flex flex-col items-center cursor-pointer transition-transform ${
                            activeStage === stage.id ? 'transform scale-110' : ''
                          }`}
                        >
                          <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                              stage.id <= selectedMeme.currentStage 
                                ? `bg-gradient-to-r ${stage.color} shadow-lg shadow-${stage.color.split(' ')[1].replace('to-', '')}/30` 
                                : 'bg-gray-800/70 text-gray-500'
                            }`}
                          >
                            {stage.icon}
                          </div>
                          <div className="mt-2 text-center">
                            <h3 className={`text-sm font-medium ${
                              stage.id <= selectedMeme.currentStage ? 'text-white' : 'text-gray-500'
                            }`}>{stage.name}</h3>
                            {activeStage === stage.id && (
                              <p className="text-xs text-gray-400 mt-1 max-w-[120px]">{stage.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Stage details */}
                  {!isEvolvingMeme && activeStage && (
                    <div className={`mt-8 p-5 rounded-xl ${
                      odysseyStages[activeStage - 1]?.bgColor
                    } border ${odysseyStages[activeStage - 1]?.borderColor}`}>
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-xl font-medium">
                            Stage {activeStage}: {odysseyStages[activeStage - 1]?.name}
                          </h3>
                          <p className="text-sm text-gray-300 mt-1">
                            {odysseyStages[activeStage - 1]?.description}
                          </p>
                        </div>
                        
                        {activeStage === selectedMeme.currentStage + 1 && (
                          <button
                            onClick={handleStartEvolution}
                            className={`px-4 py-2 bg-gradient-to-r ${odysseyStages[activeStage - 1]?.color} rounded-full text-sm flex items-center gap-2`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                            Evolution
                          </button>
                        )}
                      </div>
                      
                      {activeStage <= selectedMeme.currentStage && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-300 mb-2">Evolution History</h4>
                          <div className="space-y-2">
                            {selectedMeme.evolutionHistory
                              .filter(h => h.stage === activeStage)
                              .map((history, index) => (
                                <div key={index} className="bg-black/30 p-3 rounded-lg text-sm">
                                  <div className="flex justify-between">
                                    <span>{history.variant}</span>
                                    <span className="text-gray-400">{history.date}</span>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}