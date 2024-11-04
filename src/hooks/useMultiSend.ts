import { useContractWrite, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';
import { MULTISEND_ABI, MULTISEND_ADDRESS } from '../constants';
import { TokenHolder } from '../types';
import { useState } from 'react';

interface DistributeTokensParams {
  tokenAddress: string;
  amount: bigint;
  holders: TokenHolder[];
}

export const useMultiSend = () => {
  const [isDistributing, setIsDistributing] = useState(false);

  const { write: multiSendToken, data: tokenTxData } = useContractWrite({
    address: MULTISEND_ADDRESS,
    abi: MULTISEND_ABI,
    functionName: 'multiSendToken'
  });

  const { write: multiSendNative, data: nativeTxData } = useContractWrite({
    address: MULTISEND_ADDRESS,
    abi: MULTISEND_ABI,
    functionName: 'multiSendNative'
  });

  // Watch for MultiSend events to track transaction status
  useWatchContractEvent({
    address: MULTISEND_ADDRESS,
    abi: MULTISEND_ABI,
    eventName: 'MultiSendCompleted',
    onLogs: () => {
      setIsDistributing(false);
    },
  });

  const distributeTokens = async ({ tokenAddress, amount, holders }: DistributeTokensParams) => {
    try {
      setIsDistributing(true);
      const recipients = holders.map(h => h.address);
      const totalBalance = holders.reduce((acc, h) => acc + BigInt(h.balance), 0n);
      const amounts = holders.map(h => (amount * BigInt(h.balance)) / totalBalance);

      if (tokenAddress === '') {
        // Native token (PLS) distribution
        const value = parseEther(amount.toString());
        await multiSendNative({
          args: [recipients, amounts],
          value
        });
      } else {
        // ERC20 token distribution
        await multiSendToken({
          args: [tokenAddress, recipients, amounts],
        });
      }
    } catch (error) {
      console.error('Distribution error:', error);
      setIsDistributing(false);
      throw error;
    }
  };

  return {
    distributeTokens,
    isDistributing,
    transactionHash: tokenTxData?.hash || nativeTxData?.hash
  };
};