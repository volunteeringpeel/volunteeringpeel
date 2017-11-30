import { history, store } from '@app/Utilities';
import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

import SiteController from '@app/controllers/SiteController';

export default class PublicSite extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <SiteController />
        </ConnectedRouter>
      </Provider>
    );
  }
}
