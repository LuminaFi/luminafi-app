'use client';

import { OCConnect } from '@opencampus/ocid-connect-js';
import { ReactNode } from 'react';

export default function OCConnectWrapper({
  children,
  opts,
  sandboxMode,
}: {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts: any;
  sandboxMode: boolean;
}) {
  return (
    <OCConnect opts={opts} sandboxMode={sandboxMode}>
      {children}
    </OCConnect>
  );
}
