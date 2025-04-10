'use client';

import withAuth from '~/components/withAuth';
import InvestorDashboard from '~/container/investor-dashboard/InvestorDashboard.container';

const InvestorDashboardPage: React.FC<any> = () => {
  return (
    <div className="pt-20">
      <InvestorDashboard />
    </div>
  );
};

export default withAuth(InvestorDashboardPage);
