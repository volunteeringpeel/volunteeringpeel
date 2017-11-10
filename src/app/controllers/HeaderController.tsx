import { addMessage, dismissMessage, getUser, getUserFailure, getUserSuccess } from '@app/actions';
import Header from '@app/components/Header';
import { AxiosResponse } from 'axios';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State) => ({
  user: state.user.user,
});

// tslint:disable-next-line:variable-name
const HeaderController = connect(mapStateToProps)(Header);

export default HeaderController;
