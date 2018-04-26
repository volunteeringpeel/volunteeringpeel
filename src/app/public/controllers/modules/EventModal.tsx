// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { addMessage } from '@app/common/actions';
import { userAbleToRegister } from '@app/public/selectors';

// Component Imports
import EventModal from '@app/public/components/modules/EventModal';

const mapStateToProps = (state: State) => ({
  ableToRegister: userAbleToRegister(state),
});

const connectedEvents = connect(mapStateToProps)(EventModal);

export default connectedEvents;
