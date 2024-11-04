export type ContractType = 'ERC721' | 'ERC1155';

export interface TokenHolder {
  address: string;
  balance: string;
  percentage: number;
  tokenId?: string;
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  tokenId: string;
  totalSupply: string;
  uniqueHolders: number;
}

export interface TokenHolderCardProps {
  holder: TokenHolder;
  tokenInfo: TokenInfo;
  isCurrentUser?: boolean;
}

export interface TokenSummaryProps {
  tokenInfo: TokenInfo;
  contractType: ContractType;
  contractAddress: string;
}