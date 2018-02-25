// Library Imports
import { LocationDescriptor } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Container, Divider, Grid, Header, Menu } from 'semantic-ui-react';

// App Imports
import routes from '@app/admin/routes';

// Controller Imports
import MessageBox from '@app/common/controllers/MessageBox';

interface ContentProps {
  user: UserState;
  push: (path: LocationDescriptor) => void;
}

export default class Content extends React.Component<RouteComponentProps<any> & ContentProps> {
  public render() {
    return (
      <>
        <MessageBox />
        <Grid style={{ margin: '1em' }}>
          <Grid.Row>
            {this.props.user.status === 'in' && this.props.user.user.user.role_id === 3 ? (
              <>
                <Grid.Column width={3}>
                  <Menu vertical fluid pointing secondary>
                    <Route path="/admin/home">
                      {({ match }) => (
                        <Menu.Item active={!!match} onClick={() => this.props.push('/admin/home')}>
                          Dashboard
                        </Menu.Item>
                      )}
                    </Route>
                    <Route path="/admin/events">
                      {({ match }) => (
                        <Menu.Item
                          active={!!match}
                          onClick={() => this.props.push('/admin/events')}
                        >
                          Events
                        </Menu.Item>
                      )}
                    </Route>
                    <Menu.Item>Volunteers</Menu.Item>
                    <Menu.Item>Execs</Menu.Item>
                    <Menu.Item>Overview</Menu.Item>
                    <Menu.Item>Overview</Menu.Item>
                  </Menu>
                </Grid.Column>
                <Grid.Column width={13}>
                  <Route
                    path="/admin/:page?/:subpage?"
                    render={({ match }) => {
                      const page = _.find(routes, ['path', match.url]);
                      if (!page) {
                        return () => {
                          this.props.push('/admin/home');
                        };
                      }
                      return (
                        <Header as="h1" size="huge">
                          {page.display ? page.display : page.title}
                        </Header>
                      );
                    }}
                  />
                  <Divider />
                  {renderRoutes(routes)}
                </Grid.Column>
              </>
            ) : (
              <Grid.Column width={12}>
                <Header as="h1" size="huge" />
                <Divider />
                <p>
                  Please return to the <a href="/">public site</a>.
                </p>
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </>
    );
  }
}
