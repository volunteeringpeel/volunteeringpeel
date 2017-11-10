import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Embed,
  Form,
  Grid,
  Header,
  Icon,
  Image,
  Message,
  Segment,
} from 'semantic-ui-react';

export default class Homepage extends React.Component {
  public render() {
    return (
      <div className="large text">
        <Container style={{ paddingTop: '1em' }}>
          <Message>
            <Grid container doubling columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <Header as="h3">Apply to be part of the exec team!</Header>
                  <p>
                    Volunteering Peel Committee Member applications are out now! If you're a grade 9
                    or 10 student who enjoys volunteering and leading volunteers, meeting new people
                    and getting involved, then apply for the Volunteering Peel Executive team.
                    Applications are due on October 15th!
                  </p>
                  <a href="https://drive.google.com/file/d/0B4u62qfSypkPeVBVNWdLYzJVUVU/view">
                    <Button primary>Apply Now</Button>
                  </a>
                </Grid.Column>
                <Grid.Column>
                  <Embed
                    id="z8SeIcQ8os8"
                    placeholder="https://img.youtube.com/vi/z8SeIcQ8os8/hqdefault.jpg"
                    source="youtube"
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Message>
        </Container>

        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid stackable container verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={8}>
                <Header as="h3">Lending a Helping Hand!</Header>
                <p>
                  You know that warm, fuzzy feeling you get in the pit of your stomach when you know
                  you've done some good for the world? Yeah, we do too. We figured that high school
                  students should experience that feeling of self-fulfillment more often, and what
                  better way to do that than through volunteering? Not to mention that there are a
                  host of organizations all clamouring for quality volunteer workers who are
                  resolved to reinvent the world. So what are you waiting for? Hop onto the
                  Volunteering Peel bandwagon by <Link to="/events">signing up for an event</Link>!
                  For all interested grade 8s, you can even start volunteering the summer before
                  grade 9!
                </p>
              </Grid.Column>
              <Grid.Column floated="right" width={6}>
                <Image
                  bordered
                  shape="rounded"
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
                      <Icon name="arrow right" />
                    </Button.Content>
                  </Button>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment vertical>
          <Container textAlign="center">
            <Header as="h3">
              Subscribe to our monthly news letter to get updates on the latest volunteering events!
            </Header>
            <Form>
              <Form.Input placeholder="Email Address" />
              <Button size="large" type="submit">
                Subscribe
              </Button>
            </Form>
          </Container>
        </Segment>

        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid celled="internally" columns="equal" verticalAlign="middle" stackable container>
            <Grid.Row textAlign="center">
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as="h3">Have a question?</Header>
                <p>
                  If you have any questions or concerns, please get in touch a member of our
                  executive team. You can use the <Link to="/contact">contact form</Link>, or you
                  can email us directly at{' '}
                  <a href="mailto:info@volunteeringpeel.org">info@volunteeringpeel.org</a>, and we
                  will get back to you as soon as possible.
                </p>
              </Grid.Column>
              <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
                <Header as="h3">
                  Follow us on Twitter at <a href="http://www.twitter.com/volunpeel">
                    @VolunPeel
                  </a>{' '}
                  for updates.
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
  }
}
