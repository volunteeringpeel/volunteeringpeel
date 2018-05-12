// Library Imports
import * as React from 'react';
import { Form } from 'semantic-ui-react';

interface FormContactState {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default class FormContact extends React.Component<{}, FormContactState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: '',
      email: '',
      phone: '',
      message: '',
    };
  }

  public handleChange = (e: React.FormEvent<any>, { name, value }: any) => {
    this.setState({ [name]: value });
  };

  public handleSubmit = () => {
    const { name, email, phone, message } = this.state;
    // tslint:disable-next-line:no-console
    console.log(name, email, phone, message);
  };

  public render() {
    const { name, email, phone, message } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Name"
            name="name"
            autocomplete="name"
            value={name}
            placeholder="John Doe"
            onChange={this.handleChange}
            required
          />
          <Form.Input
            fluid
            label="Email"
            name="email"
            autocomplete="email"
            value={email}
            placeholder="john.doe@example.com"
            onChange={this.handleChange}
            required
          />
          <Form.Input
            fluid
            label="Phone"
            name="phone"
            type="tel"
            autocomplete="tel"
            value={phone}
            placeholder="555-555-5555"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.TextArea
          label="Message"
          name="message"
          value={message}
          placeholder="Write your message here, and we'll get back to you as soon as we can!"
          onChange={this.handleChange}
          required
        />
        <Form.Button type="submit" content="Submit" />
      </Form>
    );
  }
}
