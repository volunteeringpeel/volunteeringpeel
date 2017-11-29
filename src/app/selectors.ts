import { createSelector } from 'reselect';

const getUser = (state: State) => state.user;

export const userAbleToRegister = createSelector([getUser], user => {
  // if not logged in, can't register
  if (user.status !== 'in') return 'Please log in to register';
  if (!user.user.first_name || !user.user.last_name || !user.user.phone_1 || !user.user.phone_2) {
    return 'Please complete profile (name and phone #) to register';
  }
  return true;
});
