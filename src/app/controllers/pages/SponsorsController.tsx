import { connect, Dispatch } from 'react-redux';

import { loading } from '@app/actions';
import Events from '@app/components/pages/Events';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedEvents = connect(null, mapDispatchToProps)(Events);

export default connectedEvents;
