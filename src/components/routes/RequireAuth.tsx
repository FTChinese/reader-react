import { useEffect, useState } from 'react';
import { Location, Path, useLocation, useNavigate } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { authSession } from '../../store/authSession';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../progress/Loading';

export function RequireAuth(
  props: {
    children: JSX.Element;
  }
) {
  let { passport, login } = useAuth();
  let location = useLocation();
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    if (passport) {
      setLoading(false);
      return;
    }

    console.log('Loading auth from localstorage');

    authSession.load()
      .then(pp => {
        if (!pp) {
          navigate(sitemap.login, {
            state: { from: location },
            replace: true,
          });
          return;
        }

        login(pp, () => {
          setLoading(false);
        });
      });
  }, []);

  return (
    <Loading loading={loading}>
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
