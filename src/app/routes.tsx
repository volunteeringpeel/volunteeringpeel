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

const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect strict from="/" to="/home" />,
  },
  {
    path: '/home',
    component: Homepage,
  },
  {
    path: '/about',
    exact: true,
    component: About,
  },
  {
    path: '/about/faq',
    component: FAQ,
  },
  {
    path: '/about/sponsors',
    component: Sponsors,
  },
  {
    path: '/about/team',
    component: Team,
  },
  {
    path: '/events',
    component: Events,
  },
];

export default routes;
