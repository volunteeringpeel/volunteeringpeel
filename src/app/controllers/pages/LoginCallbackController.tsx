import { connect } from 'react-redux';

import LoginCallback from '@app/components/pages/LoginCallback';

const mapStateToProps = (state: State) => ({
  location: state.router.location,
});

const connectedLoginCallback = connect(mapStateToProps)(LoginCallback);

export default connectedLoginCallback;
