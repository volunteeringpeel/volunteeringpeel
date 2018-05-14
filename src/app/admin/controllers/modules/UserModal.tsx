// Library Imports
import * as _ from 'lodash';
import { connect, Dispatch } from 'react-redux';

// App Imports
import { addMessage, loading } from '@app/common/actions';

// Component Imports
import UserModal from '@app/admin/components/modules/UserModal';
import { loadUser } from '@app/common/utilities';

const mapStateToProps = (state: State) => ({
  mailListTemplate: _.map(state.user.user.user.mail_lists, list => ({
    ...list,
    subscribed: false,
  })),
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  addMessage: (message: Message) => dispatch(addMessage(message)),
});

const connectedUserModal = connect(mapStateToProps, mapDispatchToProps)(UserModal);

export default connectedUserModal;
