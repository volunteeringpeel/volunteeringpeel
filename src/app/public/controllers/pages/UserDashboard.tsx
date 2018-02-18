// Library Imports
import { connect } from 'react-redux';

// Component Imports
import UserDashboard from '@app/public/components/pages/UserDashboard';

const mapStateToProps = (state: State) => ({
  user: state.user,
});

// tslint:disable-next-line:variable-name
const UserDashboardController = connect(mapStateToProps)(UserDashboard);

export default UserDashboardController;
