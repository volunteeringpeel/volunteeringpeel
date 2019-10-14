// Library Imports
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { addMessage } from '@app/common/actions';

// Component Imports
import SponsorModal from '@app/admin/components/modules/SponsorModal';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addMessage: (message: VP.Message) => dispatch(addMessage(message)),
});

const connectedSponsorModal = connect(
  null,
  mapDispatchToProps,
)(SponsorModal);

export default connectedSponsorModal;
