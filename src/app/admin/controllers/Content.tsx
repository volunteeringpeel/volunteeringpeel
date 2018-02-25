// Library Imports
import { LocationDescriptor } from 'history';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';
import { Dispatch } from 'redux';

import Content from '@app/admin/components/Content';

const mapStateToProps = (state: State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
});

const connectedController = connect(mapStateToProps, mapDispatchToProps)(Content);
// tslint:disable-next-line:variable-name
const ContentController = withRouter(connectedController);

export default ContentController;
