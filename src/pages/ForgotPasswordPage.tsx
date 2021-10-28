import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { CenterLayout } from '../components/Layout';
import { PasswordReset } from './auth/forgot-password/PasswordReset';
import { RequestPasswordReset } from './auth/forgot-password/ReqeustPasswordReset';

export function ForgotPasswordPage() {
  let match = useRouteMatch();

  return (
    <CenterLayout>
      <Switch>
        <Route path={`${match.url}/:token`}>
          <PasswordReset />
        </Route>
        <Route path={match.url}>
          <RequestPasswordReset />
        </Route>
      </Switch>
    </CenterLayout>
  );
}
