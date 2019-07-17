// Library Imports
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { dismissAllMessages, dismissMessage } from '@app/common/actions';

// Component Inputs
import MessageBox from '@app/common/components/MessageBox';

const mapStateToProps = (state: VP.State) => ({
  messages: state.messages,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dismissMessage: (id: number) => () => dispatch(dismissMessage(id)),
  dismissAllMessages: () => dispatch(dismissAllMessages()),
});

// tslint:disable-next-line:variable-name
const MessageBoxController = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessageBox);

export default MessageBoxController;
