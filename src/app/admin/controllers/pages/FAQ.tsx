// Library Imports
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { addMessage } from '@app/common/actions';

// Component Imports
import FAQ from '@app/admin/components/pages/FAQ';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addMessage: (message: VP.Message) => dispatch(addMessage(message)),
});

const connectedFAQ = connect(
  null,
  mapDispatchToProps,
)(FAQ);

export default connectedFAQ;
