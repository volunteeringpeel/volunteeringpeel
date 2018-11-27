// Library Imports
import axios from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import { Card, Container, Image, Segment } from 'semantic-ui-react';

// Component Imports
import CardColumns from '@app/public/components/blocks/CardColumns';

interface SponsorsProps {
  loading: (status: boolean) => any;
}

interface SponsorsState {
  sponsors: VP.Sponsor[];
}

export default class Sponsors extends React.Component<SponsorsProps, SponsorsState> {
  constructor(props: SponsorsProps) {
    super(props);

    this.state = { sponsors: [] };
  }

  public componentDidMount() {
    Promise.resolve(() => this.props.loading(true))
      .then(() => axios.get('/api/public/sponsor'))
      .then(res => {
        this.props.loading(false);
        this.setState({ sponsors: res.data.data });
      });
  }

  public render() {
    return (
      <Segment style={{ padding: '4em 0em' }} vertical>
        <Container>
          <CardColumns
            columns={3}
            cards={_.map(_.sortBy(this.state.sponsors, ['priority']), sponsor => (
              <Card fluid key={sponsor.name}>
                <Image src={`/upload/sponsor/${sponsor.image}`} height="auto" width="100%" />
                <Card.Content>
                  <Card.Header>{sponsor.name}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <Card.Meta>
                    <a href={sponsor.website} target="_blank">
                      Website
                    </a>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          />
        </Container>
      </Segment>
    );
  }
}
