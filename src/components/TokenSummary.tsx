import React from 'react';
import { FileText, Users } from 'lucide-react';

interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  totalHolders: number;
}

interface TokenSummaryProps {
  tokenInfo: TokenInfo;
  contractType: 'ERC721' | 'ERC1155' | null;
  contractAddress: string;
}

export const TokenSummary: React.FC<TokenSummaryProps> = ({
  tokenInfo,
  contractType,
  contractAddress,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-5 h-5" />
            <span>Name</span>
          </div>
          <p className="text-lg font-semibold">{tokenInfo.name}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-5 h-5" />
            <span>Symbol</span>
          </div>
          <p className="text-lg font-semibold">{tokenInfo.symbol}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-5 h-5" />
            <span>Total Supply</span>
          </div>
          <p className="text-lg font-semibold">{tokenInfo.totalSupply}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span>Total Holders</span>
          </div>
          <p className="text-lg font-semibold">{tokenInfo.totalHolders}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-sm">Contract Type:</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {contractType}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-600">Contract Address:</span>
          <p className="mt-1 font-mono text-sm break-all">{contractAddress}</p>
        </div>
      </div>
    </div>
  );
};