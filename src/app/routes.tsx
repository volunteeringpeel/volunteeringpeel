// Library Imports
import * as React from 'react';
import reactLoadable from 'react-loadable';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';

// App Imports
import PublicSite from '@app/PublicSite';

interface Route extends RouteConfig {
  title: string;
  display?: string;
}

function loading() {
  return <div>Loading...</div>;
}

const routes: Route[] = [
  // TOP LEVEL PAGES
  {
    path: '/',
    exact: true,
    component: () => <Redirect strict from="/" to="/home" />,
    title: 'Home',
    display: 'Volunteering Peel',
  },
  {
    path: '/home',
    component: reactLoadable({
      loading,
      loader: () => import('@app/components/pages/Homepage' /* webpackChunkName: "homepage" */),
    }),
    title: 'Home',
    display: 'Volunteering Peel',
  },
  {
    path: '/events',
    component: reactLoadable({
      loading,
      loader: () => import('@app/controllers/pages/Events' /* webpackChunkName: "events" */),
    }),
    title: 'Events',
  },
  // ABOUT PAGES
  {
    path: '/about',
    exact: true,
    component: reactLoadable({
      loading,
      loader: () => import('@app/components/pages/About' /* webpackChunkName: "about" */),
    }),
    title: 'About',
  },
  {
    path: '/about/faq',
    component: reactLoadable({
      loading,
      loader: () => import('@app/controllers/pages/FAQ' /* webpackChunkName: "faq" */),
    }),
    title: 'FAQ',
    display: 'Frequently Asked Questions',
  },
  {
    path: '/about/sponsors',
    component: reactLoadable({
      loading,
      loader: () => import('@app/controllers/pages/Sponsors' /* webpackChunkName: "sponsors" */),
    }),
    title: 'Sponsors',
  },
  {
    path: '/about/team',
    component: reactLoadable({
      loading,
      loader: () => import('@app/controllers/pages/Team' /* webpackChunkName: "team" */),
    }),
    title: 'Team',
    display: 'Meet the Team',
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
      loading,
      loader: () =>
        import('@app/controllers/pages/UserDashboard' /* webpackChunkName: "user-dashboard" */),
    }),
    title: 'Dashboard',
  },
  {
    path: '/user/profile',
    component: reactLoadable({
      loading,
      loader: () =>
        import('@app/controllers/pages/UserProfile' /* webpackChunkName: "user-profile" */),
    }),
    title: 'Profile',
  },
  // UTILITY ROUTES
  {
    path: '/callback',
    component: reactLoadable({
      loading,
      loader: () =>
        import('@app/controllers/pages/LoginCallback' /* webpackChunkName: "login-callback" */),
    }),
    title: 'Logging in...',
  },
  // TODO: Contact page
  // {
  //   path: '/contact',
  //   component: Contact,
  //   title: 'Contact'
  // }
];

export default routes;
