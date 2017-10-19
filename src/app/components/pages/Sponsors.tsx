import { map, sortBy } from 'lodash-es';
import * as React from 'react';
import { Card, Container, Image, Segment } from 'semantic-ui-react';

import testdata from '../../testdata';

export default () => (
  <Segment style={{ padding: '8em 0em' }} vertical>
    <Container>
      <Card.Group>
        {map(sortBy(testdata.sponsors, ['priority']), sponsor => (
          <Card>
            <Image src={`http://volunteeringpeel.org/${sponsor.img}`} />
            <Card.Content>
              <Card.Header>{sponsor.name}</Card.Header>
            </Card.Content>
            <Card.Content extra>
              <Card.Meta>
                <a href={sponsor.website}>Website</a>
              </Card.Meta>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Container>
  </Segment>
);
