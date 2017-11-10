import { dismissMessage } from '@app/actions';
import MessageBox from '@app/components/modules/MessageBox';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

const mapStateToProps = (state: State) => ({
  messages: state.messages,
});

const mapDispatchToProps = (dispatch: Dispatch<number>) => ({
  dismissMessage: (id: number) => () => dispatch(dismissMessage(id)),
});

// tslint:disable-next-line:variable-name
const ConnectedMessageBox = connect(mapStateToProps, mapDispatchToProps)(MessageBox);

export default ConnectedMessageBox;
