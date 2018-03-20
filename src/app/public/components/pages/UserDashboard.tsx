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

interface UserDashboardProps {
  user: UserState;
  loading: boolean;
}

// take a number and pad it with one zero if it needs to be (i.e. 1 => 01, 11 => 11, 123 => 123)
const pad = (number: number) => (number < 10 ? ('00' + number).slice(-2) : number.toString());
const timeFormat = (time: moment.Duration) =>
  `${pad(Math.floor(time.asHours()))}:${pad(time.minutes())}`;

export default class UserDashboard extends React.Component<UserDashboardProps> {
  public render() {
    if (this.props.user.status !== 'in') return <Redirect to="/" />;

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
            <Table compact celled definition>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Event</Table.HeaderCell>
                  <Table.HeaderCell>Shift</Table.HeaderCell>
                  <Table.HeaderCell>Hours</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {_.map(this.props.user.user.userShifts, userShift => (
                  <Table.Row key={userShift.user_shift_id}>
                    <Table.Cell collapsing>
                      <Button size="mini" primary>
                        ...
                      </Button>
                    </Table.Cell>
                    <Table.Cell>{_.lowerCase(userShift.confirmLevel.name)}</Table.Cell>
                    <Table.Cell>{userShift.parentEvent.name}</Table.Cell>
                    <Table.Cell>{userShift.shift.shift_num}</Table.Cell>
                    <Table.Cell>{userShift.hours}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
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
