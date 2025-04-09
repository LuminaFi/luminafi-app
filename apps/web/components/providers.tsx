'use client';

import { PropsWithChildren } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import OCConnectWrapper from '~/components/OCConnectWrapper';
import { ThemeProvider } from '~/components/theme-provider';
import { config as wagmiConfig } from '~/lib/wagmi';

const opts = {
  redirectUri: 'http://localhost:3001/redirect',
};

const queryClient = new QueryClient();

export default function Providers({
  children,
}: Readonly<PropsWithChildren>): React.JSX.Element {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <OCConnectWrapper opts={opts} sandboxMode={true}>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </OCConnectWrapper>
    </ThemeProvider>
  );
}
