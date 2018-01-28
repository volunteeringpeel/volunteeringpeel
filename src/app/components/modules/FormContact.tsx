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
            value={name}
            onChange={this.handleChange}
            required
          />
          <Form.Input
            fluid
            label="Email"
            name="email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <Form.Input fluid label="Phone" name="phone" value={phone} onChange={this.handleChange} />
        </Form.Group>
        <Form.TextArea
          label="Message"
          name="message"
          value={message}
          onChange={this.handleChange}
          required
        />
        <Form.Button type="submit" content="Submit" />
      </Form>
    );
  }
}
