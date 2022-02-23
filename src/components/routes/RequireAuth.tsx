import { Location, Navigate, Path, To, useLocation } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { useAuth } from '../hooks/useAuth';

export function RequireAuth(
  props: {
    children: JSX.Element;
  }
) {
  let { passport } = useAuth();
  let location = useLocation();

  if (!passport) {
    return <Navigate
      to={sitemap.login}
      state={{ from: location }}
      replace
    />
  }

  return props.children;
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
