// Library Imports
import axios, { AxiosError } from 'axios';
import { LocationDescriptor } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, Route } from 'react-router-dom';
import { Dropdown, Header, Segment, Table } from 'semantic-ui-react';

// Controllers Imports
import EditEvent from '@app/admin/controllers/modules/EditEvent';

interface AttendanceProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
  push: (location: LocationDescriptor) => any;
}

interface AttendanceState {
  attendance: AttendanceEntry[];
  activeData: AttendanceEntry[];
  activeEntry: number;
}

interface AttendanceEntry {
  user_shift_id: number;
  confirmLevel: ConfirmLevel;
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
}

export default class Attendance extends React.Component<AttendanceProps, AttendanceState> {
  constructor(props: AttendanceProps) {
    super(props);

    this.state = {
      attendance: [],
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
          attendance: res.data.data,
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

  public render() {
    const dropdownOptions = _.map(
      // filtered[0] will be the first one in each shift
      _.groupBy(this.state.attendance, 'shift.shift_id'),
      filtered => ({
        key: filtered[0].shift.shift_id,
        value: filtered[0].shift.shift_id,
        text: `${filtered[0].parentEvent.name} | Shift ${filtered[0].shift.shift_num}`,
      }),
    );

    return (
      <>
        <Dropdown
          placeholder="Select Shift"
          fluid
          search
          selection
          options={dropdownOptions}
          value={this.state.activeEntry ? this.state.activeEntry : null}
          onChange={(e, { value }) =>
            this.setState({
              activeEntry: +value,
              activeData: _.filter(this.state.attendance, ['shift.shift_id', +value]),
            })
          }
        />
        {this.state.activeEntry && (
          <Table
            compact
            celled
            headerRow={['Status', 'First Name', 'Last Name', 'Start', 'End']}
            renderBodyRow={(entry: AttendanceEntry) => ({
              key: entry.user_shift_id,
              cells: [
                entry.confirmLevel.name,
                entry.user.first_name,
                entry.user.last_name,
                entry.shift.start_time,
                entry.shift.end_time,
              ],
            })}
            tableData={this.state.activeData}
          />
        )}
      </>
    );
  }
}
