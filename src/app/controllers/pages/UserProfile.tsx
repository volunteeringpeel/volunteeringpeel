// Library Imports
import { AxiosResponse } from 'axios';
import { LocationDescriptor } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

// App Imports
import { addMessage } from '@app/actions';
import { loadUser } from '@app/Utilities';

// Component Imports
import UserProfile from '@app/components/pages/UserProfile';

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
  loadUser: loadUser.bind(null, dispatch),
  addMessage: (message: Message) => {
    dispatch(addMessage(message));
  },
});

const connectedUserProfile = connect(mapStateToProps, mapDispatchToProps)(UserProfile);
// tslint:disable-next-line:variable-name
const UserProfileController = withRouter(connectedUserProfile);

export default UserProfileController;
