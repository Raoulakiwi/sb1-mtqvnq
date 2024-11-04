import { useCallback } from 'react';
import { parseAbiItem } from 'viem';
import { createRpcClient } from '../utils/rpcUtils';
import { TokenHolder, TokenInfo } from '../types';

const TRANSFER_SINGLE_EVENT = parseAbiItem('event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value)');
const TRANSFER_BATCH_EVENT = parseAbiItem('event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values)');

// Reduced chunk size for better performance
const CHUNK_SIZE = BigInt(5000);
const MAX_BLOCKS_TO_SCAN = BigInt(100000); // Limit the total blocks to scan

export const useERC1155Data = () => {
  const fetchERC1155Data = useCallback(async (contractAddress: string): Promise<{ holders: TokenHolder[], tokenInfo: TokenInfo }> => {
    const { client, withRetry } = createRpcClient();

    try {
      const toBlock = await withRetry(() => client.getBlockNumber());
      const fromBlock = toBlock - MAX_BLOCKS_TO_SCAN > 0n ? toBlock - MAX_BLOCKS_TO_SCAN : BigInt(0);
      const holderMap = new Map<string, bigint>();

      // Process blocks in parallel chunks
      const chunks: { start: bigint; end: bigint }[] = [];
      for (let start = fromBlock; start <= toBlock; start += CHUNK_SIZE) {
        const end = start + CHUNK_SIZE > toBlock ? toBlock : start + CHUNK_SIZE;
        chunks.push({ start, end });
      }

      await Promise.all(
        chunks.map(async ({ start, end }) => {
          try {
            const [singleTransfers, batchTransfers] = await withRetry(() =>
              Promise.all([
                client.getLogs({
                  address: contractAddress,
                  event: TRANSFER_SINGLE_EVENT,
                  fromBlock: start,
                  toBlock: end,
                }),
                client.getLogs({
                  address: contractAddress,
                  event: TRANSFER_BATCH_EVENT,
                  fromBlock: start,
                  toBlock: end,
                }),
              ])
            );

            // Process transfers
            for (const log of singleTransfers) {
              const { from, to, value } = log.args;
              
              if (from && from !== '0x0000000000000000000000000000000000000000') {
                const currentBalance = holderMap.get(from) || BigInt(0);
                holderMap.set(from, currentBalance - value);
              }
              
              if (to && to !== '0x0000000000000000000000000000000000000000') {
                const currentBalance = holderMap.get(to) || BigInt(0);
                holderMap.set(to, currentBalance + value);
              }
            }

            for (const log of batchTransfers) {
              const { from, to, values } = log.args;
              if (!values) continue;
              
              const totalValue = values.reduce((acc, val) => acc + val, BigInt(0));
              
              if (from && from !== '0x0000000000000000000000000000000000000000') {
                const currentBalance = holderMap.get(from) || BigInt(0);
                holderMap.set(from, currentBalance - totalValue);
              }
              
              if (to && to !== '0x0000000000000000000000000000000000000000') {
                const currentBalance = holderMap.get(to) || BigInt(0);
                holderMap.set(to, currentBalance + totalValue);
              }
            }
          } catch (error) {
            console.error('Error processing chunk:', error);
          }
        })
      );

      // Calculate totals and format holders
      const totalSupply = Array.from(holderMap.values())
        .reduce((acc, val) => acc + (val > 0n ? val : 0n), BigInt(0));

      const holders = Array.from(holderMap.entries())
        .filter(([_, balance]) => balance > BigInt(0))
        .map(([address, balance]) => ({
          address,
          balance: balance.toString(),
          percentage: Number((balance * BigInt(10000) / (totalSupply || 1n)) * BigInt(100)) / 10000,
          tokenId: '0'
        }))
        .sort((a, b) => b.percentage - a.percentage);

      return {
        holders,
        tokenInfo: {
          name: 'ERC1155 Collection',
          symbol: 'NFT',
          decimals: 0,
          tokenId: '0',
          totalSupply: totalSupply.toString(),
          uniqueHolders: holders.length
        }
      };
    } catch (error) {
      console.error('Error fetching ERC1155 data:', error);
      throw new Error('Failed to fetch ERC1155 token data');
    }
  }, []);

  return { fetchERC1155Data };
};