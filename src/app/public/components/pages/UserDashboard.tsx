// Library Imports
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { Redirect } from 'react-router';
import {
  Button,
  Container,
  Header,
  Icon,
  Menu,
  Segment,
  Statistic,
  Table,
} from 'semantic-ui-react';

// App Imports
import { timeFormat } from '@app/common/utilities';

// Component Imports
import FancyTable from '@app/common/components/FancyTable';

interface UserDashboardProps {
  user: UserState;
  loading: boolean;
}

export default class UserDashboard extends React.Component<UserDashboardProps> {
  public render() {
    if (this.props.user.status === 'out') return <Redirect to="/" />;
    if (this.props.user.status === 'loading') return null;

    const confirmedHours = timeFormat(
      _.reduce(
        _.filter(this.props.user.user.userShifts, userShift => userShift.confirmLevel.id > 100),
        (acc: moment.Duration, event) => acc.add(event.hours),
        moment.duration(),
      ),
    );
    const plannedHours = timeFormat(
      _.reduce(
        _.filter(
          this.props.user.user.userShifts,
          userShift => userShift.confirmLevel.id >= 0 && userShift.confirmLevel.id < 100,
        ),
        (acc: moment.Duration, event) => acc.add(event.hours),
        moment.duration(),
      ),
    );
    return (
      <Container>
        <Segment style={{ padding: '2em 0' }} vertical>
          <Statistic.Group
            widths={3}
            items={[
              { key: 'events', label: 'Shifts', value: this.props.user.user.userShifts.length },
              { key: 'planned', label: 'Planned', value: plannedHours },
              { key: 'confirmed', label: 'Confirmed', value: confirmedHours },
            ]}
          />
        </Segment>
        <Segment style={{ padding: '2em 0' }} vertical>
          <Header as="h2" content="Events" />
          {this.props.user.user.userShifts.length > 0 ? (
            <FancyTable
              tableData={this.props.user.user.userShifts}
              headerRow={['Status', 'Event', 'Shift', 'Hours', 'Hours Letter']}
              filters={[]}
              renderBodyRow={(userShift: UserShift) => ({
                key: userShift.user_shift_id,
                cells: [
                  userShift.confirmLevel.name,
                  userShift.parentEvent.name,
                  userShift.shift.shift_num,
                  timeFormat(moment.duration(userShift.hours)),
                  userShift.letter
                    ? {
                        key: 'letter',
                        content: (
                          <a href={`/upload/${userShift.letter}`} target="_blank">
                            Download
                          </a>
                        ),
                      }
                    : 'Not available',
                ],
              })}
            />
          ) : (
            <>
              No events found 😢<br />Sign up for an event!
            </>
          )}
        </Segment>
      </Container>
    );
  }
}
