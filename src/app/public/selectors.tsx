// Library Imports
import * as React from 'react';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';

// App Imports
import Auth from '@app/public/Auth';

const getUser = (state: State) => state.user;

export const userAbleToRegister = createSelector([getUser], user => {
  // if not logged in, can't register
  if (user.status !== 'in') {
    return (
      <>
        Please{' '}
        <a href="#" onClick={Auth.login}>
          log in
        </a>{' '}
        to register
      </>
    );
  }
  if (
    !user.user.user.first_name ||
    !user.user.user.last_name ||
    !user.user.user.phone_1 ||
    !user.user.user.school
  ) {
    return (
      <>
        Please <Link to="/user/profile">fill out your profile</Link> (name, school, and phone #) to
        register
      </>
    );
  }
  return true;
});
