// Library Imports
import * as React from 'react';

interface LoginCallbackProps {
  location: Location;
}

export default class LoginCallback extends React.Component<LoginCallbackProps> {
  public handleAuthentication() {
    const hash = JSON.parse(decodeURIComponent(this.props.location.hash.substr(7)));
    console.log(hash);
    if (hash.authenticationToken) location.replace('/');
  }

  public componentDidMount() {
    if (/authenticationToken|error/.test(this.props.location.hash)) {
      this.handleAuthentication();
    }
  }

  public render(): React.ReactElement<any> {
    return null;
  }
}
