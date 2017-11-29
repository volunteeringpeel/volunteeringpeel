import axios from 'axios';
import * as Promise from 'bluebird';
import { map, sortBy } from 'lodash-es';
import * as React from 'react';
import { Card, Container, Image, Segment } from 'semantic-ui-react';

interface SponsorsProps {
  loading: (status: boolean) => any;
}

interface SponsorsState {
  sponsors: Sponsor[];
}

export default class Sponsors extends React.Component<SponsorsProps, SponsorsState> {
  constructor() {
    super();

    this.state = { sponsors: [] };
  }

  public componentDidMount() {
    Promise.resolve(() => this.props.loading(true))
      .then(() => axios.get('/api/public/sponsors'))
      .then(res => {
        this.props.loading(false);
        this.setState({ sponsors: res.data.data });
      });
  }

  public render() {
    return (
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
    );
  }
}
