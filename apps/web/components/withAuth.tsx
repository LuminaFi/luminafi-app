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
    const { ocAuth, isLoading: ocAuthLoading } = useOCAuth();
    const [mounted, setMounted] = useState(false);

    // Contract hooks - only run these if we have an address
    const { profile, isLoading: profileLoading } = useInvestorProfile(
      TESTNET_SMART_CONTRACT_ADDRESS,
      address || '0x0000000000000000000000000000000000000000',
    );

    const { investorInfo, isLoading: investorInfoLoading } = useInvestorInfo(
      TESTNET_SMART_CONTRACT_ADDRESS,
      address || '0x0000000000000000000000000000000000000000',
    );

    // Consolidated loading state
    const isLoading =
      ocAuthLoading || profileLoading || investorInfoLoading || !mounted;

    // Handle mounting - wait for next render cycle to ensure client-side execution
    useEffect(() => {
      const timer = setTimeout(() => {
        setMounted(true);
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    // Auth check effect - add debounce to avoid premature redirects
    useEffect(() => {
      // Only check auth state when everything is loaded and component is mounted
      if (!isLoading) {
        // Check for both OpenCampus auth and wallet connection
        const isAuthenticated = ocAuth?.OCId && isConnected;

        if (!isAuthenticated) {
          console.log('Authentication required:', {
            ocAuthPresent: !!ocAuth?.OCId,
            walletConnected: isConnected,
          });

          // Add a small delay to avoid redirection flashes
          const redirectTimer = setTimeout(() => {
            router.push('/login');
          }, 300);

          return () => clearTimeout(redirectTimer);
        }
      }
    }, [mounted, ocAuth, isLoading, isConnected, router]);

    // Only show loading while we're actually loading, not when doing auth checks
    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      );
    }

    // Return the component if authenticated
    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `WithAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAuthComponent;
};

export default withAuth;
