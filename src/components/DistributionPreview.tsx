import React from 'react';
import { Distribution } from '../types';

interface DistributionPreviewProps {
  distributions: Distribution[];
  selectedTokenInfo?: {
    symbol: string;
    decimals: number;
  };
}

export const DistributionPreview: React.FC<DistributionPreviewProps> = ({
  distributions,
  selectedTokenInfo,
}) => {
  const formatAmount = (amount: bigint) => {
    if (!selectedTokenInfo) return amount.toString();
    const divisor = BigInt(10) ** BigInt(selectedTokenInfo.decimals);
    return (Number(amount) / Number(divisor)).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="space-y-2 max-h-60 overflow-auto">
        {distributions.map((dist, index) => (
          <div key={`${dist.address}-${index}`} className="flex justify-between text-sm">
            <span className="font-mono text-gray-600">
              {dist.address.slice(0, 6)}...{dist.address.slice(-4)}
            </span>
            <span className="font-medium">
              {formatAmount(dist.amount)} {selectedTokenInfo?.symbol || 'PLS'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};