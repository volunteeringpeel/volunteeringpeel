// Library Imports
import { LocationDescriptor } from 'history';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

// Component Imports
import Header from '@app/components/Header';

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
});

// tslint:disable-next-line:variable-name
const HeaderController = connect(mapStateToProps, mapDispatchToProps)(Header);

export default HeaderController;
