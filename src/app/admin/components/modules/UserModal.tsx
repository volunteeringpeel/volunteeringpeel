// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, Modal } from 'semantic-ui-react';

// Controller Imports
import MessageBox from '@app/common/controllers/MessageBox';

interface UserModalProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
  cancel: () => void;
  refresh: () => void;
  user: User;
}

export default class UserModal extends React.Component<UserModalProps, User> {
  constructor(props: UserModalProps) {
    super(props);

    this.state = {
      first_name: props.user.first_name || '',
      last_name: props.user.last_name || '',
      email: props.user.email || '',
      phone_1: props.user.phone_1 || '',
      phone_2: props.user.phone_2 || '',
      role_id: props.user.role_id,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public componentWillReceiveProps(nextProps: UserModalProps) {
    if (!_.isEqual(this.props.user, nextProps.user)) {
      this.setState({
        first_name: nextProps.user.first_name || '',
        last_name: nextProps.user.last_name || '',
        email: nextProps.user.email || '',
        phone_1: nextProps.user.phone_1 || '',
        phone_2: nextProps.user.phone_2 || '',
        role_id: nextProps.user.role_id,
      });
    }
  }

  public handleSubmit() {
    Promise.resolve(this.props.loading(true))
      .then(() =>
        axios.post(`/api/user/${this.props.user.user_id}`, this.state, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
        this.props.cancel();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error || error.name,
          more: error.response.data.details || error.message,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  }

  public handleChange = (e: React.FormEvent<any>, { name, value, checked }: any) => {
    this.setState({ [name]: value || checked });
  };

  public render() {
    return (
      <Modal open closeIcon onClose={this.props.cancel}>
        <Modal.Header>
          Edit {this.state.first_name} {this.state.last_name}
        </Modal.Header>
        <Modal.Content>
          <MessageBox />
          <br />
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
                placeholder="1234567890"
                onChange={this.handleChange}
              />
              <Form.Input
                label="Phone 2"
                name="phone_2"
                value={this.state.phone_2}
                placeholder="1234567890"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Dropdown
              label="Role"
              name="role_id"
              value={this.state.role_id}
              placeholder="Select..."
              fluid
              selection
              options={[
                { text: 'Volunteer', value: 1 },
                { text: 'Organizer', value: 2 },
                { text: 'Executive', value: 3 },
              ]}
              onChange={this.handleChange}
            />
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
