import withAuth from '~/components/withAuth';
import Register from '~/container/register';

const RegisterPage: React.FC<any> = () => {
  return <Register />;
};

export default withAuth(RegisterPage);
