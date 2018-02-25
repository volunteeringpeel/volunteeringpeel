// Library Imports
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { dismissMessage } from '@app/common/actions';

// Component Inputs
import MessageBox from '@app/common/components/MessageBox';

const mapStateToProps = (state: State) => ({
  messages: state.messages,
});

const mapDispatchToProps = (dispatch: Dispatch<number>) => ({
  dismissMessage: (id: number) => () => dispatch(dismissMessage(id)),
});

// tslint:disable-next-line:variable-name
const MessageBoxController = connect(mapStateToProps, mapDispatchToProps)(MessageBox);

export default MessageBoxController;
