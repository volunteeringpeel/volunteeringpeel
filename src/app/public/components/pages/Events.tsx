// Library Imports
import axios from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Button, Container, Item, Segment } from 'semantic-ui-react';

// Component Imports
import ProgressColor from '@app/public/components/blocks/ProgressColor';

// Controller Imports
import EventModal from '@app/public/controllers/modules/EventModal';

interface EventsProps {
  loading: (status: boolean) => any;
  loadUser: () => void;
}

interface EventsState {
  events: VPEvent[];
}

export default class Events extends React.Component<EventsProps, EventsState> {
  constructor(props: EventsProps) {
    super(props);

    this.state = { events: [] };

    this.refresh = this.refresh.bind(this);
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    return Promise.resolve(this.props.loading(true))
      .then(() => {
        if (localStorage.getItem('id_token')) {
          return axios.get('/api/events', {
            headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
          });
        }
        return axios.get('/api/public/events');
      })
      .then(res => {
        this.setState({ events: res.data.data });
        this.props.loading(false);
        this.props.loadUser();
      });
  }

  public render() {
    return (
      <Segment style={{ padding: '4em 0em' }} vertical>
        <Container>
          <div style={{ textAlign: 'center' }}>
            <Button onClick={this.refresh} basic color="grey">
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
                        value={spotsTaken}
                        total={maxSpots}
                        label={`${spotsLeft} of ${maxSpots} spots left`}
                        size="small"
                      />
                      <br />
                      <EventModal event={event} refresh={this.refresh} />
                    </Item.Extra>
                  </Item.Content>
                </Item>
              );
            })}
          </Item.Group>
        </Container>
      </Segment>
    );
  }
}
