import React from 'react';
import _ from 'lodash';
import { Container, Header, Menu, Segment } from 'semantic-ui-react';
import { Route, Link, Redirect } from 'react-router-dom';

import testdata from '../testdata';

export default class HeaderComponent extends React.Component {
  render() {
    return (
      <div>
        <Segment inverted textAlign="center" vertical>
          <Menu inverted pointing secondary size="large" widths={testdata.pages.length}>
            <Container textAlign="center">
              {_.map(testdata.pages, (page) => {
                const to = `/${page.id}`;
                return (
                  <Route path={to} key={page.id}>
                    {({ match }) => (
                      <Menu.Item active={!!match}>
                        <Link to={to}>{page.title}</Link>
                      </Menu.Item>
                    )}
                  </Route>
                );
              })}
            </Container>
          </Menu>

          <Route
            path="/:page"
            render={({ match }) => {
              const page = _.find(testdata.pages, ['id', match.params.page]);
              if (!page) return <Redirect to="/home" />;
              return (
                <Container text>
                  <Header
                    as="h1"
                    inverted
                    style={{
                      fontSize: '4em',
                      fontWeight: 'normal',
                      marginBottom: 0,
                      margin: '3em 0',
                    }}
                  >
                    {page.display ? page.display : page.title}
                  </Header>
                </Container>
              );
            }}
          />
        </Segment>
      </div>
    );
  }
}
