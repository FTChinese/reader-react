import { useAuthContext } from '../store/AuthContext';
import { ContentLayout } from '../components/Layout';
import { Unauthorized } from '../components/routes/Unauthorized';
import { DisplayName } from '../components/account/UserName';
import { DisplayEmail } from '../components/account/EmailRow';
import { DisplayPassword } from '../components/account/UpdatePassword';
import { DisplayMobile } from '../components/account/MobileRow';
import { DisplayWechat } from '../components/account/WechatRow';

export function HomePage() {
  const { passport } = useAuthContext();

  if (!passport) {
    return <Unauthorized />;
  }

  return (
    <ContentLayout>
      <>
        <DisplayEmail
          email={passport.email}
          isVerified={passport.isVerified}
        />
        <DisplayName
          userName={passport.userName}
        />
        <DisplayPassword/>
        <DisplayMobile
          mobile={passport.mobile}
        />
        <DisplayWechat
          unionId={passport.unionId}
          wechat={passport.wechat}
        />
      </>
    </ContentLayout>
  );
}
