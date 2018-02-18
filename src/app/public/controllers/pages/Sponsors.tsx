// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { loading } from '@app/public/actions';

// Component Imports
import Sponsors from '@app/public/components/pages/Sponsors';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedEvents = connect(null, mapDispatchToProps)(Sponsors);

export default connectedEvents;
