import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Search } from 'lucide-react';
import { useNFTHolders } from './hooks/useNFTHolders';
import { TokenSummary } from './components/TokenSummary';
import { TokenHolderCard } from './components/TokenHolderCard';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const { address: userAddress } = useAccount();
  
  const { holders, tokenInfo, contractType, loading, error } = useNFTHolders(
    contractAddress,
    searchTrigger
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  placeholder="Enter NFT Contract Address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={!contractAddress || loading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && <ErrorMessage message={error} />}

          {/* Token Summary */}
          {tokenInfo && (
            <TokenSummary
              tokenInfo={tokenInfo}
              contractType={contractType}
              contractAddress={contractAddress}
            />
          )}

          {/* Holders List */}
          {holders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Token Holders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {holders.map((holder) => (
                  <TokenHolderCard
                    key={holder.address}
                    holder={holder}
                    tokenInfo={tokenInfo}
                    isCurrentUser={userAddress?.toLowerCase() === holder.address.toLowerCase()}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;