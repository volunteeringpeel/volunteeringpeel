// Library Imports
import * as React from 'react';
import { Form } from 'semantic-ui-react';

export default class FormRequest extends React.Component {
  public render() {
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Input fluid label="Organizer Name" required />
          <Form.Input fluid label="Email" type="email" required />
          <Form.Input fluid label="Phone" required />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input fluid label="Event Name" required />
          <Form.Input fluid label="Organization Website" required />
          <Form.Input label="Cause / Motive" required />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input fluid label="Date" type="date" required />
          <Form.Input fluid label="Location" required />
          <Form.Select
            fluid
            label="Transportation Required?"
            options={[
              { key: 'y', text: 'Yes (busses)', value: 1 },
              { key: 'n', text: 'No', value: 0 },
            ]}
            required
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.TextArea label="Volunteer Jobs Available" required />
          <Form.TextArea label="What Volunteers Need to Bring" required />
        </Form.Group>
        <Form.Button>Submit</Form.Button>
      </Form>
    );
  }
}
