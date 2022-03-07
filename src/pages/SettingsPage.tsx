import { useAuth } from '../components/hooks/useAuth';
import { Unauthorized } from '../components/routes/Unauthorized';
import { UserNameRow } from '../features/account/UserNameRow';
import { EmailRow } from '../features/account/EmailRow';
import { PasswordRow } from '../features/account/PasswordRow';
import { MobileRow } from '../features/account/MobileRow';
import { WechatRow } from '../features/account/WechatRow';
import { isAccountWxOnly, OnReaderAccount, ReaderPassport } from '../data/account';
import { WxLinkEmailDialog } from '../features/wx/WxLinkEmailDialog';
import { useState } from 'react';
import { WxAvatar } from '../features/wx/WxAvatar';
import { StripeRow } from '../features/account/StripeRow';

export function SettingsPage() {
  const { passport } = useAuth();
  console.log('Show home page');
  if (!passport) {
    return <Unauthorized />;
  }

  const isWxOnly = isAccountWxOnly(passport);

  return ( isWxOnly ?
    <WechatDetails
      {...passport}
    /> :
    <FtcDetails
      {...passport}
    />
  );
}

/**
 * @description Show details for account with email or mobile
 */
function FtcDetails(
  props: ReaderPassport,
) {

  const { setBaseAccount } = useAuth();

  return (
    <>
      <EmailRow
        token={props.token}
        email={props.email}
        isVerified={props.isVerified}
        onUpdated={setBaseAccount}
      />
      <UserNameRow
        token={props.token}
        userName={props.userName}
        onUpdated={setBaseAccount}
      />
      <PasswordRow
        token={props.token}
      />
      <MobileRow
        token={props.token}
        mobile={props.mobile}
        onUpdated={setBaseAccount}
      />
      <WechatRow
        passport={props}
      />
      <StripeRow />
    </>
  );
}

/**
 * @description Show details if account is wechat-only
 */
function WechatDetails(
  props: ReaderPassport
) {
  const { refreshLogin } = useAuth();
  const [showDialog, setShowDialog] = useState(false);

  const handleDialog = () => {
    setShowDialog(!showDialog);
  }

  const handleLinked: OnReaderAccount = (passsport: ReaderPassport) => {
    setShowDialog(false);
    refreshLogin(passsport);
  }

  return (
    <div className="row justify-content-center">
      <div className="col-sm-10 col-lg-6">

        <WxAvatar wechat={props.wechat} />

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
