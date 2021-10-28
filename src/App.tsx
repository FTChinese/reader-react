import 'react-toastify/dist/ReactToastify.min.css';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toolbar } from './components/toolbar/Toolbar';
import { AuthProvider } from './store/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { MembershipPage } from './pages/MembershipPage';
import { HomePage } from './pages/HomePage';
import { AuthRoute, ProtectedRoute } from './components/routes/ProtectedRoute';
import { sitemap } from './data/sitemap';
import { VerificationPage } from './pages/auth/VerificationPage';
import { PasswordResetPage } from './pages/PasswordResetPage';

function App() {
  return (
    <AuthProvider>
      <Router basename="/reader">
        <Toolbar />
        <div className="page-content pt-3">
          <Switch>
            <AuthRoute path={sitemap.login}>
              <LoginPage />
            </AuthRoute>
            <AuthRoute path={sitemap.signUp}>
              <SignUpPage />
            </AuthRoute>
            <AuthRoute path={sitemap.forgotPassword}>
              <ForgotPasswordPage />
            </AuthRoute>
            <AuthRoute path={`${sitemap.passwordReset}/:token`}>
              <PasswordResetPage />
            </AuthRoute>

            <Route path={sitemap.verification}>
              <VerificationPage />
            </Route>

            <ProtectedRoute path={sitemap.membership}>
              <MembershipPage />
            </ProtectedRoute>
            <ProtectedRoute exact={true} path={sitemap.home}>
              <HomePage />
            </ProtectedRoute>
          </Switch>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
