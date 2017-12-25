// Library Imports
import { reduce } from 'lodash-es';
import * as moment from 'moment';
import * as React from 'react';
import { Redirect } from 'react-router';
import { Container, Header, Icon, Menu, Segment, Statistic, Table } from 'semantic-ui-react';

interface UserDashboardProps {
  user: UserState;
  loading: boolean;
}

export default class UserDashboard extends React.Component<UserDashboardProps> {
  // take a number and pad it with one zero if it needs to be (i.e. 1 => 01, 11 => 11, 123 => 123)
  public pad = (number: number) => (number < 10 ? ('00' + number).slice(-2) : number.toString());

  public render() {
    if (this.props.user.status !== 'in') return <Redirect to="/home" />;

    const totalHours = reduce(
      this.props.user.user.events,
      (acc: moment.Duration, event) => acc.add(event.hours),
      moment.duration(),
    );
    const hours = `${this.pad(Math.floor(totalHours.asHours()))}:${this.pad(totalHours.minutes())}`;
    return (
      <Container>
        <Segment style={{ padding: '2em 0' }} vertical>
          <Statistic.Group
            widths={2}
            items={[
              { key: 'events', label: 'Events', value: this.props.user.user.events.length },
              { key: 'hours', label: 'Hours', value: hours },
            ]}
          />
        </Segment>
        <Segment style={{ padding: '2em 0' }} vertical>
          <Header as="h2" content="Events" />
          {this.props.user.user.events.length > 0 ? (
            <>
              <Table>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>First</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>

              <Menu pagination>
                <Menu.Item as="a" icon>
                  <Icon name="chevron left" />
                </Menu.Item>
                <Menu.Item as="a">1</Menu.Item>
                <Menu.Item as="a">2</Menu.Item>
                <Menu.Item as="a">3</Menu.Item>
                <Menu.Item as="a">4</Menu.Item>
                <Menu.Item as="a" icon>
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
            </>
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
