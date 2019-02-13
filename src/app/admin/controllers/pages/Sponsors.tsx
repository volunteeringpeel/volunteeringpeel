// Library Imports
import { LocationDescriptor } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Sponsors from '@app/admin/components/pages/Sponsors';

const mapDispatchToProps = (dispatch: Dispatch<VP.State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
  push: (path: LocationDescriptor) => {
    dispatch(push(path));
  },
});

const connectedSponsors = connect(
  null,
  mapDispatchToProps,
)(Sponsors);
const routerSponsors = withRouter(connectedSponsors);

export default routerSponsors;
