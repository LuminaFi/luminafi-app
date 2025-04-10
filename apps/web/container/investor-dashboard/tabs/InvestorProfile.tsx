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
import { AlertCircle, Check, Loader2, X } from 'lucide-react';
import {
  useInvestorProfile,
  useInvestorInfo,
  usePoolInfo,
  useInvestInPool,
  useWithdrawInvestment,
  useApproveInvestmentToken,
} from '~/lib/features/contractInteractions/luminaFi';
import {
  INVESTMENT_TOKEN_ADDRESS,
  TESTNET_SMART_CONTRACT_ADDRESS,
} from '~/lib/abis/luminaFiAbi';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Button } from '~/components/ui/button';
import { WalletOptions } from '~/components/walletOptions';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { toast } from 'sonner';

// Custom Modal Component to avoid ref issues
const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed z-50 grid w-full max-w-lg scale-100 gap-4 bg-background p-6 opacity-100 sm:rounded-lg md:w-full">
        <div className="flex flex-col space-y-1.5 text-left">
          <div className="flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold leading-none tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div>{children}</div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          {footer}
        </div>
      </div>
    </div>
  );
};

const InvestorProfile = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  // Investment Modal State
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentInProgress, setInvestmentInProgress] = useState(false);
  const [investmentSuccess, setInvestmentSuccess] = useState(false);

  // Withdrawal Modal State
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawInProgress, setWithdrawInProgress] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Contract hooks
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

  // Investment hooks
  const {
    investInPool,
    hash: investmentHash,
    error: investmentError,
    isPending: isInvestmentPending,
    isSuccess: isInvestmentSuccess,
  } = useInvestInPool(TESTNET_SMART_CONTRACT_ADDRESS);

  const {
    approveToken,
    isPending: isApprovePending,
    isSuccess: isApproveSuccess,
    error: approveError,
  } = useApproveInvestmentToken(
    INVESTMENT_TOKEN_ADDRESS,
    TESTNET_SMART_CONTRACT_ADDRESS,
  );

  // Withdrawal hooks
  const {
    withdrawInvestment,
    hash: withdrawHash,
    error: withdrawError,
    isPending: isWithdrawPending,
    isSuccess: isWithdrawSuccess,
  } = useWithdrawInvestment(TESTNET_SMART_CONTRACT_ADDRESS);

  const isLoading = profileLoading || infoLoading || poolLoading;
  const error = profileError || infoError || poolError;

  // Handle investment flow
  useEffect(() => {
    if (isInvestmentPending) {
      setInvestmentInProgress(true);
    }

    if (isInvestmentSuccess) {
      setInvestmentInProgress(false);
      setInvestmentSuccess(true);

      // Show success toast
      toast('Investment Successful', {
        description: 'Your investment has been processed successfully',
        duration: 5000,
      });

      // Reset and close modal after short delay
      setTimeout(() => {
        setInvestmentSuccess(false);
        setInvestModalOpen(false);
        setInvestmentAmount('');
      }, 2000);
    }

    if (investmentError) {
      setInvestmentInProgress(false);

      // Show error toast
      toast('Investment Failed', {
        description:
          investmentError || 'There was an error processing your investment',
        duration: 5000,
      });
    }
  }, [isInvestmentPending, isInvestmentSuccess, investmentError]);

  // Handle withdrawal flow
  useEffect(() => {
    if (isWithdrawPending) {
      setWithdrawInProgress(true);
    }

    if (isWithdrawSuccess) {
      setWithdrawInProgress(false);
      setWithdrawSuccess(true);

      // Show success toast
      toast('Withdrawal Successful', {
        description: 'Your funds have been withdrawn successfully',
        duration: 5000,
      });

      // Reset and close modal after short delay
      setTimeout(() => {
        setWithdrawSuccess(false);
        setWithdrawModalOpen(false);
        setWithdrawAmount('');
      }, 2000);
    }

    if (withdrawError) {
      setWithdrawInProgress(false);

      // Show error toast
      toast('Withdrawal Failed', {
        description:
          withdrawError || 'There was an error processing your withdrawal',
        duration: 5000,
      });
    }
  }, [isWithdrawPending, isWithdrawSuccess, withdrawError]);

  const handleInvestmentSubmit = async () => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      toast('Invalid Amount', {
        description: 'Please enter a valid investment amount',
        duration: 5000,
      });
      return;
    }

    try {
      // First approve the tokens
      await approveToken(investmentAmount);

      // After approval is successful, invest
      await investInPool(investmentAmount);
    } catch (error) {
      console.error('Investment process error:', error);
      setInvestmentInProgress(false);

      toast('Investment Failed', {
        description: 'There was an error processing your investment',
        duration: 5000,
      });
    }
  };

  const handleWithdrawalSubmit = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast('Invalid Amount', {
        description: 'Please enter a valid withdrawal amount',
        duration: 5000,
      });
      return;
    }

    // Validate against user's current contribution
    if (
      investorInfo?.contribution &&
      parseFloat(withdrawAmount) > parseFloat(investorInfo.contribution)
    ) {
      toast('Invalid Amount', {
        description: 'Withdrawal amount exceeds your current contribution',
        duration: 5000,
      });
      return;
    }

    try {
      await withdrawInvestment(withdrawAmount);
    } catch (error) {
      console.error('Withdrawal error:', error);
      setWithdrawInProgress(false);

      toast('Withdrawal Failed', {
        description: 'There was an error processing your withdrawal',
        duration: 5000,
      });
    }
  };

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
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Your Investment Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => setInvestModalOpen(true)}
                      >
                        Invest More
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => setWithdrawModalOpen(true)}
                      >
                        Withdraw
                      </Button>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground">
                      Manage your investment in the pool
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Custom Modals */}
          {/* Investment Modal */}
          <Modal
            isOpen={investModalOpen}
            onClose={() => !investmentInProgress && setInvestModalOpen(false)}
            title="Invest in LuminaFi Pool"
            description="Enter the amount of ETH you would like to invest in the funding pool."
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => setInvestModalOpen(false)}
                  disabled={investmentInProgress}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvestmentSubmit}
                  disabled={
                    investmentInProgress ||
                    investmentSuccess ||
                    !investmentAmount ||
                    parseFloat(investmentAmount) <= 0
                  }
                >
                  {investmentInProgress && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {investmentSuccess && <Check className="mr-2 h-4 w-4" />}
                  {investmentInProgress
                    ? 'Processing...'
                    : investmentSuccess
                      ? 'Invested!'
                      : 'Invest'}
                </Button>
              </>
            }
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="investment-amount"
                  className="text-right col-span-1"
                >
                  Amount
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="investment-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1"
                    disabled={investmentInProgress || investmentSuccess}
                  />
                  <span className="text-sm font-medium">ETH</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground px-4">
                <p>Current pool: {poolInfo?.totalPool || '0'} ETH</p>
                <p>
                  Your contribution: {investorInfo?.contribution || '0'} ETH
                </p>
              </div>
            </div>
          </Modal>

          {/* Withdrawal Modal */}
          <Modal
            isOpen={withdrawModalOpen}
            onClose={() => !withdrawInProgress && setWithdrawModalOpen(false)}
            title="Withdraw from LuminaFi Pool"
            description="Enter the amount of ETH you would like to withdraw from the funding pool."
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => setWithdrawModalOpen(false)}
                  disabled={withdrawInProgress}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdrawalSubmit}
                  disabled={
                    withdrawInProgress ||
                    withdrawSuccess ||
                    !withdrawAmount ||
                    parseFloat(withdrawAmount) <= 0 ||
                    (investorInfo?.contribution &&
                      parseFloat(withdrawAmount) >
                        parseFloat(investorInfo.contribution)) ||
                    false
                  }
                >
                  {withdrawInProgress && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {withdrawSuccess && <Check className="mr-2 h-4 w-4" />}
                  {withdrawInProgress
                    ? 'Processing...'
                    : withdrawSuccess
                      ? 'Withdrawn!'
                      : 'Withdraw'}
                </Button>
              </>
            }
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="withdraw-amount"
                  className="text-right col-span-1"
                >
                  Amount
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    id="withdraw-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={investorInfo?.contribution}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.0"
                    className="flex-1"
                    disabled={withdrawInProgress || withdrawSuccess}
                  />
                  <span className="text-sm font-medium">ETH</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground px-4">
                <p>
                  Available to withdraw: {investorInfo?.contribution || '0'} ETH
                </p>
                {investorInfo?.contribution &&
                parseFloat(investorInfo.contribution) > 0 ? (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs"
                    onClick={() => setWithdrawAmount(investorInfo.contribution)}
                    disabled={withdrawInProgress || withdrawSuccess}
                  >
                    Withdraw maximum
                  </Button>
                ) : null}
              </div>
            </div>
          </Modal>
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
}: {
  title: string;
  value?: string;
  unit: string;
  description: string;
  highlight?: boolean;
}) => {
  return (
    <Card className="">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <p
            className={`text-2xl font-semibold ${highlight ? 'text-primary' : ''}`}
          >
            {value}
          </p>
          <span className="ml-1 text-muted-foreground">{unit}</span>
        </div>
        <p className="text-xs mt-1 text-muted-foreground">{description}</p>
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
