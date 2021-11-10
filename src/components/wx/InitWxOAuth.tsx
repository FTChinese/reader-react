import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReaderPassport } from '../../data/account';
import { validateWxOAuthCode, WxOAuthCodeReq, WxOAuthCodeResp, WxOAuthCodeSession } from '../../data/authentication';
import { sitemap } from '../../data/sitemap';
import { ResponseError } from '../../repository/response-error';
import { getWxOAuthCodeReq, wxLogin } from '../../repository/wx-auth';
import { useAuthContext } from '../../store/AuthContext';
import { wxCodeSessionStore } from '../../store/keys';
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

export function WxOAuthAccess(
  props: {
    resp: WxOAuthCodeResp;
    session: WxOAuthCodeSession | null;
  }
) {

  const { setLoggedIn, passport} = useAuthContext();
  const [ wxAccount, setWxAccount] = useState<ReaderPassport>();

  const errMsg = validateWxOAuthCode(props.resp, props.session);

  const accountLoaded: OnAccountLoaded = (pp: ReaderPassport) => {
    switch (props.session?.kind) {
      case 'login':
        setLoggedIn(pp);
        return;

      case 'link':
        setWxAccount(pp);
    }
  }

  if (errMsg) {
    return (
      <div className="text-danger">{errMsg}</div>
    );
  }

  if (!wxAccount) {
    return (
      <RetrieveWxInfo
        code={props.resp.code!}
        onLoaded={accountLoaded}
      />
    );
  }

  return (
    <LinkAccounts
      token={passport?.token}
      wxAccount={wxAccount}
      ftcAccount={passport}
    />
  );
}

/**
 * @description Retrieve wx user info.
 * UI in 3 state:
 * - In progress;
 * - Error occurred while fetching data;
 * - No error and fetching data succeeded.
 */
function RetrieveWxInfo(
  props: {
    code: string;
    onLoaded: OnAccountLoaded;
  }
) {

  const [progress, setProgress] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    wxLogin(props.code)
      .then(passport => {
        setProgress(false);
        wxCodeSessionStore.remove();
      })
      .catch((err: ResponseError) => {
        setErrMsg(err.message);
      });
  }, [props.code]);

  if (progress) {
    return (
      <div className="text-center">
        正在获取数据，请稍候
        <span className="spinner-border spinner-border-sm"></span>
      </div>
    );
  }

  if (errMsg) {
    <div className="text-center">
      <div>出错了！</div>
      <div className="text-danger">{errMsg}</div>
      {/* TODO: show this only for login; otherwise to to home page. */}
      <Link to={sitemap.login}>重试</Link>
    </div>
  }

  return (
    <div className="text-center">授权成功！</div>
  );
}
