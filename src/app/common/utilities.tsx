// Library Imports
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as Promise from 'bluebird';
import { connectRouter, push, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import * as moment from 'moment';
import 'moment-timezone';
import * as React from 'react';
import * as ReactGA from 'react-ga';
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

const PROD_API = process.env.NODE_ENV === 'production' || process.env.PROD_API !== null;

export const API_BASE = PROD_API
  ? 'https://beta.volunteeringpeel.org/api'
  : 'http://localhost:7071';
export const API_VERSION = 'v2';
export const getAPI = (endpoint: string, config?: AxiosRequestConfig) =>
  axios.get(`${API_BASE}/${API_VERSION}/${endpoint}`, config);
export const putAPI = (endpoint: string, data?: any, config?: AxiosRequestConfig) =>
  axios.put(`${API_BASE}/${API_VERSION}/${endpoint}`, data, config);
export const postAPI = (endpoint: string, data?: any, config?: AxiosRequestConfig) =>
  axios.post(`${API_BASE}/${API_VERSION}/${endpoint}`, data, config);

export const BLOB_BASE = PROD_API
  ? 'https://volunteeringpeel.blob.core.windows.net/website-upload'
  : 'http://localhost:10000';
export const blobSrc = (file: string) => `${BLOB_BASE}/${file}`;

// take a number and pad it with one zero if it needs to be (i.e. 1 => 01, 11 => 11, 123 => 123)
const pad = (number: number) => number.toString().padStart(2, '0');

// moment duration toString basically (hh:mm)
export function timeFormat(time: moment.Duration) {
  return `${pad(Math.floor(time.asHours()))}:${pad(time.minutes())}`;
}

export function formatDateForMySQL(date: Date): string {
  return moment(date)
    .tz('America/Toronto')
    .format('YYYY-MM-DD HH:mm:ss');
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
export function loadUser(dispatch: Dispatch): Promise<boolean> {
  dispatch(loading(true));
  // check if we're logged in at all
  return Promise.resolve(axios.get('https://beta.volunteeringpeel.org/.auth/me'))
    .then(() => dispatch(getUser()).payload)
    .then(response => {
      // success
      if (response.data.status === 'success') {
        dispatch(getUserSuccess(response as AxiosResponse<VP.APIDataSuccess<VP.User>>));
        if (response.data.data.new) {
          ReactGA.event({
            category: 'User',
            action: 'Created Account',
          });
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
      } else if (response.data.status === 'error') {
        dispatch(logout());
        dispatch(getUserFailure(response as AxiosResponse<VP.APIDataError>));
        // failure
        dispatch(
          addMessage({
            message: response.data.message,
            more: response.data.details,
            severity: 'negative',
          }),
        );
        return false;
      }
    })
    .catch((error: AxiosError) => {
      if (error === null) return;
      // big failure
      dispatch(logout());
      dispatch(getUserFailure(error.response));
      // don't show the error if the error is "not logged in"
      if (error.response && error.response.status !== 401) {
        console.log(error.response.status);
        dispatch(
          addMessage({
            message: error.response.data.message,
            more: error.response.data.details,
            severity: 'negative',
          }),
        );
      }
      return false;
    })
    .finally(() => dispatch(loading(false)));
}

export const history = createBrowserHistory();

function configureStore(initialState?: VP.State) {
  let middleware = [routerMiddleware(history), reduxThunk];
  let newStore: Store<VP.State>;

  if (process.env.NODE_ENV !== 'production') {
    const reduxLogger = require('redux-logger').default;
    middleware = [...middleware, reduxLogger];

    const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    newStore = createStore(
      combineReducers({ ...reducers, router: connectRouter(history) }),
      initialState,
      composeEnhancers(applyMiddleware(...middleware)),
    );
  } else {
    newStore = createStore(
      combineReducers({ ...reducers, router: connectRouter(history) }),
      initialState,
      compose(applyMiddleware(...middleware)),
    );
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      newStore.replaceReducer(
        combineReducers({ ...nextRootReducer, router: connectRouter(history) }),
      );
    });
  }

  return newStore;
}

export const store = configureStore();
