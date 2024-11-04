import { usePublicClient } from 'wagmi';
import { ERC721_ABI } from '../constants';
import { TokenHolder, TokenInfo } from '../types';
import { type Address } from 'viem';

export const useERC721Data = () => {
  const publicClient = usePublicClient();

  const fetchERC721Data = async (contractAddress: string) => {
    const contractAddr = contractAddress as Address;
    let holders: TokenHolder[] = [];
    let tokenInfo: TokenInfo;

    try {
      const supply = await publicClient.readContract({
        address: contractAddr,
        abi: ERC721_ABI,
        functionName: 'totalSupply',
      });

      if (!supply || supply === 0n) {
        throw new Error('Invalid total supply');
      }

      const uniqueHolders = new Map<string, bigint>();

      for (let tokenId = 0n; tokenId < supply; tokenId++) {
        try {
          const owner = await publicClient.readContract({
            address: contractAddr,
            abi: ERC721_ABI,
            functionName: 'ownerOf',
            args: [tokenId],
          });

          if (owner) {
            const currentBalance = uniqueHolders.get(owner as string) || 0n;
            uniqueHolders.set(owner as string, currentBalance + 1n);
          }
        } catch (err) {
          console.debug(`Token ID ${tokenId} might be burned or not exist`);
          continue;
        }
      }

      holders = Array.from(uniqueHolders.entries())
        .map(([address, balance]) => ({
          address,
          balance: balance.toString(),
          percentage: Number((balance * 100n) / supply),
          tokenId: '0'
        }))
        .sort((a, b) => b.percentage - a.percentage);

      const [name, symbol] = await Promise.all([
        publicClient.readContract({
          address: contractAddr,
          abi: ERC721_ABI,
          functionName: 'name',
        }).catch(() => 'Unknown Token'),
        publicClient.readContract({
          address: contractAddr,
          abi: ERC721_ABI,
          functionName: 'symbol',
        }).catch(() => 'UNKNOWN')
      ]);

      tokenInfo = {
        name: name as string,
        symbol: symbol as string,
        decimals: 0,
        tokenId: '0',
        totalSupply: supply.toString(),
        uniqueHolders: uniqueHolders.size
      };

      return { holders, tokenInfo };
    } catch (err) {
      console.error('Error fetching ERC721 data:', err);
      throw new Error('Failed to fetch ERC721 token data');
    }
  };

  return { fetchERC721Data };
};