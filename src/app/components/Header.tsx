import Auth from '@app/Auth';
import { LocationDescriptor } from 'history';
import { find, map } from 'lodash-es';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { Container, Dropdown, Header, Icon, Menu, Message, Segment } from 'semantic-ui-react';

import MessageBoxController from '@app/controllers/modules/MessageBoxController';

interface HeaderComponentProps {
  user: UserState;
  push: (path: LocationDescriptor) => void;
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
        <Dropdown item text="Me" className="right">
          <Dropdown.Menu>
            <Dropdown.Header
              icon="user"
              content={`${this.props.user.user.first_name} ${this.props.user.user.last_name}`}
            />
            <Dropdown.Divider />
            <Dropdown.Item onClick={Auth.logout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      );
    } else if (this.props.user.status === 'out') {
      userButton = (
        <Menu.Item as="div">
          <a href="#" onClick={Auth.login}>
            Login
          </a>
        </Menu.Item>
      );
    } else {
      userButton = (
        <Menu.Item as="div">
          <Icon name="circle notched" />
        </Menu.Item>
      );
    }
    return (
      <div>
        <Segment inverted textAlign="center" vertical style={{ paddingBottom: '1em' }}>
          <Menu inverted size="large" widths={4}>
            <Container textAlign="center">
              <Route path="/home">
                {({ match }) => (
                  <Menu.Item active={!!match} onClick={() => this.props.push('/home')}>
                    Home
                  </Menu.Item>
                )}
              </Route>
              <Route path="/about">
                {({ match }) => (
                  <Dropdown item text="About" className={match ? 'active' : ''}>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => this.props.push('/about')}>About</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.props.push('/about/team')}>
                        Meet the Team
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => this.props.push('/about/faq')}>
                        FAQ
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => this.props.push('/about/sponsors')}>
                        Sponsors
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => this.props.push('/about/contact')}>
                        Contact
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Route>
              <Route path="/events">
                {({ match }) => (
                  <Menu.Item active={!!match} onClick={() => this.props.push('/events')}>
                    Events
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
              if (!page) this.props.push('/home');
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
