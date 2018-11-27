// Library Imports
import { AxiosResponse } from 'axios';
import * as Promise from 'bluebird';
import * as update from 'immutability-helper';
import * as _ from 'lodash';
import { combineReducers } from 'redux';
import { Action, handleAction, handleActions } from 'redux-actions';

// App Imports
import {
  ADD_MESSAGE,
  addMessage,
  DISMISS_ALL_MESSAGES,
  DISMISS_MESSAGE,
  GET_USER,
  GET_USER_FAILURE,
  GET_USER_SUCCESS,
  LOADING,
  LOGOUT,
} from '@app/common/actions';
import { store } from '@app/common/utilities';

const loading = handleAction<boolean, boolean>(
  LOADING,
  (state: boolean, action: Action<boolean>): boolean => {
    return action.payload;
  },
  false,
);

const defaultUser: VP.UserState = {
  user: { user: null, new: false, userShifts: [] },
  status: 'out',
};
const user = handleActions<VP.UserState, any>(
  {
    [GET_USER]: (state: VP.UserState, action: Action<Promise<any>>): VP.UserState => {
      return { ...state, status: 'loading' };
    },
    [GET_USER_SUCCESS]: (
      state: VP.UserState,
      action: Action<AxiosResponse<VP.APIDataSuccess<VP.UserData>>>,
    ): VP.UserState => {
      return { status: 'in', user: action.payload.data.data };
    },
    [GET_USER_FAILURE]: (
      state: VP.UserState,
      action: Action<AxiosResponse<VP.APIDataError>>,
    ): VP.UserState => {
      return defaultUser;
    },
    [LOGOUT]: (state: VP.UserState, action: Action<void>): VP.UserState => {
      return defaultUser;
    },
  },
  defaultUser,
);

const messages = handleActions<VP.Message[], any>(
  {
    [ADD_MESSAGE]: (state: VP.Message[], action: Action<VP.Message>): VP.Message[] => {
      const highestID = _.maxBy(state, 'id');
      return [
        {
          id: highestID ? highestID.id + 1 : 0,
          message: action.payload.message,
          more: action.payload.more,
          severity: action.payload.severity,
        },
        ...state,
      ];
    },
    [DISMISS_MESSAGE]: (state: VP.Message[], action: Action<number>): VP.Message[] => {
      return state.filter(todo => todo.id !== action.payload);
    },
    [DISMISS_ALL_MESSAGES]: (state: VP.Message[], action: Action<void>): VP.Message[] => {
      return [];
    },
  },
  [],
);

export { loading, user, messages };
