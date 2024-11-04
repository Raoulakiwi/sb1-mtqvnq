import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Token {
  address: string;
  symbol: string;
  balance: string;
  decimals: number;
}

interface TokenSelectorProps {
  selectedToken: string;
  tokens: Token[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (address: string) => void;
  selectedTokenInfo?: Token;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  tokens,
  isOpen,
  onToggle,
  onSelect,
  selectedTokenInfo,
}) => {
  const formatBalance = (balance: string, decimals: number) => {
    const value = BigInt(balance);
    const divisor = BigInt(10) ** BigInt(decimals);
    return (Number(value) / Number(divisor)).toLocaleString(undefined, {
      maximumFractionDigits: 4,
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent flex items-center justify-between"
      >
        <span className="flex items-center">
          {selectedTokenInfo ? (
            <>
              <span className="font-medium">{selectedTokenInfo.symbol}</span>
              <span className="ml-2 text-gray-500">
                Balance: {formatBalance(selectedTokenInfo.balance, selectedTokenInfo.decimals)}
              </span>
            </>
          ) : (
            'Select Token'
          )}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="p-2 space-y-1">
            {tokens.map((token) => (
              <button
                key={token.address}
                onClick={() => onSelect(token.address)}
                className={`w-full px-4 py-2 text-left rounded hover:bg-gray-50 flex items-center justify-between ${
                  selectedToken === token.address ? 'bg-purple-50' : ''
                }`}
              >
                <span className="font-medium">{token.symbol}</span>
                <span className="text-gray-500">
                  {formatBalance(token.balance, token.decimals)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};