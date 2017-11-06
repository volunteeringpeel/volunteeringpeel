import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { match } from 'react-router';
import { renderRoutes, RouteConfig } from 'react-router-config';
import { BrowserRouter, Route } from 'react-router-dom';

import Footer from '@app/components/Footer';
import Header from '@app/components/Header';

import LoadingDimmer from '@app/components/modules/LoadingDimmer';

import routes from '@app/routes';

interface PublicSiteState {
  loading: boolean;
  user?: User;
}

export default class PublicSite extends React.Component<{}, PublicSiteState> {
  constructor() {
    super();

    this.state = { loading: true };
  }

  public componentDidMount() {
    axios.get('/api/user').then(res => {
      this.setState({ loading: false, user: res.data.data });
    });
  }

  public render() {
    return (
      <BrowserRouter>
        <LoadingDimmer loading={this.state.loading}>
          <Header />
          {renderRoutes(routes)}
          <Footer />
        </LoadingDimmer>
      </BrowserRouter>
    );
  }
}
