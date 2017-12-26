// Library Imports
import * as React from 'react';
import reactLoadable, { LoadingComponentProps } from 'react-loadable';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';

// App Imports
import { loading } from '@app/actions';
import { store } from '@app/Utilities';

interface Route extends RouteConfig {
  title: string;
  display?: string;
}

class Loading extends React.Component<LoadingComponentProps> {
  public componentWillUnmount() {
    store.dispatch(loading(false));
  }

  public render(): JSX.Element {
    if (this.props.pastDelay) {
      store.dispatch(loading(true));
    }
    return null;
  }
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
      loading: Loading,
      loader: () => import('@app/components/pages/Homepage' /* webpackChunkName: "homepage" */),
    }),
    title: 'Home',
    display: 'Volunteering Peel',
  },
  {
    path: '/events',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/controllers/pages/Events' /* webpackChunkName: "events" */),
    }),
    title: 'Events',
  },
  // ABOUT PAGES
  {
    path: '/about',
    exact: true,
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/components/pages/About' /* webpackChunkName: "about" */),
    }),
    title: 'About',
  },
  {
    path: '/about/faq',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/controllers/pages/FAQ' /* webpackChunkName: "faq" */),
    }),
    title: 'FAQ',
    display: 'Frequently Asked Questions',
  },
  {
    path: '/about/sponsors',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/controllers/pages/Sponsors' /* webpackChunkName: "sponsors" */),
    }),
    title: 'Sponsors',
  },
  {
    path: '/about/team',
    component: reactLoadable({
      loading: Loading,
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
      loading: Loading,
      loader: () =>
        import('@app/controllers/pages/UserDashboard' /* webpackChunkName: "user-dashboard" */),
    }),
    title: 'Dashboard',
  },
  {
    path: '/user/profile',
    component: reactLoadable({
      loading: Loading,
      loader: () =>
        import('@app/controllers/pages/UserProfile' /* webpackChunkName: "user-profile" */),
    }),
    title: 'Profile',
  },
  // UTILITY ROUTES
  {
    path: '/callback',
    component: reactLoadable({
      loading: Loading,
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
