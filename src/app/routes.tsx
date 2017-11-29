import * as React from 'react';
import { RouteConfig } from 'react-router-config';
import { Redirect } from 'react-router-dom';

import PublicSite from './PublicSite';

import About from '@app/components/pages/About';
import Homepage from '@app/components/pages/Homepage';
import EventsController from '@app/controllers/pages/EventsController';
import FAQController from '@app/controllers/pages/FAQController';
import LoginCallbackController from '@app/controllers/pages/LoginCallbackController';
import SponsorsController from '@app/controllers/pages/SponsorsController';
import TeamController from '@app/controllers/pages/TeamController';

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
    component: FAQController,
    title: 'FAQ',
    display: 'Frequently Asked Questions',
  },
  {
    path: '/about/sponsors',
    component: SponsorsController,
    title: 'Sponsors',
  },
  {
    path: '/about/team',
    component: TeamController,
    title: 'Team',
    display: 'Meet the Team',
  },
  {
    path: '/events',
    component: EventsController,
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
