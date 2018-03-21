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
          <p>
            I recognize and understand that there are risks associated with being a volunteer for
            Volunteering Peel. I hereby waive and release any and all claims for injuries or damages
            I have against Volunteering Peel, its executives, committee members, and other
            volunteers caused by the negligence of any of them arising out of my participation as a
            volunteer. I understand that I will not receive remuneration for the time or services I
            provide to Volunteering Peel. I understand that Volunteering Peel is not accountable for
            any financial losses or theft incurred during our events. I understand that photographs
            or videos will be taken of me at the events and that I will not receive any compensation
            for photographs taken of the participation at the event. I take full responsibility
            towards any and all actions and decisions that I make while volunteering, and accept all
            consequences that may occur. I hereby willingly consent to release Volunteering Peel,
            and all of its partners, from all liabilities and waive all claims and demands arising
            from personal injuries or loss of life incurred while participating at the event.
          </p>
        </Segment>
      </Container>
    );
  }
}
