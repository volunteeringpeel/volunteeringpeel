import * as React from 'react';
import { map } from 'lodash-es';
import { Segment, Card, Container, Image } from 'semantic-ui-react';

import testdata from '../../testdata';

export default () => (
  <Segment style={{ padding: '8em 0em' }} vertical>
    <Container>
      <Card.Group>
        {map(testdata.execs, exec => (
          <Card>
            <Image
              src={`http://volunteeringpeel.org/images/execPortraits/2017/${exec.first_name}${exec.last_name}2017.JPG`}
            />
            <Card.Content>
              <Card.Header>
                {exec.first_name} {exec.last_name}
              </Card.Header>
              <Card.Meta>
                <span className="date">Joined in 2015</span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Card.Description>{exec.bio}</Card.Description>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Container>
  </Segment>
);
