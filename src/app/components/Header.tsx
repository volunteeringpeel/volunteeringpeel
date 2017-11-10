import Auth from '@app/Auth';
import { find, map } from 'lodash-es';
import * as React from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import { Container, Dropdown, Header, Menu, Message, Segment, Icon } from 'semantic-ui-react';

import MessageBoxController from '@app/controllers/modules/MessageBoxController';

interface HeaderComponentProps {
  user: UserState;
}

class HeaderComponent extends React.Component<HeaderComponentProps> {
  private pages: Page[] = [
    { id: '/home', title: 'Home', display: 'Volunteering Peel' },
    { id: '/about', title: 'About' },
    { id: '/about/team', title: 'Team', display: 'Meet the Team' },
    { id: '/events', title: 'Events' },
    { id: '/about/sponsors', title: 'Sponsors' },
    { id: '/about/faq', title: 'FAQ', display: 'Frequently Asked Questions' },
    { id: '/about/contact', title: 'Contact' },
  ];

  public render() {
    let userButton;

    if (this.props.user.status === 'in') {
      userButton = (
        <Menu.Item onClick={Auth.logout}>Logout ({this.props.user.user.email})</Menu.Item>
      );
    } else if (this.props.user.status === 'out') {
      userButton = <Menu.Item onClick={Auth.login}>Login</Menu.Item>;
    } else {
      userButton = (
        <Menu.Item>
          <Icon name="circle notched" />
        </Menu.Item>
      );
    }
    return (
      <div>
        <Segment inverted textAlign="center" vertical style={{ paddingBottom: '1em' }}>
          <Menu inverted pointing secondary size="large" widths={4}>
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
              {userButton}
            </Container>
          </Menu>

          <Route
            path="/:page/:subpage?"
            render={({ match }) => {
              const page = find(this.pages, ['id', match.url]);
              if (!page) return <Redirect to="/home" />;
              return (
                <Container text>
                  <Header
                    as="h1"
                    inverted
                    style={{
                      fontWeight: 'normal',
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
        <MessageBoxController />
      </div>
    );
  }
}

export default HeaderComponent;
