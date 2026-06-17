export type AppRoute =
  | { name: 'home'; path: '/' }
  | { name: 'create'; path: '/create' }
  | { name: 'manage'; path: '/manage' }
  | { name: 'content'; path: string; id: string }
  | { name: 'exhibition'; path: string; id: string };
