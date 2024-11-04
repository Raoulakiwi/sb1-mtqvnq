import { http, createConfig } from 'wagmi';
import { pulsechain } from 'wagmi/chains';

export const config = createConfig({
  chains: [pulsechain],
  transports: {
    [pulsechain.id]: http('https://rpc.pulsechain.com'),
  },
});