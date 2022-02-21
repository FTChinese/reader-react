import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * @description Scroll restoration. Render it at the top of your app, but below Router
 * @see https://v5.reactrouter.com/web/guides/scroll-restoration
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * @description If you have a tab interface connected to the router,
 * then you probably don’t want to be scrolling to the top when they switch tabs.
 *
 */
function ScrollToTopOnMount() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}
