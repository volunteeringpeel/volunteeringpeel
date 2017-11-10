import { createBrowserHistory } from 'history';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';
import reduxThunk from 'redux-thunk';

import * as reducers from '@app/reducers';

export function listify(list: string[] | number[], prefix: string = ''): string {
  // If length is 0 or 1, don't bother listing
  if (list.length === 0) {
    return '';
  }
  if (list.length === 1) {
    return prefix + list[0];
  }
  // Everything but the last item
  const firstBit = list.slice(0, -1).join(`, ${prefix}`);
  // If not 2 list with oxford comma (e.g. 'x, y, and z' and 'x and y')
  const finalJoin = list.length === 2 ? ' and ' : ', and ';
  // The last item
  const lastOne = list[list.length - 1];
  return firstBit + finalJoin + lastOne;
}

export function pluralize(noun: string, number: number): string {
  return noun + (number !== 1 ? 's' : '');
}

export const history = createBrowserHistory();

function configureStore(initialState?: State) {
  let middleware = [routerMiddleware(history), reduxThunk];
  let newStore: Store<State>;

  if (process.env.NODE_ENV !== 'production') {
    const reduxLogger = require('redux-logger').default;
    middleware = [...middleware, reduxLogger];

    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    newStore = createStore<State>(
      combineReducers({ ...reducers, router: routerReducer }),
      initialState,
      composeEnhancers(applyMiddleware(...middleware)),
    );
  } else {
    newStore = createStore<State>(
      combineReducers({ ...reducers, router: routerReducer }),
      initialState,
      compose(applyMiddleware(...middleware)),
    );
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      newStore.replaceReducer(combineReducers({ ...reducers, router: routerReducer }));
    });
  }

  return newStore;
}

export const store = configureStore();
