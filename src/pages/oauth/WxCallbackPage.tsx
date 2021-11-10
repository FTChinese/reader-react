import { useQuery } from '../../components/hooks/useLocation';
import { AuthLayout } from '../../components/Layout';
import { WxOAuthAccess } from '../../components/wx/InitWxOAuth';
import { WxOAuthCodeResp } from '../../data/authentication';
import { wxCodeSessionStore } from '../../store/keys';

export function WxCallbackPage() {
  const query = useQuery();

  const resp: WxOAuthCodeResp = {
    code: query.get('code'),
    state: query.get('state'),
  };

  const sess = wxCodeSessionStore.load();

  return (
    <AuthLayout
      title="微信登录">

      <WxOAuthAccess
        resp={resp}
        session={sess}
      />
    </AuthLayout>
  );
}




