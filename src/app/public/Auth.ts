// Library Imports
import * as auth0 from 'auth0-js';
import { push } from 'react-router-redux';

// App Imports
import { addMessage, dismissAllMessages, logout } from '@app/common/actions';
import { loadUser, store } from '@app/common/utilities';

class Auth {
  private auth0: auth0.WebAuth;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.auth0 = new auth0.WebAuth({
      domain: 'volunteering-peel.auth0.com',
      clientID: 'XVYrcvpmYz5nrJ77qkJJFEqtkREB1vVE',
      redirectUri: window.location.origin + '/callback',
      audience: 'https://volunteeringpeel.org/api',
      responseType: 'token id_token',
      scope: 'openid email',
    });
  }

  public login() {
    this.auth0.authorize();
  }

  public handleAuthentication(callback?: () => void) {
    this.auth0.parseHash((err, authResult) => {
      store.dispatch(push('/user/profile'));
      if (authResult && authResult.accessToken && authResult.idToken) {
        // Set the time that the access token will expire at
        const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);

        store.dispatch(dismissAllMessages());
        store.dispatch(addMessage({ message: 'Logged in', severity: 'positive' }));
        loadUser(store.dispatch);
      } else if (err) {
        store.dispatch(
          addMessage({
            message: 'Login failed',
            more: `Please try again. Error: ${err.error}`,
            severity: 'negative',
          }),
        );
      }
      if (callback) callback();
    });
  }

  public logout() {
    store.dispatch(logout());
    store.dispatch(dismissAllMessages());
    store.dispatch(addMessage({ message: 'Logged out successfully', severity: 'positive' }));
    // navigate to the home route
    store.dispatch(push('/'));
  }
}

export default new Auth();
