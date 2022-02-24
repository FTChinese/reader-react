import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/hooks/useAuth';
import { AuthLayout } from '../components/layout/AuthLayout'
import { sitemap } from '../data/sitemap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { InitWxOAuth } from '../features/auth/InitWxOAuth';
import { EmailLogin } from '../features/auth/EmailLogin';
import { MobileLogin } from '../features/auth/MobileLogin';

export function LoginPage() {

  const { passport } = useAuth();

  if (passport) {
    return <Navigate
      to={sitemap.home}
      replace={true}
    />;
  }

  return (
    <AuthLayout
      title="登录FT中文网"
    >
      <>
        <Tabs defaultActiveKey="email" className="mb-3 mt-5 nav-fill">
          <Tab eventKey="email" title="邮箱">
            <EmailLogin/>
          </Tab>
          <Tab eventKey="mobile" title="手机号码">
            <MobileLogin/>
          </Tab>
        </Tabs>

        <InitWxOAuth/>
      </>
    </AuthLayout>
  );
}
