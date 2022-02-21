import { Navigate } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';

export function Unauthorized() {
  return <div>Logged in required!</div>;
}

export function GoHome() {
  return <Navigate
    to={{
      pathname: sitemap.home
    }}
  />;
}
