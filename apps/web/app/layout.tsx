import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import OCConnectWrapper from '~/components/OCConnectWrapper';
import { ThemeProvider } from '~/components/theme-provider';
import { HeroHeader } from '~/components/header';
import { FooterComponent as Footer } from '~/components/footer';

import '../styles/output.css';

export const metadata: Metadata = {
  title: 'Create Turborepo',
  description: 'Generated by create turbo',
};

const opts = {
  redirectUri: 'http://localhost:3001/redirect',
};

export default function RootLayout({
  children,
}: Readonly<PropsWithChildren>): React.JSX.Element {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} overflow-x-hidden antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <OCConnectWrapper opts={opts} sandboxMode={true}>
            <HeroHeader />
            {children}
            <Footer />
          </OCConnectWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
