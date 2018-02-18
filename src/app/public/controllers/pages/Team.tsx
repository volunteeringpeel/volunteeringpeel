// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { loading } from '@app/public/actions';

// Component Imports
import Team from '@app/public/components/pages/Team';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedTeam = connect(null, mapDispatchToProps)(Team);

export default connectedTeam;
