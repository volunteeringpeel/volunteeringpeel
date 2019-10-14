// Library Imports
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

import Content from '@app/admin/components/Content';

const mapStateToProps = (state: VP.State) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  push: (path: string) => {
    dispatch(push(path));
  },
});

const connectedController = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Content);
// tslint:disable-next-line:variable-name
const ContentController = withRouter(connectedController);

export default ContentController;
