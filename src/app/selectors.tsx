// Library Imports
import * as React from 'react';
import { createSelector } from 'reselect';

// App Imports
import Auth from '@app/Auth';

const getUser = (state: State) => state.user;

export const userAbleToRegister = createSelector([getUser], user => {
  // if not logged in, can't register
  if (user.status !== 'in') {
    return (
      <>
        Please <a onClick={Auth.login}>log in</a> to register
      </>
    );
  }
  if (
    !user.user.user.first_name ||
    !user.user.user.last_name ||
    !user.user.user.phone_1 ||
    !user.user.user.phone_2
  ) {
    return 'Please complete profile (name and phone #) to register';
  }
  return true;
});
