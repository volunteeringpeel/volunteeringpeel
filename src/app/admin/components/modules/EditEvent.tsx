// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import { Form } from 'semantic-ui-react';

interface EditEventProps {
  addMessage: (message: Message) => any;
  cancel: () => void;
  loading: (status: boolean) => any;
  originalEvent: VPEvent;
  refresh: () => void;
}

interface EditEventState {
  name: string;
  description: string;
  address: string;
  transport: string;
}

export default class EditEvent extends React.Component<EditEventProps, EditEventState> {
  constructor(props: EditEventProps) {
    super(props);

    this.state = {
      name: props.originalEvent.name,
      description: props.originalEvent.description,
      address: props.originalEvent.address,
      transport: props.originalEvent.transport,
    };
  }

  public componentWillReceiveProps(nextProps: EditEventProps) {
    if (this.props.originalEvent.event_id !== nextProps.originalEvent.event_id) {
      this.setState({
        name: nextProps.originalEvent.name,
        description: nextProps.originalEvent.description,
        address: nextProps.originalEvent.address,
        transport: nextProps.originalEvent.transport,
      });
    }
  }

  public handleChange = (e: React.FormEvent<any>, { name, value }: any) => {
    this.setState({ [name]: value });
  };

  public handleSubmit = () => {
    const { name, description, address, transport } = this.state;
    // tslint:disable-next-line:no-console
    console.log(name, description, address, transport);
    Promise.resolve(this.props.loading(true))
      .then(() =>
        axios.post(
          `/api/events/${this.props.originalEvent.event_id}`,
          { name, description, address, transport },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
          },
        ),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  };

  public handleDelete = () => {
    Promise.resolve(this.props.loading(true))
      .then(() =>
        axios.delete(`/api/events/${this.props.originalEvent.event_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
        // deselect event (cause it's gone)
        this.props.cancel();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  };

  public render() {
    const { name, description, address, transport } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          fluid
          label="Name"
          name="name"
          value={name}
          placeholder="A Super Cool Event"
          onChange={this.handleChange}
          required
        />
        <Form.TextArea
          label="Description"
          name="description"
          value={description}
          placeholder="This is gonna be super cool. Sign up please my life depends on it."
          onChange={this.handleChange}
          required
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Address"
            name="address"
            value={address}
            placeholder="1234 Sesame Street"
            onChange={this.handleChange}
            required
          />
          <Form.Input
            fluid
            label="Transportation provided from"
            name="transport"
            value={transport}
            placeholder="None provided"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Button
            type="submit"
            content="Save Changes"
            icon="save"
            labelPosition="left"
            primary
          />
          <Form.Button
            onClick={this.handleDelete}
            content="Delete Event"
            negative
            icon="delete"
            labelPosition="left"
          />
          <Form.Button onClick={this.props.cancel} content="Cancel" />
        </Form.Group>
      </Form>
    );
  }
}
