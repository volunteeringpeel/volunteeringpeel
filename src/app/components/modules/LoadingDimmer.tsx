import * as React from 'react';
import { Dimmer, Header, Icon } from 'semantic-ui-react';

interface LoadingDimmerProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export default class LoadingDimmer extends React.Component<LoadingDimmerProps> {
  public static defaultProps = {
    loading: true,
    loadingText: 'Loading...',
  };

  public render() {
    return (
      <Dimmer.Dimmable as="div" dimmed={this.props.loading}>
        <Dimmer active={this.props.loading}>
          <Header as="h2" icon inverted>
            <Icon name="circle notched" loading />
            {this.props.loadingText}
          </Header>
        </Dimmer>
        {this.props.children}
      </Dimmer.Dimmable>
    );
  }
}
