'use client';

import withAuth from '~/components/withAuth';
import ApplyContainer from '~/container/apply/Apply.container';

const ApplyPage: React.FC<any> = () => {
  return <ApplyContainer />;
};

export default withAuth(ApplyPage);
