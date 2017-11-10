import { noop } from 'lodash-es';
import { createAction } from 'redux-actions';

/* tslint:disable:object-shorthand-properties-first */
// User Management
export const SET_USER = 'SET_USER';
export const setUser = createAction<User, User>(SET_USER, (user: User) => user);

// Error Management
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const addMessage = createAction<Message, Message>(ADD_MESSAGE, (message: Message) => ({
  more: '',
  severity: 'error',
  ...message,
}));
export const DISMISS_MESSAGE = 'DISMISS_MESSAGE';
export const dismissMessage = createAction<number, number>(DISMISS_MESSAGE, (id: number) => id);
export const DISMISS_ALL_MESSAGES = 'DISMISS_ALL_MESSAGES';
export const dismissAllMessages = createAction<void>(DISMISS_ALL_MESSAGES, noop);
