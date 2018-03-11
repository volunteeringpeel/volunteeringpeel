// Library Imports
import axios, { AxiosError } from 'axios';
import * as React from 'react';
import { Button, Dropdown, Header, Label, Menu, Segment, Table } from 'semantic-ui-react';

// Controller Imports
import UserModal from '@app/admin/controllers/modules/UserModal';

interface EventProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
}

interface EventState {
  users: User[];
  selectedUser: User;
}

export default class Events extends React.Component<EventProps, EventState> {
  constructor(props: EventProps) {
    super(props);

    this.state = {
      users: [],
      selectedUser: null,
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
    const headerRow = ['', 'First Name', 'Last Name', 'Email', 'Phone 1', 'Phone 2', 'Actions'];
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
                onClick={() => this.setState({ selectedUser: user })}
              />
              <Dropdown.Item icon="trash" text="Delete" />
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
        {this.state.selectedUser && (
          <UserModal
            user={this.state.selectedUser}
            cancel={() => this.setState({ selectedUser: null })}
            refresh={() => this.refresh()}
          />
        )}
      </>
    );
  }
}
