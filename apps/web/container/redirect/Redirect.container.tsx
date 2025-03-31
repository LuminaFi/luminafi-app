'use client';

import { LoginCallBack, useOCAuth } from '@opencampus/ocid-connect-js';
import { useRouter } from 'next/navigation';
import { Loading } from '~/components/loading';

const RedirectContainer = () => {
  const router = useRouter();

  const loginSuccess = () => {
    router.push('/');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loginError = (error: any) => {
    console.error('Login error:', error);
  };

  const CustomErrorComponent = () => {
    const { authState } = useOCAuth();
    return <div>Error Logging in: {authState.error?.message}</div>;
  };

  const CustomLoadingComponent = () => {
    return <Loading />;
  };

  return (
    <LoginCallBack
      errorCallback={loginError}
      successCallback={loginSuccess}
      customErrorComponent={<CustomErrorComponent />}
      customLoadingComponent={<CustomLoadingComponent />}
    />
  );
};

export default RedirectContainer;
