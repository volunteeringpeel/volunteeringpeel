// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { addMessage } from '@app/common/actions';

// Component Imports
import Images from '@app/admin/components/pages/Images';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  addMessage: (message: Message) => dispatch(addMessage(message)),
});

const connectedImages = connect(null, mapDispatchToProps)(Images);

export default connectedImages;
