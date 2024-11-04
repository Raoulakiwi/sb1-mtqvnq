import { Chain } from 'viem';

export const pulsechain = {
  id: 369,
  name: 'PulseChain',
  network: 'pulsechain',
  nativeCurrency: {
    decimals: 18,
    name: 'Pulse',
    symbol: 'PLS',
  },
  rpcUrls: {
    default: {
      http: [
        'https://rpc.pulsechain.com',
        'https://pulsechain.publicnode.com',
        'https://rpc-pulsechain.g4mm4.io',
      ],
    },
    public: {
      http: [
        'https://rpc.pulsechain.com',
        'https://pulsechain.publicnode.com',
        'https://rpc-pulsechain.g4mm4.io',
      ],
    },
  },
  blockExplorers: {
    default: { name: 'PulseScan', url: 'https://scan.pulsechain.com' },
  },
} as const satisfies Chain;