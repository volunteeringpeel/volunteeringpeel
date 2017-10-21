import { map, sumBy } from 'lodash-es';
import * as moment from 'moment';
import * as React from 'react';
import { Container, Item, Progress, Segment, SemanticCOLORS } from 'semantic-ui-react';

import EventModal from '../modules/EventModal';

import testdata from '../../testdata';

export default () => (
  <Segment style={{ padding: '8em 0em' }} vertical>
    <Container>
      <Item.Group>
        {map(testdata.events, (event: VPEvent) => {
          // Import dates into moment.js for easy comparison and formatting
          const momentDates = map(event.shifts, shift => moment(shift.date));
          // Smallest date is start and largest is end
          const startDate = moment.min(...momentDates);
          const endDate = moment.min(...momentDates);
          // Change if necessary (e.g. Oct 17, 2017)
          const formatString = 'MMM D, YYYY';
          // If start === end, one day event, otherwise range
          const date = startDate.isSame(endDate, 'day')
            ? startDate.format(formatString)
            : `${startDate.format(formatString)} - ${endDate.format(formatString)}`;

          // Calculate if event is full based on spots (sum up shift spots)
          const maxSpots = sumBy(event.shifts, 'max_spots');
          const spotsLeft = sumBy(event.shifts, 'spots');
          const spotsTaken = maxSpots - spotsLeft;
          // Event is full if spotsLeft === 0
          const full = spotsLeft === 0;

          // Calculate colour for progress bar.
          const colors: SemanticCOLORS[] = ['red', 'orange', 'yellow', 'olive', 'green'];
          const percentFull = spotsLeft / maxSpots;
          // Floor multiples of 20% so full is green, 99% - 80% is olive, etc.
          // Full bars are grey (disabled)
          const color = full ? 'grey' : colors[Math.floor(percentFull / 0.2)];
          return (
            <Item key={event.id}>
              <Item.Content>
                <Item.Header>
                  {event.name} <small>{date}</small>
                </Item.Header>
                <Item.Meta>{event.address}</Item.Meta>
                <Item.Description>{event.description}</Item.Description>
                <Item.Extra>
                  {`${event.shifts.length} ${event.shifts.length > 1 ? 'shifts' : 'shift'}`}
                  <Progress
                    value={spotsTaken}
                    total={maxSpots}
                    label="Spots"
                    size="small"
                    color={color}
                  />
                  <EventModal event={event} />
                </Item.Extra>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </Container>
  </Segment>
);
