'use client';

import { useOCAuth } from '@opencampus/ocid-connect-js';
import { useAccount } from 'wagmi';
import { Logo } from '~/components/logo';
import { Button } from '~/components/ui/button';
import { WalletOptions } from '~/components/walletOptions';

const LoginContainer = () => {
  const { ocAuth } = useOCAuth();
  const { isConnected } = useAccount();

  const handleLogin = async () => {
    try {
      await ocAuth.signInWithRedirect({ state: 'opencampus' });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-transparent">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Logo className="w-32" />
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to LuminaFi
            </h1>
            <p className="text-sm text-muted-foreground">
              Connect your wallet to continue
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          {!isConnected && <WalletOptions />}
          {!ocAuth?.OCId && (
            <Button
              onClick={handleLogin}
              size="lg"
              variant="default"
              className="w-64"
            >
              Login with OpenCampus
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;
