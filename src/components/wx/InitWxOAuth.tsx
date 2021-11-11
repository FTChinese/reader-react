import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { ReaderPassport } from '../../data/account';
import { WxOAuthCodeReq } from '../../data/authentication';
import { sitemap } from '../../data/sitemap';
import { ResponseError } from '../../repository/response-error';
import { getWxOAuthCodeReq, wxLogin } from '../../repository/wx-auth';
import { useAuthContext } from '../../store/AuthContext';
import { wxCodeSessionStore } from '../../store/keys';
import { ProgressOrError } from '../ProgressErrorBoundary';
import { LinkAccounts } from './LinkAccounts';

type OnAccountLoaded = (passport: ReaderPassport) => void;

/**
 * @description WxLogin show a wechat login button and build the link to request a wechat OAuth code.
 * It is shown at the bottom of the login page.
 */
export function InitWxOAuth() {

  const [ req, setReq ] = useState<WxOAuthCodeReq>();

  useEffect(() => {
    getWxOAuthCodeReq()
      .then(reqRes => {

        setReq(reqRes);
      })
      .catch(err => console.log(err));
  }, []);

  if (!req) {
    return <></>;
  }

  const handleClick = () => {
    wxCodeSessionStore.save(req, 'login');
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <a href={req.redirectTo} target="_blank" onClick={handleClick}>
        <img src="https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon48_wx_button.png" alt="微信登录" />
      </a>
    </div>
  );
}

/**
 * @description Validate OAuath code and fetch user info if valid.
 */
export function WxOAuthAccess(
  props: {
    code: string;
  }
) {

  const { setLoggedIn, passport} = useAuthContext();

  const [ wxAccount, setWxAccount] = useState<ReaderPassport>();

  const [progress, setProgress] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  // After wechat account is loaded.
  const accountLoaded: OnAccountLoaded = (pp: ReaderPassport) => {

    if (passport) {
      setWxAccount(pp);
    } else {
      setLoggedIn(pp);
    }
  }

  useEffect(() => {
    wxLogin(props.code)
      .then(wxPassport => {
        // We get wechat account data.
        // Not progress. No error.
        setErrMsg('');
        setProgress(false);
        wxCodeSessionStore.remove();

        // If user already logged in, this is a link session; otherwise a login session.
        setWxAccount(wxPassport);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        setErrMsg(err.message);
      });
  }, [props.code]);

  // Fetching account, or error.
  if (!wxAccount) {
    {/* TODO: show this only for login; otherwise to to home page. <Link to={sitemap.login}>重试</Link>*/}
    return (
      <ProgressOrError
        progress={progress}
        errMsg={errMsg}
      />
    );
  }

  // User already logged-in. So this is a email-linking-wechat session.
  if (passport) {
    return (
      <div>
        <div className="text-center">授权成功！</div>
        <LinkAccounts
          token={passport.token}
          wxAccount={wxAccount}
          ftcAccount={passport}
          onLinked={accountLoaded}
        />
      </div>
    );
  }

  return <LoginSuccess passport={wxAccount}/>;
}

function LoginSuccess(
  props: {
    passport: ReaderPassport;
  }
) {
  const { setLoggedIn, passport } = useAuthContext();

  useEffect(() => {
    setLoggedIn(props.passport);
  });

  if (passport) {
    return <Redirect to={sitemap.home}/>;
  }

  return <div>登录成功，跳转...</div>
}
