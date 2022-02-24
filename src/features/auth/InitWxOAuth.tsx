import { useEffect, useState } from 'react';
import { WxOAuthCodeReq } from '../../data/authentication';
import { getWxOAuthCodeReq } from '../../repository/wx-auth';
import { wxOAuthCbSession } from '../../store/wxOAuthCbSession';

/**
 * @description WxLogin show a wechat login button and build the link to request a wechat OAuth code.
 * It is shown at the bottom of the login page.
 * The `redirect_uri` is not on this site.
 * We will be redirected to subscription-api, and
 * then relayed to this app.
 * @see https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
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
    return null;
  }

  const handleClick = () => {
    wxOAuthCbSession.save(req, 'login');
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <a href={req.redirectTo} target="_blank" onClick={handleClick}>
        <img src="https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon48_wx_button.png" alt="微信登录" />
      </a>
    </div>
  );
}


