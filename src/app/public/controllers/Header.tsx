// Library Imports
import { LocationDescriptor } from 'history';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

// Component Imports
import Header from '@app/public/components/Header';

const mapStateToProps = (state: VP.State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
});

const connectedHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
// tslint:disable-next-line:variable-name
const HeaderController = withRouter(connectedHeader);

export default HeaderController;
