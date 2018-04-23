// Library Imports
import { AxiosError, AxiosResponse } from 'axios';
import * as Promise from 'bluebird';
import { createBrowserHistory } from 'history';
import * as moment from 'moment';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { push, routerMiddleware, routerReducer } from 'react-router-redux';
import { applyMiddleware, combineReducers, compose, createStore, Dispatch, Store } from 'redux';
import reduxThunk from 'redux-thunk';

// App Imports
import {
  addMessage,
  getUser,
  getUserFailure,
  getUserSuccess,
  loading,
  logout,
} from '@app/common/actions';
import * as reducers from '@app/common/reducers';

// take a number and pad it with one zero if it needs to be (i.e. 1 => 01, 11 => 11, 123 => 123)
const pad = (number: number) => (number < 10 ? ('00' + number).slice(-2) : number.toString());

// moment duration toString basically (hh:mm)
export function timeFormat(time: moment.Duration) {
  return `${pad(Math.floor(time.asHours()))}:${pad(time.minutes())}`;
}

export function formatDateForMySQL(date: Date): string {
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) + // month is off by 1 (i.e. Jan = 0)
    '-' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
}

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

/**
 * Load the current user into redux store
 * @param dispatch Dispatch to base redux on
 * @returns Promise awaiting success (true) or failure (false)
 */
export function loadUser(dispatch: Dispatch<State>): Promise<boolean> {
  // Check whether there's local storage
  if (!localStorage.getItem('access_token')) return Promise.resolve(false);
  dispatch(loading(true));
  // Check whether the current time is past the token's expiry time
  const expiresAt = +localStorage.getItem('expires_at');
  const isValid = new Date().getTime() < expiresAt;
  if (!isValid) {
    dispatch(logout());
    dispatch(
      addMessage({
        message: 'Session expired',
        more: 'Please log back in',
        severity: 'negative',
      }),
    );
    dispatch(loading(false));
    return Promise.resolve(false);
  }

  // fetch user from token (if server deems it's valid token)
  return dispatch(getUser(localStorage.getItem('id_token')))
    .payload.then(response => {
      // success
      if (response.data.status === 'success') {
        dispatch(getUserSuccess(response as AxiosResponse<APIDataSuccess<User>>));
        if (response.data.data.new) {
          dispatch(
            addMessage({
              message: 'Welcome!',
              more: (
                <>
                  <strong>Before signing up for events</strong>, please provide a contact phone
                  number (or two)
                </>
              ),
              severity: 'positive',
            }),
          );
          dispatch(push('/user/profile'));
        }
        return true;
      }
      // failure
      dispatch(logout());
      dispatch(getUserFailure(response as AxiosResponse<APIDataError>));
      dispatch(
        addMessage({
          message: response.data.error,
          more: response.data.details,
          severity: 'negative',
        }),
      );
      return false;
    })
    .catch((error: AxiosError) => {
      // big failure
      dispatch(logout());
      dispatch(getUserFailure(error.response));
      dispatch(
        addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        }),
      );
      return false;
    })
    .finally(() => dispatch(loading(false)));
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
