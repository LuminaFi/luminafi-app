import { http, createConfig, injected } from 'wagmi';
import { eduChainTestnet } from 'wagmi/chains';

export const config = createConfig({
  chains: [eduChainTestnet],
  transports: {
    [eduChainTestnet.id]: http(),
  },
  connectors: [
    injected(),
  ],
  ssr: true,
});
