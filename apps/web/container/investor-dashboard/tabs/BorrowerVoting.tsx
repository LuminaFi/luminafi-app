'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Loader2,
  ExternalLink,
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
import {
  useGetLoanCount,
  useGetMinVotesRequired,
  useGetLoanIdsByStatus,
  useGetLoanInfoBatch,
  useHasVotedForLoan,
} from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

const BorrowerVoting = () => {
  const [expandedLoan, setExpandedLoan] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [borrowerDetails, setBorrowerDetails] = useState<
    Record<string, { name: string; institution: string }>
  >({});

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

  // Get minimum votes required
  const { minVotesRequired, isLoading: minVotesLoading } =
    useGetMinVotesRequired(TESTNET_SMART_CONTRACT_ADDRESS);

  // Get total loan count
  const { loanCount, isLoading: loanCountLoading } = useGetLoanCount(
    TESTNET_SMART_CONTRACT_ADDRESS,
  );

  // Get loan IDs by status
  const { loanIds: pendingLoanIds, isLoading: pendingIdsLoading } =
    useGetLoanIdsByStatus(TESTNET_SMART_CONTRACT_ADDRESS, LoanStatus.Pending);

  const { loanIds: approvedLoanIds, isLoading: approvedIdsLoading } =
    useGetLoanIdsByStatus(TESTNET_SMART_CONTRACT_ADDRESS, LoanStatus.Approved);

  const { loanIds: activeLoanIds, isLoading: activeIdsLoading } =
    useGetLoanIdsByStatus(TESTNET_SMART_CONTRACT_ADDRESS, LoanStatus.Active);

  const { loanIds: fundedLoanIds, isLoading: fundedIdsLoading } =
    useGetLoanIdsByStatus(TESTNET_SMART_CONTRACT_ADDRESS, LoanStatus.Funded);

  // Get loan information in batches
  const allLoanIds = useMemo(() => {
    const ids = [];
    if (pendingLoanIds) ids.push(...pendingLoanIds);
    if (approvedLoanIds) ids.push(...approvedLoanIds);
    if (activeLoanIds) ids.push(...activeLoanIds);
    if (fundedLoanIds) ids.push(...fundedLoanIds);
    return ids;
  }, [pendingLoanIds, approvedLoanIds, activeLoanIds, fundedLoanIds]);

  const { loansInfo, isLoading: loansInfoLoading } = useGetLoanInfoBatch(
    TESTNET_SMART_CONTRACT_ADDRESS,
    allLoanIds,
  );

  // Check if user has voted for expanded loan
  const { hasVoted, isLoading: voteCheckLoading } = useHasVotedForLoan(
    TESTNET_SMART_CONTRACT_ADDRESS,
    expandedLoan || undefined,
    address || '0x0000000000000000000000000000000000000000',
  );

  // Voting functionality
  const { voteForLoan, isPending, isSuccess, error } = useVoteForLoan(
    TESTNET_SMART_CONTRACT_ADDRESS,
  );

  // Fetch borrower details for loans when they're expanded
  useEffect(() => {
    if (expandedLoan !== null && loansInfo) {
      const loan = loansInfo.find((l) => l.id === expandedLoan);
      if (loan && !borrowerDetails[expandedLoan]) {
        // Here you would call your contract to get borrower details
        // For demo purposes, we'll use mock data
        const mockDetails = {
          name: `Borrower ${expandedLoan}`,
          institution: `University ${expandedLoan}`,
        };
        setBorrowerDetails((prev) => ({
          ...prev,
          [expandedLoan]: mockDetails,
        }));
      }
    }
  }, [expandedLoan, loansInfo, borrowerDetails]);

  const handleVote = async (loanId: number) => {
    try {
      await voteForLoan(loanId);
      toast.success('Vote submitted successfully!');
    } catch (err) {
      console.error('Error voting for loan:', err);
      toast.error('Failed to submit vote. Please try again.');
    }
  };

  const toggleExpand = (loanId: number) => {
    setExpandedLoan(expandedLoan === loanId ? null : loanId);
  };

  // Filter loans based on search term
  const filteredLoans = useMemo(() => {
    if (!loansInfo) return [];

    return loansInfo.filter((loan) => {
      const borrowerDetail = borrowerDetails[loan.id];
      const borrowerName = borrowerDetail?.name || '';
      const institution = borrowerDetail?.institution || '';

      return (
        searchTerm === '' ||
        borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [loansInfo, borrowerDetails, searchTerm]);

  // Categorize loans by status
  const pendingLoans = useMemo(
    () => filteredLoans.filter((loan) => loan.status === LoanStatus.Pending),
    [filteredLoans],
  );

  const approvedLoans = useMemo(
    () => filteredLoans.filter((loan) => loan.status === LoanStatus.Approved),
    [filteredLoans],
  );

  const activeLoans = useMemo(
    () =>
      filteredLoans.filter(
        (loan) =>
          loan.status === LoanStatus.Active ||
          loan.status === LoanStatus.Funded,
      ),
    [filteredLoans],
  );

  const isDataLoading =
    roleLoading ||
    infoLoading ||
    poolLoading ||
    minVotesLoading ||
    loanCountLoading ||
    pendingIdsLoading ||
    approvedIdsLoading ||
    activeIdsLoading ||
    fundedIdsLoading ||
    loansInfoLoading;

  const renderLoanCard = (loan: any) => {
    const borrowerDetail = borrowerDetails[loan.id] || {
      name: 'Unknown',
      institution: 'Unknown',
    };
    const isExpanded = expandedLoan === loan.id;
    const isUserVoted = hasVoted && isExpanded;

    return (
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
                        : loan.status === LoanStatus.Funded ||
                            loan.status === LoanStatus.Active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                  }
                >
                  {LoanStatus[loan.status]}
                </Badge>
              </div>
              <CardDescription className="flex items-center mt-1">
                <GraduationCap className="w-3 h-3 mr-1" />
                {borrowerDetail.institution}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpand(loan.id)}
              className="p-1 h-8 w-8"
            >
              {isExpanded ? <ChevronUp /> : <ChevronDown />}
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
                {loan.votes}/{minVotesRequired || 5} votes
              </span>
            </div>
            <Progress
              value={(loan.votes / (minVotesRequired || 5)) * 100}
              className="h-2"
            />
          </div>

          {isExpanded && (
            <div className="mt-5 p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Borrower</h4>
                  <p className="text-sm">{borrowerDetail.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {loan.borrower}
                  </p>
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
                        /{minVotesRequired || 5} votes needed
                      </span>
                    </div>
                  </div>
                  {loan.proof && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        Supporting Documents
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 w-full"
                        onClick={() =>
                          window.open(
                            `https://ipfs.io/ipfs/${loan.proof.replace('ipfs://', '')}`,
                            '_blank',
                          )
                        }
                      >
                        <ExternalLink className="w-3 h-3 mr-1" /> View Proof
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {loan.status === LoanStatus.Pending && (
            <Button
              className="w-full"
              onClick={() => handleVote(loan.id)}
              disabled={
                !isInvestor || !hasVotingRights || isPending || isUserVoted
              }
            >
              {isPending && expandedLoan === loan.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isUserVoted ? (
                "You've Voted"
              ) : (
                'Vote to Approve'
              )}
            </Button>
          )}

          {loan.status === LoanStatus.Approved && (
            <Button variant="outline" className="w-full" disabled>
              Approved (Awaiting Funding)
            </Button>
          )}

          {(loan.status === LoanStatus.Funded ||
            loan.status === LoanStatus.Active) && (
            <Button variant="outline" className="w-full" disabled>
              Funded and Active
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Borrower Loan Proposals</h2>
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

      {/* Loading state */}
      {isDataLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading loan proposals...</p>
        </div>
      )}

      {/* Loan proposals display */}
      {!isDataLoading && (
        <Tabs
          defaultValue="pending"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">
              Pending Approval ({pendingLoans.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedLoans.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({activeLoans.length})
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

          <TabsContent value="active" className="space-y-4">
            {activeLoans.length > 0 ? (
              activeLoans.map(renderLoanCard)
            ) : (
              <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <p className="text-muted-foreground">
                  No active loans at the moment
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
      )}

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
