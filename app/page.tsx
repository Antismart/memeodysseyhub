import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
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
              Create your own "Seed Meme" coin on the Base blockchain. Add your meme's origin story and make it unique.
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
              Evolve your meme through themed stages like "Viral Volcano" and "TikTok Tundra" while earning rewards.
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

        <div className="mt-12 p-6 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl max-w-4xl w-full backdrop-blur-sm border border-pink-500/30">
          <h3 className="text-2xl font-semibold mb-4 text-center">Featured in the Hall of Memes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Placeholder for featured memes */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-purple-700/40 rounded-lg p-4 flex flex-col items-center">
                <div className="h-32 w-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg flex items-center justify-center mb-2">
                  <Image
                    src="/meme-coin.png"
                    alt={`Top Meme #${i}`}
                    width={100}
                    height={100}
                  />
                </div>
                <h4 className="font-medium">Top Meme #{i}</h4>
                <p className="text-sm text-gray-300 mt-1">Cultural Points: {1000 - i * 200}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/hall-of-memes" className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full hover:opacity-90 transition-opacity font-medium">
              View Hall of Memes
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
