// Library Imports
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Team from '@app/public/components/pages/Team';

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedTeam = connect(
  null,
  mapDispatchToProps,
)(Team);

export default connectedTeam;
