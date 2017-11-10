import { dismissMessage } from '@app/actions';
import Auth from '@app/Auth';
import { map } from 'lodash-es';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Container, Message, Segment } from 'semantic-ui-react';

interface MessageBoxProps {
  messages: Message[];
  dismissMessage: (id: number) => () => any;
}

class MessageBox extends React.Component<MessageBoxProps> {
  public render() {
    if (this.props.messages) {
      return (
        <Segment as={Container} style={{ paddingTop: '1em' }} vertical>
          {map(this.props.messages, message => (
            <Message
              header={message.message}
              content={message.more}
              onDismiss={this.props.dismissMessage(message.id)}
              {...{ [message.severity]: true }}
            />
          ))}
        </Segment>
      );
    }
    return null;
  }
}

const mapStateToProps = (state: State) => ({
  messages: state.messages,
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  dismissMessage: (id: number) => () => dispatch(dismissMessage(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox);
