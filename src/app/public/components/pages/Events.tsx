// Library Imports
import axios from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Button, Container, Header, Item, Segment } from 'semantic-ui-react';

// Component Imports
import ProgressColor from '@app/public/components/blocks/ProgressColor';
import SubscribeBox from '@app/public/components/modules/SubscribeBox';

// Controller Imports
import EventModal from '@app/public/controllers/modules/EventModal';

interface EventsProps {
  loadUser: () => void;
  addMessage: (message: Message) => any;
}

interface EventsState {
  loading: boolean;
  events: VPEvent[];
}

export default class Events extends React.Component<EventsProps, EventsState> {
  constructor(props: EventsProps) {
    super(props);

    this.state = { events: [], loading: true };

    this.refresh = this.refresh.bind(this);
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    return Promise.resolve(this.setState({ loading: true }))
      .then(() => {
        if (localStorage.getItem('id_token')) {
          return axios.get('/api/event', {
            headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
          });
        }
        return axios.get('/api/public/event');
      })
      .then(res => {
        // Only show events that are marked as active in admin console
        this.setState({ events: _.filter(res.data.data, ['active', true]), loading: false });
        this.props.loadUser();
      });
  }

  public render() {
    return (
      <>
        <Segment style={{ padding: '4em 0em' }} vertical>
          <Container textAlign="center">
            <Header as="h3">Event Notification Sign Up</Header>
            <p>Sign up below for email notifications whenever a new event is posted.</p>
            <SubscribeBox listID={2} />
          </Container>
        </Segment>
        <Segment vertical>
          <Container>
            <div style={{ textAlign: 'center' }}>
              <Button onClick={this.refresh} basic color="grey" loading={this.state.loading}>
                Refresh
              </Button>
            </div>
            <Item.Group divided>
              {_.map(this.state.events, (event: VPEvent) => {
                // Import dates into moment.js for easy comparison and formatting
                const startDates = _.map(event.shifts, shift => moment(shift.start_time));
                const endDates = _.map(event.shifts, shift => moment(shift.end_time));
                // Smallest date is start and largest is end
                const startDate = moment.min(...startDates);
                const endDate = moment.max(...endDates);
                // Change formatting (e.g. Oct 17, 2017)
                const formatString = 'MMM D, YYYY';
                // If start === end, one day event, otherwise range
                const date = startDate.isSame(endDate, 'day')
                  ? startDate.format(formatString)
                  : `${startDate.format(formatString)} - ${endDate.format(formatString)}`;

                // Calculate if event is full based on spots (sum up shift spots)
                const maxSpots = _.sumBy(event.shifts, 'max_spots');
                const spotsTaken = _.sumBy(event.shifts, 'spots_taken');
                const spotsLeft = maxSpots - spotsTaken;
                // Event is full if spotsLeft === 0
                const full = spotsLeft === 0;
                return (
                  <Item key={event.event_id}>
                    <Item.Content>
                      <Item.Header>
                        {event.name} <small>{date}</small>
                      </Item.Header>
                      <Item.Meta>{event.address}</Item.Meta>
                      <Item.Description>
                        <ReactMarkdown source={event.description} />
                      </Item.Description>
                      <Item.Extra>
                        {`${event.shifts.length} ${event.shifts.length > 1 ? 'shifts' : 'shift'}`}
                        <ProgressColor
                          value={maxSpots - spotsTaken}
                          total={maxSpots}
                          label={`${spotsLeft} of ${maxSpots} spots left`}
                          size="small"
                        />
                        <br />
                        <EventModal
                          event={event}
                          refresh={this.refresh}
                          onSuccess={() => {
                            this.props.addMessage({
                              message: 'Signup successful',
                              more: (
                                <>
                                  Thank you for signing up for an event! Here are some next steps
                                  you can think about:
                                  <ul>
                                    <li>
                                      We will be sending a confirmation email, please make sure you
                                      get it
                                    </li>
                                    <li>You will receive a phone call prior to the event</li>
                                    <li>Idk man do something</li>
                                  </ul>
                                </>
                              ),
                              severity: 'positive',
                            });
                            window.scrollTo(0, 0);
                          }}
                        />
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                );
              })}
            </Item.Group>
          </Container>
        </Segment>
      </>
    );
  }
}
