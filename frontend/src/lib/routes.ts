import type { AppRoute } from '../types/routes';

export function parseHashRoute(): AppRoute {
  const hashPath = window.location.hash.replace(/^#/, '') || '/';
  return parsePathRoute(hashPath);
}

export function parsePathRoute(path: string): AppRoute {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const parts = normalized.split('/').filter(Boolean);

  if (parts[0] === 'create') {
    return { name: 'create', path: '/create' };
  }

  if (parts[0] === 'manage') {
    return { name: 'manage', path: '/manage' };
  }

  if (parts[0] === 'content' && parts[1]) {
    return { name: 'content', path: `/content/${parts[1]}`, id: parts[1] };
  }

  if (parts[0] === 'exhibition' && parts[1]) {
    return { name: 'exhibition', path: `/exhibition/${parts[1]}`, id: parts[1] };
  }

  return { name: 'home', path: '/' };
}
