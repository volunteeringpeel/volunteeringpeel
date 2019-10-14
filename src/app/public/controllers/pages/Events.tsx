// Library Imports
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { addMessage } from '@app/common/actions';

// Component Imports
import { loadUser } from '@app/common/utilities';
import Events from '@app/public/components/pages/Events';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadUser: loadUser.bind(null, dispatch),
  addMessage: (message: VP.Message) => dispatch(addMessage(message)),
});

const connectedEvents = connect(
  null,
  mapDispatchToProps,
)(Events);

export default connectedEvents;
