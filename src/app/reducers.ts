import { ADD_MESSAGE, DISMISS_ALL_MESSAGES, DISMISS_MESSAGE, SET_USER } from '@app/actions';
import * as update from 'immutability-helper';
import { filter, maxBy } from 'lodash-es';
import { combineReducers } from 'redux';
import { Action, handleActions } from 'redux-actions';

const user = handleActions<User, User>(
  {
    [SET_USER]: (state: User, action: Action<User>): User => {
      return action.payload;
    },
  },
  null,
);

const messages = handleActions<Message[], any>(
  {
    [ADD_MESSAGE]: (state: Message[], action: Action<Message>): Message[] => {
      const highestID = maxBy(state, 'id');
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
    [DISMISS_MESSAGE]: (state: Message[], action: Action<number>): Message[] => {
      return state.filter(todo => todo.id !== action.payload);
    },
    [DISMISS_ALL_MESSAGES]: (state: Message[], action: Action<void>): Message[] => {
      return [];
    },
  },
  [],
);

export { user, messages };
