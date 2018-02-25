// Library Imports
import * as React from 'react';
import * as reactLoadable from 'react-loadable';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';

// App Imports
import Loading from '@app/common/components/Loading';

import Contact from '@app/public/components/pages/Contact';

interface Route extends RouteConfig {
  title: string;
  display?: string;
}

const routes: Route[] = [
  // TOP LEVEL PAGES
  {
    path: '/',
    exact: true,
    component: reactLoadable({
      loading: Loading,
      loader: () =>
        import('@app/public/components/pages/Homepage' /* webpackChunkName: "homepage" */),
    }),
    title: 'Home',
    display: 'Volunteering Peel',
  },
  {
    path: '/events',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/public/controllers/pages/Events' /* webpackChunkName: "events" */),
    }),
    title: 'Events',
  },
  // ABOUT PAGES
  {
    path: '/about',
    exact: true,
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/public/components/pages/About' /* webpackChunkName: "about" */),
    }),
    title: 'About',
  },
  {
    path: '/about/faq',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/public/controllers/pages/FAQ' /* webpackChunkName: "faq" */),
    }),
    title: 'FAQ',
    display: 'Frequently Asked Questions',
  },
  {
    path: '/about/sponsors',
    component: reactLoadable({
      loading: Loading,
      loader: () =>
        import('@app/public/controllers/pages/Sponsors' /* webpackChunkName: "sponsors" */),
    }),
    title: 'Sponsors',
  },
  {
    path: '/about/team',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/public/controllers/pages/Team' /* webpackChunkName: "team" */),
    }),
    title: 'Team',
    display: 'Meet the Team',
  },
  {
    path: '/about/contact',
    component: Contact,
    title: 'Contact',
  },
  // USER PAGES
  {
    path: '/user',
    exact: true,
    component: () => <Redirect strict from="/user" to="/user/dashboard" />,
    title: 'Dashboard',
  },
  {
    path: '/user/dashboard',
    component: reactLoadable({
      loading: Loading,
      loader: () =>
        import('@app/public/controllers/pages/UserDashboard' /* webpackChunkName: "user-dashboard" */),
    }),
    title: 'Dashboard',
  },
  {
    path: '/user/profile',
    component: reactLoadable({
      loading: Loading,
      loader: () =>
        import('@app/public/controllers/pages/UserProfile' /* webpackChunkName: "user-profile" */),
    }),
    title: 'Profile',
  },
  // UTILITY ROUTES
  {
    path: '/callback',
    component: reactLoadable({
      loading: Loading,
      loader: () =>
        import('@app/public/controllers/pages/LoginCallback' /* webpackChunkName: "login-callback" */),
    }),
    title: 'Logging in...',
  },
];

export default routes;
