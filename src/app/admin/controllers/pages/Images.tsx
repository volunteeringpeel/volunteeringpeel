// Library Imports
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { addMessage } from '@app/common/actions';

// Component Imports
import Images from '@app/admin/components/pages/Images';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addMessage: (message: VP.Message) => dispatch(addMessage(message)),
});

const connectedImages = connect(
  null,
  mapDispatchToProps,
)(Images);

export default connectedImages;
