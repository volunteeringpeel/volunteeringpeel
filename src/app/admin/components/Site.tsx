// Library Imports
import * as React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router';
import { Menu } from 'semantic-ui-react';

// Component Imports
import Footer from '@app/common/components/Footer';
import LoadingDimmer from '@app/common/components/LoadingDimmer';

// Controller Imports
import Content from '@app/admin/controllers/Content';

interface SiteProps {
  loading: boolean;
  loadUser: () => void;
}

export default class Site extends React.Component<SiteProps & RouteComponentProps<any>> {
  public componentDidMount() {
    this.props.loadUser();
  }

  public render() {
    return (
      <>
        <LoadingDimmer loading={this.props.loading} />
        <Menu inverted stackable>
          <Menu.Item header>Volunteering Peel Admin</Menu.Item>
          <Menu.Item position="right">
            <a href="/">Back</a>
          </Menu.Item>
        </Menu>
        <Content />
        <Footer />
      </>
    );
  }
}
