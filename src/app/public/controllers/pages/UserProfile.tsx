// Library Imports
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { addMessage } from '@app/common/actions';
import { loadUser } from '@app/common/utilities';

// Component Imports
import UserProfile from '@app/public/components/pages/UserProfile';

const mapStateToProps = (state: VP.State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (path: string) => {
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
