import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, Grid, Header, Button, Image, Icon, Form, Container } from 'semantic-ui-react';

export default () => (
  <div>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid stackable container verticalAlign="middle">
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as="h3" style={{ fontSize: '2em' }}>
              Lending a Helping Hand!
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              You know that warm, fuzzy feeling you get in the pit of your stomach when you know
              you've done some good for the world? Yeah, we do too. We figured that high school
              students should experience that feeling of self-fulfillment more often, and what
              better way to do that than through volunteering? Not to mention that there are a host
              of organizations all clamouring for quality volunteer workers who are resolved to
              reinvent the world. So what are you waiting for? Hop onto the Volunteering Peel
              bandwagon by <Link to="/events">signing up for an event</Link>! For all interested
              grade 8s, you can even start volunteering the summer before grade 9!
            </p>
          </Grid.Column>
          <Grid.Column floated="right" width={6}>
            <Image
              bordered
              rounded
              size="large"
              src="http://volunteeringpeel.org/images/home-slider/7.JPG"
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Link to="/events">
              <Button primary animated size="huge">
                <Button.Content visible>Get Started</Button.Content>
                <Button.Content hidden>
                  <Icon name="right arrow" />
                </Button.Content>
              </Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment vertical>
      <Container textAlign="center">
        <Header as="h3" style={{ fontSize: '2em' }}>
          Subscribe to our monthly news letter to get updates on the latest volunteering events!
        </Header>
        <Form>
          <Form.Input placeholder="Email Address" />
          <Button type="submit">Subscribe</Button>
        </Form>
      </Container>
    </Segment>

    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid celled="internally" columns="equal" verticalAlign="middle" stackable container>
        <Grid.Row textAlign="center">
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as="h3" style={{ fontSize: '2em' }}>
              Have a question?
            </Header>
            <p style={{ fontSize: '1.33em' }}>
              <p>
                If you have any questions or concerns, please get in touch a member of our executive
                team. You can use the <Link to="/contact">contact form</Link>, or you can email us
                directly at <a href="mailto:info@volunteeringpeel.org">
                  info@volunteeringpeel.org
                </a>, and we will get back to you as soon as possible.
              </p>
            </p>
          </Grid.Column>
          <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
            <Header as="h3" style={{ fontSize: '2em' }}>
              Follow us on Twitter at <a href="http://www.twitter.com/volunpeel">@VolunPeel</a> for
              updates.
            </Header>
            <a
              className="twitter-timeline"
              href="https://twitter.com/VolunPeel?ref_src=twsrc%5Etfw"
              data-height="300"
            >
              Tweets by VolunPeel
            </a>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  </div>
);
