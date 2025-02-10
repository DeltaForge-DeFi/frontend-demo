import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createPublicClient, createWalletClient, custom, defineChain, http } from 'viem';
import { arbitrum } from 'viem/chains';

const ARBITRUM_ONE_RPC =
  'https://virtual.arbitrum.rpc.tenderly.co/6eaf7d37-d37e-4f9f-a5f8-fda8f1be72b4';

export const virtual_arbitrum_one = defineChain({
  id: 42161,
  name: 'Virtual Arbitrum One',
  nativeCurrency: { name: 'VETH', symbol: 'VETH', decimals: 18 },
  rpcUrls: {
    default: { http: [ARBITRUM_ONE_RPC] }
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'https://virtual.arbitrum.rpc.tenderly.co/420d456c-cfc8-4f87-ba74-8647d06683f3'
    }
  },
});

export const config = getDefaultConfig({
  appName: 'Delta Forge',
  //https://cloud.reown.com/ (i.e WalletConnect) 
  projectId: '6971f194512885a1ba4b83a92e478671',
  chains: [virtual_arbitrum_one],
});


export const publicClient = createPublicClient({
  chain: virtual_arbitrum_one,
  transport: http()
})

export const walletClient = createWalletClient({
  chain: virtual_arbitrum_one,
  transport: custom(window.ethereum)
})

// Infer config types
export type Config = typeof config;
