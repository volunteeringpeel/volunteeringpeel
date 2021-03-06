// Library Imports
import { connect } from 'react-redux';

// App Imports
import { userAbleToRegister } from '@app/public/selectors';

// Component Imports
import EventModal from '@app/public/components/modules/EventModal';

const mapStateToProps = (state: VP.State) => ({
  ableToRegister: userAbleToRegister(state),
});

const connectedEvents = connect(mapStateToProps)(EventModal);

export default connectedEvents;
