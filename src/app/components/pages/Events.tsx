import axios from 'axios';
import * as Promise from 'bluebird';
import { map, sumBy } from 'lodash-es';
import * as moment from 'moment';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Button, Container, Item, Segment } from 'semantic-ui-react';

import ProgressColor from '@app/components/blocks/ProgressColor';
import LoadingDimmer from '@app/components/modules/LoadingDimmer';
import EventModalController from '@app/controllers/modules/EventModalController';

interface EventsState {
  loading: boolean;
  events: VPEvent[];
}

export default class Events extends React.Component<{}, EventsState> {
  constructor() {
    super();

    this.state = { loading: true, events: [] };

    this.refresh = this.refresh.bind(this);
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    return Promise.resolve(this.setState({ loading: true }))
      .then(() => {
        if (localStorage.getItem('id_token')) {
          return axios.get('/api/events', {
            headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
          });
        }
        return axios.get('/api/public/events');
      })
      .then(res => {
        this.setState({ loading: false, events: res.data.data });
      });
  }

  public render() {
    return (
      <LoadingDimmer loading={this.state.loading}>
        <Segment style={{ padding: '4em 0em' }} vertical>
          <Container>
            <div style={{ textAlign: 'center' }}>
              <Button onClick={this.refresh} basic color="grey">
                Refresh
              </Button>
            </div>
            <Item.Group divided>
              {map(this.state.events, (event: VPEvent) => {
                // Import dates into moment.js for easy comparison and formatting
                const momentDates = map(event.shifts, shift => moment(shift.date));
                // Smallest date is start and largest is end
                const startDate = moment.min(...momentDates);
                const endDate = moment.max(...momentDates);
                // Change formatting (e.g. Oct 17, 2017)
                const formatString = 'MMM D, YYYY';
                // If start === end, one day event, otherwise range
                const date = startDate.isSame(endDate, 'day')
                  ? startDate.format(formatString)
                  : `${startDate.format(formatString)} - ${endDate.format(formatString)}`;

                // Calculate if event is full based on spots (sum up shift spots)
                const maxSpots = sumBy(event.shifts, 'max_spots');
                const spotsTaken = sumBy(event.shifts, 'spots_taken');
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
                        <EventModalController event={event} refresh={this.refresh} />
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                );
              })}
            </Item.Group>
          </Container>
        </Segment>
      </LoadingDimmer>
    );
  }
}
