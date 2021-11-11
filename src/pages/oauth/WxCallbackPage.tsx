import { useEffect, useState } from 'react';
import { useQuery } from '../../components/hooks/useLocation';
import { AuthLayout } from '../../components/Layout';
import { ProgressOrError } from '../../components/ProgressErrorBoundary';
import { WxOAuthAccess } from '../../components/wx/InitWxOAuth';
import { validateWxOAuthCode, WxOAuthCodeResp } from '../../data/authentication';
import { wxCodeSessionStore } from '../../store/keys';

export function WxCallbackPage() {
  const query = useQuery();

  const [ progress, setProgress ] = useState(true);
  const [ errMsg, setErrMsg ] = useState('');

  const [ code, setCode ]= useState<string | null>(null);

  const resp: WxOAuthCodeResp = {
    code: query.get('code'),
    state: query.get('state'),
  };

  // UI goes from:
  // - Progressing
  // - Session found
  // - Session not found
  useEffect(() => {
    const sess = wxCodeSessionStore.load();
    setProgress(false);
    const errMsg = validateWxOAuthCode(resp, sess);
    if (errMsg) {
      setErrMsg(errMsg);
    } else {
      setCode(resp.code)
    }
  }, []);

  return (
    <AuthLayout
      title="微信登录"
    >
      {
        code ?
        <WxOAuthAccess
          code={code}
        /> :
        <ProgressOrError
          progress={progress}
          errMsg={errMsg}
        />
      }
    </AuthLayout>
  );
}




