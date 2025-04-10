'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, formatUnits } from 'viem';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { useUserRole } from '~/lib/features/contractInteractions/luminaFi';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { BlockExplorerLink } from '~/components/blockExplorerLink';

// Type definition for blockchain events/transactions
interface Transaction {
  id: string; // Transaction hash
  type:
    | 'Investment'
    | 'Voting'
    | 'Platform Deposit'
    | 'Return'
    | 'Withdrawal'
    | 'Loan Request'
    | 'Loan Payment';
  recipient: string;
  description: string;
  amount: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  blockNumber: number;
}

const TransactionHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { address, isConnected } = useAccount();
  const {
    isInvestor,
    isBorrower,
    isAdmin,
    isLoading: roleLoading,
  } = useUserRole(
    TESTNET_SMART_CONTRACT_ADDRESS,
    address || '0x0000000000000000000000000000000000000000',
  );

  const itemsPerPage = 5;

  // Function to fetch events from the blockchain
  const fetchTransactionHistory = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, you would use a library like ethers.js, viem, or your blockchain provider
      // to fetch events from the contract that are relevant to the current user

      // Here is a mock implementation to simulate blockchain event fetching
      // In a real application, you'd make API calls to fetch events or use a subgraph

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Example events that would be fetched from the blockchain
      const events = [
        {
          eventName: 'InvestmentAdded',
          transactionHash: '0x123abc...',
          args: {
            investor: address,
            amountInvestmentToken: BigInt(1200000000000000000), // 1.2 ETH
          },
          blockNumber: 12345678,
          timestamp: Date.now() - 86400000 * 2, // 2 days ago
        },
        {
          eventName: 'LoanVoted',
          transactionHash: '0x456def...',
          args: {
            loanId: BigInt(1),
            voter: address,
          },
          blockNumber: 12345680,
          timestamp: Date.now() - 86400000 * 5, // 5 days ago
        },
        {
          eventName: 'VotingRightsGranted',
          transactionHash: '0x789ghi...',
          args: {
            investor: address,
          },
          blockNumber: 12345679,
          timestamp: Date.now() - 86400000 * 7, // 7 days ago
        },
        {
          eventName: 'InvestmentAdded',
          transactionHash: '0xabc123...',
          args: {
            investor: address,
            amountInvestmentToken: BigInt(3000000000000000000), // 3.0 ETH
          },
          blockNumber: 12345675,
          timestamp: Date.now() - 86400000 * 10, // 10 days ago
        },
        {
          eventName: 'ProfitDistributed',
          transactionHash: '0xdef456...',
          args: {
            totalProfit: BigInt(800000000000000000), // 0.8 ETH
          },
          blockNumber: 12345685,
          timestamp: Date.now() - 86400000 * 15, // 15 days ago
        },
        {
          eventName: 'InvestmentWithdrawn',
          transactionHash: '0xghi789...',
          args: {
            investor: address,
            amountInvestmentToken: BigInt(500000000000000000), // 0.5 ETH
          },
          blockNumber: 12345690,
          timestamp: Date.now() - 86400000 * 20, // 20 days ago
        },
      ];

      // Convert blockchain events to transaction objects
      const txs = events.map((event) => {
        let transaction: Transaction;

        switch (event.eventName) {
          case 'InvestmentAdded':
            transaction = {
              id: event.transactionHash,
              type: 'Platform Deposit',
              recipient: 'LuminaFi Pool',
              description: 'Deposit to investment pool',
              amount: formatEther(event.args.amountInvestmentToken!) + ' ETH',
              date: new Date(event.timestamp).toISOString(),
              status: 'Completed',
              blockNumber: event.blockNumber,
            };
            break;

          case 'InvestmentWithdrawn':
            transaction = {
              id: event.transactionHash,
              type: 'Withdrawal',
              recipient: 'Personal Wallet',
              description: 'Withdrawal from investment pool',
              amount: formatEther(event.args.amountInvestmentToken!) + ' ETH',
              date: new Date(event.timestamp).toISOString(),
              status: 'Completed',
              blockNumber: event.blockNumber,
            };
            break;

          case 'LoanVoted':
            transaction = {
              id: event.transactionHash,
              type: 'Voting',
              recipient: `Loan #${event.args.loanId?.toString()}`,
              description: 'Vote for loan approval',
              amount: '0 ETH',
              date: new Date(event.timestamp).toISOString(),
              status: 'Completed',
              blockNumber: event.blockNumber,
            };
            break;

          case 'VotingRightsGranted':
            transaction = {
              id: event.transactionHash,
              type: 'Investment',
              recipient: 'LuminaFi DAO',
              description: 'Received voting rights',
              amount: '0 ETH',
              date: new Date(event.timestamp).toISOString(),
              status: 'Completed',
              blockNumber: event.blockNumber,
            };
            break;

          case 'ProfitDistributed':
            transaction = {
              id: event.transactionHash,
              type: 'Return',
              recipient: 'From LuminaFi Pool',
              description: 'Profit distribution',
              amount: '+' + formatEther(event.args.totalProfit!) + ' ETH',
              date: new Date(event.timestamp).toISOString(),
              status: 'Completed',
              blockNumber: event.blockNumber,
            };
            break;

          default:
            transaction = {
              id: event.transactionHash,
              type: 'Investment',
              recipient: 'Unknown',
              description: event.eventName,
              amount: '0 ETH',
              date: new Date(event.timestamp).toISOString(),
              status: 'Completed',
              blockNumber: event.blockNumber,
            };
        }

        return transaction;
      });

      // Sort transactions by date (most recent first)
      txs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      setTransactions(txs);
    } catch (err) {
      console.error('Error fetching transaction history:', err);
      setError('Failed to load transaction history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && !roleLoading) {
      fetchTransactionHistory();
    }
  }, [address, isConnected, roleLoading]);

  // Apply filters
  const filteredTransactions =
    filter === 'all'
      ? transactions
      : transactions.filter(
          (tx) => tx.type.toLowerCase() === filter.toLowerCase(),
        );

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Export transactions as CSV
  const exportCSV = () => {
    // Create CSV header
    const headers = [
      'ID',
      'Type',
      'Recipient',
      'Description',
      'Amount',
      'Date',
      'Status',
      'Block Number',
    ];

    // Convert transactions to CSV rows
    const csvRows = [
      headers.join(','),
      ...filteredTransactions.map((tx) =>
        [
          tx.id,
          tx.type,
          tx.recipient,
          `"${tx.description}"`, // Quote description to handle commas
          tx.amount,
          new Date(tx.date).toLocaleString(),
          tx.status,
          tx.blockNumber,
        ].join(','),
      ),
    ];

    // Create CSV content
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `luminafi-transactions-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);

    // Trigger download and clean up
    link.click();
    document.body.removeChild(link);
  };

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <p className="text-lg mb-4">
              Please connect your wallet to view your transaction history
            </p>
            <Button>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Transactions</CardTitle>
            <CardDescription>
              View all your blockchain transactions with LuminaFi
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="investment">Investments</SelectItem>
                <SelectItem value="voting">Voting Activities</SelectItem>
                <SelectItem value="platform deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="return">Returns</SelectItem>
                <SelectItem value="loan request">Loan Requests</SelectItem>
                <SelectItem value="loan payment">Loan Payments</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={exportCSV}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p>Loading transaction history...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <p className="text-muted-foreground">
                No transactions found. Start investing or interacting with the
                platform to see your history.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">
                        {tx.id.slice(0, 8)}...{tx.id.slice(-6)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            tx.type === 'Investment'
                              ? 'bg-blue-100 text-blue-800'
                              : tx.type === 'Voting'
                                ? 'bg-purple-100 text-purple-800'
                                : tx.type === 'Platform Deposit'
                                  ? 'bg-green-100 text-green-800'
                                  : tx.type === 'Withdrawal'
                                    ? 'bg-red-100 text-red-800'
                                    : tx.type === 'Return'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : tx.type === 'Loan Request'
                                        ? 'bg-indigo-100 text-indigo-800'
                                        : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {tx.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.recipient}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {tx.description}
                      </TableCell>
                      <TableCell
                        className={
                          tx.amount.startsWith('+') ? 'text-green-600' : ''
                        }
                      >
                        {tx.amount}
                      </TableCell>
                      <TableCell>
                        {new Date(tx.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            tx.status === 'Completed'
                              ? 'bg-green-50 text-green-800 border-green-200'
                              : tx.status === 'Pending'
                                ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                : 'bg-red-50 text-red-800 border-red-200'
                          }
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <BlockExplorerLink
                          txHash={tx.id}
                          text={<Eye className="h-4 w-4" />}
                          variant="ghost"
                          size="icon"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
