// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { addMessage, loading } from '@app/common/actions';

// Component Imports
import { loadUser } from '@app/common/utilities';
import Events from '@app/public/components/pages/Events';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loadUser: loadUser.bind(null, dispatch),
  addMessage: (message: Message) => dispatch(addMessage(message)),
});

const connectedEvents = connect(null, mapDispatchToProps)(Events);

export default connectedEvents;
