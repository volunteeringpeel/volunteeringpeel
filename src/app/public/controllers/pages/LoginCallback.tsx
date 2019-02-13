// Library Imports
import { connect } from 'react-redux';

// Component Imports
import LoginCallback from '@app/public/components/pages/LoginCallback';

const mapStateToProps = (state: VP.State) => ({
  location: state.router.location,
});

const connectedLoginCallback = connect(mapStateToProps)(LoginCallback);

export default connectedLoginCallback;
