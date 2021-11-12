import { Redirect } from 'react-router-dom';
import { sitemap } from '../../data/sitemap';

export function Unauthorized() {
  return <Redirect
    to={{
      pathname: sitemap.login
    }}
  />;
}

export function GoHome() {
  return <Redirect
    to={{
      pathname: sitemap.home
    }}
  />;
}
