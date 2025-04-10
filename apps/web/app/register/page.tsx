'use client';

import withAuth from '~/components/withAuth';
import Register from '~/container/register';

const RegisterPage = () => {
  return <Register />;
};

export default withAuth(RegisterPage);
