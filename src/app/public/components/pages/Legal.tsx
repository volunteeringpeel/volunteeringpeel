// Library Imports
import * as React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

export default class Contact extends React.Component {
  public render() {
    return (
      <Container>
        <Segment vertical>
          <Header as="h2">Terms and Conditions</Header>
          <p>TODO</p>
        </Segment>
        <Segment vertical>
          <Header as="h2">Privacy Policy</Header>
          <p>TODO</p>
        </Segment>
        <Segment vertical>
          <Header as="h2">Waiver of Liability</Header>
          <p>TODO</p>
        </Segment>
      </Container>
    );
  }
}
