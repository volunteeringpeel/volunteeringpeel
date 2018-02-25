// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { addMessage, loading } from '@app/common/actions';

// Component Imports
import EditEvent from '@app/admin/components/modules/EditEvent';
import { loadUser } from '@app/common/utilities';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  addMessage: (message: Message) => dispatch(addMessage(message)),
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedEvents = connect(null, mapDispatchToProps)(EditEvent);

export default connectedEvents;
