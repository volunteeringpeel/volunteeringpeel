// Library Imports
import axios, { AxiosError } from 'axios';
import * as _ from 'lodash';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Header, Menu, Segment } from 'semantic-ui-react';

// Controllers Imports
import EditEvent from '@app/admin/controllers/modules/EditEvent';

interface EventProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
}

interface EventState {
  events: VPEvent[];
  activeEvent: VPEvent;
}

export default class Events extends React.Component<EventProps, EventState> {
  constructor(props: EventProps) {
    super(props);

    this.state = {
      events: [],
      activeEvent: null,
    };
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    return Promise.resolve(this.props.loading(true))
      .then(() => {
        return axios.get('/api/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        });
      })
      .then(res => {
        this.setState({
          events: res.data.data,
          // reset active event with new data and/or nothing if event was deleted
          activeEvent: _.find(res.data.data, [
            'event_id',
            // check existence before checking id
            this.state.activeEvent && this.state.activeEvent.event_id,
          ]),
        });
        this.props.loading(false);
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      });
  }

  public setActiveEvent(event: VPEvent) {
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
              <Menu.Item
                active={this.state.activeEvent && this.state.activeEvent.event_id === -1}
                onClick={() =>
                  this.setActiveEvent({
                    event_id: -1,
                    name: '',
                    description: '',
                    transport: '',
                    address: '',
                    shifts: [],
                  })
                }
              >
                <em>Add New Event</em>
              </Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column stretched>
            <Segment>
              {this.state.activeEvent ? (
                <EditEvent
                  originalEvent={this.state.activeEvent}
                  refresh={() => this.refresh()}
                  cancel={() => this.setState({ activeEvent: null })}
                />
              ) : (
                <p>Please select an event to edit</p>
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
