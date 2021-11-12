import { useAuthContext } from '../store/AuthContext';
import { ContentLayout } from '../components/Layout';
import { Unauthorized } from '../components/routes/Unauthorized';
import { UserNameRow } from '../components/account/UserNameRow';
import { DisplayEmail } from '../components/account/EmailRow';
import { DisplayPassword } from '../components/account/PasswordRow';
import { DisplayMobile } from '../components/account/MobileRow';
import { DisplayWechat } from '../components/account/WechatRow';
import { BaseAccount, isAccountWxOnly, ReaderPassport } from '../data/account';
import { WxLinkEmailDialog } from '../components/wx/WxLinkEmailDialog';
import { OnReaderAccount } from "../components/wx/OnReaderAccount";
import { useState } from 'react';
import { WxAvatar } from '../components/wx/WxAvatar';
import { OnAccountUpdated } from '../components/account/OnAccountUpdated';

export function HomePage() {
  const { passport } = useAuthContext();

  if (!passport) {
    return <Unauthorized />;
  }

  const isWxOnly = isAccountWxOnly(passport);

  return (
    <ContentLayout>
      { isWxOnly ?
        <WechatDetails
          {...passport}
        /> :
        <FtcDetails
          {...passport}
        />
      }
    </ContentLayout>
  );
}

/**
 * @description Show details for account with email or mobile
 */
 function FtcDetails(
  props: ReaderPassport,
) {

  const { setLoggedIn } = useAuthContext();

  const handleUpdated: OnAccountUpdated = (a: BaseAccount) => {
    setLoggedIn({
      ...props,
      ...a
    });
  };

  return (
    <>
      <DisplayEmail
        token={props.token}
        email={props.email}
        isVerified={props.isVerified}
        onUpdated={handleUpdated}
      />
      <UserNameRow
        token={props.token}
        userName={props.userName}
        onUpdated={handleUpdated}
      />
      <DisplayPassword
        token={props.token}
      />
      <DisplayMobile
        token={props.token}
        mobile={props.mobile}
        onUpdated={handleUpdated}
      />
      <DisplayWechat
        passport={props}
      />
    </>
  );
}

/**
 * @description Show details if account is wechat-only
 */
function WechatDetails(
  props: ReaderPassport
) {
  const { setLoggedIn } = useAuthContext();
  const [showDialog, setShowDialog] = useState(false);

  const handleDialog = () => {
    setShowDialog(!showDialog);
  }

  const handleLinked: OnReaderAccount = (passsport: ReaderPassport) => {
    setShowDialog(false);
    setLoggedIn(passsport);
  }

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-lg-6">

        <div className="d-flex justify-content-center">
          <WxAvatar wechat={props.wechat} />
        </div>

        <div className="text-center">
          <p>您目前使用了微信账号登录FT中文网。为保障账号安全，建议绑定在FT中文网注册的邮箱账号。</p>

          <button
            className="btn btn-primary"
            onClick={handleDialog}
          >
            绑定邮箱
          </button>

          <WxLinkEmailDialog
            passport={props}
            show={showDialog}
            onClose={handleDialog}
            onLinked={handleLinked}
          />
        </div>

      </div>
    </div>
  );
}
