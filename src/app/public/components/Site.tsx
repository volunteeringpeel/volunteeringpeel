// Library Imports
import * as React from 'react';
import { renderRoutes } from 'react-router-config';

// App Imports
import routes from '@app/public/routes';
import { RouteComponentProps } from 'react-router';

// Component Imports
import Footer from '@app/common/components/Footer';
import LoadingDimmer from '@app/common/components/LoadingDimmer';

// Controller Imports
import Header from '@app/public/controllers/Header';

interface SiteProps {
  loading: boolean;
  loadUser: () => void;
}

export default class Site extends React.Component<RouteComponentProps<any> & SiteProps> {
  public componentDidMount() {
    this.props.loadUser();
  }

  public render() {
    return (
      <>
        <LoadingDimmer loading={this.props.loading} />
        <Header />
        {renderRoutes(routes)}
        <Footer />
      </>
    );
  }
}
