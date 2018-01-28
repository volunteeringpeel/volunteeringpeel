// Library Imports
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Header, Segment } from 'semantic-ui-react';

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
];

export default class Contact extends React.Component {
  public render() {
    return (
      <Container>
        <Segment vertical>
          <Header as="h2">Contact Form</Header>
          <Form>
            <Form.Group widths="equal">
              <Form.Input fluid label="Name" required />
              <Form.Input fluid label="Email" required />
              <Form.Input fluid label="Phone" />
            </Form.Group>
            <Form.TextArea label="Message" required />
            <Form.Button>Submit</Form.Button>
          </Form>
        </Segment>
        <Segment vertical>
          <Header as="h2">Volunteer Request Form</Header>
          <p>
            <ul>
              <li>Does your event support a non-profit cause?</li>
              <li>Do you need volunteers aged 12-18?</li>
              <li>Are you located within the GTA</li>
            </ul>
            If you answered yes to all of the above questions, please fill in all the information
            below and submit your request. A representative will contact you shortly.
          </p>
          <Form>
            <Form.Group widths="equal">
              <Form.Input fluid label="Organizer Name" required />
              <Form.Input fluid label="Email" type="email" required />
              <Form.Input fluid label="Phone" required />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input fluid label="Organization Website" required />
              <Form.Input label="Cause / Motive" required />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input fluid label="Event Name" required />
              <Form.Input fluid label="Date" type="date" required />
              <Form.Input fluid label="Location" required />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.TextArea label="Volunteer Jobs Available" required />
              <Form.TextArea label="What Volunteers Need to Bring" required />
            </Form.Group>
            <Form.Button>Submit</Form.Button>
          </Form>
        </Segment>
      </Container>
    );
  }
}
