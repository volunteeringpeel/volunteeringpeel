// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Users from '@app/admin/components/pages/Users';
import { loadUser } from '@app/common/utilities';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedUsers = connect(null, mapDispatchToProps)(Users);

export default connectedUsers;
