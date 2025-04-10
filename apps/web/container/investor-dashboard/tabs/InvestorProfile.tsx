'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Skeleton } from '~/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  useInvestorProfile,
  useInvestorInfo,
  usePoolInfo,
} from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { WalletOptions } from '~/components/walletOptions';

const InvestorProfile = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  // Always call hooks at the top level with a default address if none is available
  const {
    profile,
    error: profileError,
    isLoading: profileLoading,
  } = useInvestorProfile(
    TESTNET_SMART_CONTRACT_ADDRESS,
    address || '0x0000000000000000000000000000000000000000',
  );

  const {
    investorInfo,
    error: infoError,
    isLoading: infoLoading,
  } = useInvestorInfo(
    TESTNET_SMART_CONTRACT_ADDRESS,
    address || '0x0000000000000000000000000000000000000000',
  );

  const {
    poolInfo,
    error: poolError,
    isLoading: poolLoading,
  } = usePoolInfo(TESTNET_SMART_CONTRACT_ADDRESS);

  const isLoading = profileLoading || infoLoading || poolLoading;
  const error = profileError || infoError || poolError;

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  // Handle routing if no wallet is connected
  useEffect(() => {
    if (!isConnected && !isLoading) {
      <WalletOptions />;
    }
  }, [isConnected, isLoading, router]);

  if (!isConnected && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
        <p className="text-xl text-center mb-4">Please connect your wallet</p>
        <p className="text-muted-foreground text-center mb-6">
          You need to connect your wallet to view your investor profile
        </p>
        <Button onClick={() => router.push('/connect-wallet')}>
          Connect Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Investor Profile</h2>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <ProfileSkeleton />
      ) : profile ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt={profile.name} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription className="mt-1">
                  @{profile.userName}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Institution</p>
                  <p className="font-medium">{profile.institutionName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Source of Income
                  </p>
                  <p className="font-medium">{profile.sourceOfIncome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium text-xs truncate">
                    {profile.userAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-200">
                    {profile.registered ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Stats */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Investment Statistics</CardTitle>
              <CardDescription>
                Your investment status and voting power
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                  title="Total Contribution"
                  value={investorInfo?.contribution || '0'}
                  unit="ETH"
                  description="Your total investment in the platform"
                />
                <StatCard
                  title="Voting Weight"
                  value={investorInfo?.votingWeight?.toString() || '0'}
                  unit="Points"
                  description={
                    investorInfo?.hasVotingRight
                      ? 'You have voting rights'
                      : 'No voting rights yet'
                  }
                  highlight={investorInfo?.hasVotingRight}
                />
                <StatCard
                  title="Reputation Score"
                  value={profile.reputationScore.toString()}
                  unit="Points"
                  description="Your platform reputation score"
                />
                <StatCard
                  title="Pool Share"
                  value={
                    investorInfo?.sharePercentage
                      ? (investorInfo.sharePercentage * 100).toFixed(2) + '%'
                      : '0%'
                  }
                  unit=""
                  description={`Of total pool: ${poolInfo?.totalPool || '0'} ETH`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Platform Pool Information */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Platform Pool Information</CardTitle>
              <CardDescription>
                Overview of the investment and insurance pools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Pool Balance"
                  value={poolInfo?.totalPool || '0'}
                  unit="ETH"
                  description="Total investment tokens in the pool"
                />
                <StatCard
                  title="Available Funds"
                  value={poolInfo?.availableFunds || '0'}
                  unit="USDC"
                  description="Funds available for new loans"
                />
                <StatCard
                  title="Allocated Funds"
                  value={poolInfo?.allocatedFunds || '0'}
                  unit="USDC"
                  description="Funds currently allocated to active loans"
                />
                <StatCard
                  title="Insurance Pool"
                  value={poolInfo?.insurancePool || '0'}
                  unit="USDC"
                  description="Funds reserved for default protection"
                />
                <StatCard
                  title="Total Investors"
                  value={poolInfo?.investorCount?.toString() || '0'}
                  unit="Investors"
                  description="Number of investors in the pool"
                />
                <StatCard
                  title="Your Investment Actions"
                  actionButtons={true}
                  unit=""
                  description="Manage your investment in the pool"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
          <p className="text-xl text-center mb-2">No investor profile found</p>
          <p className="text-muted-foreground text-center mb-6">
            Please complete your registration to access the investor dashboard
          </p>
          <Button onClick={() => router.push('/register')}>
            Register as Investor
          </Button>
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  title,
  value,
  unit,
  description,
  highlight = false,
  actionButtons = false,
}: {
  title: string;
  value?: string;
  unit: string;
  description: string;
  highlight?: boolean;
  actionButtons?: boolean;
}) => {
  return (
    <Card className="">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {actionButtons ? (
          <div className="space-y-2">
            <Button size="sm" className="w-full">
              Invest More
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              Withdraw
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-baseline">
              <p
                className={`text-2xl font-semibold ${highlight ? 'text-primary' : ''}`}
              >
                {value}
              </p>
              <span className="ml-1 text-muted-foreground">{unit}</span>
            </div>
            <p className="text-xs mt-1 text-muted-foreground">{description}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const ProfileSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-3 w-20 mb-1" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-3 w-60" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg"
              >
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-6 w-20 mb-1" />
                <Skeleton className="h-2 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-3 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-lg"
              >
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-6 w-20 mb-1" />
                <Skeleton className="h-2 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorProfile;
