import { useAccount, useBalance, useContractReads } from 'wagmi';
import { ERC20_ABI } from '../constants';

// Common token addresses on PulseChain
const COMMON_TOKENS = [
  {
    address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39', // HEX
    symbol: 'HEX'
  },
  {
    address: '0x95B303987A60C71504D99Aa1b13B4DA07b0790ab', // PLSX
    symbol: 'PLSX'
  },
  {
    address: '0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d', // INC
    symbol: 'INC'
  }
] as const;

export function useWalletTokens() {
  const { address } = useAccount();
  
  // Get native PLS balance
  const { data: plsBalance } = useBalance({
    address,
    watch: true,
  });

  // Get ERC20 token balances
  const { data: tokenData } = useContractReads({
    contracts: COMMON_TOKENS.flatMap(token => ([
      {
        address: token.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address as `0x${string}`],
      },
      {
        address: token.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'decimals',
      },
      {
        address: token.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'symbol',
      }
    ])),
    enabled: !!address,
  });

  // Process token data into a more usable format
  const tokens = COMMON_TOKENS.map((token, index) => {
    const offset = index * 3;
    const balance = tokenData?.[offset]?.result;
    const decimals = tokenData?.[offset + 1]?.result;
    const symbol = tokenData?.[offset + 2]?.result || token.symbol;

    return {
      address: token.address,
      symbol,
      balance: balance?.toString() || '0',
      decimals: Number(decimals || 18),
    };
  });

  return {
    nativeBalance: {
      symbol: 'PLS',
      balance: plsBalance?.value?.toString() || '0',
      decimals: 18,
    },
    tokens,
  };
}