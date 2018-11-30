// Library Imports
import * as _ from 'lodash';
import * as React from 'react';
import { Action } from 'redux-actions';
import { Button, Container, Message } from 'semantic-ui-react';

interface MessageBoxProps {
  as?: any;
  messages: VP.Message[];
  dismissMessage: (id: number) => () => Action<number>;
  dismissAllMessages: () => Action<void>;
}

export default class MessageBox extends React.Component<MessageBoxProps> {
  public static defaultProps: Partial<MessageBoxProps> = {
    as: Container,
  };

  public render() {
    if (this.props.messages.length === 0) return null;
    return (
      <Container as={this.props.as} style={{ paddingTop: '1em' }}>
        {_.map(this.props.messages, message => (
          <Message
            key={message.id}
            header={message.message}
            content={message.more}
            onDismiss={this.props.dismissMessage(message.id)}
            {...{ [message.severity]: true }}
          />
        ))}
        <hr />
        <Button content="Clear All" basic size="mini" onClick={this.props.dismissAllMessages} />
      </Container>
    );
  }
}
