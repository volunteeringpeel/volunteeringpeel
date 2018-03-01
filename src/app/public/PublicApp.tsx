// Library Imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

// App Imports
import { history, store } from '@app/common/utilities';
import '@app/css/style.less';

// Controller Imports
import PublicSite from '@app/public/controllers/PublicSite';

class PublicApp extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <PublicSite />
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
