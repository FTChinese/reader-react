import { useEffect, useState } from 'react';
import { useQuery } from '../../components/hooks/useLocation';
import { AuthLayout } from '../../components/Layout';
import { ProgressOrError } from '../../components/ProgressErrorBoundary';
import { WxOAuthAccess } from '../../components/wx/InitWxOAuth';
import { validateWxOAuthCode, WxOAuthCodeResp, WxOAuthCodeSession } from '../../data/authentication';
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
      title="微信登录"
    >
      <ProcessCode
        resp={resp}
        sess={sess}
      />
    </AuthLayout>
  );
}

function ProcessCode(
  props: {
    resp: WxOAuthCodeResp;
    sess: WxOAuthCodeSession | null;
  }
) {

  const [ errMsg, setErrMsg ] = useState('');
  const [ code, setCode ]= useState<string | null>(null);

    // UI goes from:
  // - Progressing
  // - Session found
  // - Session not found
  useEffect(() => {
    const errMsg = validateWxOAuthCode(props.resp, props.sess);
    if (errMsg) {
      setErrMsg(errMsg);
    } else {
      setCode(props.resp.code)
    }
  }, []);

  if (errMsg) {
    return <ProgressOrError errMsg={errMsg} />
  }

  if (!props.sess) {
    return <>Missing session data!</>;
  }

  if (code) {
    return (
      <WxOAuthAccess
        code={code}
        usage={props.sess.kind}
      />
    );
  }

  return <>Missing code!</>;
}




