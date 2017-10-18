import * as React from 'react';
import { Segment, Divider, Menu, Container, Icon } from 'semantic-ui-react';

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
      &copy; 2017 Volunteering Peel. All rights reserved. Made with <Icon name="heart" as="i" />.
    </Container>
  </Segment>
);
