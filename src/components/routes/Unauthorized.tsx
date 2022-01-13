import { Navigate } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';

export function Unauthorized() {
  return <Navigate
    to={{
      pathname: sitemap.login
    }}
    replace={true}
  />;
}

export function GoHome() {
  return <Navigate
    to={{
      pathname: sitemap.home
    }}
  />;
}
