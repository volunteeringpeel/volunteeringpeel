// Library Imports
import * as _ from 'lodash';
import { connect, Dispatch } from 'react-redux';

// App Imports
import { addMessage } from '@app/common/actions';

// Component Imports
import UserModal from '@app/admin/components/modules/UserModal';

const mapStateToProps = (state: VP.State) => ({
  mailListTemplate: _.map(state.user.user.user.mail_lists, list => ({
    ...list,
    subscribed: false,
  })),
});

const mapDispatchToProps = (dispatch: Dispatch<VP.State>) => ({
  addMessage: (message: VP.Message) => dispatch(addMessage(message)),
});

const connectedUserModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserModal);

export default connectedUserModal;
