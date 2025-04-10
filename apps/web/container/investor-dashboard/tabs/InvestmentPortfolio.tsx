'use client';

import React from 'react';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import {
  useInvestorInfo,
  usePoolInfo,
} from '~/lib/features/contractInteractions/luminaFi';
import { TESTNET_SMART_CONTRACT_ADDRESS } from '~/lib/abis/luminaFiAbi';
import { useAccount } from 'wagmi';
import { BarChart3, TrendingUp, Users, AreaChart } from 'lucide-react';

const InvestmentPortfolio = () => {
  const { address } = useAccount();

  // Always call hooks at the top level, not conditionally
  const { investorInfo } = useInvestorInfo(
    TESTNET_SMART_CONTRACT_ADDRESS,
    address || '0x0000000000000000000000000000000000000000',
  );

  const { poolInfo } = usePoolInfo(TESTNET_SMART_CONTRACT_ADDRESS);

  // Calculate estimated earnings based on share percentage and profit
  const estimatedEarnings = investorInfo
    ? (parseFloat(investorInfo.contribution) * 0.12).toFixed(4) // Assuming 12% average return
    : '0';

  // Calculate projected annual yield
  const projectedYield =
    investorInfo && investorInfo.contribution !== '0'
      ? (
          (parseFloat(estimatedEarnings) /
            parseFloat(investorInfo.contribution)) *
          100
        ).toFixed(2)
      : '0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
        <h2 className="text-2xl font-bold">Investment Portfolio</h2>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button size="sm">Invest More</Button>
          <Button size="sm" variant="outline">
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          title="Pool Contribution"
          value={`${investorInfo?.contribution || '0'} ETH`}
          icon={<BarChart3 className="h-4 w-4" />}
          change={
            investorInfo?.sharePercentage
              ? `${(investorInfo.sharePercentage * 100).toFixed(2)}% of pool`
              : '0% of pool'
          }
          changeType="neutral"
        />
        <OverviewCard
          title="Estimated Earnings"
          value={`${estimatedEarnings} ETH`}
          icon={<TrendingUp className="h-4 w-4" />}
          change={`${projectedYield}% yield`}
          changeType="positive"
        />
        <OverviewCard
          title="Pool Statistics"
          value={poolInfo?.investorCount?.toString() || '0'}
          icon={<Users className="h-4 w-4" />}
          change={`${poolInfo?.allocatedFunds || '0'} USDC allocated`}
          changeType="neutral"
        />
        <OverviewCard
          title="Available Pool Funds"
          value={`${poolInfo?.availableFunds || '0'} USDC`}
          icon={<AreaChart className="h-4 w-4" />}
          change={`${poolInfo?.insurancePool || '0'} USDC in insurance`}
          changeType="neutral"
        />
      </div>
    </div>
  );
};

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
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentPortfolio;
