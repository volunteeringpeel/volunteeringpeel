// Library Imports
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { addMessage, loading } from '@app/common/actions';

// Component Imports
import Attendance from '@app/admin/components/pages/Attendance';

const mapStateToProps = (state: VP.State) => ({
  user: state.user.user.user,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addMessage: (message: VP.Message) => dispatch(addMessage(message)),
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedAttendance = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Attendance);

export default connectedAttendance;
