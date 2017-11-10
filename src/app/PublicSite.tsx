import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { match, Route } from 'react-router';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter } from 'react-router-redux';

import Footer from '@app/components/Footer';
import Header from '@app/components/Header';

import LoadingDimmer from '@app/components/modules/LoadingDimmer';

import { addMessage, setUser } from '@app/actions';
import Auth from '@app/Auth';
import routes from '@app/routes';
import { history, store } from '@app/Utilities';

interface PublicSiteState {
  loading: boolean;
}

const handleAuthentication = (nextState: any) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    Auth.handleAuthentication();
  }
};

export default class PublicSite extends React.Component<{}, PublicSiteState> {
  constructor() {
    super();

    this.state = { loading: true };
  }

  public componentDidMount() {
    Promise.resolve(axios.get('/api/user'))
      .then(res => {
        store.dispatch(setUser(res.data.data));
      })
      .catch((err: AxiosError) => {
        store.dispatch(addMessage({ message: err.message, severity: 'negative' }));
      })
      .lastly(() => this.setState({ loading: false }));
  }

  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <LoadingDimmer loading={this.state.loading}>
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
        </ConnectedRouter>
      </Provider>
    );
  }
}
