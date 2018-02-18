// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { loading } from '@app/public/actions';

// Component Imports
import { loadUser } from '@app/common/utilities';
import Events from '@app/public/components/pages/Events';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
  loadUser: loadUser.bind(null, dispatch),
});

const connectedEvents = connect(null, mapDispatchToProps)(Events);

export default connectedEvents;
