import { useAuthContext } from '../store/AuthContext';
import { ContentLayout } from '../components/Layout';
import { Unauthorized } from '../components/routes/Unauthorized';
import { DisplayName } from '../components/account/UserName';
import { DisplayEmail } from '../components/account/EmailRow';
import { DisplayPassword } from '../components/account/UpdatePassword';
import { DisplayMobile } from '../components/account/MobileRow';
import { DisplayWechat } from '../components/account/WechatRow';
import { isAccountWxOnly, ReaderPassport } from '../data/account';
import { WechatOnly } from '../components/account/WechatOnly';

function FtcDetails(
  props: ReaderPassport,
) {
  return (
    <>
      <DisplayEmail
        email={props.email}
        isVerified={props.isVerified}
      />
      <DisplayName
        userName={props.userName}
      />
      <DisplayPassword
        token={props.token}
      />
      <DisplayMobile
        mobile={props.mobile}
      />
      <DisplayWechat
        unionId={props.unionId}
        wechat={props.wechat}
      />
    </>
  );
}

export function HomePage() {
  const { passport } = useAuthContext();

  if (!passport) {
    return <Unauthorized />;
  }

  const isWxOnly = isAccountWxOnly(passport);

  return (
    <ContentLayout>
      { isWxOnly ?
        <WechatOnly
          token={passport.token}
          wechat={passport.wechat}
        /> :
        <FtcDetails
          {...passport}
        />
      }
    </ContentLayout>
  );
}
