// Library Imports
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import FAQ from '@app/public/components/pages/FAQ';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedFAQ = connect(
  null,
  mapDispatchToProps,
)(FAQ);

export default connectedFAQ;
