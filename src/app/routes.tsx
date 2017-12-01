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
import UserDashboard from '@app/controllers/pages/UserDashboard';

interface Route extends RouteConfig {
  title: string;
  display?: string;
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
    component: Homepage,
    title: 'Home',
    display: 'Volunteering Peel',
  },
  {
    path: '/events',
    component: Events,
    title: 'Events',
  },
  // ABOUT PAGES
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
  // USER PAGES
  {
    path: '/user',
    exact: true,
    component: () => <Redirect strict from="/user" to="/user/dashboard" />,
    title: 'Dashboard',
  },
  {
    path: '/user/dashboard',
    component: UserDashboard,
    title: 'Dashboard',
  },
  // {
  //   path: '/user/profile',
  //   component: UserProfile,
  //   title: 'Profile',
  // },
  // UTILITY ROUTES
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
