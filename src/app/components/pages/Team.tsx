import axios from 'axios';
import { map } from 'lodash-es';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Card, Container, Image, Segment } from 'semantic-ui-react';

import LoadingDimmer from '@app/components/modules/LoadingDimmer';

interface TeamState {
  loading: boolean;
  execs: Exec[];
}

export default class Team extends React.Component<{}, TeamState> {
  constructor() {
    super();

    this.state = { loading: true, execs: [] };
  }

  public componentDidMount() {
    axios.get('/api/execs').then(res => {
      this.setState({ loading: false, execs: res.data.data });
    });
  }

  public render() {
    return (
      <LoadingDimmer loading={this.state.loading}>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Container>
            <Card.Group>
              {map(this.state.execs, exec => (
                <Card>
                  <Image
                    src={`http://volunteeringpeel.org/images/execPortraits/2017/${exec.first_name}${exec.last_name}2017.JPG`}
                  />
                  <Card.Content>
                    <Card.Header>
                      {exec.first_name} {exec.last_name}
                    </Card.Header>
                    <Card.Meta>Position Goes Here</Card.Meta>
                  </Card.Content>
                  <Card.Content extra>
                    <Card.Description>
                      <ReactMarkdown source={exec.bio} />
                    </Card.Description>
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
