// Library Imports
import { LocationDescriptor } from 'history';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';

// App Imports
import { addMessage } from '@app/common/actions';
import { loadUser } from '@app/common/utilities';

// Component Imports
import UserProfile from '@app/public/components/pages/UserProfile';

const mapStateToProps = (state: VP.State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch<VP.State>) => ({
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
  loadUser: loadUser.bind(null, dispatch),
  addMessage: (message: VP.Message) => {
    dispatch(addMessage(message));
  },
});

// tslint:disable-next-line:variable-name
const UserProfileController = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserProfile);

export default UserProfileController;
