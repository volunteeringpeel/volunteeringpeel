// Library Imports
import { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Component Imports
import UserDashboard from '@app/components/pages/UserDashboard';

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const connectedUserDashboard = connect(mapStateToProps)(UserDashboard);
// tslint:disable-next-line:variable-name
const UserDashboardController = withRouter(connectedUserDashboard);

export default UserDashboardController;
