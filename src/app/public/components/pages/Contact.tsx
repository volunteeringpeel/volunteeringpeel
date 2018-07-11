// Library Imports
import * as React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';

// Component Imports
import FormContact from '@app/public/components/modules/FormContact';
import FormRequest from '@app/public/components/modules/FormRequest';

export default class Contact extends React.Component {
  public render() {
    return (
      <Container style={{ padding: '4em 0em' }}>
        <Segment vertical>
          <Header as="h2">General Contact</Header>
          {/* <FormContact /> */}
          <p>
            Please email us at{' '}
            <a href="mailto:info@volunteeringpeel.org">info@volunteeringpeel.org</a> with any
            questions, comments, or concerns.
          </p>
        </Segment>
        <Segment vertical>
          <Header as="h2">Event Volunteer Request Form</Header>
          <ul>
            <li>Does your event support a non-profit cause?</li>
            <li>Do you need volunteers aged 12-18?</li>
            <li>Are you located within the GTA</li>
          </ul>
          <p>
            If you answered yes to all of the above questions, please fill in all the information
            below and submit your request. A representative will contact you shortly.
          </p>
          {/* <FormRequest /> */}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSeOvV6gfAxov1oP4tjX-I32sr54lctFdTosvM6DL3paCjV--A/viewform?embedded=true"
            marginHeight={10}
            marginWidth={0}
            width="100%"
            height="500"
            frameBorder="0"
          >
            Loading...
          </iframe>
        </Segment>
      </Container>
    );
  }
}
