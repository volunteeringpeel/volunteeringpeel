import { addMessage, dismissMessage, getUser, getUserFailure, getUserSuccess } from '@app/actions';
import Header from '@app/components/Header';
import { AxiosResponse } from 'axios';
import { LocationDescriptor } from 'history';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
});

const connectedHeader = connect(mapStateToProps, mapDispatchToProps)(Header);
// tslint:disable-next-line:variable-name
const HeaderController = withRouter(connectedHeader);

export default HeaderController;
