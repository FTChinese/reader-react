import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './store/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CenterLayout } from './components/layout/CenterLayout'
import { ContentLayout } from './components/layout/ContentLayout'
import { siteRoot } from './data/sitemap'
import { LoginPage } from './pages/LoginPage'
import { VerificationPage } from './pages/auth/VerificationPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { WxCallbackPage } from './pages/oauth/WxCallbackPage'
import { PasswordResetPage } from './pages/PasswordResetPage'
import { SignUpPage } from './pages/SignUpPage'
import { HomePage } from './pages/HomePage'
import { MembershipPage } from './pages/MembershipPage'
import { RecoilRoot } from 'recoil'

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <AuthProvider>
        <BrowserRouter basename="/reader">
          <Routes>
            <Route path="/" element={<App />} >
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
  </React.StrictMode>,
  document.getElementById('root')
)
