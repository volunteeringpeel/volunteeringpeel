// Library Imports
import { ConnectedRouter } from 'connected-react-router';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';

// App Imports
import { history, store } from '@app/common/utilities';
import '@app/css/style.less';
import withTracker from '@app/public/withTracker';

// Controller Imports
import PublicSite from '@app/public/controllers/PublicSite';

class PublicApp extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route component={withTracker(PublicSite)} />
        </ConnectedRouter>
      </Provider>
    );
  }
}

// tslint:disable-next-line:variable-name
let App = PublicApp;

if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line:no-var-requires
  App = require('react-hot-loader').hot(module)(PublicApp);
}

export default App;
