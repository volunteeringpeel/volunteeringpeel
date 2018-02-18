// Library Imports
import { LocationDescriptor } from 'history';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

// App Imports
import { loadUser } from '@app/common/utilities';

import Site from '@app/admin/components/Site';

const mapStateToProps = (state: State) => ({
  user: state.user,
  loading: state.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loadUser: () => {
    loadUser(dispatch).then(success => {
      if (!success) window.location.replace('/');
    });
  },
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
});

const connectedController = connect(mapStateToProps, mapDispatchToProps)(Site);
// tslint:disable-next-line:variable-name
const SiteController = withRouter(connectedController);

export default SiteController;
