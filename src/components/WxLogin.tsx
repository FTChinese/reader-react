import { useEffect, useState } from 'react';
import { getWxOAuthSession } from '../repository/wx-auth';

export function WxLogin() {

  const [ link, setLink ] = useState('');

  useEffect(() => {
    getWxOAuthSession()
      .then(sess => {
        localStorage.setItem(`fta_wxlogin`, JSON.stringify(sess));
        setLink(sess.redirectTo);
      })
      .catch(err => console.log(err));
  }, []);

  if (!link) {
    return <></>;
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <a href={link} target="_blank">
        <img src="https://open.weixin.qq.com/zh_CN/htmledition/res/assets/res-design-download/icon48_wx_button.png" alt="微信登录" />
      </a>
    </div>
  );
}
