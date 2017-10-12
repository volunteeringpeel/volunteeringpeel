import React from 'react';
import _ from 'lodash';
import { Button, Container, Header, Icon, Menu, Segment } from 'semantic-ui-react';
import { Route, Link, Redirect } from 'react-router-dom';

import testdata from '../testdata';

export default class Homepage extends React.Component {
  render() {
    return (
      <div>
        <Segment
          inverted
          textAlign="center"
          style={{ minHeight: 700, padding: '1em 0em' }}
          vertical
        >
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
                    content={page.title}
                    inverted
                    style={{
                      fontSize: '4em',
                      fontWeight: 'normal',
                      marginBottom: 0,
                      marginTop: '3em',
                    }}
                  />
                  <Header
                    as="h2"
                    content={page.subtitle}
                    inverted
                    style={{ fontSize: '1.7em', fontWeight: 'normal' }}
                  />
                  {page.id === 'home' && (
                    <Link to="/events">
                      <Button primary animated size="huge">
                        <Button.Content visible>Get Started</Button.Content>
                        <Button.Content hidden>
                          <Icon name="right arrow" />
                        </Button.Content>
                      </Button>
                    </Link>
                  )}
                </Container>
              );
            }}
          />
        </Segment>
      </div>
    );
  }
}
