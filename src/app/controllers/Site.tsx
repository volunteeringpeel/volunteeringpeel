// Library Imports
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

// App Imports
import Site from '@app/components/Site';
import { loadUser } from '@app/Utilities';

const mapStateToProps = (state: State) => ({
  loading: state.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loadUser: loadUser.bind(null, dispatch),
});

const connectedSite = connect(mapStateToProps, mapDispatchToProps)(Site);
// tslint:disable-next-line:variable-name
const SiteController = withRouter(connectedSite);

export default SiteController;
