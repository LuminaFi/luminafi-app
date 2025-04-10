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
import { ChevronLeft, ChevronRight, Download, Eye } from 'lucide-react';
import { useState } from 'react';

// Mock transaction data
const mockTransactions = [
  {
    id: 'TX12345',
    type: 'Investment',
    recipient: 'Alex Johnson',
    description: "Funding for Master's in Computer Science",
    amount: '1.2 ETH',
    date: '2025-03-15 14:32',
    status: 'Completed',
  },
  {
    id: 'TX12346',
    type: 'Voting',
    recipient: 'Maria Silva',
    description: 'Vote for PhD in Data Science funding',
    amount: '0',
    date: '2025-03-12 09:15',
    status: 'Completed',
  },
  {
    id: 'TX12347',
    type: 'Platform Deposit',
    recipient: 'LuminaFi',
    description: 'Deposit to investment pool',
    amount: '3.0 ETH',
    date: '2025-03-10 16:45',
    status: 'Completed',
  },
  {
    id: 'TX12348',
    type: 'Return',
    recipient: 'From James Peterson',
    description: 'Monthly return payment',
    amount: '+0.08 ETH',
    date: '2025-03-05 11:20',
    status: 'Completed',
  },
  {
    id: 'TX12349',
    type: 'Investment',
    recipient: 'David Kim',
    description: 'Funding for Bachelor in Electrical Engineering',
    amount: '0.5 ETH',
    date: '2025-02-28 13:10',
    status: 'Completed',
  },
  {
    id: 'TX12350',
    type: 'Return',
    recipient: 'From Alex Johnson',
    description: 'Monthly return payment',
    amount: '+0.06 ETH',
    date: '2025-02-15 10:05',
    status: 'Completed',
  },
  {
    id: 'TX12351',
    type: 'Platform Deposit',
    recipient: 'LuminaFi',
    description: 'Deposit to investment pool',
    amount: '2.0 ETH',
    date: '2025-02-10 15:30',
    status: 'Completed',
  },
];

const TransactionHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');

  const itemsPerPage = 5;

  // Apply filters
  const filteredTransactions =
    filter === 'all'
      ? mockTransactions
      : mockTransactions.filter(
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Transactions</CardTitle>
            <CardDescription>
              View all your blockchain transactions
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
                <SelectItem value="return">Returns</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        tx.type === 'Investment'
                          ? 'bg-blue-100 text-blue-800'
                          : tx.type === 'Voting'
                            ? 'bg-purple-100 text-purple-800'
                            : tx.type === 'Platform Deposit'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
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
                  <TableCell>{new Date(tx.date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-zinc-100">
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
