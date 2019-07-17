// Library Imports
import { LocationDescriptor } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Divider, Grid, Header, Menu } from 'semantic-ui-react';

// App Imports
import routes from '@app/admin/routes';

// Controller Imports
import MessageBox from '@app/common/controllers/MessageBox';

interface ContentProps {
  user: VP.UserState;
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
                    {routes.map(route => (
                      <Route path={route.path} key={route.path}>
                        {({ match }: any) => (
                          <Menu.Item active={!!match} onClick={() => this.props.push(route.path)}>
                            {route.title}
                          </Menu.Item>
                        )}
                      </Route>
                    ))}
                  </Menu>
                </Grid.Column>
                <Grid.Column width={13}>
                  <Route
                    path="/admin/:page"
                    render={({ match }: any) => {
                      const page = _.find(routes, route => {
                        const regex = new RegExp(`^\/admin\/${match.params.page}`, 'gi');
                        return !!route.path.match(regex);
                      });

                      if (!page) {
                        return <Redirect to="/admin/dashboard" />;
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
