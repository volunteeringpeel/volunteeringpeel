// Library Imports
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

// App Imports
import { loadUser } from '@app/common/utilities';
import PublicSite from '@app/public/components/PublicSite';

const mapStateToProps = (state: VP.State) => ({
  loading: state.loading,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadUser: loadUser.bind(null, dispatch),
});

const connectedController = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicSite);
// tslint:disable-next-line:variable-name
const PublicSiteController = withRouter(connectedController);

export default PublicSiteController;
