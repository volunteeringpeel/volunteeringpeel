import React from 'react';
import { Route } from 'react-router-dom';
import Homepage from './pages/Homepage';

export default class Content extends React.Component {
  render() {
    return (
      <Route
        path="/:page"
        render={({ match }) => {
          const pages = { home: <Homepage /> };

          if (pages[match.params.page]) return pages[match.params.page];
          return null;
        }}
      />
    );
  }
}
