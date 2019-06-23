// Library Imports
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';

// App Imports
import homepageJpg from '@app/images/homepage.jpg';

// Component Imports
// import HomepageMessage from '@app/public/components/modules/HomepageMessage';
import SubscribeBox from '@app/public/components/modules/SubscribeBox';

export default class Homepage extends React.Component {
  public render() {
    return (
      <div className="large text">
        {/* <HomepageMessage /> */}
        <Segment style={{ padding: '8em 0em 4em' }} vertical>
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
                <Image bordered shape="rounded" size="large" src={homepageJpg} />
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
            <Header as="h2">
              Subscribe to our monthly news letter to get updates on the latest volunteering events!
            </Header>
            <SubscribeBox listID={1} />
          </Container>
        </Segment>

        <Segment style={{ padding: '4em 0em 8em' }} vertical>
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
                  Follow us on Twitter at <a href="http://www.twitter.com/volunpeel">@VolunPeel</a>{' '}
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
