// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { loading } from '@app/public/actions';

// Component Imports
import Events from '@app/public/components/pages/Events';
import { loadUser } from '@app/Utilities';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
  loadUser: loadUser.bind(null, dispatch),
});

const connectedEvents = connect(null, mapDispatchToProps)(Events);

export default connectedEvents;
