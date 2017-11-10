import axios from 'axios';
import { map, sortBy } from 'lodash-es';
import * as React from 'react';
import { Card, Container, Image, Segment } from 'semantic-ui-react';

import LoadingDimmer from '@app/components/modules/LoadingDimmer';

interface SponsorsState {
  loading: boolean;
  sponsors: Sponsor[];
}

export default class Sponsors extends React.Component<{}, SponsorsState> {
  constructor() {
    super();

    this.state = { loading: true, sponsors: [] };
  }

  public componentDidMount() {
    axios.get('/api/public/sponsors').then(res => {
      this.setState({ loading: false, sponsors: res.data.data });
    });
  }

  public render() {
    return (
      <LoadingDimmer loading={this.state.loading}>
        <Segment style={{ padding: '4em 0em' }} vertical>
          <Container>
            <Card.Group>
              {map(sortBy(this.state.sponsors, ['priority']), sponsor => (
                <Card>
                  <Image src={`http://volunteeringpeel.org/${sponsor.image}`} />
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
      </LoadingDimmer>
    );
  }
}
