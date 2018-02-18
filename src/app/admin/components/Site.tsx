// Library Imports
import { LocationDescriptor } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { Container, Grid, Header, Menu } from 'semantic-ui-react';

// App Imports
import routes from '@app/admin/routes';

// Component Imports
import Footer from '@app/common/components/Footer';
import LoadingDimmer from '@app/common/components/LoadingDimmer';

interface SiteProps {
  loading: boolean;
  loadUser: () => void;
  push: (path: LocationDescriptor) => void;
  user: UserState;
}

export default class Site extends React.Component<RouteComponentProps<any> & SiteProps> {
  public componentDidMount() {
    this.props.loadUser();
  }

  public render() {
    if (this.props.user.status !== 'in') return null;
    return (
      <>
        <LoadingDimmer loading={this.props.loading} />
        <Menu inverted fixed="top" stackable>
          <Menu.Item header>Volunteering Peel Admin</Menu.Item>
          <Menu.Item position="right">Back</Menu.Item>
        </Menu>
        <Grid>
          <Grid.Row style={{ margin: '1em' }}>
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
                      <Header as="h1">
                        {page.display ? page.display : page.title}
                      </Header>
                    );
                  }}
                />
                {renderRoutes(routes)}
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Footer />
      </>
    );
  }
}
