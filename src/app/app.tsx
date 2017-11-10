import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import PublicSite from './PublicSite';

import './css/style.less';

if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line:variable-name
  const render = (Component: any) => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      document.getElementById('app'),
    );
  };

  render(PublicSite);

  if (module.hot) {
    module.hot.accept('./PublicSite', () => {
      render(PublicSite);
    });
  }
} else {
  ReactDOM.render(<PublicSite />, document.getElementById('app'));
}
