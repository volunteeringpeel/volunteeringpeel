// Library Imports
import { LocationDescriptor } from 'history';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

// App Imports
import { addMessage } from '@app/common/actions';
import { loadUser } from '@app/common/utilities';

import AdminSite from '@app/admin/components/AdminSite';

const mapStateToProps = (state: State) => ({
  loading: state.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loadUser: () => {
    loadUser(dispatch).then(success => {
      if (!success) window.location.replace('/');
      else dispatch(addMessage({ message: 'Logged in successfully', severity: 'positive' }));
    });
  },
});

const connectedAdminSite = connect(mapStateToProps, mapDispatchToProps)(AdminSite);
// tslint:disable-next-line:variable-name
const AdminSiteController = withRouter(connectedAdminSite);

export default AdminSiteController;
