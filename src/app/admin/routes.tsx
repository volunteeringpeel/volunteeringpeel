// Library Imports
import * as React from 'react';
import * as reactLoadable from 'react-loadable';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';

// App Imports
import Loading from '@app/common/components/Loading';

export interface CustomRouteConfig extends RouteConfig {
  title: string;
  display?: string;
}

const routes: CustomRouteConfig[] = [
  {
    path: '/admin/home',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/admin/components/pages/Home'),
    }),
    title: 'Dashboard',
  },
  {
    path: '/admin/events',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/admin/controllers/pages/Events'),
    }),
    title: 'Events',
  },
  {
    path: '/admin/users',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/admin/controllers/pages/Users'),
    }),
    title: 'Users',
  },
  {
    path: '/admin/attendance',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/admin/controllers/pages/Attendance'),
    }),
    title: 'Attendance + Management',
  },
  {
    path: '/admin/mailing-list',
    component: reactLoadable({
      loading: Loading,
      loader: () => import('@app/admin/components/pages/MailingList'),
    }),
    title: 'Mailing List',
  },
];

export default routes;
