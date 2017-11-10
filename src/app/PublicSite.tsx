import { history, store } from '@app/Utilities';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import ConnectedSite from '@app/components/ConnectedSite';

export default class PublicSite extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <ConnectedSite />
        </ConnectedRouter>
      </Provider>
    );
  }
}
