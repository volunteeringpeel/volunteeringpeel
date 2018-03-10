// Library Imports
import axios, { AxiosError } from 'axios';
import * as _ from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Header, Menu, Segment, Table } from 'semantic-ui-react';

// Controllers Imports
import EditEvent from '@app/admin/controllers/modules/EditEvent';

interface EventProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
}

interface EventState {
  users: User[];
}

export default class Events extends React.Component<EventProps, EventState> {
  constructor(props: EventProps) {
    super(props);

    this.state = {
      users: [],
    };
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    return Promise.resolve(this.props.loading(true))
      .then(() => {
        return axios.get('/api/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        });
      })
      .then(res => {
        this.setState({ users: res.data.data });
        this.props.loading(false);
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      });
  }

  public render() {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>First Name</Table.HeaderCell>
            <Table.HeaderCell>Last Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Phone 1</Table.HeaderCell>
            <Table.HeaderCell>Phone 2</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.state.users.map(user => (
            <Table.Row>
              <Table.Cell>{user.first_name}</Table.Cell>
              <Table.Cell>{user.last_name}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.phone_1}</Table.Cell>
              <Table.Cell>{user.phone_2}</Table.Cell>
              <Table.Cell>{user.role_id}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}
