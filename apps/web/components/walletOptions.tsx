import * as React from 'react';
import { Connector, useConnect } from 'wagmi';
import { Button } from './ui/button';
import { metaMask } from 'wagmi/connectors';

export function WalletOptions() {
  const { connect } = useConnect();

  return <WalletOption onClick={() => connect({ connector: metaMask() })} />;
}

function WalletOption({ onClick }: { onClick: () => void }) {
  return <Button onClick={onClick}>Connect Metamask</Button>;
}
