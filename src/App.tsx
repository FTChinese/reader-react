import 'react-toastify/dist/ReactToastify.min.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toolbar } from './components/layout/Toolbar';
import { CenterLayout } from './components/layout/CenterLayout';
import { ContentLayout } from './components/layout/ContentLayout';
import { sitePath } from './data/sitemap';
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
import { StripeWalletPage } from './pages/StripeWalletPage';
import { HomePage } from './pages/HomePage';
import { RequireStripeCustomer } from './components/routes/RequireStripeCustomer';
import { liveMode } from './components/routes/stripePromise';

function Skeleton() {
  return (
    <>
      <Toolbar />
      <div className="page-content mt-3">
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
            <Route path={sitePath.login} element={<LoginPage />} />
            <Route path={sitePath.signUp} element={<SignUpPage />} />
            <Route path={sitePath.forgotPassword} element={<ForgotPasswordPage />} />
            <Route path={`${sitePath.passwordReset}/:token`} element={<PasswordResetPage />} />
            <Route path={`${sitePath.verification}/:token`} element={<VerificationPage />} />
            <Route path={sitePath.wxOAuthCb} element={<WxOAuthCbPage />} />
          </Route>

          <Route
            element={
              <RequireAuth live={liveMode}>
                <ContentLayout />
              </RequireAuth>
            }
          >
            <Route
              path={sitePath.setting}
            >
              <Route
                index
                element={<SettingsPage />}
              />
              <Route
                path={sitePath.stripe}
                element={
                  <RequireStripeCustomer>
                    <StripeWalletPage />
                  </RequireStripeCustomer>
                }
              />
            </Route>
            <Route
              path={sitePath.membership}
              element={<MembershipPage />}
            />
            <Route
              path={sitePath.subs}
              element={<SubsPage live={liveMode} />}
            />
            <Route
              path={sitePath.checkout}
              element={
                <RequireShoppingCart>
                  <CheckoutPage />
                </RequireShoppingCart>
              }
            />
            <Route
              path={sitePath.alipayCb}
              element={<AliPayCbPage />}
            />
            <Route
              path={sitePath.stripeSetupCb}
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
