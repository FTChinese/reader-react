import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './store/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CenterLayout } from './components/layout/CenterLayout'
import { ContentLayout } from './components/layout/ContentLayout'
import { sitemap } from './data/sitemap'
import { LoginPage } from './pages/LoginPage'
import { VerificationPage } from './pages/auth/VerificationPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { WxCallbackPage } from './pages/oauth/WxCallbackPage'
import { PasswordResetPage } from './pages/PasswordResetPage'
import { SignUpPage } from './pages/SignUpPage'
import { HomePage } from './pages/HomePage'
import { MembershipPage } from './pages/MembershipPage'

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter basename="/reader">
        <Routes>
          <Route
            path="/"
            element={<App />}
          >
            <Route
              path=""
              element={<CenterLayout />}
            >
              <Route
                path={sitemap.login}
                element={<LoginPage />}
              />

              <Route
                path={sitemap.signUp}
                element={<SignUpPage />}
              />

              <Route
                path={sitemap.forgotPassword}
                element={<ForgotPasswordPage />}
              />

              <Route
                path={`${sitemap.passwordReset}/:token`}
                element={<PasswordResetPage />}
              />

              <Route
                path={`${sitemap.verification}/:token`}
                element={<VerificationPage />}
              />

              <Route
                path={sitemap.authCallback}
                element={<WxCallbackPage />}
              />
            </Route>

            <Route
              path=""
              element={<ContentLayout />}
            >
              <Route path={sitemap.membership}
                element={<MembershipPage />}
              />

              <Route path={sitemap.home}
                element={<HomePage />}
              />

            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
