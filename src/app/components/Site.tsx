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
import Header from '@app/components/Header';

import LoadingDimmer from '@app/components/modules/LoadingDimmer';

interface SiteProps {
  user: User;
  status: 'in' | 'out' | 'loading';
  loadUser: () => void;
}

const handleAuthentication = (nextState: any) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    Auth.handleAuthentication();
  }
};

export default class Site extends React.Component<SiteProps> {
  public componentDidMount() {
    this.props.loadUser();
  }

  public render() {
    return (
      <LoadingDimmer loading={this.props.status === 'loading'}>
        <Header auth={Auth} />
        {renderRoutes(routes)}
        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props);
            return null;
          }}
        />
        <Footer />
      </LoadingDimmer>
    );
  }
}
