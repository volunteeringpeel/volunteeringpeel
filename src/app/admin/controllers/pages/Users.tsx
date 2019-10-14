// Library Imports
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

// Component Imports
import Users from '@app/admin/components/pages/Users';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (path: string) => {
    dispatch(push(path));
  },
});

const connectedUsers = connect(
  null,
  mapDispatchToProps,
)(Users);
const routerUsers = withRouter(connectedUsers);

export default routerUsers;
