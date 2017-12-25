// Library Imports
import { map, reduce, filter } from 'lodash-es';
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
    if (this.props.user.status !== 'in') return <Redirect to="/home" />;

    const pastHours = timeFormat(
      reduce(
        filter(this.props.user.user.events, event => moment(event.end_time).isBefore(moment.now())),
        (acc: moment.Duration, event) => acc.add(event.hours),
        moment.duration(),
      ),
    );
    const plannedHours = timeFormat(
      reduce(
        filter(this.props.user.user.events, event => moment(event.end_time).isAfter(moment.now())),
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
              { key: 'events', label: 'Events', value: this.props.user.user.events.length },
              { key: 'completed', label: 'Completed', value: pastHours },
              { key: 'planned', label: 'Planned', value: plannedHours },
            ]}
          />
        </Segment>
        <Segment style={{ padding: '2em 0' }} vertical>
          <Header as="h2" content="Events" />
          {this.props.user.user.events.length > 0 ? (
            <Table compact celled definition>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell>Event</Table.HeaderCell>
                  <Table.HeaderCell>Shift</Table.HeaderCell>
                  <Table.HeaderCell>Hours</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {map(this.props.user.user.events, event => (
                  <Table.Row>
                    <Table.Cell collapsing>
                      <Button size="mini" primary>
                        ...
                      </Button>
                    </Table.Cell>
                    <Table.Cell>{event.name}</Table.Cell>
                    <Table.Cell>{event.shift_num}</Table.Cell>
                    <Table.Cell>{event.hours}</Table.Cell>
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
