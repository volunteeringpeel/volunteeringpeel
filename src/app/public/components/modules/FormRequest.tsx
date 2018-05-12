// Library Imports
import * as React from 'react';
import { Form } from 'semantic-ui-react';

interface FormRequestState {
  name: string;
  email: string;
  phone: string;
  event: string;
  website: string;
  cause: string;
  date: string;
  location: string;
  transportation: number;
  jobs: string;
  stuff: string;
}

export default class FormRequest extends React.Component<{}, FormRequestState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: '',
      email: '',
      phone: '',
      event: '',
      website: '',
      cause: '',
      date: '',
      location: '',
      transportation: 0,
      jobs: '',
      stuff: '',
    };
  }

  public handleChange = (e: React.FormEvent<any>, { name, value }: any) => {
    this.setState({ [name]: value });
  };

  public handleSubmit = () => {
    const {
      name,
      email,
      phone,
      event,
      website,
      cause,
      date,
      location,
      transportation,
      jobs,
      stuff,
    } = this.state;

    // tslint:disable-next-line:no-console
    console.log(
      name,
      email,
      phone,
      event,
      website,
      cause,
      date,
      location,
      transportation,
      jobs,
      stuff,
    );
  };

  public render() {
    const {
      name,
      email,
      phone,
      event,
      website,
      cause,
      date,
      location,
      transportation,
      jobs,
      stuff,
    } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Organizer Name"
            name="name"
            autocomplete="name"
            onChange={this.handleChange}
            value={name}
            placeholder="John Doe"
            required
          />
          <Form.Input
            fluid
            label="Email"
            name="email"
            type="email"
            autocomplete="email"
            onChange={this.handleChange}
            required
            value={email}
            placeholder="john.doe@example.com"
          />
          <Form.Input
            fluid
            label="Phone"
            name="phone"
            type="tel"
            autocomplete="tel"
            onChange={this.handleChange}
            required
            value={phone}
            placeholder="555-555-5555"
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Event Name"
            name="event"
            onChange={this.handleChange}
            required
            value={event}
            placeholder="A Really Cool Event"
          />
          <Form.Input
            fluid
            label="Organization Website"
            name="website"
            type="url"
            onChange={this.handleChange}
            required
            value={website}
            placeholder="https://example.com"
          />
          <Form.Input
            label="Cause / Motive"
            name="cause"
            onChange={this.handleChange}
            required
            value={cause}
            placeholder="Curing cancer"
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Date"
            name="date"
            type="date"
            onChange={this.handleChange}
            required
            value={date}
            placeholder="2019-04-01"
          />
          <Form.Input
            fluid
            label="Location"
            name="location"
            onChange={this.handleChange}
            required
            value={location}
            placeholder="2655 Erin Centre Blvd"
          />
          <Form.Select
            fluid
            label="Transportation Required?"
            name="transportation"
            options={[
              { key: 'y', text: 'Yes (busses)', value: 1 },
              { key: 'n', text: 'No', value: 0 },
            ]}
            onChange={this.handleChange}
            required
            value={transportation}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.TextArea
            label="Volunteer Jobs Available"
            name="jobs"
            onChange={this.handleChange}
            required
            value={jobs}
            placeholder={'- Setup\n- Answering questions\n- Directing attendee flow'}
          />
          <Form.TextArea
            label="What Volunteers Need to Bring"
            name="stuff"
            onChange={this.handleChange}
            required
            value={stuff}
            placeholder={'- Water\n- Lunch money\n- Sunscreen'}
          />
        </Form.Group>
        <Form.Button type="submit" content="Submit" />
      </Form>
    );
  }
}
