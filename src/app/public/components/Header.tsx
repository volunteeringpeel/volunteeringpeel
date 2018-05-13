// Library Imports
import { LocationDescriptor } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { Redirect } from 'react-router';
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import { Container, Dropdown, Header, Icon, Menu, Message, Segment } from 'semantic-ui-react';

// App Imports
import Auth from '@app/public/Auth';
import routes from '@app/public/routes';

// Controller Imports
import MessageBox from '@app/common/controllers/MessageBox';

interface HeaderComponentProps {
  user: UserState;
  push: (path: LocationDescriptor) => void;
}

class HeaderComponent extends React.Component<RouteComponentProps<any> & HeaderComponentProps> {
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
                {this.props.user.user.user.role_id === 3 && (
                  <Dropdown.Item as="a" href="/admin/dashboard">
                    Admin
                  </Dropdown.Item>
                )}
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
          <Menu inverted stackable size="large" widths={5}>
            <Container textAlign="center">
              <Route path="/" exact>
                {({ match }) => (
                  <Menu.Item active={!!match} onClick={() => this.props.push('/')}>
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
                      <Dropdown.Item onClick={() => this.props.push('/about/legal')}>
                        Legal
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
              <Route path="/contact">
                {({ match }) => (
                  <Menu.Item active={!!match} onClick={() => this.props.push('/contact')}>
                    Contact
                  </Menu.Item>
                )}
              </Route>
              {userButton}
            </Container>
          </Menu>

          <Route
            path="/:page?/:subpage?"
            render={({ match }) => {
              const page = _.find(routes, ['path', match.url]);
              if (!page) {
                return <Redirect to="/" />;
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
