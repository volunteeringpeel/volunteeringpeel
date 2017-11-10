import { dismissMessage } from '@app/actions';
import Site from '@app/components/Site';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State) => ({
  user: state.user,
});

// tslint:disable-next-line:variable-name
const ConnectedSite = connect(mapStateToProps)(Site);

export default ConnectedSite;
