// Library Imports
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';

// App Imports
import { addMessage, loading } from '@app/common/actions';

// Component Imports
import EditEvent from '@app/admin/components/modules/EditEvent';

const mapDispatchToProps = (dispatch: Dispatch<VP.State>) => ({
  addMessage: (message: VP.Message) => dispatch(addMessage(message)),
  loading: (status: boolean) => dispatch(loading(status)),
  push: (path: string) => {
    dispatch(push(path));
  },
});

const connectedEvents = connect(
  null,
  mapDispatchToProps,
)(EditEvent);

export default connectedEvents;
