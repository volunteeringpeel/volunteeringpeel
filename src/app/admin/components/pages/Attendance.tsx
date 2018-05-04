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
  activeData: AttendanceEntry[];
  activeEntry: number;
  execList: DropdownItemProps[];
  confirmLevels: ConfirmLevel[];
  clients: string[];
  addEntry: boolean;
  addUser: number;
  addState: 'positive' | 'negative' | 'warning' | 'primary';
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
  notes: AttendanceField<string>;
  shift: {
    shift_id: number;
    shift_num: number;
  };
  parentEvent: {
    event_id: number;
    name: string;
  };
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
      attendance: [],
      confirmLevels: [],
      execList: [],
      activeData: [],
      activeEntry: null,
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
      this.refresh();
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
        const ix = _.findIndex(this.state.activeData, ['user_shift_id', +command[1]]);
        if (ix < 0) return;

        this.setState(
          update(this.state, {
            activeData: {
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

  public refresh() {
    this.sendMessage(
      {
        action: `refresh|${new Date().getTime()}`,
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
                shift: __.shift,
                other_shifts: __.other_shifts,
                parentEvent: __.parentEvent,
                user: __.user,
                confirm_level_id: { value: __.confirm_level_id, lock: null },
                start_time: { value: __.start_time, lock: null },
                end_time: { value: __.end_time, lock: null },
                hours_override: { value: __.hours_override, lock: null },
                assigned_exec: { value: __.assigned_exec, lock: null },
                notes: { value: __.notes, lock: null },
                status: null,
              }),
            ),
            confirmLevels: data.data.levels,
            execList: data.data.execList,
          });
          if (this.state.activeEntry) {
            this.setState({
              activeData: _.filter(this.state.attendance, [
                'shift.shift_id',
                +this.state.activeEntry,
              ]),
            });
          }
        } else {
          this.props.addMessage({ message: data.error, more: data.details, severity: 'negative' });
        }
      },
    );
  }

  public handleUpdate(entry: number, field: string, value: any) {
    const valid = field === 'hours_override' ? /^-?\d+:\d{2}?(:\d{2})?$/.test(value) : true;
    const ix = _.findIndex(this.state.activeData, ['user_shift_id', entry]);
    const id = this.state.activeData[ix].user_shift_id;
    const action = `update/${id}/${field}|${new Date().getTime()}`;
    if (valid) {
      this.sendMessage(
        {
          action,
          key: localStorage.getItem('id_token'),
          data: value,
        },
        data => {
          if ((this.state.activeData[ix] as any)[field].lock) {
            this.setState(
              update(this.state, {
                activeData: { [ix]: { [field]: { lock: { status: { $set: data.status } } } } },
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
        activeData: {
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
    const shifts = _.map(
      // filtered[0] will be the first one in each shift
      _.groupBy(this.state.attendance, 'shift.shift_id'),
      filtered => ({
        key: filtered[0].shift.shift_id,
        value: filtered[0].shift.shift_id,
        text: `${filtered[0].parentEvent.name} | Shift ${filtered[0].shift.shift_num}`,
      }),
    );

    const statuses = _.map(this.state.confirmLevels, level => ({
      key: level.id,
      value: level.id,
      text: level.name,
    }));

    const columns = [
      'Status',
      'First Name',
      'Last Name',
      'Phone Numbers',
      'Email',
      'Start and End',
      'Hours',
      'Other Shifts',
      'Assigned Exec',
      'Notes',
    ];

    const getLock = (row: number, field: string): TableCellProps => {
      const data: any = this.state.activeData[row];
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
            options={shifts}
            value={this.state.activeEntry ? this.state.activeEntry : null}
            onChange={(e, { value }) =>
              this.setState({
                activeEntry: +value,
                activeData: _.filter(this.state.attendance, ['shift.shift_id', +value]),
              })
            }
          />
        </Form.Field>
        {this.state.activeEntry && (
          <>
            <Form.Field inline>
              <label>Actions: </label>
              <Button.Group>
                <Button
                  content="Add Entry"
                  onClick={() => {
                    this.setState({
                      addEntry: !this.state.addEntry,
                      addState: this.state.addEntry ? null : 'primary',
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
                    const pdf: pdfMake.TDocumentDefinitions = {
                      pageOrientation: 'landscape',
                      header: { text: '\nDiwalicious - Shift 1', alignment: 'center' },
                      footer: (currentPage: number, pageCount: number) => ({
                        text: currentPage + ' of ' + pageCount,
                        alignment: 'center',
                      }),
                      content: {
                        table: {
                          headerRows: 1,
                          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', '*'],

                          body: [
                            // header row
                            [
                              'First',
                              'Last',
                              'Phone #1',
                              'Phone #2',
                              'Check-In Time',
                              'Check-Out Time',
                              'Notes',
                            ].map(text => ({
                              text,
                              bold: true,
                              alignment: 'center',
                              noWrap: true,
                            })),
                            // body rows
                            ..._.map(_.sortBy(this.state.activeData, 'user.first_name'), entry => [
                              entry.user.first_name,
                              entry.user.last_name,
                              entry.user.phone_1 || '',
                              entry.user.phone_2 || '',
                              '',
                              '',
                              entry.notes.value || '',
                            ]),
                          ],
                        },
                      },
                    };
                    pdfMake.createPdf(pdf).download(`attendance-${this.state.activeEntry}.pdf`);
                  }}
                />
                <Button
                  content="Export (CSV)"
                  onClick={() =>
                    axios
                      .get(`/api/attendance/csv/${this.state.activeEntry}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
                      })
                      .then(res => {
                        const link = document.createElement('a');
                        link.download = `attendance-${this.state.activeEntry}.csv`;
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
                        action: `add/${this.state.activeEntry}|${new Date().getTime()}`,
                        key: localStorage.getItem('id_token'),
                        data: this.state.addUser,
                      },
                      data => {
                        if (data.status === 'success') {
                          this.setState({ addUser: null, addState: 'positive' });
                          this.refresh();
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
              tableData={this.state.activeData}
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
                      key: 'notes',
                      content: (
                        <Form.TextArea
                          inline
                          fluid
                          value={entry.notes.value || ''}
                          onChange={(e, { value }) =>
                            this.handleUpdate(entry.user_shift_id, 'notes', value)
                          }
                        />
                      ),
                      className: `cell-${entry.user_shift_id}-notes`,
                      ...getLock(i, 'notes'),
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
