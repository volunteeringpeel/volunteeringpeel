// Library Imports
import * as React from 'react';
import { Dimmer, Header, Icon } from 'semantic-ui-react';

interface LoadingDimmerProps {
  loading: boolean;
  loadingText?: string;
  page?: boolean;
}

export default class LoadingDimmer extends React.Component<LoadingDimmerProps> {
  public static defaultProps = {
    loading: true,
    loadingText: 'Loading...',
    page: true,
  };

  public render() {
    return (
      <Dimmer active={this.props.loading} page={this.props.page}>
        <Header as="h2" icon inverted>
          <Icon name="circle notched" loading />
          {this.props.loadingText}
        </Header>
      </Dimmer>
    );
  }
}
