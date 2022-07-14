import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../progress/Loading';

export function RequireNoAuth(
  props: {
    children: JSX.Element;
  }
) {
  const { passport, loadingAuth, loadAccount } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadAccount();
  }, []);

  useEffect(() => {
  if (passport || loadingAuth) {
    return;
  }

  // If neither passport exists, nor in loading.
  navigate(sitemap.home, {
    replace: true,
  });
  }, [loadingAuth]);

  return (
    <Loading loading={loadingAuth}>
      {props.children}
    </Loading>
  );
}
