// Library Imports
import { LocationDescriptor } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Events from '@app/admin/components/pages/Events';
import { loadUser } from '@app/common/utilities';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
});

const connectedEvents = connect(null, mapDispatchToProps)(Events);
const routerEvents = withRouter(connectedEvents);

export default routerEvents;
