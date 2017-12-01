// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { loading } from '@app/actions';

// Component Imports
import Events from '@app/components/pages/Events';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedEvents = connect(null, mapDispatchToProps)(Events);

export default connectedEvents;
