// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { addMessage, loading } from '@app/common/actions';

// Component Imports
import UserModal from '@app/admin/components/modules/UserModal';
import { loadUser } from '@app/common/utilities';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  addMessage: (message: Message) => dispatch(addMessage(message)),
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedUserModal = connect(null, mapDispatchToProps)(UserModal);

export default connectedUserModal;
