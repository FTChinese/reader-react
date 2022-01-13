import { useEffect, useState } from 'react';
import { ReaderPassport } from '../../data/account';
import { WxOAuthCodeReq } from '../../data/authentication';
import { WxOAuthKind } from '../../data/enum';
import { ResponseError } from '../../repository/response-error';
import { getWxOAuthCodeReq, wxLogin } from '../../repository/wx-auth';
import { useAuthContext } from '../../store/AuthContext';
import { wxCodeSessionStore } from '../../store/keys';
import { ProgressOrError } from '../../components/ProgressErrorBoundary';
import { GoHome, Unauthorized } from '../../components/routes/Unauthorized';
import { LinkAccounts } from './LinkAccounts';
import { OnReaderAccount } from './OnReaderAccount';

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
    usage: WxOAuthKind;
  }
) {

  const [ wxPassport, setWxPassport] = useState<ReaderPassport>();

  const [progress, setProgress] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    wxLogin(props.code)
      .then(wxPassport => {
        // We get wechat account data.
        // Not progress. No error.
        setErrMsg('');
        setProgress(false);
        // If user already logged in, this is a link session; otherwise a login session.
        setWxPassport(wxPassport);
      })
      .catch((err: ResponseError) => {
        setProgress(false);
        setErrMsg(err.message);
      });

    return function() {
      wxCodeSessionStore.remove();
    };
  }, [props.code]);

  // Fetching account, or error.
  if (!wxPassport) {
    return (
      <ProgressOrError
        progress={progress}
        errMsg={errMsg}
      />
    );
  }

  switch (props.usage) {
    case 'login':
      return <HandleLogin wxPassport={wxPassport}/>;

    case 'link':
      return <HandleLink wxPassport={wxPassport}/>;

    default:
      return <div className="text-center">授权成功！</div>;
  }
}

function HandleLogin(
  props: {
    wxPassport: ReaderPassport;
  }
) {
  const { setLoggedIn, passport } = useAuthContext();

  useEffect(() => {
    setLoggedIn(props.wxPassport);
  });

  if (!passport) {
    return <Unauthorized/>;
  }

  return <GoHome />;
}

function HandleLink(
  props: {
    wxPassport: ReaderPassport;
  }
) {

  const { setLoggedIn, passport } = useAuthContext();
  const [ linked, setLinked ] = useState(false);

  const handleLinked: OnReaderAccount = (pp) => {
    setLoggedIn(pp);
    setLinked(true);
  }

  if (!passport) {
    return <GoHome/>;
  }

  if (linked) {
    return <GoHome/>;
  }

  return (
    <LinkAccounts
      token={props.wxPassport.token}
      wxAccount={props.wxPassport}
      ftcAccount={passport}
      onLinked={handleLinked}
    />
  );
}
