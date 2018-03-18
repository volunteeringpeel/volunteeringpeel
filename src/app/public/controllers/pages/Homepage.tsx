// Library Imports
import { connect, Dispatch } from 'react-redux';

// App Imports
import { addMessage } from '@app/common/actions';

// Component Imports
import Homepage from '@app/public/components/pages/Homepage';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  addMessage: (message: Message) => {
    dispatch(addMessage(message));
  },
});

// tslint:disable-next-line:variable-name
const HomepageController = connect(null, mapDispatchToProps)(Homepage);

export default HomepageController;
