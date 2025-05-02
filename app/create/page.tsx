'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ConnectWallet from '../components/ConnectWallet';
import { useZoraCoins } from '../components/ZoraCoinsService';
import Header from '../components/Header';

// Define interface for meme coin data structure
interface MemeCoin {
  id: number;
  name: string;
  symbol: string;
  description: string;
  image: string;
  currentStage: number;
  culturalPoints: number;
  evolutionHistory: {
    stage: number;
    date: string;
    variant: string;
  }[];
  originStory: string;
  tags: string[];
  contractAddress: string;
}

export default function CreatePage() {
  const { mintContentCoin, isConnected, address } = useZoraCoins();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('/meme-coin.png'); // Default image
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originStory, setOriginStory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [supply, setSupply] = useState(1000000); // Default supply of 1 million tokens
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create a temporary URL for the selected image
      const objectURL = URL.createObjectURL(file);
      setImageURL(objectURL);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return imageURL;
    
    // In a real implementation, we would upload the image to IPFS
    // For this prototype, we'll just use the fake URL
    return imageURL;
  };

  const saveToLocalStorage = (memeCoin: MemeCoin) => {
    if (!address) return;
    
    try {
      // Get existing meme coins from local storage
      const storageKey = `memeCoins-${address}`;
      const existingMemeCoinsJson = localStorage.getItem(storageKey);
      let existingMemeCoins: MemeCoin[] = [];
      
      if (existingMemeCoinsJson) {
        existingMemeCoins = JSON.parse(existingMemeCoinsJson);
      }
      
      // Add the new meme coin
      existingMemeCoins.push(memeCoin);
      
      // Save back to local storage
      localStorage.setItem(storageKey, JSON.stringify(existingMemeCoins));
      
      console.log('Meme coin saved to local storage:', memeCoin);
    } catch (error) {
      console.error('Error saving meme coin to local storage:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      setLoading(true);

      // Upload image to IPFS (or just use our mock in this case)
      const imageURI = await uploadImage();

      // Mint the content coin
      const result = await mintContentCoin({
        name,
        symbol,
        description,
        imageURI,
        originStory,
        tags: tags.split(',').map(tag => tag.trim()),
        supply,
      });

      console.log('Mint result:', result);
      setTransactionHash(result.receipt.transactionHash);
      setContractAddress(result.token.address);
      
      // Create a meme coin object
      const newMemeCoin: MemeCoin = {
        id: Date.now(), // Use timestamp as unique ID
        name,
        symbol,
        description,
        image: imageURI,
        currentStage: 1,
        culturalPoints: 0,
        evolutionHistory: [
          { 
            stage: 1, 
            date: new Date().toISOString().split('T')[0], 
            variant: 'Original' 
          }
        ],
        originStory,
        tags: tags.split(',').map(tag => tag.trim()),
        contractAddress: result.token.address
      };
      
      // Save to localStorage
      saveToLocalStorage(newMemeCoin);
      
      setMintSuccess(true);
    } catch (error) {
      console.error('Error creating meme coin:', error);
      alert('Failed to create meme coin. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setSymbol('');
    setDescription('');
    setImageURL('/meme-coin.png');
    setSelectedFile(null);
    setOriginStory('');
    setTags('');
    setTransactionHash(null);
    setContractAddress(null);
    setMintSuccess(false);
    setSupply(1000000); // Reset supply to default
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 text-white p-8">
      {/* Navigation header */}
      <Header />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Create Your Meme Coin
        </h1>

        {!isConnected ? (
          <div className="text-center py-16 bg-purple-800/30 rounded-xl backdrop-blur-sm">
            <h2 className="text-xl font-medium mb-4">Connect Your Wallet</h2>
            <p className="text-gray-300 mb-6">You need to connect your wallet to create a meme coin.</p>
            <div className="flex justify-center">
              <ConnectWallet className="px-8 py-3 text-lg" />
            </div>
          </div>
        ) : mintSuccess ? (
          <div className="bg-purple-800/30 p-8 rounded-xl backdrop-blur-sm border border-purple-600/30">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Success! Your Meme Coin is Minted</h2>
              <p className="text-gray-300 mb-6">Your meme coin is now on the blockchain. Let the evolution journey begin!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="relative w-full h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-purple-500/30">
                  <Image
                    src={imageURL}
                    alt={name}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">{name}</h3>
                  <p className="text-sm text-gray-400">Symbol: {symbol}</p>
                </div>
                
                <div className="bg-purple-900/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Transaction Hash:</h4>
                  <a 
                    href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 break-all hover:underline"
                  >
                    {transactionHash}
                  </a>
                </div>
                
                <div className="bg-purple-900/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Contract Address:</h4>
                  <a 
                    href={`https://sepolia.basescan.org/address/${contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-cyan-400 break-all hover:underline"
                  >
                    {contractAddress}
                  </a>
                </div>
                
                <div className="flex flex-wrap gap-2 my-4">
                  {tags.split(',').map((tag, index) => (
                    <span key={index} className="text-xs bg-purple-700/50 px-2 py-0.5 rounded-full">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <Link 
                    href="/odyssey" 
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:opacity-90 transition-opacity flex-1 text-center"
                  >
                    View in Odyssey
                  </Link>
                  <Link 
                    href="/arena" 
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:opacity-90 transition-opacity flex-1 text-center"
                  >
                    Enter Viral Arena
                  </Link>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-500 rounded-full hover:bg-gray-800/30 transition-colors"
                  >
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-purple-800/30 p-8 rounded-xl backdrop-blur-sm border border-purple-600/30">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-medium mb-6">Meme Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Meme Name*</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-purple-900/50 border border-purple-600/50 rounded-lg p-2 text-white"
                      placeholder="e.g. Distracted Boyfriend"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Symbol*</label>
                    <input 
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      required
                      maxLength={5}
                      className="w-full bg-purple-900/50 border border-purple-600/50 rounded-lg p-2 text-white"
                      placeholder="e.g. MEME"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max 5 characters, automatically uppercase</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description*</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={3}
                      className="w-full bg-purple-900/50 border border-purple-600/50 rounded-lg p-2 text-white"
                      placeholder="A brief description of your meme"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Origin Story</label>
                    <textarea
                      value={originStory}
                      onChange={(e) => setOriginStory(e.target.value)}
                      rows={3}
                      className="w-full bg-purple-900/50 border border-purple-600/50 rounded-lg p-2 text-white"
                      placeholder="Where did this meme originate? Tell its story..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma-separated)</label>
                    <input 
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full bg-purple-900/50 border border-purple-600/50 rounded-lg p-2 text-white"
                      placeholder="e.g. funny, classic, viral"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Supply*</label>
                    <input 
                      type="number"
                      value={supply}
                      onChange={(e) => setSupply(Number(e.target.value))}
                      required
                      className="w-full bg-purple-900/50 border border-purple-600/50 rounded-lg p-2 text-white"
                      placeholder="e.g. 1000000"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-medium mb-6">Meme Image</h2>
                
                <div className="text-center">
                  <div 
                    className="relative w-full h-64 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500/80 mb-4 cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Image
                      src={imageURL}
                      alt="Meme Preview"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-4 py-2 bg-purple-700/80 backdrop-blur-sm rounded-lg">
                        Change Image
                      </div>
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <p className="text-sm text-gray-400">Click to upload or change your meme image</p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="bg-purple-900/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Minting Information</h3>
                    <p className="text-xs text-gray-400">
                      Your meme coin will be created on the Base Sepolia testnet. 
                      This is a testnet for development purposes only.
                    </p>
                  </div>
                  
                  <div className="bg-purple-900/50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Connected Wallet</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-cyan-100">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:opacity-90 transition-opacity flex items-center gap-2 ${
                        loading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </>
                      ) : 'Create Meme Coin'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}