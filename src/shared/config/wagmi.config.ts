import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createPublicClient, createWalletClient, custom, defineChain, http } from 'viem';
import { arbitrum } from 'viem/chains';

const ARBITRUM_ONE_RPC =
  'https://virtual.arbitrum.rpc.tenderly.co/fec9fdf9-2e31-48ac-9e82-ec64365e36d5';

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
      url: 'https://virtual.arbitrum.rpc.tenderly.co/8feb0b06-2fc4-40e2-a043-686d81403e32'
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
