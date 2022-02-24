import { useEffect, useState } from 'react';
import { useQuery } from '../components/hooks/useQuery';
import { AuthLayout } from '../components/layout/AuthLayout';
import { validateWxOAuthCode, WxOAuthCodeResp, WxOAuthCodeSession } from '../data/authentication';
import { ErrorBoudary } from '../components/progress/ErrorBoundary';
import { Loading } from '../components/progress/Loading';
import { wxLogin } from '../repository/wx-auth';
import { ResponseError } from '../repository/response-error';
import { useAuth } from '../components/hooks/useAuth';
import { ReaderPassport } from '../data/account';
import { OnReaderAccount } from '../features/wx/OnReaderAccount';
import { LinkAccounts } from '../features/wx/LinkAccounts';
import { wxOAuthCbSession } from '../store/wxOAuthCbSession';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getAuthRedirect } from '../components/routes/RequireAuth';
import { sitemap } from '../data/sitemap';

export function WxCallbackPage() {
  const query = useQuery();

  // Get reponse data from query parameter.
  const resp: WxOAuthCodeResp = {
    code: query.get('code'),
    state: query.get('state'),
  };

  // Get session data from localstorage.
  const sess = wxOAuthCbSession.load();

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

  const { login, passport } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [ errMsg, setErrMsg ] = useState('');
  const [ progress, setProgress ] = useState(true);
  const [ wxPassport, setWxPassport ] = useState<ReaderPassport>();

    // UI goes from:
  // - Progressing
  // - Session found
  // - Session not found
  useEffect(() => {
    const errMsg = validateWxOAuthCode(props.resp, props.sess);
    if (errMsg) {
      setProgress(false);
      setErrMsg(errMsg);
      return;
    }

    // Fetching account, or error.
    wxLogin(props.resp.code!!)
      .then(wxPassport => {
        // We get wechat account data.
        // Not progress. No error.
        setErrMsg('');
        setProgress(false);
        // If user already logged in, this is a link session; otherwise a login session.
        setWxPassport(wxPassport);

        switch (props.sess?.kind) {
          case 'login':
            login(wxPassport, () => {
              console.log('Login success');
              navigate(getAuthRedirect(location), { replace: true });
            });

          case 'link':
            setWxPassport(wxPassport);

          default:
            setErrMsg('Oops! Something went wrong');
        }
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        setErrMsg(err.message);
      });

    return function() {
      wxOAuthCbSession.remove();
    };
  }, [props.resp.code]);

  return (
    <ErrorBoudary
      errMsg={errMsg}
    >
      <Loading
        loading={progress}
      >
        <>
          {
            passport && <GoHome/>
          }
          {
            (passport && wxPassport) &&
            <HandleLink
              ftcPassport={passport}
              wxPassport={wxPassport}
            />
          }
        </>
      </Loading>
    </ErrorBoudary>
  );
}

function HandleLink(
  props: {
    ftcPassport: ReaderPassport;
    wxPassport: ReaderPassport;
  }
) {

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [ linked, setLinked ] = useState(false);

  const handleLinked: OnReaderAccount = (pp) => {
    login(pp, () => {
      console.log('Login success');
      navigate(getAuthRedirect(location), { replace: true });
    });
    setLinked(true);
  }

  if (linked) {
    return <GoHome/>;
  }

  return (
    <LinkAccounts
      token={props.wxPassport.token}
      wxAccount={props.wxPassport}
      ftcAccount={props.ftcPassport}
      onLinked={handleLinked}
    />
  );
}

export function GoHome() {
  return <Navigate
    to={{
      pathname: sitemap.home
    }}
  />;
}
