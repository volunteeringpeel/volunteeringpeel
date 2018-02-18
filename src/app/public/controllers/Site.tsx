// Library Imports
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

// App Imports
import { loadUser } from '@app/common/utilities';
import Site from '@app/public/components/Site';

const mapStateToProps = (state: State) => ({
  loading: state.loading,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loadUser: loadUser.bind(null, dispatch),
});

const connectedController = connect(mapStateToProps, mapDispatchToProps)(Site);
// tslint:disable-next-line:variable-name
const SiteController = withRouter(connectedController);

export default SiteController;
