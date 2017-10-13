import React from 'react';
import { Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import About from './pages/About';
import FAQ from './pages/FAQ';

export default class Content extends React.Component {
  render() {
    return (
      <Route
        path="/:page"
        render={({ match }) => {
          const pages = { home: <Homepage />, about: <About />, faq: <FAQ /> };

          if (pages[match.params.page]) return pages[match.params.page];
          return null;
        }}
      />
    );
  }
}
