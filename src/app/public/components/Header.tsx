// Library Imports
import { LocationDescriptor } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { Redirect } from 'react-router';
import { Route, RouteComponentProps } from 'react-router-dom';
import { Container, Dropdown, Header, Icon, Menu, Segment } from 'semantic-ui-react';

// App Imports
import logoPng from '@app/images/logo.png';
import routes from '@app/public/routes';

// Controller Imports
import MessageBox from '@app/common/controllers/MessageBox';
import { API_BASE } from '@app/common/utilities';

interface HeaderComponentProps {
  user: VP.UserState;
  push: (path: string) => void;
}

class HeaderComponent extends React.Component<RouteComponentProps<any> & HeaderComponentProps> {
  public render() {
    let userButton;

    if (this.props.user.status === 'in') {
      userButton = (
        <Route path="/user">
          {({ match }: any) => (
            <Dropdown item text="Me" className={match ? 'active right' : 'right'}>
              <Dropdown.Menu>
                <Dropdown.Header
                  icon="user"
                  content={`${this.props.user.user.user.first_name} ${this.props.user.user.user.last_name}`}
                />
                <Dropdown.Item as="a" onClick={() => this.props.push('/user/profile')}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as="a" onClick={() => this.props.push('/user/dashboard')}>
                  Dashboard
                </Dropdown.Item>
                {this.props.user.user.user.role_id === 3 && (
                  <Dropdown.Item as="a" href="/admin/dashboard">
                    Admin
                  </Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Item
                  as="a"
                  href={`${document.location.origin}/.auth/logout?post_logout_redirect_url=/`}
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Route>
      );
    } else if (this.props.user.status === 'out') {
      userButton = (
        <Menu.Item
          as="a"
          href={`${document.location.origin}/.auth/login/google?post_login_redirect_url=${document.location.origin}/callback`}
        >
          Login
        </Menu.Item>
      );
    } else {
      userButton = (
        <Menu.Item>
          <Icon name="circle notched" />
        </Menu.Item>
      );
    }
    return (
      <>
        <Menu stackable size="large" style={{ marginBottom: 0 }}>
          <Container>
            <Route path="/" exact>
              {({ match }: any) => (
                <Menu.Item
                  active={!!match}
                  onClick={() => this.props.push('/')}
                  style={{ minWidth: '200px' }}
                >
                  <img src={logoPng} style={{ width: '100%' }} />
                </Menu.Item>
              )}
            </Route>
            <Menu.Menu position="right">
              <Route path="/about">
                {({ match }: any) => (
                  <Dropdown item text="About" className={match ? 'active' : ''}>
                    <Dropdown.Menu>
                      <Dropdown.Item as="a" onClick={() => this.props.push('/about')}>
                        About
                      </Dropdown.Item>
                      <Dropdown.Item as="a" onClick={() => this.props.push('/about/team')}>
                        Meet the Team
                      </Dropdown.Item>
                      <Dropdown.Item as="a" onClick={() => this.props.push('/about/faq')}>
                        FAQ
                      </Dropdown.Item>
                      <Dropdown.Item as="a" onClick={() => this.props.push('/about/sponsors')}>
                        Sponsors
                      </Dropdown.Item>
                      <Dropdown.Item as="a" onClick={() => this.props.push('/about/legal')}>
                        Legal
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Route>
              <Route path="/events">
                {({ match }: any) => (
                  <Menu.Item active={!!match} onClick={() => this.props.push('/events')}>
                    Events
                  </Menu.Item>
                )}
              </Route>
              <Route path="/contact">
                {({ match }: any) => (
                  <Menu.Item active={!!match} onClick={() => this.props.push('/contact')}>
                    Contact
                  </Menu.Item>
                )}
              </Route>
              <Route path="/apply">
                {({ match }: any) => (
                  <Menu.Item active={!!match} onClick={() => this.props.push('/apply')}>
                    Exec Applications
                  </Menu.Item>
                )}
              </Route>
              {userButton}
            </Menu.Menu>
          </Container>
        </Menu>
        <Segment inverted textAlign="center" vertical className="main-header">
          <Route
            path="/:page?/:subpage?"
            render={({ match }: any) => {
              const page = _.find(routes, ['path', match.url]);
              if (!page) {
                return <Redirect to="/" />;
              }
              return (
                <Container text>
                  <Header as="h1" inverted>
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
