// Library Imports
import * as React from 'react';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';

const getUser = (state: VP.State) => state.user;

export const userAbleToRegister = createSelector(
  [getUser],
  user => {
    // if not logged in, can't register
    if (user.status !== 'in') {
      // TODO: HYPERLINK LOG IN
      return <>Please log in to register</>;
    }
    if (
      !user.user.user.first_name ||
      !user.user.user.last_name ||
      !user.user.user.phone_1 ||
      !user.user.user.school
    ) {
      return (
        <>
          Please <Link to="/user/profile">fill out your profile</Link> (name, school, and phone #)
          to register
        </>
      );
    }
    return true;
  },
);
