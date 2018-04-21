// Library Imports
import axios, { AxiosError } from 'axios';
import { LocationDescriptor } from 'history';
import update from 'immutability-helper'; // tslint:disable-line:import-name
import * as _ from 'lodash';
import * as React from 'react';
import { Dropdown, Form, Table } from 'semantic-ui-react';

interface AttendanceProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
  push: (location: LocationDescriptor) => any;
}

interface AttendanceState {
  attendance: AttendanceEntry[];
  activeData: AttendanceEntry[];
  activeEntry: number;
  confirmLevels: ConfirmLevel[];
}

interface AttendanceEntry {
  user_shift_id: number;
  confirmLevel: number;
  hours: string;
  shift: {
    shift_id: number;
    shift_num: number;
    start_time: string;
    end_time: string;
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
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    return Promise.resolve(this.props.loading(true))
      .then(() => {
        return axios.get('/api/attendance', {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        });
      })
      .then(res => {
        this.setState({
          attendance: res.data.data.attendance,
          confirmLevels: res.data.data.levels,
        });
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

  public handleUpdate(entry: number, field: string, value: any) {
    this.setState(
      update(this.state, {
        activeData: {
          [_.findIndex(this.state.activeData, __ => __.user_shift_id === entry)]: {
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
      <Form>
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
              activeData: _.map(
                _.filter(this.state.attendance, ['shift.shift_id', +value]),
                // set changed to false by default
                __ => ({ ...__, changed: false }),
              ),
            })
          }
        />
        {this.state.activeEntry && (
          <>
            <Table
              compact
              celled
              headerRow={['Status', 'First Name', 'Last Name', 'Start', 'End']}
              renderBodyRow={(entry: AttendanceEntry) => ({
                key: entry.user_shift_id,
                cells: [
                  <td>
                    <Dropdown
                      inline
                      fluid
                      search
                      options={statuses}
                      value={entry.confirmLevel}
                      onChange={(e, { value }) =>
                        this.handleUpdate(entry.user_shift_id, 'confirmLevel', value)
                      }
                    />
                  </td>,
                  entry.user.first_name,
                  entry.user.last_name,
                  entry.shift.start_time,
                  entry.shift.end_time,
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
