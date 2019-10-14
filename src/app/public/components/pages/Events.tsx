// Library Imports
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import * as ReactMarkdown from 'react-markdown';
import { Button, Container, Header, Item, Segment } from 'semantic-ui-react';

// Component Imports
import ProgressColor from '@app/public/components/blocks/ProgressColor';
import HomepageMessage from '@app/public/components/modules/HomepageMessage';
import SubscribeBox from '@app/public/components/modules/SubscribeBox';

// Controller Imports
import { getAPI, pluralize } from '@app/common/utilities';
import EventModal from '@app/public/controllers/modules/EventModal';

interface EventsProps {
  loadUser: () => void;
  addMessage: (message: VP.Message) => any;
}

interface EventsState {
  loading: boolean;
  events: VP.Event[];
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
      .then(() => getAPI('event?filter=active'))
      .then(res => {
        const sortedEvents = _.orderBy(res.data.data, ['shifts[0].start_time'], 'asc');
        this.setState({ events: sortedEvents, loading: false });
        this.props.loadUser();
      });
  }

  public render() {
    return (
      <>
        <HomepageMessage />
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
              {this.state.events.length > 0 ? (
                _.map(this.state.events, (event: VP.Event) => {
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
                    : `${startDate.format(formatString)} – ${endDate.format(formatString)}`;

                  // Calculate if event is full based on spots (sum up shift spots)
                  const maxSpots = _.sumBy(event.shifts, 'max_spots');
                  const spotsTaken = _.sumBy(event.shifts, 'spots_taken');
                  const spotsLeft = spotsTaken > maxSpots ? 0 : maxSpots - spotsTaken;

                  // list of shifts as HH:MM-HH:MM
                  const shifts = _.map(
                    event.shifts,
                    shift =>
                      `${moment(shift.start_time).format('hh:mm a')} – ${moment(
                        shift.end_time,
                      ).format('hh:mm a')}`,
                  ).join(', ');
                  return (
                    <Item key={event.event_id}>
                      <Item.Content>
                        <Item.Header>
                          {event.name} <small>{date}</small>
                        </Item.Header>
                        <Item.Meta>
                          {event.address}
                          <br />
                          {event.transport
                            ? `Transportation provided from ${event.transport}`
                            : 'No transportation provided'}
                        </Item.Meta>
                        <Item.Description>
                          <ReactMarkdown source={event.description} />
                        </Item.Description>
                        <Item.Extra>
                          {`${event.shifts.length} ${pluralize(
                            'shift',
                            event.shifts.length,
                          )}: ${shifts}`}
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
                              ReactGA.event({
                                category: 'Events',
                                action: 'Signed Up',
                                label: event.name,
                              });
                              this.props.addMessage({
                                message: 'Signup successful',
                                more: (
                                  <>
                                    Thanks for signing up! Here are some next steps.
                                    <ul>
                                      <li>
                                        One week prior to the event, you will receive a CONFIRMATION
                                        EMAIL with more information regarding the event, please make
                                        sure to REPLY to confirm your attendance. If you do not
                                        reply, you will also receive a PHONE CALL.
                                      </li>
                                      <li>
                                        Until then, you will not receive any emails from us unless
                                        it is urgent. We strongly encourage you to invite your
                                        friends along and mark the date of the event on your
                                        calendar! If for some reason you cannot go, please contact
                                        us as soon as possible. Cheers!
                                      </li>
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
                })
              ) : (
                <p>Uh-oh! There are no upcoming events in our records at the moment.</p>
              )}
            </Item.Group>
          </Container>
        </Segment>
      </>
    );
  }
}
