import { useEffect } from 'react';
import { Location, Path, useLocation, useNavigate } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../progress/Loading';

export function RequireAuth(
  props: {
    children: JSX.Element;
  }
) {
  let { passport, loadingAuth } = useAuth();
  let location = useLocation();
  const navigate = useNavigate();

  // When refreshing page manually, passport will
  // be loaded from localstorage. This is ususally
  // slower than building the global state.
  // We might wait for the loading.
  useEffect(() => {
    if (passport) {
      console.log('Passport already exists');
      return;
    }

    if (loadingAuth) {
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
      {props.children}
    </Loading>
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
