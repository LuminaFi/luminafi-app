'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Badge } from '~/components/ui/badge';
import { Progress } from '~/components/ui/progress';
import {
  useInvestorInfo,
  useInvestmentPoolInfo,
} from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { useAccount } from 'wagmi';
import { PieChart, BarChart3, TrendingUp, Users } from 'lucide-react';

// Mock data for portfolio visualization
const mockPortfolio = {
  totalInvested: '2.5',
  totalEarned: '0.32',
  activeLoans: 3,
  completedLoans: 2,
  investmentsByEducationLevel: [
    { name: "Bachelor's", value: 30 },
    { name: "Master's", value: 50 },
    { name: 'PhD', value: 20 },
  ],
  investmentsByInstitution: [
    { name: 'MIT', value: 40 },
    { name: 'Stanford', value: 35 },
    { name: 'Berkeley', value: 25 },
  ],
  recentInvestments: [
    {
      id: 1,
      borrowerName: 'Alex Johnson',
      institution: 'Berkeley University',
      program: "Master's in Computer Science",
      amount: '1.2',
      date: '2025-03-15',
      status: 'Active',
      progress: 65,
    },
    {
      id: 2,
      borrowerName: 'Maria Silva',
      institution: 'Stanford University',
      program: 'PhD in Data Science',
      amount: '0.8',
      date: '2025-02-22',
      status: 'Active',
      progress: 40,
    },
    {
      id: 3,
      borrowerName: 'David Kim',
      institution: 'MIT',
      program: 'Bachelor in Electrical Engineering',
      amount: '0.5',
      date: '2025-01-10',
      status: 'Active',
      progress: 80,
    },
  ],
};

const InvestmentPortfolio = () => {
  const { address } = useAccount();

  // Always call hooks at the top level, not conditionally
  const { investorInfo, isLoading: infoLoading } = useInvestorInfo(
    TESTNET_SMART_CONTRACT_ADDRESS,
    address || '0x0000000000000000000000000000000000000000',
  );

  const { poolInfo, isLoading: poolLoading } = useInvestmentPoolInfo(
    TESTNET_SMART_CONTRACT_ADDRESS,
  );

  const isLoading = infoLoading || poolLoading;

  // In a real application, you'd fetch this data from your backend or smart contract
  // This is just mock data for UI demonstration

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Investment Portfolio</h2>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          title="Total Invested"
          value={`${investorInfo?.contribution || mockPortfolio.totalInvested} ETH`}
          icon={<BarChart3 className="h-4 w-4" />}
          change="+12.5%"
          changeType="positive"
        />
        <OverviewCard
          title="Estimated Earnings"
          value={`${mockPortfolio.totalEarned} ETH`}
          icon={<TrendingUp className="h-4 w-4" />}
          change="+5.2%"
          changeType="positive"
        />
        <OverviewCard
          title="Active Investments"
          value={mockPortfolio.activeLoans.toString()}
          icon={<Users className="h-4 w-4" />}
          change="No change"
          changeType="neutral"
        />
        <OverviewCard
          title="Pool Share"
          value={
            poolInfo
              ? `${((parseFloat(investorInfo?.contribution || '0') / parseFloat(poolInfo.totalPool)) * 100).toFixed(2)}%`
              : '0%'
          }
          icon={<PieChart className="h-4 w-4" />}
          change="-2.1%"
          changeType="negative"
        />
      </div>

      {/* Portfolio Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Distribution</CardTitle>
          <CardDescription>
            Breakdown of your investments by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="education">
            <TabsList className="mb-4">
              <TabsTrigger value="education">Education Level</TabsTrigger>
              <TabsTrigger value="institution">Institution</TabsTrigger>
            </TabsList>
            <TabsContent value="education">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 flex flex-col justify-center">
                  {/* In a real app, you would have a chart component here */}
                  <div className="h-60 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Pie Chart: Education Level Distribution
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {mockPortfolio.investmentsByEducationLevel.map(
                    (item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.name}</span>
                          <span>{item.value}%</span>
                        </div>
                        <Progress value={item.value} className="h-2" />
                      </div>
                    ),
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="institution">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 flex flex-col justify-center">
                  {/* In a real app, you would have a chart component here */}
                  <div className="h-60 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Bar Chart: Institution Distribution
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {mockPortfolio.investmentsByInstitution.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Investments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Investments</CardTitle>
          <CardDescription>Your active investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPortfolio.recentInvestments.map((investment) => (
              <div key={investment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{investment.borrowerName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {investment.institution}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {investment.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Program</p>
                    <p>{investment.program}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount Invested</p>
                    <p>{investment.amount} ETH</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Repayment Progress</span>
                    <span>{investment.progress}%</span>
                  </div>
                  <Progress value={investment.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Component for overview cards
const OverviewCard = ({
  title,
  value,
  icon,
  change,
  changeType,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
        </div>
        <div className="mt-4">
          <span
            className={`text-xs ${
              changeType === 'positive'
                ? 'text-green-600'
                : changeType === 'negative'
                  ? 'text-red-600'
                  : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            vs last month
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentPortfolio;
