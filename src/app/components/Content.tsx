import * as React from 'react';
import { Route } from 'react-router-dom';

import About from 'app/components/pages/About';
import Events from 'app/components/pages/Events';
import FAQ from 'app/components/pages/FAQ';
import Homepage from 'app/components/pages/Homepage';
import Sponsors from 'app/components/pages/Sponsors';
import Team from 'app/components/pages/Team';

export default class Content extends React.Component {
  public render() {
    return (
      <Route
        path="/:page"
        render={({ match }) => {
          const pages: { [key: string]: JSX.Element } = {
            about: (
              <Route
                path="/about/:subpage"
                children={({ match: subMatch }) => {
                  const subpages: { [key: string]: JSX.Element } = {
                    faq: <FAQ />,
                    sponsors: <Sponsors />,
                    team: <Team />,
                  };
                  if (!subMatch) return <About />;
                  if (subpages[subMatch.params.subpage]) return subpages[subMatch.params.subpage];
                  return null;
                }}
              />
            ),
            events: <Events />,
            home: <Homepage />,
          };

          if (pages[match.params.page]) return pages[match.params.page];
          return null;
        }}
      />
    );
  }
}
