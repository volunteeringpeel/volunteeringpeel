import React from 'react';
import _ from 'lodash';
import { Segment, Card, Container, Image } from 'semantic-ui-react';

import testdata from '../../testdata';

export default () => (
  <Segment style={{ padding: '8em 0em' }} vertical>
    <Container>
      <Card.Group>
        {_.map(_.sortBy(testdata.sponsors, ['priority']), sponsor => (
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
