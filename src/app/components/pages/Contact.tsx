// Library Imports
import * as React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

// Component Imports
import FormContact from '@app/components/modules/FormContact';
import FormRequest from '@app/components/modules/FormRequest';

export default class Contact extends React.Component {
  public render() {
    return (
      <Container>
        <Segment vertical>
          <Header as="h2">Contact Form</Header>
          <FormContact />
        </Segment>
        <Segment vertical>
          <Header as="h2">Volunteer Request Form</Header>
          <ul>
            <li>Does your event support a non-profit cause?</li>
            <li>Do you need volunteers aged 12-18?</li>
            <li>Are you located within the GTA</li>
          </ul>
          <p>
            If you answered yes to all of the above questions, please fill in all the information
            below and submit your request. A representative will contact you shortly.
          </p>
          <FormRequest />
        </Segment>
      </Container>
    );
  }
}
