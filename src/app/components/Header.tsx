// Library Imports
import { LocationDescriptor } from 'history';
import { find, map } from 'lodash-es';
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
        <Dropdown item text="Me" className="right">
          <Dropdown.Menu>
            <Dropdown.Header
              icon="user"
              content={`${this.props.user.user.user.first_name} ${
                this.props.user.user.user.last_name
              }`}
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
              const page = find(routes, ['path', match.url]);
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
      </div>
    );
  }
}

export default HeaderComponent;
