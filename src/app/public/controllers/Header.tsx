// Library Imports
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

// Component Imports
import Header from '@app/public/components/Header';

const mapStateToProps = (state: VP.State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (path: string) => {
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
