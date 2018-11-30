/* tslint:disable:object-shorthand-properties-first */
// Library Imports
import axios, { AxiosResponse } from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import { createAction } from 'redux-actions';

// General Things
export const LOADING = 'LOADING';
export const loading = createAction<boolean, boolean>(LOADING, (active: boolean) => active);

// VP.User Management
export const LOGOUT = 'LOGOUT';
export const logout = createAction<void>(LOGOUT, () => {
  // Clear access token and ID token from local storage
  localStorage.removeItem('access_token');
  localStorage.removeItem('id_token');
  localStorage.removeItem('expires_at');
});

export const GET_USER = 'GET_USER';
export const getUser = createAction<Promise<AxiosResponse<VP.APIData<VP.User>>>, string>(
  GET_USER,
  (token: string) =>
    Promise.resolve(
      axios({
        method: 'get',
        url: `/api/user/current`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ),
);
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const getUserSuccess = createAction<
  AxiosResponse<VP.APIDataSuccess<VP.User>>,
  AxiosResponse<VP.APIDataSuccess<VP.User>>
>(GET_USER_SUCCESS, (response: AxiosResponse<VP.APIDataSuccess<VP.User>>) => response);
export const GET_USER_FAILURE = 'GET_USER_FAILURE';
export const getUserFailure = createAction<
  AxiosResponse<VP.APIDataError>,
  AxiosResponse<VP.APIDataError>
>(GET_USER_FAILURE, (response: AxiosResponse<VP.APIDataError>) => response);

// Error Management
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const addMessage = createAction<VP.Message, VP.Message>(
  ADD_MESSAGE,
  (message: VP.Message) => ({
    more: '',
    severity: 'error',
    ...message,
  }),
);
export const DISMISS_MESSAGE = 'DISMISS_MESSAGE';
export const dismissMessage = createAction<number, number>(DISMISS_MESSAGE, (id: number) => id);
export const DISMISS_ALL_MESSAGES = 'DISMISS_ALL_MESSAGES';
export const dismissAllMessages = createAction<void>(DISMISS_ALL_MESSAGES, _.noop);
