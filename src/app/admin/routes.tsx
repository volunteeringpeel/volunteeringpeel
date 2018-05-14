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
    component: require('@app/admin/components/pages/Home').default,
    title: 'Dashboard',
  },
  {
    path: '/admin/events',
    component: require('@app/admin/controllers/pages/Events').default,
    title: 'Events',
  },
  {
    path: '/admin/users',
    component: require('@app/admin/controllers/pages/Users').default,
    title: 'Users',
  },
  {
    path: '/admin/attendance',
    component: require('@app/admin/controllers/pages/Attendance').default,
    title: 'Attendance + Management',
  },
  {
    path: '/admin/mailing-list',
    component: require('@app/admin/components/pages/MailingList').default,
    title: 'Mailing List',
  },
  {
    path: '/admin/faq',
    component: require('@app/admin/controllers/pages/FAQ').default,
    title: 'FAQs',
  },
  {
    path: '/admin/images',
    component: require('@app/admin/controllers/pages/Images').default,
    title: 'Images',
  },
];

export default routes;
