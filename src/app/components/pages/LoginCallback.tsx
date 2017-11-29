import * as React from 'react';

import Auth from '@app/Auth';

interface LoginCallbackProps {
  location: Location;
}

export default class LoginCallback extends React.Component<LoginCallbackProps> {
  public componentDidMount() {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      Auth.handleAuthentication();
    }
  }

  public render() {
    return <div />;
  }
}
