'use client';

import { useState } from 'react';
import { Wallet, PieChart, History, Settings, DollarSign } from 'lucide-react';
import { cn } from '~/lib/utils';
import InvestorProfile from './tabs/InvestorProfile';
import BorrowerVoting from './tabs/BorrowerVoting';
import InvestmentPortfolio from './tabs/InvestmentPortfolio';
import TransactionHistory from './tabs/InvestorTransactionHistory';
import InvestorSettings from './tabs/InvestorSettings';

const navigation = [
  { name: 'Profile', icon: Wallet },
  { name: 'Investment Opportunities', icon: DollarSign },
  { name: 'Portfolio', icon: PieChart },
  { name: 'Transaction History', icon: History },
  { name: 'Settings', icon: Settings },
];

const InvestorDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('Profile');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Profile':
        return <InvestorProfile />;
      case 'Investment Opportunities':
        return <BorrowerVoting />;
      case 'Portfolio':
        return <InvestmentPortfolio />;
      case 'Transaction History':
        return <TransactionHistory />;
      case 'Settings':
        return <InvestorSettings />;
      default:
        return <InvestorProfile />;
    }
  };

  return (
    <section className="flex flex-col bg-zinc-50 min-h-screen px-4 pt-6 md:pt-8 dark:bg-transparent">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Investor Dashboard</h1>

        <div className="flex flex-row gap-6 bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-64 border-r border-zinc-100 dark:border-zinc-800 min-h-[calc(100vh-10rem)]">
            <nav className="flex flex-col p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <div
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm rounded-md relative cursor-pointer transition-all',
                      'hover:bg-zinc-100 dark:hover:bg-zinc-800',
                      isActive
                        ? 'font-medium text-primary bg-blue-50 dark:bg-blue-950/30'
                        : 'text-zinc-700 dark:text-zinc-300',
                    )}
                  >
                    <item.icon size={18} />
                    {item.name}
                    {isActive && (
                      <span className="absolute left-0 top-0 w-1 h-full bg-primary rounded-r-md" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-auto">{renderActiveTab()}</div>
        </div>
      </div>
    </section>
  );
};

export default InvestorDashboard;
