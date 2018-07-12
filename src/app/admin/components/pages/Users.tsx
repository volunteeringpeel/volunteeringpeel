// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import { LocationDescriptor } from 'history';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import {
  Button,
  Dropdown,
  Form,
  Header,
  Label,
  Menu,
  Pagination,
  Segment,
  Table,
} from 'semantic-ui-react';

// Component Imports
import FancyTable from '@app/common/components/FancyTable';
import LoadingDimmer from '@app/common/components/LoadingDimmer';

// Controller Imports
import UserModal from '@app/admin/controllers/modules/UserModal';
import * as _ from 'lodash';

interface UsersProps {
  addMessage: (message: Message) => any;
  push: (location: LocationDescriptor) => any;
}

interface UsersState {
  users: ((User | Exec) & { shiftHistory: { [confirmLevel: number]: number } })[];
  confirmLevels: ConfirmLevel[];
  page: number;
  pageSize: number;
  lastPage: number;
  loading: boolean;
}

export default class Users extends React.Component<
  UsersProps & RouteComponentProps<any>,
  UsersState
> {
  constructor(props: UsersProps & RouteComponentProps<any>) {
    super(props);

    this.state = {
      users: [],
      confirmLevels: [],
      lastPage: 1,
      page: 1,
      pageSize: 20,
      loading: true,
    };
  }

  public componentDidMount() {
    this.refresh();
  }

  public handleDelete = (id: number) => {
    Promise.resolve(this.setState({ loading: true }))
      .then(() =>
        axios.delete(`/api/user/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error || error.name,
          more: error.response.data.details || error.message,
          severity: 'negative',
        });
      })
      .finally(() => {
        this.refresh();
        // refresh will call loading(false)
      });
  };

  public refresh() {
    return Promise.resolve(this.setState({ loading: true }))
      .then(() => {
        return axios.get(`/api/user?page=${this.state.page}&page_size=${this.state.pageSize}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        });
      })
      .then(res => {
        // data includes state.users, state.confirmLevels, state.lastPage
        this.setState(res.data.data);
        this.setState({ loading: false });
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
    // exit if there's no users in cache
    if (!this.state.users) return null;
    const headerRow = [
      'Role',
      'First Name',
      'Last Name',
      'School',
      'Email',
      'Phone 1',
      'Phone 2',
      'Actions',
    ];
    const footerRow = [
      <th colSpan={headerRow.length} key="footer">
        <Button
          size="mini"
          content="Add"
          icon="add"
          onClick={() => this.props.push('/admin/users/-1')}
        />
        <Pagination
          activePage={this.state.page}
          totalPages={this.state.lastPage}
          onPageChange={(e, { activePage }) => {
            this.setState({ page: +activePage });
            this.refresh();
          }}
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
        {
          key: 'school',
          icon: user.school ? null : 'attention',
          content: user.school || 'Missing',
          warning: !user.school,
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
      <Form>
        <LoadingDimmer loading={this.state.loading} page={false} />
        <FancyTable
          headerRow={headerRow}
          renderBodyRow={renderBodyRow}
          tableData={this.state.users}
          footerRow={footerRow}
          filters={[{ name: 'exec', description: 'Execs', filter: user => user.role_id === 3 }]}
        />
        {this.state.users.length &&
          this.state.confirmLevels.length && (
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
                          school: '',
                          role_id: 1,
                          mail_lists: [],
                          show_exec: true,
                          shiftHistory: {},
                        }
                      : _.find(this.state.users, ['user_id', +match.params.id])
                  }
                  confirmLevels={this.state.confirmLevels}
                  cancel={() => this.props.push('/admin/users')}
                  refresh={() => this.refresh()}
                />
              )}
            />
          )}
      </Form>
    );
  }
}
