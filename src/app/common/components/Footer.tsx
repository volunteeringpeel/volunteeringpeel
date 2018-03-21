// Library Imports
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Divider, Icon, Menu, Segment } from 'semantic-ui-react';

export default () => (
  <Segment inverted vertical style={{ padding: '5em 0em' }}>
    <Container textAlign="center">
      <Divider horizontal fitted inverted>
        <Menu text inverted size="massive">
          <Menu.Item>
            <a href="http://www.twitter.com/volunpeel">
              <Icon name="twitter" as="i" />
            </a>
            <a href="https://www.facebook.com/VolunteeringPeel/?fref=ts">
              <Icon name="facebook" as="i" />
            </a>
            <a href="https://www.instagram.com/volunteeringpeel/">
              <Icon name="instagram" as="i" />
            </a>
            <a href="mailto:info@volunteeringpeel.org">
              <Icon name="envelope" as="i" />
            </a>
          </Menu.Item>
        </Menu>
      </Divider>
      &copy; 2017-{new Date().getFullYear()} Volunteering Peel. All rights reserved. Made with{' '}
      <Icon name="heart" as="i" />.
      <br />
      <Link to="/about/legal">
        <small>Legal</small>
      </Link>
    </Container>
  </Segment>
);
