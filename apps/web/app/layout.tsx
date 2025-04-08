import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import '../styles/output.css';
import Providers from '~/components/providers';
import { HeroHeader } from '~/components/header';
import { FooterComponent as Footer } from '~/components/footer';

export const metadata: Metadata = {
  title: 'LuminaFi - Student Funding Platform',
  description:
    'A decentralized platform connecting students with investors for educational funding opportunities',
  keywords: [
    'education funding',
    'student finance',
    'blockchain',
    'defi',
    'web3',
  ],
  authors: [
    {
      name: 'LuminaFi Team',
    },
  ],
  openGraph: {
    title: 'LuminaFi - Student Funding Platform',
    description:
      'A decentralized platform connecting students with investors for educational funding opportunities',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<PropsWithChildren>): React.JSX.Element {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} overflow-x-hidden antialiased`}
      >
        <Providers>
          <>
            <HeroHeader />
            {children}
            <Footer />
          </>
        </Providers>
      </body>
    </html>
  );
}
