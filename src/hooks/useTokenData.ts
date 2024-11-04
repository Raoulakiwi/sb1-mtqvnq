import { useContractRead } from 'wagmi';
import { ERC20_ABI } from '../constants';

export const useTokenData = (tokenAddress: string) => {
  const { data: name } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'name',
  });

  const { data: symbol } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
  });

  const { data: decimals } = useContractRead({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });

  return {
    name: name as string,
    symbol: symbol as string,
    decimals: decimals as number,
  };
};