import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createPublicClient, createWalletClient, custom, defineChain, http } from 'viem';
import { arbitrum } from 'viem/chains';


export const virtual_arbitrum_one = defineChain({
  id: 42161,
  name: 'Virtual Arbitrum One',
  nativeCurrency: { name: 'VETH', symbol: 'VETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://virtual.arbitrum.rpc.tenderly.co/359abe6c-6d76-406f-9cd8-3faa07396a42'] }
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'https://virtual.arbitrum.rpc.tenderly.co/dc6cbd97-f683-41f7-998f-e0410055afdf'
    }
  },
});

export const config = getDefaultConfig({
  appName: 'Delta Forge',
  //https://cloud.reown.com/ (i.e WalletConnect) 
  projectId: '6971f194512885a1ba4b83a92e478671',
  chains: [arbitrum],
});


export const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http()
})

export const walletClient = createWalletClient({
  chain: arbitrum,
  transport: custom(window.ethereum)
})

// Infer config types
export type Config = typeof config;
