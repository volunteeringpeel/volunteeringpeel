// Library Imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

// App Imports
import { history, store } from '@app/common/utilities';
import '@app/css/style.less';

// Components Imports
import AdminSite from '@app/admin/controllers/AdminSite';

class AdminApp extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AdminSite />
        </ConnectedRouter>
      </Provider>
    );
  }
}

// tslint:disable-next-line:variable-name
let App = AdminApp;

if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line:no-var-requires
  App = require('react-hot-loader').hot(module)(AdminApp);
}

export default App;
