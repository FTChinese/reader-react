import { useQuery } from '../../components/hooks/useLocation';
import { AuthLayout } from '../../components/Layout';

export function WxCallbackPage() {
  const query = useQuery();

  return (
    <AuthLayout
      title="微信登录">
      <div>Code - {query.get('code')}, State - {query.get('state')}</div>
    </AuthLayout>
  );
}
