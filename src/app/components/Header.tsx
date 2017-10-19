import { find } from 'lodash-es';
import * as React from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import { Container, Dropdown, Header, Menu, Segment } from 'semantic-ui-react';

import testdata from '../testdata';

export default class HeaderComponent extends React.Component {
  public render() {
    return (
      <div>
        <Segment inverted textAlign="center" vertical>
          <Menu inverted pointing secondary size="large" widths={3}>
            <Container textAlign="center">
              <Route path="/home">
                {({ match }) => (
                  <Menu.Item active={!!match}>
                    <Link to="/home">Home</Link>
                  </Menu.Item>
                )}
              </Route>
              <Route path="/about">
                {({ match }) => (
                  <Dropdown item text="About" className={match ? 'active' : ''}>
                    <Dropdown.Menu>
                      <Link to="/about">
                        <Dropdown.Item>About</Dropdown.Item>
                      </Link>
                      <Link to="/about/team">
                        <Dropdown.Item>Meet the Team</Dropdown.Item>
                      </Link>
                      <Link to="/about/faq">
                        <Dropdown.Item>FAQ</Dropdown.Item>
                      </Link>
                      <Link to="/about/sponsors">
                        <Dropdown.Item>Sponsors</Dropdown.Item>
                      </Link>
                      <Link to="/about/contact">
                        <Dropdown.Item>Contact</Dropdown.Item>
                      </Link>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Route>
              <Route path="/events">
                {({ match }) => (
                  <Menu.Item active={!!match}>
                    <Link to="/events">Events</Link>
                  </Menu.Item>
                )}
              </Route>
            </Container>
          </Menu>

          <Route
            path="/:page/:subpage?"
            render={({ match }) => {
              const page = find(testdata.pages, ['id', match.url]);
              if (!page) return <Redirect to="/home" />;
              return (
                <Container text>
                  <Header
                    as="h1"
                    inverted
                    style={{
                      fontWeight: 'normal',
                      margin: '3em 0',
                      marginBottom: 0,
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
