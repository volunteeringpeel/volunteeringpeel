// Library Imports
import axios, { AxiosError } from 'axios';
import * as Bluebird from 'bluebird';
import { LocationDescriptor } from 'history';
import update from 'immutability-helper'; // tslint:disable-line:import-name
import * as _ from 'lodash';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as vfsFonts from 'pdfmake/build/vfs_fonts';
import * as React from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker';
import {
  Button,
  Dropdown,
  DropdownItemProps,
  Form,
  Label,
  Message,
  Segment,
  Table,
  TableCellProps,
} from 'semantic-ui-react';
import 'web-animations-js';

// Hack to get VFS fonts to work
(pdfMake as any).vfs = vfsFonts.pdfMake.vfs;

// App Imports
import { formatDateForMySQL, timeFormat } from '@app/common/utilities';

// Component Imports
import FancyTable from '@app/common/components/FancyTable';

interface AttendanceProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
  push: (location: LocationDescriptor) => any;
  user: Exec;
}

interface AttendanceState {
  attendance: AttendanceEntry[];
  activeShift: {
    shift_id: number;
    shift_num: number;
    name: string;
    start_time: string;
    event_id: number;
  };
  shifts: {
    shift_id: number;
    shift_num: number;
    name: string;
    start_time: string;
    event_id: number;
  }[];
  execList: DropdownItemProps[];
  confirmLevels: ConfirmLevel[];
  clients: string[];
  addEntry: boolean;
  addUser: number;
  addState: 'positive' | 'negative' | 'warning';
  users: { text: string; value: number }[];
}

interface AttendanceEntry {
  user_shift_id: number;
  confirm_level_id: AttendanceField<number>;
  start_time: AttendanceField<string>;
  end_time: AttendanceField<string>;
  hours_override: AttendanceField<string>;
  other_shifts: string;
  assigned_exec: AttendanceField<number>;
  add_info: AttendanceField<string>;
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    phone_1: string;
    phone_2: string;
    email: string;
  };
}

interface AttendanceField<T> {
  value: T;
  lock: { action: string; status: 'success' | 'loading' | 'error' | 'changed' };
}

export default class Attendance extends React.Component<AttendanceProps, AttendanceState> {
  private ws: WebSocket;
  private wsCallbacks: { [action: string]: (data: WebSocketData<any>) => void } = {};
  constructor(props: AttendanceProps) {
    super(props);

    this.state = {
      attendance: null,
      confirmLevels: [],
      execList: [],
      activeShift: null,
      shifts: [],
      clients: [],
      users: [],
      addEntry: false,
      addState: null,
      addUser: null,
    };

    this.refresh = this.refresh.bind(this);
  }

  public componentDidMount() {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    this.ws = new WebSocket(`${protocol}://${host}/api/attendance/ws`);
    this.ws.onopen = () => {
      this.sendMessage(
        {
          action: `shifts|${new Date().getTime()}`,
          key: localStorage.getItem('id_token'),
        },
        data => {
          if (data.status === 'success') {
            this.setState({
              shifts: data.data,
            });
          } else {
            this.props.addMessage({
              message: data.error,
              more: data.details,
              severity: 'negative',
            });
          }
        },
      );
    };
    this.ws.onmessage = (e: MessageEvent) => {
      let data: WebSocketData<any>;
      try {
        data = JSON.parse(e.data);
      } catch (e) {
        // handle error
        return;
      }
      this.recieveMessage(data);
    };
  }

  public componentWillUnmount() {
    if (this.ws && this.ws.readyState !== this.ws.CLOSED) {
      this.ws.close();
    }
  }

  public sendMessage(message: WebSocketRequest<any>, callback: (data: WebSocketData<any>) => void) {
    this.wsCallbacks[message.action] = callback;
    this.ws.send(JSON.stringify(message));
  }

  public recieveMessage(data: WebSocketData<any>): void {
    if (data.action === 'global') {
      // global error, handle
      if (data.status === 'error') {
        return this.props.addMessage({
          message: data.error,
          more: data.details,
          severity: 'negative',
        });
      }
      return;
    }
    if (this.wsCallbacks[data.action]) {
      this.wsCallbacks[data.action](data);
      delete this.wsCallbacks[data.action];
      return;
    }
    // parse action (action/param|timestamp)
    if (data.status === 'success') {
      const actionParts = data.action.split('|');
      const command = actionParts[0].split('/');
      if (command[0] === 'update') {
        // command in form update/id/field
        const ix = _.findIndex(this.state.attendance, ['user_shift_id', +command[1]]);
        if (ix < 0) return;

        this.setState(
          update(this.state, {
            attendance: {
              [ix]: {
                [command[2]]: {
                  value: {
                    $set: data.data,
                  },
                  lock: { $set: { action: data.action, lock: 'changed' } },
                },
              },
            },
          }),
        );
        // flashy animate
        const color = '#276f86';
        const backgroundColor = '#f8ffff';
        document.querySelector(`.cell-${command[1]}-${command[2]}`).animate(
          [
            {
              color,
              backgroundColor,
              opacity: 0,
            },
            {
              color,
              backgroundColor,
              opacity: 1,
              offset: 0.1,
            },
            {
              color: '#000',
              backgroundColor: '#fff',
              opacity: 1,
            },
          ],
          {
            duration: 5000,
          },
        );
        return;
      }
      if (command[0] === 'clients') {
        this.setState({ clients: data.data });
        return;
      }
    }
    return this.recieveMessage({
      action: 'global',
      status: 'error',
      error: 'Recieved response with no known request',
      details: JSON.stringify(data),
    });
  }

  public refresh(id: number) {
    this.sendMessage(
      {
        action: `refresh/${id}|${new Date().getTime()}`,
        key: localStorage.getItem('id_token'),
      },
      data => {
        if (data.status === 'success') {
          this.setState({
            attendance: _.map(
              data.data.attendance as any[],
              // set empty maps by default
              __ => ({
                user_shift_id: __.user_shift_id,
                other_shifts: __.other_shifts,
                user: __.user,
                confirm_level_id: { value: __.confirm_level_id, lock: null },
                start_time: { value: __.start_time, lock: null },
                end_time: { value: __.end_time, lock: null },
                hours_override: { value: __.hours_override, lock: null },
                assigned_exec: { value: __.assigned_exec, lock: null },
                add_info: { value: __.add_info, lock: null },
                status: null,
              }),
            ),
            confirmLevels: data.data.levels,
            execList: data.data.execList,
          });
        } else {
          this.props.addMessage({ message: data.error, more: data.details, severity: 'negative' });
        }
      },
    );
  }

  public handleUpdate(entry: number, field: string, value: any) {
    const valid = field === 'hours_override' ? /^-?\d+:\d{2}?(:\d{2})?$/.test(value) : true;
    const ix = _.findIndex(this.state.attendance, ['user_shift_id', entry]);
    const id = this.state.attendance[ix].user_shift_id;
    const action = `update/${id}/${field}|${new Date().getTime()}`;
    if (valid) {
      this.sendMessage(
        {
          action,
          key: localStorage.getItem('id_token'),
          data: value,
        },
        data => {
          if ((this.state.attendance[ix] as any)[field].lock) {
            this.setState(
              update(this.state, {
                attendance: { [ix]: { [field]: { lock: { status: { $set: data.status } } } } },
              }),
            );
          }
          if (data.status === 'error') {
            this.props.addMessage({
              message: data.error,
              more: data.details,
              severity: 'negative',
            });
          }
        },
      );
    }
    this.setState(
      update(this.state, {
        attendance: {
          [ix]: {
            [field]: {
              value: {
                $set: value,
              },
              lock: {
                $set: { action, status: valid ? 'loading' : 'error' },
              },
            },
          },
        },
      }),
    );
  }

  public render() {
    if (!this.ws || this.ws.readyState === this.ws.CONNECTING) {
      return <Message header="Establishing connection..." />;
    }
    if (this.ws.readyState !== this.ws.OPEN) {
      return <Message header="Connection lost" />;
    }

    const statuses = _.map(this.state.confirmLevels, level => ({
      key: level.id,
      value: level.id,
      text: level.name,
    }));

    const columns = [
      { name: 'Status', key: 'confirm_level_id.value' },
      {
        name: 'First Name',
        key: 'user.first_name',
        function: (row: AttendanceEntry) => _.lowerCase(row.user.first_name),
      },
      {
        name: 'Last Name',
        key: 'user.last_name',
        function: (row: AttendanceEntry) => _.lowerCase(row.user.last_name),
      },
      { name: 'Phone Numbers', key: 'user.phone_1' },
      {
        name: 'Email',
        key: 'user.email',

        function: (row: AttendanceEntry) => _.lowerCase(row.user.email),
      },
      { name: 'Start and End', key: 'start_time.value' },
      { name: 'Hours', key: 'end_time.value' },
      { name: 'Other Shifts', key: 'other_shifts' },
      { name: 'Assigned', key: 'assigned_exec' },
      {
        name: 'Notes',
        key: 'add_info.value',
        function: (row: AttendanceEntry) => _.lowerCase(row.add_info.value),
      },
      {
        name: 'Actions',
        key: '',
      },
    ];

    const getLock = (row: number, field: string): TableCellProps => {
      const data: any = this.state.attendance[row];
      const lock = (data[field] as AttendanceField<any>).lock;
      if (!lock) return {};
      if (lock.status === 'success') return { positive: true };
      if (lock.status === 'error') return { negative: true };
      if (lock.status === 'loading') return { warning: true };
    };

    return (
      <Form>
        <p>
          Also editing:{' '}
          {_.map(this.state.clients, (client, i) => <Label as="span" key={i} content={client} />)}
        </p>
        <Form.Field>
          <Dropdown
            placeholder="Select Shift"
            fluid
            search
            selection
            options={this.state.shifts.map(shift => {
              const start = moment(shift.start_time).format('YYYY-MM-DD');
              return {
                key: shift.shift_id,
                text: `${shift.name} | Shift ${shift.shift_num} | ${start}`,
                value: shift.shift_id,
              };
            })}
            value={this.state.activeShift ? this.state.activeShift.shift_id : null}
            onChange={(e, { value }) => {
              this.setState({
                activeShift: _.find(this.state.shifts, ['shift_id', +value]),
              });
              this.refresh(+value);
            }}
          />
        </Form.Field>
        {this.state.attendance && (
          <>
            <Form.Field inline>
              <label>Actions: </label>
              <Button.Group>
                <Button
                  content="Add Entry"
                  onClick={() => {
                    this.setState({
                      addEntry: !this.state.addEntry,
                      addState: this.state.addEntry ? null : 'positive',
                    });
                    this.sendMessage(
                      {
                        action: `users|${new Date().getTime()}`,
                        key: localStorage.getItem('id_token'),
                      },
                      data => {
                        if (data.status === 'success') {
                          this.setState({ users: data.data });
                        } else {
                          this.setState({ addState: 'negative' });
                          this.props.addMessage({
                            message: data.error,
                            more: data.details,
                            severity: 'negative',
                          });
                        }
                      },
                    );
                  }}
                  {...{ [this.state.addState]: true }}
                />
                <Button
                  content="Print (PDF)"
                  onClick={() => {
                    // use sample row to get shift/event data
                    const pdf: pdfMake.TDocumentDefinitions = {
                      pageSize: 'LETTER',
                      header: {
                        text: `\n${this.state.activeShift.name} | Shift ${
                          this.state.activeShift.shift_num
                        }`,
                        alignment: 'center',
                      },
                      footer: (currentPage: number, pageCount: number) => ({
                        text: currentPage + ' of ' + pageCount,
                        alignment: 'center',
                      }),
                      content: {
                        table: {
                          headerRows: 1,
                          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto'],

                          body: [
                            // header row
                            [
                              'First',
                              'Last',
                              'Phone #1',
                              'Phone #2',
                              'Check-In Time',
                              'Check-Out Time',
                            ].map(text => ({
                              text,
                              bold: true,
                              alignment: 'center',
                              noWrap: true,
                            })),
                            // body rows
                            ..._.map(_.sortBy(this.state.attendance, 'user.first_name'), entry => [
                              entry.user.first_name,
                              entry.user.last_name,
                              entry.user.phone_1 || '',
                              entry.user.phone_2 || '',
                              '',
                              '',
                            ]),
                          ],
                        },
                      },
                    };
                    // attendance Event Name # -> attendance-event-name-#
                    const filename = _.kebabCase(
                      `attendance ${this.state.activeShift.name} ${
                        this.state.activeShift.shift_num
                      }`,
                    );
                    pdfMake.createPdf(pdf).download(`${filename}.pdf`);
                  }}
                />
                <Button
                  content="Export (CSV)"
                  onClick={() =>
                    axios
                      .get(`/api/attendance/csv/${this.state.activeShift.shift_id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
                      })
                      .then(res => {
                        const link = document.createElement('a');
                        // attendance Event Name # -> attendance-event-name-#
                        const filename = _.kebabCase(
                          `attendance ${this.state.activeShift.name} ${
                            this.state.activeShift.shift_num
                          }`,
                        );
                        link.download = `${filename}.csv`;
                        link.href = `data:text/csv;charset=UTF-8,${encodeURIComponent(res.data)}`;
                        link.dispatchEvent(new MouseEvent('click'));
                        link.remove();
                      })
                  }
                />
              </Button.Group>
            </Form.Field>
            {this.state.addEntry && (
              <Segment>
                <Form.Field>
                  <Dropdown
                    placeholder="Select user"
                    fluid
                    search
                    selection
                    loading={this.state.users.length === 0}
                    options={this.state.users}
                    value={this.state.addUser ? this.state.addUser : null}
                    onChange={(e, { value }) =>
                      this.setState({
                        addUser: +value,
                      })
                    }
                  />
                </Form.Field>
                <Button
                  content="Add"
                  onClick={() =>
                    this.sendMessage(
                      {
                        action: `add/${this.state.activeShift.shift_id}|${new Date().getTime()}`,
                        key: localStorage.getItem('id_token'),
                        data: this.state.addUser,
                      },
                      data => {
                        if (data.status === 'success') {
                          this.setState({ addUser: null, addState: 'positive' });
                          this.refresh(this.state.activeShift.shift_id);
                        } else {
                          this.setState({ addState: 'negative' });
                          this.props.addMessage({
                            message: data.error,
                            more: data.details,
                            severity: 'negative',
                          });
                        }
                      },
                    )
                  }
                />
              </Segment>
            )}
            <FancyTable
              filters={[
                {
                  name: 'mine',
                  description: 'Assigned to me',
                  filter: __ => __.assigned_exec.value === this.props.user.user_id,
                },
                {
                  name: 'unconfirmed',
                  description: 'Unconfirmed',
                  filter: __ => __.confirm_level_id.value <= 0,
                },
              ]}
              headerRow={columns}
              tableData={this.state.attendance}
              renderBodyRow={(entry: AttendanceEntry, i: number) => {
                const assignedExec = _.find(this.state.execList, ['user_id', entry.assigned_exec]);
                return {
                  key: entry.user_shift_id,
                  cells: [
                    {
                      key: 'confirm_level_id',
                      content: (
                        <Dropdown
                          inline
                          fluid
                          search
                          options={statuses}
                          value={entry.confirm_level_id.value}
                          onChange={(e, { value }) =>
                            this.handleUpdate(entry.user_shift_id, 'confirm_level_id', value)
                          }
                        />
                      ),
                      className: `cell-${entry.user_shift_id}-confirm_level_id`,
                      ...getLock(i, 'confirm_level_id'),
                    },
                    entry.user.first_name,
                    entry.user.last_name,
                    {
                      key: 'phone_numbers',
                      content: (
                        <span>
                          <a href={`tel:${entry.user.phone_1}`}>{entry.user.phone_1}</a>
                          <br />
                          <a href={`tel:${entry.user.phone_2}`}>{entry.user.phone_2}</a>
                        </span>
                      ),
                    },
                    {
                      key: 'email',
                      content: <a href={`mailto:${entry.user.email}`}>{entry.user.email}</a>,
                    },
                    {
                      key: 'time',
                      content: (
                        <>
                          <DateTimePicker
                            value={new Date(entry.start_time.value)}
                            onChange={value =>
                              this.handleUpdate(
                                entry.user_shift_id,
                                'start_time',
                                value.toISOString(),
                              )
                            }
                          />
                          <DateTimePicker
                            value={new Date(entry.end_time.value)}
                            onChange={value =>
                              this.handleUpdate(
                                entry.user_shift_id,
                                'end_time',
                                value.toISOString(),
                              )
                            }
                          />
                        </>
                      ),
                      className: [
                        `cell-${entry.user_shift_id}-start_time`,
                        `cell-${entry.user_shift_id}-end_time`,
                      ],
                      ...getLock(i, 'start_time'),
                      ...getLock(i, 'end_time'),
                    },
                    {
                      key: 'hours',
                      content: (
                        <>
                          {timeFormat(
                            moment.duration(
                              moment(entry.end_time.value).diff(entry.start_time.value),
                            ),
                          )}{' '}
                          +
                          <Form.Input
                            inline
                            fluid
                            type="text"
                            control="input"
                            size="mini"
                            pattern="-?[0-9]+(:[0-9]{2})?(:[0-9]{2})?"
                            value={entry.hours_override.value || ''}
                            placeholder="00:00"
                            onChange={(e, { value }) => {
                              if (/^-?[0-9]+:?[0-9]{0,2}:?[0-9]{0,2}?$/.test(value)) {
                                e.currentTarget.setCustomValidity('');
                                this.handleUpdate(entry.user_shift_id, 'hours_override', value);
                              } else if (!value) {
                                // set to '' if empty (because empty doesn't match regex)
                                this.handleUpdate(entry.user_shift_id, 'hours_override', '');
                              } else {
                                e.currentTarget.setCustomValidity('Please type a duration hh:mm');
                              }
                            }}
                          />
                          ={' '}
                          {timeFormat(
                            moment
                              .duration(moment(entry.end_time.value).diff(entry.start_time.value))
                              .add(entry.hours_override.value),
                          )}
                        </>
                      ),
                      className: `cell-${entry.user_shift_id}-hours_override`,
                      ...getLock(i, 'hours_override'),
                    },
                    entry.other_shifts,
                    {
                      key: 'assigned_exec',
                      content: (
                        <Dropdown
                          inline
                          fluid
                          search
                          options={this.state.execList}
                          value={entry.assigned_exec.value}
                          onChange={(e, { value }) =>
                            this.handleUpdate(entry.user_shift_id, 'assigned_exec', value)
                          }
                        />
                      ),
                      className: `cell-${entry.user_shift_id}-assigned_exec`,
                      ...getLock(i, 'assigned_exec'),
                    },
                    {
                      key: 'add_info',
                      content: (
                        <Form.TextArea
                          inline
                          value={entry.add_info.value || ''}
                          onChange={(e, { value }) =>
                            this.handleUpdate(entry.user_shift_id, 'add_info', value)
                          }
                        />
                      ),
                      className: `cell-${entry.user_shift_id}-add_info`,
                      ...getLock(i, 'add_info'),
                    },
                    {
                      key: 'actions',
                      content: (
                        <Button
                          negative
                          size="tiny"
                          icon="delete"
                          onClick={() =>
                            this.sendMessage(
                              {
                                action: `delete/${
                                  this.state.activeShift.shift_id
                                }|${new Date().getTime()}`,
                                key: localStorage.getItem('id_token'),
                                data: entry.user.user_id,
                              },
                              data => {
                                if (data.status === 'success') {
                                  this.refresh(this.state.activeShift.shift_id);
                                } else {
                                  this.setState({ addState: 'negative' });
                                  this.props.addMessage({
                                    message: data.error,
                                    more: data.details,
                                    severity: 'negative',
                                  });
                                }
                              },
                            )
                          }
                        />
                      ),
                    },
                  ],
                };
              }}
            />
          </>
        )}
      </Form>
    );
  }
}
