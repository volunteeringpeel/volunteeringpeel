import * as React from 'react';
import { Dimmer, Header, Icon } from 'semantic-ui-react';

interface LoadingDimmerProps {
  loading: boolean;
  loadingText?: string;
}

export default class LoadingDimmer extends React.Component<LoadingDimmerProps> {
  public static defaultProps = {
    loading: true,
    loadingText: 'Loading...',
  };

  public render() {
    return (
      <Dimmer active={this.props.loading} page>
        <Header as="h2" icon inverted>
          <Icon name="circle notched" loading />
          {this.props.loadingText}
        </Header>
      </Dimmer>
    );
  }
}
