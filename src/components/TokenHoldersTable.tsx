import React from 'react';
import { ExternalLink } from 'lucide-react';
import { TokenHolder } from '../types';

interface Props {
  holders: TokenHolder[];
  tokenSymbol: string;
}

const formatAddress = (address: string) => 
  `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

export const TokenHoldersTable: React.FC<Props> = ({ holders, tokenSymbol }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-4 px-4 font-semibold text-gray-600">Holder</th>
          <th className="text-right py-4 px-4 font-semibold text-gray-600">Token ID</th>
          <th className="text-right py-4 px-4 font-semibold text-gray-600">Balance</th>
          <th className="text-right py-4 px-4 font-semibold text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {holders.map((holder) => (
          <tr key={holder.address} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-4 px-4">
              <div className="flex items-center">
                <span className="font-mono text-sm text-gray-800">
                  {formatAddress(holder.address)}
                </span>
              </div>
            </td>
            <td className="py-4 px-4 text-right">
              <span className="text-gray-600">#{holder.tokenId}</span>
            </td>
            <td className="py-4 px-4 text-right">
              <span className="font-medium text-gray-900">
                {parseFloat(holder.balance).toLocaleString()} {tokenSymbol}
              </span>
            </td>
            <td className="py-4 px-4 text-right">
              <a
                href={`https://scan.pulsechain.com/address/${holder.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-600 hover:text-purple-800"
              >
                View <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);