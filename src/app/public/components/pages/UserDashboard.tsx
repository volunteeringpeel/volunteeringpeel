// Library Imports
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Form,
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
        _.filter(this.props.user.user.userShifts, userShift => userShift.confirmLevel.id >= 100),
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
            <Form>
              <FancyTable
                tableData={this.props.user.user.userShifts}
                columnDefs={['Status', 'Event', 'Shift', 'Hours', 'Hours Letter']}
                filters={[
                  {
                    name: 'confirmed',
                    description: 'Confirmed',
                    filter: userShift => userShift.confirmLevel.id >= 100,
                  },
                  {
                    name: 'letter',
                    description: 'Has hours letter',
                    filter: userShift => !!userShift.letter,
                  },
                ]}
                renderBodyRow={(userShift: UserShift) => ({
                  key: userShift.user_shift_id,
                  positive: userShift.confirmLevel.id >= 100,
                  negative: userShift.confirmLevel.id < 0,
                  cells: [
                    userShift.confirmLevel.name,
                    userShift.parentEvent.name,
                    userShift.shift.shift_num,
                    timeFormat(moment.duration(userShift.hours)),
                    userShift.letter
                      ? {
                          key: 'letter',
                          content: (
                            <a href={`/upload/letter/${userShift.letter}`} target="_blank">
                              Download
                            </a>
                          ),
                        }
                      : 'Not available',
                  ],
                })}
              />
            </Form>
          ) : (
            <p>
              No events found 😢
              <br />
              <Link to="/events">Sign up for an event!</Link>
            </p>
          )}
        </Segment>
      </Container>
    );
  }
}
