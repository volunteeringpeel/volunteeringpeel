import { connect } from 'react-redux';

import EventModal from '@app/components/modules/EventModal';
import { userAbleToRegister } from '@app/selectors';

const mapStateToProps = (state: State) => ({
  ableToRegister: userAbleToRegister(state),
});

const connectedEvents = connect(mapStateToProps)(EventModal);

export default connectedEvents;
