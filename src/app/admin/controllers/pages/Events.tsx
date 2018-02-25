// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Events from '@app/admin/components/pages/Events';
import { loadUser } from '@app/common/utilities';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedEvents = connect(null, mapDispatchToProps)(Events);

export default connectedEvents;
