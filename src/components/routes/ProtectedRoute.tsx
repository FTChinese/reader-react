import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../../store/AuthContext';
import { sitemap } from '../../data/sitemap';

/**
 * @description Content accessible only if logged-in. Force redirect if not authorized.
 */
export function ProtectedRoute(props: RouteProps) {
  const { passport } = useAuthContext();

  if (passport) {
    return <Route {...props} />;
  } else {
    return <Redirect
      to={{
        pathname: sitemap.login
      }}
    />;
  }
}

/**
 * @description Force redirect if user logged-in.
 */
export function AuthRoute(props: RouteProps) {
  const { passport } = useAuthContext();

  // If users visit these when already logged-in,
  // they will be redirect to home page.
  if (passport) {
    // TODO: redirect as is.
    return <Redirect
      to={{
        pathname: sitemap.home
      }}
    />;
  }

  return <Route {...props} />;
}
