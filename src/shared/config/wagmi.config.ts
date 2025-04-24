import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createPublicClient, createWalletClient, custom, defineChain, http } from 'viem';
import { arbitrum } from 'viem/chains';

const ARBITRUM_ONE_RPC =
  'https://virtual.arbitrum.rpc.tenderly.co/a3fbcc43-22fa-4b65-833d-af6c689e6944';

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
      url: 'https://virtual.arbitrum.rpc.tenderly.co/c0157c3a-3dd1-4e62-8545-d2ca2bab5712'
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

export const walletClient = typeof window !== 'undefined' && window.ethereum
  ? createWalletClient({
    chain: virtual_arbitrum_one,
    transport: custom(window.ethereum)
  })
  : null;

export type Config = typeof config;
