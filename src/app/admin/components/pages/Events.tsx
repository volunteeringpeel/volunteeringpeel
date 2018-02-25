// Library Imports
import * as _ from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Menu, Segment } from 'semantic-ui-react';

interface EventState {
  events: any[];
  activeEvent: any;
}

export default class Events extends React.Component<{}, EventState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      events: _.times(10, i => ({ event_id: i, name: `Test ${i}` })),
      activeEvent: null,
    };
  }

  public setActiveEvent(event: any) {
    this.setState({ activeEvent: event });
  }

  public render() {
    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Menu fluid vertical secondary pointing>
              {_.map(this.state.events, event => (
                <Menu.Item
                  key={event.event_id}
                  active={
                    this.state.activeEvent && event.event_id === this.state.activeEvent.event_id
                  }
                  onClick={() => this.setActiveEvent(event)}
                >
                  {event.name}
                </Menu.Item>
              ))}
            </Menu>
          </Grid.Column>
          <Grid.Column stretched>
            <Segment>
              {this.state.activeEvent && <Header as="h2">{this.state.activeEvent.name}</Header>}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
