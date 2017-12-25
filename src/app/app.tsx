// Library Imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

// App Imports
import '@app/css/style.less';
import { history, store } from '@app/Utilities';

// Controller Imports
import Site from '@app/controllers/Site';

class App extends React.Component {
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

// tslint:disable-next-line:variable-name
let HotApp = App;

if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line:no-var-requires
  HotApp = require('react-hot-loader').hot(module)(App);
}

ReactDOM.render(<HotApp />, document.getElementById('app'));
