// Library Imports
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

// App Imports
import { addMessage } from '@app/common/actions';
import { loadUser } from '@app/common/utilities';

import AdminSite from '@app/admin/components/AdminSite';

const mapStateToProps = (state: VP.State) => ({
  loading: state.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<VP.State>) => ({
  loadUser: () => {
    loadUser(dispatch).then(success => {
      if (!success) window.location.replace('/');
      else dispatch(addMessage({ message: 'Logged in successfully', severity: 'positive' }));
    });
  },
});

const connectedAdminSite = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AdminSite);
// tslint:disable-next-line:variable-name
const AdminSiteController = withRouter(connectedAdminSite);

export default AdminSiteController;
