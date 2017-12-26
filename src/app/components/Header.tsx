// Library Imports
import { LocationDescriptor } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { Container, Dropdown, Header, Icon, Menu, Message, Segment } from 'semantic-ui-react';

// App Imports
import Auth from '@app/Auth';
import routes from '@app/routes';

// Controller Imports
import MessageBox from '@app/controllers/modules/MessageBox';

interface HeaderComponentProps {
  user: UserState;
  push: (path: LocationDescriptor) => void;
}

class HeaderComponent extends React.Component<HeaderComponentProps> {
  public render() {
    let userButton;

    if (this.props.user.status === 'in') {
      userButton = (
        <Route path="/user">
          {({ match }) => (
            <Dropdown item text="Me" className={match ? 'active right' : 'right'}>
              <Dropdown.Menu>
                <Dropdown.Header
                  icon="user"
                  content={`${this.props.user.user.user.first_name} ${
                    this.props.user.user.user.last_name
                  }`}
                />
                <Dropdown.Item onClick={() => this.props.push('/user/profile')}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.props.push('/user/dashboard')}>
                  Dashboard
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={Auth.logout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Route>
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
      <>
        <Segment inverted textAlign="center" vertical style={{ paddingBottom: '1em' }}>
          <Menu inverted stackable size="large" widths={4}>
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
              const page = _.find(routes, ['path', match.url]);
              if (!page) {
                return () => {
                  this.props.push('/home');
                };
              }
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
        <MessageBox />
      </>
    );
  }
}

export default HeaderComponent;
