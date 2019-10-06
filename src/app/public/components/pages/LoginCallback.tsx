// Library Imports
import * as React from 'react';

interface LoginCallbackProps {
  location: Location;
}

export default class LoginCallback extends React.Component<LoginCallbackProps> {
  public handleAuthentication() {
    // TODO: IMPLEMENT
  }

  public componentDidMount() {
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.handleAuthentication();
    }
  }

  public render(): React.ReactElement<any> {
    return null;
  }
}
