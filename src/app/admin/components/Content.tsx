// Library Imports
import { LocationDescriptor } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Container, Divider, Grid, Header, Menu } from 'semantic-ui-react';

// App Imports
import routes from '@app/admin/routes';

interface ContentProps {
  user: UserState;
  push: (path: LocationDescriptor) => void;
}

export default class Content extends React.Component<RouteComponentProps<any> & ContentProps> {
  public render() {
    return (
      <Grid>
        <Grid.Row style={{ margin: '1em' }}>
          {this.props.user.status === 'in' && this.props.user.user.user.role_id === 3 ? (
            <>
              <Grid.Column width={3}>
                <Menu vertical fluid pointing secondary>
                  <Route path="/admin" exact>
                    {({ match }) => (
                      <Menu.Item active={!!match} onClick={() => this.props.push('/admin')}>
                        Home
                      </Menu.Item>
                    )}
                  </Route>
                  <Menu.Item>Events</Menu.Item>
                  <Menu.Item>Volunteers</Menu.Item>
                  <Menu.Item>Execs</Menu.Item>
                  <Menu.Item>Overview</Menu.Item>
                  <Menu.Item>Overview</Menu.Item>
                </Menu>
              </Grid.Column>
              <Grid.Column width={9}>
                <Container>
                  <Route
                    path="/admin/:page?/:subpage?"
                    render={({ match }) => {
                      const page = _.find(routes, ['path', match.url]);
                      if (!page) {
                        return () => {
                          this.props.push('/admin');
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
                </Container>
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
    );
  }
}
