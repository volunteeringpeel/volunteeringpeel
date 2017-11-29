import { addMessage, logout } from '@app/actions';
import { store } from '@app/Utilities';
import * as auth0 from 'auth0-js';
import { push } from 'react-router-redux';

class Auth {
  private auth0 = new auth0.WebAuth({
    domain: 'volunteering-peel.auth0.com',
    clientID: 'XVYrcvpmYz5nrJ77qkJJFEqtkREB1vVE',
    redirectUri: 'http://localhost:19847/callback',
    audience: 'https://volunteeringpeel.org/api',
    responseType: 'token id_token',
    scope: 'openid email',
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  public login() {
    this.auth0.authorize();
  }

  public handleAuthentication(cb?: () => void) {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        store.dispatch(addMessage({ message: 'Logged in', severity: 'positive' }));
      } else if (err) {
        store.dispatch(
          addMessage({ message: err.error, more: err.description, severity: 'negative' }),
        );
      }
      if (cb) cb();
      store.dispatch(push('/home'));
    });
  }

  public setSession(authResult: auth0.Auth0DecodedHash) {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    store.dispatch(push('/home'));
  }

  public logout() {
    store.dispatch(logout());
    store.dispatch(addMessage({ message: 'Logged out successfully', severity: 'positive' }));
    // navigate to the home route
    store.dispatch(push('/home'));
  }

  public isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}

export default new Auth();
