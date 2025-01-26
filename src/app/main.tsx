import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit';

import { routeTree } from './lib/route-tree.gen';
import { config } from '@/shared/config/wagmi.config';
import { queryClient } from '@/shared/config/react-query';

import './index.css';

const rainbowTheme: Theme = {
  blurs: {
    modalOverlay: 'blur(1px)',
  },
      //@ts-ignore
  colors: {
    modalBackground: 'black',
  },
};

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  document.documentElement.classList.toggle('dark');

  const particles = Array.from({ length: 100 }).map((_, i) => (
    <div key={i} className="particle" style={{ left: `${Math.random() * 100}vw`, top: `${Math.random() * 100}vh` }}></div>
  ));

  root.render(
    <StrictMode>
      <div className="animated-background min-h-screen">
        {particles}
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider
              theme={rainbowTheme}
            >
              <RouterProvider router={router} />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </div>
    </StrictMode>,
  );
}
