import {
  addMessage,
  dismissMessage,
  getUser,
  getUserFailure,
  getUserSuccess,
  logout,
} from '@app/actions';
import Site from '@app/components/Site';
import { AxiosError, AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State) => ({
  loading: state.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loadUser: () => {
    // Check whether the current time is past the token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const isValid = new Date().getTime() < expiresAt;
    if (!isValid) {
      dispatch(logout());
      dispatch(
        addMessage({
          message: 'Session expired',
          more: 'Please log back in',
          severity: 'negative',
        }),
      );
      return;
    }

    // fetch user from token (if server deems it's valid token)
    dispatch(getUser(localStorage.getItem('id_token')))
      .payload.then(response => {
        if (response.data.status === 'success') {
          dispatch(getUserSuccess(response as AxiosResponse<APIDataSuccess<User>>));
        } else {
          localStorage.removeItem('id_token');
          dispatch(getUserFailure(response as AxiosResponse<APIDataError>));
          dispatch(
            addMessage({
              message: response.data.error,
              more: response.data.details,
              severity: 'negative',
            }),
          );
        }
      })
      .catch((error: AxiosError) => {
        localStorage.removeItem('id_token');
        dispatch(getUserFailure(error.response));
        dispatch(
          addMessage({
            message: error.response.data.error,
            more: error.response.data.details,
            severity: 'negative',
          }),
        );
      });
  },
});

const connectedSite = connect(mapStateToProps, mapDispatchToProps)(Site);
// tslint:disable-next-line:variable-name
const SiteController = withRouter(connectedSite);

export default SiteController;
