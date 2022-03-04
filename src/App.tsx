import 'react-toastify/dist/ReactToastify.min.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toolbar } from './components/layout/Toolbar';
import { CenterLayout } from './components/layout/CenterLayout';
import { ContentLayout } from './components/layout/ContentLayout';
import { siteRoot } from './data/sitemap';
import { VerificationPage } from './pages/VerificationPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { MembershipPage } from './pages/MembershipPage';
import { WxOAuthCbPage } from './pages/WxOAuthCbPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { SignUpPage } from './pages/SignUpPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { StripeSetupCbPage } from './pages/StripeSetupCbPage';
import { SubsPage } from './pages/SubsPage';
import { RequireAuth } from './components/routes/RequireAuth';
import { AliPayCbPage } from './pages/AliPayCbPage';
import { RequireShoppingCart } from './components/routes/RequireShoopingCart';
import { StripeSettingPage } from './pages/StripeSettingPage';
import { HomePage } from './pages/HomePage';

function Skeleton() {
  return (
    <>
      <Toolbar />

      <div className="page-content pt-3">
        <Outlet />
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
    </>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Skeleton />} >
          <Route element={<CenterLayout />}>
            <Route path={siteRoot.login} element={<LoginPage />} />
            <Route path={siteRoot.signUp} element={<SignUpPage />} />
            <Route path={siteRoot.forgotPassword} element={<ForgotPasswordPage />} />
            <Route path={`${siteRoot.passwordReset}/:token`} element={<PasswordResetPage />} />
            <Route path={`${siteRoot.verification}/:token`} element={<VerificationPage />} />
            <Route path={siteRoot.wxOAuthCb} element={<WxOAuthCbPage />} />
          </Route>

          <Route
            element={
              <RequireAuth>
                <ContentLayout />
              </RequireAuth>
            }
          >
            <Route
              path={siteRoot.setting}
            >
              <Route
                index
                element={<SettingsPage />}
              />
              <Route
                path={siteRoot.stripe}
                element={<StripeSettingPage/>}
              />
            </Route>
            <Route
              path={siteRoot.membership}
              element={<MembershipPage />}
            />
            <Route
              path={siteRoot.subs}
              element={<SubsPage />}
            />
            <Route
              path={siteRoot.checkout}
              element={
                <RequireShoppingCart>
                  <CheckoutPage />
                </RequireShoppingCart>
              }
            />
            <Route
              path={siteRoot.alipayCb}
              element={<AliPayCbPage />}
            />
            <Route
              path={siteRoot.stripeSetupCb}
              element={<StripeSetupCbPage />}
            />
            <Route
              index
              element={<HomePage />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
