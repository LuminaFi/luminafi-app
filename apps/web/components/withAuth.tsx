'use client';

import { useRouter } from 'next/navigation';
import { useEffect, ComponentType, useState } from 'react';
import { useOCAuth } from '@opencampus/ocid-connect-js';
import { Loading } from '~/components/loading';
import {
  useInvestorInfo,
  useInvestorProfile,
} from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { useAccount } from 'wagmi';

interface WithAuthProps {
  [key: string]: any;
}

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>,
) => {
  const WithAuthComponent = (props: P) => {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { ocAuth, isLoading } = useOCAuth();
    const [mounted, setMounted] = useState(false);

    // Contract hooks
    const { profile } = useInvestorProfile(
      TESTNET_SMART_CONTRACT_ADDRESS,
      address || '0x0000000000000000000000000000000000000000',
    );

    const { investorInfo } = useInvestorInfo(
      TESTNET_SMART_CONTRACT_ADDRESS,
      address || '0x0000000000000000000000000000000000000000',
    );

    // Handle mounting
    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    // Auth check effect
    useEffect(() => {
      if (
        mounted &&
        !isLoading &&
        (!ocAuth?.OCId ||
        !isConnected)
      ) {
        router.push('/login');
      }
    }, [
      mounted,
      ocAuth,
      isLoading,
      isConnected,
      profile,
      investorInfo,
      router,
    ]);

    if (!mounted || isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
};

export default withAuth;
