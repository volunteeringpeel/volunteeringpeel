import { addMessage, dismissMessage, getUser, getUserFailure, getUserSuccess } from '@app/actions';
import Site from '@app/components/Site';
import { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State) => ({
  user: state.user.user,
  status: state.user.status,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loadUser: () => {
    const token = localStorage.getItem('id_token');
    if (!token || token === '') {
      // if there is no token, dont bother
      return;
    }

    // fetch user from token (if server deems it's valid token)
    dispatch(getUser(token))
      .payload.then(response => {
        if (response.data.status === 'success') {
          dispatch(getUserSuccess(response as AxiosResponse<APIDataSuccess<User>>));
        } else {
          sessionStorage.removeItem('id_token');
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
      .catch(error => {
        dispatch(getUserFailure(error));
        dispatch(
          addMessage({
            message: error.data.error,
            more: error.data.details,
            severity: 'negative',
          }),
        );
      });
  },
});

// tslint:disable-next-line:variable-name
const SiteController = connect(mapStateToProps, mapDispatchToProps)(Site);

export default SiteController;
