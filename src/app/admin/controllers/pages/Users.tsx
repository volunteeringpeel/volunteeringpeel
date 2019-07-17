// Library Imports
import { LocationDescriptor } from 'history';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

// Component Imports
import Users from '@app/admin/components/pages/Users';

const mapDispatchToProps = (dispatch: Dispatch) => ({
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
