// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import FAQ from '@app/public/components/pages/FAQ';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedFAQ = connect(null, mapDispatchToProps)(FAQ);

export default connectedFAQ;
