// Library Imports
import { LocationDescriptor } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

// Component Imports
import Users from '@app/admin/components/pages/Users';

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
