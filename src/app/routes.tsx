import * as React from 'react';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';

import PublicSite from './PublicSite';

import About from '@app/components/pages/About';
import Events from '@app/components/pages/Events';
import FAQ from '@app/components/pages/FAQ';
import Homepage from '@app/components/pages/Homepage';
import Sponsors from '@app/components/pages/Sponsors';
import Team from '@app/components/pages/Team';
import LoginCallbackController from '@app/controllers/pages/LoginCallbackController';

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
    component: LoginCallbackController,
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
