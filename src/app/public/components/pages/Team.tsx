// Library Imports
import axios from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Card, Container, Image, Segment } from 'semantic-ui-react';

interface TeamProps {
  loading: (status: boolean) => any;
}

interface TeamState {
  execs: Exec[];
}

export default class Team extends React.Component<TeamProps, TeamState> {
  constructor(props: TeamProps) {
    super(props);

    this.state = { execs: [] };
  }

  public componentDidMount() {
    Promise.resolve(() => this.props.loading(true))
      .then(() => axios.get('/api/public/execs'))
      .then(res => {
        this.props.loading(false);
        this.setState({ execs: res.data.data });
      });
  }

  public render() {
    return (
      <Segment style={{ padding: '4em 0em' }} vertical>
        <Container>
          <Card.Group>
            {_.map(this.state.execs, exec => (
              <Card key={exec.user_id}>
                {exec.pic && <Image src={`/upload/${exec.pic}`} />}
                <Card.Content>
                  <Card.Header>
                    {exec.first_name} {exec.last_name}
                  </Card.Header>
                  <Card.Meta>{exec.title}</Card.Meta>
                </Card.Content>
                <Card.Content extra>
                  <Card.Description>
                    <ReactMarkdown source={exec.bio || ''} />
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Container>
      </Segment>
    );
  }
}
