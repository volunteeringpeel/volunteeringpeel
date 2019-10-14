// Library Imports
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Dispatch } from 'redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Sponsors from '@app/admin/components/pages/Sponsors';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loading: (status: boolean) => dispatch(loading(status)),
  push: (path: string) => {
    dispatch(push(path));
  },
});

const connectedSponsors = connect(
  null,
  mapDispatchToProps,
)(Sponsors);
const routerSponsors = withRouter(connectedSponsors);

export default routerSponsors;
