'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Progress } from '~/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Search,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { LoanStatus } from '~/lib/abis/luminaFiAbi';
import {
  useVoteForLoan,
  useUserRole,
  usePoolInfo,
  useInvestorInfo,
} from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { useAccount } from 'wagmi';

// This would come from your contract in a real application
const mockLoans = [
  {
    id: 1,
    borrower: '0x1234...5678',
    borrowerName: 'Alex Johnson',
    institution: 'Berkeley University',
    reason: "Master's Degree in Computer Science",
    proof: 'ipfs://QmHash1',
    amountStablecoin: '5000',
    termMonths: 24,
    profitSharePercentage: 1000, // 10%
    status: LoanStatus.Pending,
    votes: 3,
    totalVoters: 5,
    fundingProgress: 40,
    minVotesRequired: 5,
  },
  {
    id: 2,
    borrower: '0xabcd...efgh',
    borrowerName: 'Maria Silva',
    institution: 'Stanford University',
    reason: 'PhD in Data Science',
    proof: 'ipfs://QmHash2',
    amountStablecoin: '15000',
    termMonths: 36,
    profitSharePercentage: 1500, // 15%
    status: LoanStatus.Approved,
    votes: 7,
    totalVoters: 7,
    fundingProgress: 20,
    minVotesRequired: 5,
  },
  {
    id: 3,
    borrower: '0x9876...5432',
    borrowerName: 'David Kim',
    institution: 'MIT',
    reason: 'Bachelor in Electrical Engineering',
    proof: 'ipfs://QmHash3',
    amountStablecoin: '8000',
    termMonths: 30,
    profitSharePercentage: 1200, // 12%
    status: LoanStatus.Approved,
    votes: 6,
    totalVoters: 6,
    fundingProgress: 70,
    minVotesRequired: 5,
  },
];

const BorrowerVoting = () => {
  const [expandedLoan, setExpandedLoan] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { address, isConnected } = useAccount();

  // Get user roles and check voting rights
  const {
    isInvestor,
    hasVotingRights,
    isLoading: roleLoading,
  } = useUserRole(
    TESTNET_SMART_CONTRACT_ADDRESS,
    address || '0x0000000000000000000000000000000000000000',
  );

  // Get investor's info
  const { investorInfo, isLoading: infoLoading } = useInvestorInfo(
    TESTNET_SMART_CONTRACT_ADDRESS,
    address || '0x0000000000000000000000000000000000000000',
  );

  // Get pool information
  const { poolInfo, isLoading: poolLoading } = usePoolInfo(
    TESTNET_SMART_CONTRACT_ADDRESS,
  );

  const { voteForLoan, isPending, isSuccess, error } = useVoteForLoan(
    TESTNET_SMART_CONTRACT_ADDRESS,
  );

  const handleVote = async (loanId: number) => {
    await voteForLoan(loanId);
  };

  const toggleExpand = (loanId: number) => {
    setExpandedLoan(expandedLoan === loanId ? null : loanId);
  };

  const filteredLoans = mockLoans.filter(
    (loan) =>
      loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.reason.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const pendingLoans = filteredLoans.filter(
    (loan) => loan.status === LoanStatus.Pending,
  );
  const approvedLoans = filteredLoans.filter(
    (loan) => loan.status === LoanStatus.Approved,
  );

  const isDataLoading = roleLoading || infoLoading || poolLoading;

  const renderLoanCard = (loan: (typeof mockLoans)[0]) => (
    <Card key={loan.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{loan.reason}</CardTitle>
              <Badge
                className={
                  loan.status === LoanStatus.Pending
                    ? 'bg-yellow-100 text-yellow-800'
                    : loan.status === LoanStatus.Approved
                      ? 'bg-blue-100 text-blue-800'
                      : loan.status === LoanStatus.Active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                }
              >
                {LoanStatus[loan.status]}
              </Badge>
            </div>
            <CardDescription className="flex items-center mt-1">
              <GraduationCap className="w-3 h-3 mr-1" />
              {loan.institution}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleExpand(loan.id)}
            className="p-1 h-8 w-8"
          >
            {expandedLoan === loan.id ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="grid grid-cols-3 gap-4 text-sm mb-2">
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-medium">${loan.amountStablecoin} USDC</p>
          </div>
          <div>
            <p className="text-muted-foreground">Term</p>
            <p className="font-medium">{loan.termMonths} months</p>
          </div>
          <div>
            <p className="text-muted-foreground">Profit Share</p>
            <p className="font-medium">{loan.profitSharePercentage / 100}%</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Voting Progress</span>
            <span>
              {loan.votes}/{loan.minVotesRequired} votes
            </span>
          </div>
          <Progress
            value={(loan.votes / loan.minVotesRequired) * 100}
            className="h-2"
          />
        </div>

        {expandedLoan === loan.id && (
          <Card className="mt-5">
            <CardContent>
              <div>
                <h4 className="text-sm font-medium mb-1 text-black">
                  Borrower
                </h4>
                <p className="text-sm">{loan.borrowerName}</p>
                <p className="text-xs text-muted-foreground">{loan.borrower}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Reason for Loan</h4>
                <p className="text-sm">{loan.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h4 className="text-sm font-medium mb-1">Voting Status</h4>
                  <div className="text-sm">
                    <span className="font-medium">{loan.votes}</span>
                    <span className="text-muted-foreground">
                      /{loan.minVotesRequired} votes needed
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Supporting Documents
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 w-full"
                  >
                    View Proof
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>

      <CardFooter>
        {loan.status === LoanStatus.Pending && (
          <Button
            className="w-full"
            onClick={() => handleVote(loan.id)}
            disabled={!isInvestor || !hasVotingRights || isPending}
          >
            {isPending ? 'Processing...' : 'Vote to Approve'}
          </Button>
        )}

        {loan.status === LoanStatus.Approved && (
          <Button variant="outline" className="w-full" disabled>
            Approved (Awaiting Funding)
          </Button>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Borrower Voting</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search loans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-60"
          />
        </div>
      </div>

      {/* Investor Stats */}
      {isConnected && !isDataLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Your Investment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {investorInfo?.contribution || '0'} ETH
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {investorInfo?.sharePercentage
                  ? (investorInfo.sharePercentage * 100).toFixed(2)
                  : '0'}
                % of total pool
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Voting Status</CardTitle>
            </CardHeader>
            <CardContent>
              {hasVotingRights ? (
                <>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                    <p className="text-sm">
                      Weight: {investorInfo?.votingWeight || 1}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    You can vote on pending loan requests
                  </p>
                </>
              ) : (
                <>
                  <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Invest in the pool to gain voting rights
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-base">Pool Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Pool</p>
                  <p className="font-medium">
                    {poolInfo?.totalPool || '0'} ETH
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Investors</p>
                  <p className="font-medium">
                    {poolInfo?.investorCount || '0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Access warning for non-investors or those without voting rights */}
      {isConnected && !isDataLoading && isInvestor && !hasVotingRights && (
        <Alert variant="destructive" className="mb-6 flex gap-2 flex-col">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Voting Rights</AlertTitle>
          <AlertDescription>
            You need to invest in the LuminaFi pool to gain voting rights. Once
            you've contributed, you'll be able to vote on borrower loan
            requests.
          </AlertDescription>
        </Alert>
      )}

      {isConnected && !isDataLoading && !isInvestor && (
        <Alert className="mb-6 flex gap-2 flex-col">
          <Info className="h-4 w-4" />
          <AlertTitle>Investor Role Required</AlertTitle>
          <AlertDescription>
            Only registered investors with active investments can vote on
            borrower requests. Please register as an investor to participate.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pending Approval ({pendingLoans.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedLoans.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Requests ({filteredLoans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingLoans.length > 0 ? (
            pendingLoans.map(renderLoanCard)
          ) : (
            <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-muted-foreground">
                No pending loans available
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedLoans.length > 0 ? (
            approvedLoans.map(renderLoanCard)
          ) : (
            <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-muted-foreground">
                No approved loans ready for funding
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredLoans.length > 0 ? (
            filteredLoans.map(renderLoanCard)
          ) : (
            <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-muted-foreground">
                No loans match your search criteria
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Error display */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success message */}
      {isSuccess && (
        <Alert
          variant="default"
          className="mt-4 bg-green-50 border-green-200 text-green-800"
        >
          <Info className="h-4 w-4" />
          <AlertTitle>Vote Submitted</AlertTitle>
          <AlertDescription>
            Your vote has been successfully recorded!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default BorrowerVoting;
