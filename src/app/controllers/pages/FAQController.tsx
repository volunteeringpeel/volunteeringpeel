import { connect, Dispatch } from 'react-redux';

import { loading } from '@app/actions';
import FAQ from '@app/components/pages/FAQ';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedFAQ = connect(null, mapDispatchToProps)(FAQ);

export default connectedFAQ;
