// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import { LocationDescriptor } from 'history';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';
import { Button, Dimmer, Dropdown, Form, Icon, Pagination } from 'semantic-ui-react';

// Component Imports
import FancyTable from '@app/common/components/FancyTable';
import LoadingDimmer from '@app/common/components/LoadingDimmer';

// Controller Imports
import UserModal from '@app/admin/controllers/modules/UserModal';
import * as _ from 'lodash';

interface UsersProps {
  addMessage: (message: VP.Message) => any;
  push: (location: LocationDescriptor) => any;
}

interface UsersState {
  users: ((VP.User | VP.Exec) & { shiftHistory: { [confirmLevel: number]: number } })[];
  confirmLevels: VP.ConfirmLevel[];
  loading: boolean;
  search: string;
  latestData: number;
  // pagination: should be extracted
  page: number;
  pageSize: number;
  lastPage: number;
  sortKey: string;
  sortDir: 'ascending' | 'descending';
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
      search: '',
      latestData: 0,
      lastPage: 1,
      page: 1,
      pageSize: 20,
      loading: true,
      sortKey: 'user_id',
      sortDir: 'ascending',
    };

    this.refresh = this.refresh.bind(this);
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
        // refresh will unset loading
      });
  };
  public refresh() {
    const requestTime = Date.now();
    return Promise.resolve(this.setState({ loading: true }))
      .then(() => {
        const query = `/api/user?page=${this.state.page}&page_size=${this.state.pageSize}&sort=${
          this.state.sortKey
        }&sort_dir=${this.state.sortDir}&search=${encodeURIComponent(this.state.search)}`;
        return axios.get(query, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        });
      })
      .then(res => {
        // account for quick succession of requests when searching
        if (requestTime > this.state.latestData) {
          // data includes state.users, state.confirmLevels, state.lastPage
          this.setState(res.data.data);
          this.setState({ loading: false, latestData: requestTime });
        }
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
      { name: 'Role', key: 'role_id' },
      'First Name',
      'Last Name',
      'School',
      'Email',
      'Phone 1',
      'Phone 2',
      { name: 'Actions', key: null },
    ];
    const footerRow = [
      <th colSpan={headerRow.length} key="footer">
        <Pagination
          activePage={this.state.page}
          totalPages={this.state.lastPage}
          onPageChange={(e, { activePage }) => {
            this.setState({ page: +activePage });
            this.refresh();
          }}
          inverted
          color="green"
          ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
          firstItem={{ content: <Icon name="angle double left" />, icon: true }}
          lastItem={{ content: <Icon name="angle double right" />, icon: true }}
          prevItem={{ content: <Icon name="angle left" />, icon: true }}
          nextItem={{ content: <Icon name="angle right" />, icon: true }}
        />
      </th>,
    ];
    const renderBodyRow = (user: VP.User, i: number) => ({
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
        <Form.Field inline>
          <label>Actions: </label>
          <Button.Group>
            <Button content="Add" icon="add" onClick={() => this.props.push('/admin/users/-1')} />
          </Button.Group>
        </Form.Field>
        <Form.Input
          inline
          label="Search:"
          placeholder="first, last, phone, or email"
          value={this.state.search}
          onChange={(e, { value }) => {
            this.setState({ search: value });
            this.refresh();
          }}
        />
        <Dimmer.Dimmable>
          <LoadingDimmer loading={this.state.loading} page={false} />
          <FancyTable
            columnDefs={headerRow}
            renderBodyRow={renderBodyRow}
            tableData={this.state.users}
            footerRow={footerRow}
            filters={[{ name: 'exec', description: 'Execs', filter: user => user.role_id === 3 }]}
            sortCallback={(key, dir) => {
              this.setState({
                // reset page to 1 if sort changes
                page: 1,
                sortKey: key,
                sortDir: dir,
              });
              this.refresh();
            }}
          />
        </Dimmer.Dimmable>
        {this.state.users.length && this.state.confirmLevels.length && (
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
