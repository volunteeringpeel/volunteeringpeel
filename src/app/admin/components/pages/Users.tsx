// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import { LocationDescriptor } from 'history';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { Button, Dropdown, Header, Label, Menu, Segment, Table } from 'semantic-ui-react';

// Controller Imports
import UserModal from '@app/admin/controllers/modules/UserModal';
import * as _ from 'lodash';

interface EventProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
  push: (location: LocationDescriptor) => any;
}

interface EventState {
  users: User[];
}

export default class Events extends React.Component<
  EventProps & RouteComponentProps<any>,
  EventState
> {
  constructor(props: EventProps & RouteComponentProps<any>) {
    super(props);

    this.state = {
      users: [],
    };
  }

  public componentDidMount() {
    this.refresh();
  }

  public handleDelete = (id: number) => {
    Promise.resolve(this.props.loading(true))
      .then(() =>
        axios.delete(`/api/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.refresh();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error || error.name,
          more: error.response.data.details || error.message,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  };

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
    const headerRow = [
      '',
      'First Name',
      'Last Name',
      'Email',
      'Phone 1',
      'Phone 2',
      <th key="add">
        <Button
          size="mini"
          content="Add"
          icon="add"
          onClick={() => this.props.push('/admin/users/-1')}
        />
      </th>,
    ];
    const renderBodyRow = (user: User, i: number) => ({
      key: `row-${i}`,
      cells: [
        { key: 'role', content: [null, 'Volunteer', 'Organizer', 'Executive'][user.role_id] },
        user.first_name || {
          key: 'first_name',
          icon: 'attention',
          content: 'Missing',
          warning: true,
        },
        user.last_name || {
          key: 'last_name',
          icon: 'attention',
          content: 'Missing',
          warning: true,
        },
        user.email,
        {
          key: 'phone_1',
          icon: user.phone_1 ? null : 'attention',
          content: user.phone_1 || 'Missing',
          warning: !user.phone_1,
        },
        {
          key: 'phone_2',
          icon: user.phone_2 ? null : 'attention',
          content: user.phone_2 || 'Missing',
          warning: !user.phone_2,
        },
        <td key="actions">
          <Dropdown>
            <Dropdown.Menu>
              <Dropdown.Item
                icon="edit"
                text="Edit"
                onClick={() => this.props.push(`/admin/users/${user.user_id}`)}
              />
              <Dropdown.Item
                icon="trash"
                text="Delete"
                onClick={() => this.handleDelete(user.user_id)}
              />
              <Dropdown.Item icon="delete" text="Blacklist" />
            </Dropdown.Menu>
          </Dropdown>
        </td>,
      ],
    });
    return (
      <>
        <Table
          compact
          celled
          definition
          headerRow={headerRow}
          renderBodyRow={renderBodyRow}
          tableData={this.state.users}
        />
        {this.state.users.length && (
          <Route
            path="/admin/users/:id"
            component={({ match }: RouteComponentProps<any>) => (
              <UserModal
                user={
                  +match.params.id < 0
                    ? {
                        user_id: -1,
                        first_name: '',
                        last_name: '',
                        email: '',
                        phone_1: '',
                        phone_2: '',
                        role_id: 1,
                      }
                    : _.find(this.state.users, ['user_id', +match.params.id])
                }
                cancel={() => this.props.push('/admin/users')}
                refresh={() => this.refresh()}
              />
            )}
          />
        )}
      </>
    );
  }
}
