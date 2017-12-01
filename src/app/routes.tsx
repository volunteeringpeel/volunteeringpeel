// Library Imports
import * as React from 'react';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';

// App Imports
import PublicSite from '@app/PublicSite';

// Component Imports
import About from '@app/components/pages/About';
import Homepage from '@app/components/pages/Homepage';

// Controller Imports
import Events from '@app/controllers/pages/Events';
import FAQ from '@app/controllers/pages/FAQ';
import LoginCallback from '@app/controllers/pages/LoginCallback';
import Sponsors from '@app/controllers/pages/Sponsors';
import Team from '@app/controllers/pages/Team';

interface Route extends RouteConfig {
  title: string;
  display?: string;
}

const routes: Route[] = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect strict from="/" to="/home" />,
    title: 'Home',
    display: 'Volunteering Peel',
  },
  {
    path: '/home',
    component: Homepage,
    title: 'Home',
    display: 'Volunteering Peel',
  },
  {
    path: '/about',
    exact: true,
    component: About,
    title: 'About',
  },
  {
    path: '/about/faq',
    component: FAQ,
    title: 'FAQ',
    display: 'Frequently Asked Questions',
  },
  {
    path: '/about/sponsors',
    component: Sponsors,
    title: 'Sponsors',
  },
  {
    path: '/about/team',
    component: Team,
    title: 'Team',
    display: 'Meet the Team',
  },
  {
    path: '/events',
    component: Events,
    title: 'Events',
  },
  {
    path: '/callback',
    component: LoginCallback,
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
