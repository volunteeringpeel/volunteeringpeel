// Library Imports
import { connect } from 'react-redux';
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

// tslint:disable-next-line:variable-name
const SiteController = connect(mapStateToProps, mapDispatchToProps)(Site);

export default SiteController;
