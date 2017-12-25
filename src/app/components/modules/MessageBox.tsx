// Library Imports
import { map } from 'lodash-es';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Action } from 'redux-actions';
import { Container, Message, Segment } from 'semantic-ui-react';

// App Imports
import { dismissMessage } from '@app/actions';
import Auth from '@app/Auth';

interface MessageBoxProps {
  as?: any;
  messages: Message[];
  dismissMessage: (id: number) => () => Action<number>;
}

export default class MessageBox extends React.Component<MessageBoxProps> {
  public static defaultProps: Partial<MessageBoxProps> = {
    as: Container,
  };

  public render() {
    if (!this.props.messages) return null;
    return (
      <Segment as={this.props.as} style={{ paddingTop: '1em' }} vertical>
        {map(this.props.messages, message => (
          <Message
            key={message.id}
            header={message.message}
            content={message.more}
            onDismiss={this.props.dismissMessage(message.id)}
            {...{ [message.severity]: true }}
          />
        ))}
      </Segment>
    );
  }
}
