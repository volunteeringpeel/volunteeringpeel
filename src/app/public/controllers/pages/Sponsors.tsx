// Library Imports
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Sponsors from '@app/public/components/pages/Sponsors';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedEvents = connect(
  null,
  mapDispatchToProps,
)(Sponsors);

export default connectedEvents;
