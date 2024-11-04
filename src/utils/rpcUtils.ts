import { PublicClient, createPublicClient, http } from 'viem';
import { pulsechain } from '../config/chains';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createRpcClient = () => {
  let currentRpcIndex = 0;
  const rpcUrls = pulsechain.rpcUrls.public.http;

  const getNextRpcUrl = () => {
    currentRpcIndex = (currentRpcIndex + 1) % rpcUrls.length;
    return rpcUrls[currentRpcIndex];
  };

  const createClient = (rpcUrl: string): PublicClient => {
    return createPublicClient({
      chain: pulsechain,
      transport: http(rpcUrl),
      batch: {
        multicall: true,
      },
    });
  };

  let client = createClient(rpcUrls[0]);

  const withRetry = async <T>(operation: () => Promise<T>): Promise<T> => {
    let lastError: unknown;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < MAX_RETRIES - 1) {
          await sleep(RETRY_DELAY * (attempt + 1));
          client = createClient(getNextRpcUrl());
        }
      }
    }
    
    throw lastError;
  };

  return {
    client,
    withRetry,
  };
};