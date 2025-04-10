'use client';

import { useState } from 'react';
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
import { ChevronDown, ChevronUp, GraduationCap, Search } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { LoanStatus } from '~/lib/abis/luminaFiAbi';
import {
  useVoteForLoan,
  useInvestInLuminaFi,
} from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { formatEther, parseEther } from 'viem';

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

const InvestmentOpportunities = () => {
  const [expandedLoan, setExpandedLoan] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [investAmount, setInvestAmount] = useState<{ [key: number]: string }>(
    {},
  );

  const { voteForLoan } = useVoteForLoan(TESTNET_SMART_CONTRACT_ADDRESS);
  const { investInLuminaFi } = useInvestInLuminaFi(
    TESTNET_SMART_CONTRACT_ADDRESS,
  );

  const handleVote = async (loanId: number) => {
    await voteForLoan(loanId);
  };

  const handleInvest = async (loanId: number) => {
    const amount = investAmount[loanId];
    if (!amount) return;

    await investInLuminaFi(amount);

    // Clear input after investment
    setInvestAmount({
      ...investAmount,
      [loanId]: '',
    });
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
            <span>Funding Progress</span>
            <span>{loan.fundingProgress}%</span>
          </div>
          <Progress value={loan.fundingProgress} className="h-2" />
        </div>

        {expandedLoan === loan.id && (
          <div className="mt-4 space-y-4 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-md">
            <div>
              <h4 className="text-sm font-medium mb-1">Borrower</h4>
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
                    /{loan.minVotesRequired} votes
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
          </div>
        )}
      </CardContent>

      <CardFooter>
        {loan.status === LoanStatus.Pending && (
          <Button className="w-full" onClick={() => handleVote(loan.id)}>
            Vote to Approve
          </Button>
        )}

        {loan.status === LoanStatus.Approved && (
          <div className="w-full grid grid-cols-3 gap-2">
            <Input
              type="number"
              placeholder="ETH amount"
              className="col-span-2"
              value={investAmount[loan.id] || ''}
              onChange={(e) =>
                setInvestAmount({
                  ...investAmount,
                  [loan.id]: e.target.value,
                })
              }
            />
            <Button
              onClick={() => handleInvest(loan.id)}
              disabled={!investAmount[loan.id]}
            >
              Invest
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investment Opportunities</h2>
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

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All Loans ({filteredLoans.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval ({pendingLoans.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Ready for Funding ({approvedLoans.length})
          </TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};

export default InvestmentOpportunities;
