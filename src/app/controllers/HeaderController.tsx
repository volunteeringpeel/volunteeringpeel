import { addMessage, dismissMessage, getUser, getUserFailure, getUserSuccess } from '@app/actions';
import Header from '@app/components/Header';
import { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const connectedHeader = connect(mapStateToProps)(Header);
// tslint:disable-next-line:variable-name
const HeaderController = withRouter(connectedHeader);

export default HeaderController;
