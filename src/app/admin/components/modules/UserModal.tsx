// Library Imports
import axios, { AxiosError } from 'axios';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';

interface UserModalProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
  cancel: () => void;
  user: User;
}

export default class UserModal extends React.Component<UserModalProps, User> {
  constructor(props: UserModalProps) {
    super(props);

    this.state = props.user;
  }

  public componentWillReceiveProps(nextProps: UserModalProps) {
    if (!_.isEqual(this.props.user, nextProps.user)) {
      this.setState(nextProps.user);
    }
  }

  public handleSubmit() {}

  public handleChange = (e: React.FormEvent<any>, { name, value, checked }: any) => {
    this.setState({ [name]: value || checked });
  };

  public render() {
    return (
      <Modal open closeIcon onClose={this.props.cancel}>
        <Modal.Header>
          Edit {this.state.first_name} {this.state.last_name}
        </Modal.Header>
        <Modal.Content scrolling>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths="equal">
              <Form.Input
                label="First Name"
                name="first_name"
                value={this.state.first_name}
                onChange={this.handleChange}
              />
              <Form.Input
                label="Last Name"
                name="last_name"
                value={this.state.last_name}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Input
              label="Email"
              name="email"
              value={this.state.email}
              type="email"
              onChange={this.handleChange}
            />
            <Form.Group widths="equal">
              <Form.Input
                label="Phone 1"
                name="phone_1"
                value={this.state.phone_1}
                placeholder="4165555555"
                onChange={this.handleChange}
              />
              <Form.Input
                label="Phone 2"
                name="phone_2"
                value={this.state.phone_2}
                placeholder="9055555555"
                onChange={this.handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button primary icon="save" content="Save" onClick={this.handleSubmit} />
            <Button basic icon="delete" content="Cancel" onClick={this.props.cancel} />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}
