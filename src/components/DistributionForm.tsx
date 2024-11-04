import React, { useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useNFTHolders } from '../hooks/useNFTHolders';
import { Search, Loader2 } from 'lucide-react';
import { ErrorMessage } from './ErrorMessage';
import { TokenSummary } from './TokenSummary';
import { TokenHolderCard } from './TokenHolderCard';
import { isAddress } from 'viem';

export function DistributionForm() {
  const { address: userAddress } = useAccount();
  const [contractAddress, setContractAddress] = useState('');
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [inputError, setInputError] = useState<string | null>(null);
  
  const {
    holders,
    tokenInfo,
    contractType,
    loading,
    error
  } = useNFTHolders(contractAddress, searchTrigger);

  const handleSearch = useCallback(() => {
    setInputError(null);
    
    if (!contractAddress) {
      setInputError('Please enter a contract address');
      return;
    }

    if (!isAddress(contractAddress)) {
      setInputError('Please enter a valid contract address');
      return;
    }

    setSearchTrigger(prev => prev + 1);
  }, [contractAddress]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700 mb-1">
            NFT Contract Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="contractAddress"
              value={contractAddress}
              onChange={(e) => {
                setContractAddress(e.target.value);
                setInputError(null);
              }}
              onKeyPress={handleKeyPress}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Enter NFT contract address"
              disabled={loading}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !contractAddress}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {inputError && <ErrorMessage message={inputError} />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && contractType && holders.length > 0 && (
          <div className="space-y-6">
            <TokenSummary 
              tokenInfo={tokenInfo}
              contractType={contractType}
              contractAddress={contractAddress}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Token Holders</h3>
              {holders.map((holder, index) => (
                <TokenHolderCard
                  key={`${holder.address}-${index}`}
                  holder={holder}
                  tokenInfo={tokenInfo}
                  isCurrentUser={holder.address.toLowerCase() === userAddress?.toLowerCase()}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && holders.length === 0 && searchTrigger > 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No token holders found for this contract.</p>
          </div>
        )}
      </div>
    </div>
  );
}