// Library Imports
import * as React from 'react';
import { renderRoutes } from 'react-router-config';

// App Imports
import routes from '@app/routes';

// Component Imports
import Footer from '@app/components/Footer';
import LoadingDimmer from '@app/components/modules/LoadingDimmer';

// Controller Imports
import Header from '@app/controllers/Header';

interface SiteProps {
  loading: boolean;
  loadUser: () => void;
}

export default class Site extends React.Component<SiteProps> {
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
