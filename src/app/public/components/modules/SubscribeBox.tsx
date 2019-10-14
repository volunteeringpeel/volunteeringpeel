import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import { postAPI } from '@app/common/utilities';

interface SubscribeBoxProps {
  listID: number;
}

interface SubscribeBoxState {
  subscribed: boolean;
  loading: boolean;
  email: string;
  tocAgree: boolean;
  message: VP.Message;
}

export default class SubscribeBox extends React.Component<SubscribeBoxProps, SubscribeBoxState> {
  constructor(props: SubscribeBoxProps) {
    super(props);

    this.state = {
      subscribed: false,
      loading: false,
      email: '',
      tocAgree: false,
      message: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public handleSubmit = () => {
    Promise.resolve(this.setState({ loading: true }))
      .then(() => postAPI(`mail-list/signup/${this.props.listID}`, { email: this.state.email }))
      .then(res => {
        this.setState({ message: { message: res.data.data, severity: 'positive' } });
      })
      .catch((error: AxiosError) => {
        this.setState({
          message: {
            message: error.response.data.message,
            more: error.response.data.details,
            severity: 'negative',
          },
        });
      })
      .finally(() => {
        this.setState({ loading: false, subscribed: true });
      });
  };

  public render() {
    return !this.state.subscribed ? (
      <Form onSubmit={this.handleSubmit}>
        {this.state.message && (
          <Message
            header={this.state.message.message}
            content={this.state.message.more}
            onDismiss={() => this.setState({ message: null })}
            {...{ [this.state.message.severity]: true }}
          />
        )}
        <Form.Input
          placeholder="Email Address"
          name="email"
          type="email"
          value={this.state.email}
          onChange={(e, { value }) => this.setState({ email: value })}
          disabled={this.state.loading}
          required
        />
        <Form.Checkbox
          label={
            <label>
              I agree to recieve communication from Volunteering Peel and to the{' '}
              <Link to="/about/legal#privacy">privacy policy</Link>
            </label>
          }
          name="tocAgree"
          checked={this.state.tocAgree}
          onChange={(e, { checked }) => this.setState({ tocAgree: checked })}
          disabled={this.state.loading}
          required
        />
        <Button
          size="large"
          type="submit"
          loading={this.state.loading}
          disabled={!this.state.tocAgree}
        >
          Subscribe
        </Button>
      </Form>
    ) : (
      <p>Thanks for subscribing!</p>
    );
  }
}
