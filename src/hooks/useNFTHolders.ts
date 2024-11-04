import { useState, useEffect } from 'react';
import { createPublicClient, http, parseAbi } from 'viem';
import { pulsechain } from 'wagmi/chains';

const publicClient = createPublicClient({
  chain: pulsechain,
  transport: http('https://rpc.pulsechain.com'),
});

const ERC721_ABI = parseAbi([
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
]);

const ERC1155_ABI = parseAbi([
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function uri(uint256 id) view returns (string)',
  'event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)',
  'event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)',
]);

interface TokenHolder {
  address: string;
  balance: string;
  percentage: number;
}

interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  totalHolders: number;
}

export const useNFTHolders = (contractAddress: string, trigger: number) => {
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [contractType, setContractType] = useState<'ERC721' | 'ERC1155' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contractAddress || !trigger) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try ERC721 first
        try {
          const name = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: ERC721_ABI,
            functionName: 'name',
          });
          
          const symbol = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: ERC721_ABI,
            functionName: 'symbol',
          });
          
          const totalSupply = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: ERC721_ABI,
            functionName: 'totalSupply',
          });

          setContractType('ERC721');
          
          // Get transfer events
          const transferEvents = await publicClient.getLogs({
            address: contractAddress as `0x${string}`,
            event: ERC721_ABI[5],
            fromBlock: 0n,
            toBlock: 'latest',
          });

          // Process holders
          const holdersMap = new Map<string, bigint>();
          
          for (const event of transferEvents) {
            const to = event.args.to as string;
            const from = event.args.from as string;
            
            if (from !== '0x0000000000000000000000000000000000000000') {
              const currentBalance = holdersMap.get(from) || 0n;
              holdersMap.set(from, currentBalance - 1n);
            }
            
            const currentBalance = holdersMap.get(to) || 0n;
            holdersMap.set(to, currentBalance + 1n);
          }

          const holdersList = Array.from(holdersMap.entries())
            .filter(([_, balance]) => balance > 0n)
            .map(([address, balance]) => ({
              address,
              balance: balance.toString(),
              percentage: Number((balance * 100n) / BigInt(totalSupply.toString())),
            }));

          setHolders(holdersList);
          setTokenInfo({
            name: name.toString(),
            symbol: symbol.toString(),
            totalSupply: totalSupply.toString(),
            totalHolders: holdersList.length,
          });
          
          return;
        } catch (e) {
          // Not an ERC721, try ERC1155
          const events = await publicClient.getLogs({
            address: contractAddress as `0x${string}`,
            event: ERC1155_ABI[2],
            fromBlock: 0n,
            toBlock: 'latest',
          });

          setContractType('ERC1155');

          const holdersMap = new Map<string, bigint>();
          let totalTokens = 0n;

          for (const event of events) {
            const to = event.args.to as string;
            const from = event.args.from as string;
            const value = event.args.value as bigint;

            if (from !== '0x0000000000000000000000000000000000000000') {
              const currentBalance = holdersMap.get(from) || 0n;
              holdersMap.set(from, currentBalance - value);
            }

            const currentBalance = holdersMap.get(to) || 0n;
            holdersMap.set(to, currentBalance + value);
            totalTokens += value;
          }

          const holdersList = Array.from(holdersMap.entries())
            .filter(([_, balance]) => balance > 0n)
            .map(([address, balance]) => ({
              address,
              balance: balance.toString(),
              percentage: Number((balance * 100n) / totalTokens),
            }));

          setHolders(holdersList);
          setTokenInfo({
            name: 'ERC1155 Token',
            symbol: 'NFT',
            totalSupply: totalTokens.toString(),
            totalHolders: holdersList.length,
          });
        }
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Error fetching token data. Please check the contract address and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contractAddress, trigger]);

  return { holders, tokenInfo, contractType, loading, error };
};