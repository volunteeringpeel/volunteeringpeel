// Library Imports
import axios, { AxiosError } from 'axios';
import * as _ from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Menu, Segment, Table, Label, Dropdown } from 'semantic-ui-react';

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
    const headerRow = ['', 'First Name', 'Last Name', 'Email', 'Phone 1', 'Phone 2', 'Actions'];
    const renderBodyRow = (user: User, i: number) => ({
      key: i,
      cells: [
        [null, 'Volunteer', 'Organizer', 'Executive'][user.role_id],
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
        user.phone_1 || { key: 'phone_1', icon: 'attention', content: 'Missing', warning: true },
        user.phone_2 || { key: 'phone_2', icon: 'attention', content: 'Missing', warning: true },
        <td>
          <Dropdown>
            <Dropdown.Menu>
              <Dropdown.Item icon="edit" text="Edit" />
              <Dropdown.Item icon="trash" text="Delete" />
              <Dropdown.Item icon="delete" text="Blacklist" />
            </Dropdown.Menu>
          </Dropdown>
        </td>,
      ],
    });
    return (
      <Table
        compact
        celled
        definition
        headerRow={headerRow}
        renderBodyRow={renderBodyRow}
        tableData={this.state.users}
      />
    );
  }
}
