// Library Imports
import axios, { AxiosError } from 'axios';
import * as Bluebird from 'bluebird';
import { LocationDescriptor } from 'history';
import update from 'immutability-helper'; // tslint:disable-line:import-name
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { Dropdown, Form, Table } from 'semantic-ui-react';

// App Imports
import { formatDateForMySQL, timeFormat } from '@app/common/utilities';

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
  confirmLevels: ConfirmLevel[];
}

interface AttendanceEntry {
  user_shift_id: number;
  confirm_level_id: number;
  start_time: string;
  end_time: string;
  hours_override: string;
  other_shifts: string;
  assigned_exec: number;
  assigned_name: string;
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
  };
  changed: boolean;
}

export default class Attendance extends React.Component<AttendanceProps, AttendanceState> {
  constructor(props: AttendanceProps) {
    super(props);

    this.state = {
      attendance: [],
      confirmLevels: [],
      activeData: [],
      activeEntry: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    return Bluebird.resolve(this.props.loading(true))
      .then(() => {
        return axios.get('/api/attendance', {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        });
      })
      .then(res => {
        this.setState({
          attendance: _.map(
            res.data.data.attendance as AttendanceEntry[],
            // set changed to false by default
            __ => ({ ...__, changed: false }),
          ),
          confirmLevels: res.data.data.levels,
        });
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => {
        this.props.loading(false);
        if (this.state.activeEntry) {
          this.setState({
            activeData: _.filter(this.state.attendance, [
              'shift.shift_id',
              +this.state.activeEntry,
            ]),
          });
        }
      });
  }

  public handleUpdate(entry: number, field: string, value: any) {
    this.setState(
      update(this.state, {
        activeData: {
          [_.findIndex(this.state.activeData, ['user_shift_id', entry])]: {
            [field]: {
              $set: value,
            },
            changed: {
              $set: true,
            },
          },
        },
      }),
    );
  }

  public handleSubmit() {
    return Bluebird.resolve(this.props.loading(true))
      .then(() =>
        axios.post(
          '/api/attendance',
          _.map(_.filter(this.state.activeData, 'changed'), __ => ({
            user_shift_id: __.user_shift_id,
            confirm_level_id: __.confirm_level_id,
            start_override: formatDateForMySQL(new Date(__.start_time)),
            end_override: formatDateForMySQL(new Date(__.end_time)),
            hours_override: __.hours_override,
          })),
          { headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` } },
        ),
      )
      .then(res => {
        this.props.addMessage({
          message: res.data.data,
          severity: 'positive',
        });
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => {
        this.props.loading(false);
        this.refresh();
      });
  }

  public render() {
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

    return (
      <Form onSubmit={this.handleSubmit}>
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
        {this.state.activeEntry && (
          <>
            <Table
              compact
              celled
              headerRow={[
                'Status',
                'First Name',
                'Last Name',
                'Start and End',
                'Hours',
                'Other Shifts',
                'Assigned Exec',
              ]}
              renderBodyRow={(entry: AttendanceEntry) => ({
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
                        value={entry.confirm_level_id}
                        onChange={(e, { value }) =>
                          this.handleUpdate(entry.user_shift_id, 'confirm_level_id', value)
                        }
                      />
                    ),
                  },
                  entry.user.first_name,
                  entry.user.last_name,
                  {
                    key: 'time',
                    content: (
                      <>
                        <DateTimePicker
                          value={new Date(entry.start_time)}
                          onChange={value =>
                            this.handleUpdate(
                              entry.user_shift_id,
                              'start_time',
                              value.toISOString(),
                            )
                          }
                        />
                        <DateTimePicker
                          value={new Date(entry.end_time)}
                          onChange={value =>
                            this.handleUpdate(entry.user_shift_id, 'end_time', value.toISOString())
                          }
                        />
                      </>
                    ),
                  },
                  {
                    key: 'hours',
                    content: (
                      <>
                        {timeFormat(moment.duration(moment(entry.end_time).diff(entry.start_time)))}{' '}
                        +
                        <Form.Input
                          inline
                          fluid
                          type="text"
                          size="mini"
                          pattern="-?[0-9]+(:[0-9]{2})?(:[0-9]{2})?"
                          value={entry.hours_override}
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
                            .duration(moment(entry.end_time).diff(entry.start_time))
                            .add(entry.hours_override),
                        )}
                      </>
                    ),
                  },
                  entry.other_shifts,
                  {
                    key: 'assigned_exec',
                    content: entry.assigned_name,
                    positive: entry.assigned_exec === this.props.user.user_id,
                  },
                ],
                warning: entry.changed,
              })}
              tableData={this.state.activeData}
            />
            <Form.Button type="submit">Save</Form.Button>
          </>
        )}
      </Form>
    );
  }
}
