import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '../../components/hooks/useLocation';
import { AuthLayout } from '../../components/Layout';
import { validateWxOAuthCode, WxOAuthCodeResp, WxOAuthCodeSession } from '../../data/authentication';
import { sitemap } from '../../data/sitemap';
import { ResponseError } from '../../repository/response-error';
import { wxLogin } from '../../repository/wx-auth';
import { useAuthContext } from '../../store/AuthContext';
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

      <VerifyCode
        resp={resp}
        session={sess}
      />
    </AuthLayout>
  );
}


function VerifyCode(
  props: {
    resp: WxOAuthCodeResp;
    session: WxOAuthCodeSession | null;
  }
) {

  const errMsg = validateWxOAuthCode(props.resp, props.session);
  if (errMsg) {
    return (
      <div className="text-danger">{errMsg}</div>
    );
  }

  return <RetrieveWxInfo code={props.resp.code!}/>;
}

function RetrieveWxInfo(
  props: {
    code: string;
  }
) {

  const { setLoggedIn } = useAuthContext();
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    wxLogin(props.code)
      .then(passport => {
        wxCodeSessionStore.remove();
        setLoggedIn(passport);
      })
      .catch((err: ResponseError) => {
        setErrMsg(err.message);
      });
  }, [props.code]);

  if (errMsg) {
    <div className="text-center">
      <div>出错了！</div>
      <div className="text-danger">{errMsg}</div>
      <Link to={sitemap.login}>重试</Link>
    </div>
  }

  return (
    <div className="text-center">
      正在获取数据，请稍候
      <span className="spinner-border spinner-border-sm"></span>
    </div>
  );
}
