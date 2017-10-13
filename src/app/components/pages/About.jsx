import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Grid, Header, Button, Icon } from 'semantic-ui-react';

export default () => (
  <div className="large text">
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid
        celled="internally"
        columns="equal"
        textAlign="center"
        verticalAlign="middle"
        stackable
        container
      >
        <Grid.Row>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as="h3">Who We Are</Header>
            <p>
              Volunteering Peel is a group of students who organize volunteer events. Our main goal
              is to help students gain their 40 hours of community service in a fun way. We are a
              youth-engagement project situated in the heart of the GTA. Our group is based in
              Mississauga and was created in November of 2005.
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as="h3">How YOU Can Get Involved!</Header>
            <p>
              Visit our <Link to="/events">events page</Link> to sign up for an event - it's really
              easy! On our sign up form, simply provide us with your name, phone number and
              preferred email for the event you want to sign up for. A student organizer will
              correspond with you until event day.
            </p>
            <Link to="/events">
              <Button primary animated size="huge">
                <Button.Content visible>Sign up now!</Button.Content>
                <Button.Content hidden>
                  <Icon name="right arrow" />
                </Button.Content>
              </Button>
            </Link>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as="h3">How It All Began</Header>
            <p>
              Volunteering Peel is an organization that started off as a school club at John Fraser
              Secondary School, in Mississauga. Rohit Mehta was a grade 10 student who felt that
              there was a lack of resources available for students who needed volunteer hours. What
              started off as a fun way for him and his friends to get involved in the community,
              soon grew into something much more. Since then, Volunteering Peel has partnered with
              various community organizations to bring volunteer opportunities to a network of over
              2000 students from schools all across Peel. Volunteers can get involved in running
              events, fundraisers, environmental events, festivals, and many more. We are constantly
              on the lookout for new events to provide students with more exciting opportunities.
            </p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as="h3">Our Mission</Header>
            <p>
              Volunteering Peel works with community groups and event organizers to provide
              volunteers where needed. As a student-run organization, Volunteering Peel aims to
              facilitate volunteer opportunities for students by initiating contact with event
              organizers, organizing events, and helping students work towards their 40 hours and
              beyond. If you are a student or organization who wants to get involved with
              Volunteering Peel, please contact us <Link to="/contact">here</Link>! Our work could
              not be possible without our wonderful student leadership team, and{' '}
              <Link to="/sponsors">our sponsors</Link>.
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  </div>
);
