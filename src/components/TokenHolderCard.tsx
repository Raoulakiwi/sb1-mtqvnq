import React from 'react';
import { Wallet } from 'lucide-react';

interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  totalHolders: number;
}

interface TokenHolder {
  address: string;
  balance: string;
  percentage: number;
}

interface TokenHolderCardProps {
  holder: TokenHolder;
  tokenInfo: TokenInfo | null;
  isCurrentUser: boolean;
}

export const TokenHolderCard: React.FC<TokenHolderCardProps> = ({
  holder,
  tokenInfo,
  isCurrentUser,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isCurrentUser ? 'ring-2 ring-purple-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm text-gray-600">Holder Address</p>
            <p className="font-mono text-sm break-all">{holder.address}</p>
          </div>
        </div>
        {isCurrentUser && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            You
          </span>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        <div>
          <p className="text-sm text-gray-600">Balance</p>
          <p className="text-lg font-semibold">{holder.balance} {tokenInfo?.symbol}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">Percentage</p>
          <p className="text-lg font-semibold">{holder.percentage.toFixed(2)}%</p>
        </div>
      </div>
    </div>
  );
};