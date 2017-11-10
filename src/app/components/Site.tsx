import { addMessage } from '@app/actions';
import Auth from '@app/Auth';
import routes from '@app/routes';
import { history, store } from '@app/Utilities';
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import * as React from 'react';
import { match, Route } from 'react-router';
import { renderRoutes } from 'react-router-config';

import Footer from '@app/components/Footer';
import HeaderController from '@app/controllers/HeaderController';

import LoadingDimmer from '@app/components/modules/LoadingDimmer';

interface SiteProps {
  user: User;
  status: 'in' | 'out' | 'loading';
  loadUser: () => void;
}

export default class Site extends React.Component<SiteProps> {
  constructor() {
    super();

    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  public componentDidMount() {
    this.props.loadUser();
  }

  public handleAuthentication(nextState: any) {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
      Auth.handleAuthentication(this.props.loadUser);
    }
  }

  public render() {
    return (
      <LoadingDimmer loading={this.props.status === 'loading'}>
        <HeaderController />
        {renderRoutes(routes)}
        <Route
          path="/callback"
          render={props => {
            this.handleAuthentication(props);
            return null;
          }}
        />
        <Footer />
      </LoadingDimmer>
    );
  }
}
