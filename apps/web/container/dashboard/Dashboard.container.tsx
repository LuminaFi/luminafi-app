'use client';

import { useState } from 'react';
import { FileText, UserCircle } from 'lucide-react';
import { cn } from '~/lib/utils';

const navigation = [
  { name: 'Profile', icon: UserCircle },
  { name: 'Credentials', icon: FileText },
];

const DashboardContainer = () => {
  const [activeTab, setActiveTab] = useState<string>('Profile');

  return (
    <section className="flex flex-col bg-zinc-50 px-4 pt-16 md:pt-32 dark:bg-transparent">
      <div className="flex flex-1 justify-center">
        <div className="flex flex-row gap-10 relative w-[50%] self-center">
          <div className="w-48 border-r-zinc-50 border-r left-0">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const isActive = activeTab === item.name;
                return (
                  <div
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm rounded-md relative cursor-pointer',
                      'hover:bg-zinc-100 dark:hover:bg-zinc-800',
                      isActive && 'font-medium text-primary',
                    )}
                  >
                    <item.icon size={20} />
                    {item.name}
                    {isActive && (
                      <span className="absolute left-0 w-1 h-full bg-primary rounded-r-md" />
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {activeTab === 'Profile' ? (
            <div className="w-full">
              <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
                Profile
              </h1>
            </div>
          ) : null}
          {activeTab === 'Credentials' ? (
            <div className="w-full">
              <h1 className="text-title mb-4 mt-4 text-4xl font-semibold">
                Credentials
              </h1>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default DashboardContainer;
