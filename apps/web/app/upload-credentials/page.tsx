'use client';

import withAuth from '~/components/withAuth';
import UploadCredentialsContainer from '~/container/upload-credentials/UploadCredentials.container';

const UploadCredentialsPage: React.FC<any> = () => {
  return <UploadCredentialsContainer />;
};

export default withAuth(UploadCredentialsPage);
