// Library Imports
import { LocationDescriptor } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Users from '@app/admin/components/pages/Users';
import { loadUser } from '@app/common/utilities';

const mapDispatchToProps = (dispatch: Dispatch<VP.State>) => ({
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
});

const connectedUsers = connect(
  null,
  mapDispatchToProps,
)(Users);
const routerUsers = withRouter(connectedUsers);

export default routerUsers;
