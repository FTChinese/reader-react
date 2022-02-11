import 'react-toastify/dist/ReactToastify.min.css';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toolbar } from './components/layout/Toolbar';
import { RecoilRoot } from 'recoil';
import { CenterLayout } from './components/layout/CenterLayout';
import { ContentLayout } from './components/layout/ContentLayout';
import { siteRoot } from './data/sitemap';
import { VerificationPage } from './pages/auth/VerificationPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MembershipPage } from './pages/MembershipPage';
import { WxCallbackPage } from './pages/oauth/WxCallbackPage';
import { PasswordResetPage } from './pages/PasswordResetPage';
import { SignUpPage } from './pages/SignUpPage';
import { AuthProvider } from './store/AuthContext';

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
    <RecoilRoot>
      <AuthProvider>
        <BrowserRouter basename="/reader">
          <Routes>
            <Route path="/" element={<Skeleton />} >
              <Route element={<CenterLayout />}>
                <Route path={siteRoot.login} element={<LoginPage />} />
                <Route path={siteRoot.signUp} element={<SignUpPage />} />
                <Route path={siteRoot.forgotPassword} element={<ForgotPasswordPage />} />
                <Route path={`${siteRoot.passwordReset}/:token`} element={<PasswordResetPage />} />
                <Route path={`${siteRoot.verification}/:token`} element={<VerificationPage />} />
                <Route path={siteRoot.authCallback} element={<WxCallbackPage />} />
              </Route>

              <Route element={<ContentLayout />}>
                <Route path={siteRoot.membership} element={<MembershipPage />} />
                <Route index element={<HomePage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </RecoilRoot>
  );
}

export default App;
