// Library Imports
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

// App Imports
import { history, store } from '@app/Utilities';

// Controller Imports
import Site from '@app/controllers/Site';

class PublicSite extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Site />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default hot(module)(PublicSite);
