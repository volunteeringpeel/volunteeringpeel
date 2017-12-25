// Library Imports
import { connect } from 'react-redux';

// App Imports
import { userAbleToRegister } from '@app/selectors';

// Component Imports
import EventModal from '@app/components/modules/EventModal';

const mapStateToProps = (state: State) => ({
  ableToRegister: userAbleToRegister(state),
});

const connectedEvents = connect(mapStateToProps)(EventModal);

export default connectedEvents;
