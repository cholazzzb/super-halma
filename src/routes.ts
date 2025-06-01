import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('shared-ui/pages/home/home.tsx'),
  route('*', 'shared-ui/pages/404.tsx'),
] satisfies RouteConfig;
