import { useEffect } from 'react';
import { Location, Path, useLocation, useNavigate } from 'react-router-dom';
import { isTestAccount } from '../../data/account';
import { sitemap } from '../../data/sitemap';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../progress/Loading';
import { WarningBanner } from '../text/WarningBanner';

/**
 * @description RequireAuth acts like a middleware
 * checking authorization data.
 */
export function RequireAuth(
  props: {
    live: boolean;
    children: JSX.Element;
  }
) {
  const { passport, loadingAuth, loadAccount } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Gothas of useEffect dependency:
  // https://www.benmvp.com/blog/object-array-dependencies-react-useEffect-hook/
  useEffect(() => {
    loadAccount();
  }, []);

  // When refreshing page manually, passport will
  // be loaded from localstorage. This is ususally
  // slower than building the global state.
  // We might wait for the loading.
  useEffect(() => {
    if (passport || loadingAuth) {
      return;
    }

    // If neither passport exists, nor in loading.
    navigate(sitemap.login, {
      state: { from: location },
      replace: true,
    });
  }, [loadingAuth]);

  return (
    <Loading loading={loadingAuth}>
      <>
        <TestModeMessage
          liveMode={props.live}
          testAccount={isTestAccount(passport)}
        />
        {props.children}
      </>
    </Loading>
  );
}

function TestModeMessage(
  props: {
    liveMode: boolean;
    testAccount: boolean
  }
) {
  if (props.liveMode) {
    if (!props.testAccount) {
      return null;
    }
  }

  // When stripe mode is test, you must use test account for any payment.
  return (
    <WarningBanner
      text={`Test Mode. ${props.testAccount ? 'Test' : 'Live'} Account.`}
    />
  );
}

type RedirectFrom = {
  from?: Partial<Path>;
};

export function getAuthRedirect(location: Location): string {
  if (!location.state) {
    return sitemap.home;
  }

  const state = location.state as RedirectFrom;

  return state.from?.pathname || sitemap.home;
}
