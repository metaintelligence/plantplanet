import { useEffect, useState } from 'react';
import { parseHashRoute, parsePathRoute } from '../lib/routes';
import type { AppRoute } from '../types/routes';

export function useHashRoute() {
  const [route, setRoute] = useState<AppRoute>(() => parseHashRoute());

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const updateRoute = (path: string) => {
    const hash = path === '/' ? '#/' : `#${path}`;

    if (window.location.hash === hash) {
      setRoute(parsePathRoute(path));
      return;
    }

    window.location.hash = hash;
  };

  return { route, setRoute, updateRoute };
}
