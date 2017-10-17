import React from 'react';
import { Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Team from './pages/Team';
import Sponsors from './pages/Sponsors';

export default class Content extends React.Component {
  render() {
    return (
      <Route
        path="/:page"
        render={({ match }) => {
          const pages = {
            home: <Homepage />,
            about: (
              <Route
                path="/about/:subpage"
                children={({ match: subMatch }) => {
                  const subpages = { faq: <FAQ />, team: <Team />, sponsors: <Sponsors /> };
                  if (!subMatch) return <About />;
                  if (subpages[subMatch.params.subpage]) return subpages[subMatch.params.subpage];
                  return null;
                }}
              />
            ),
          };

          if (pages[match.params.page]) return pages[match.params.page];
          return null;
        }}
      />
    );
  }
}
