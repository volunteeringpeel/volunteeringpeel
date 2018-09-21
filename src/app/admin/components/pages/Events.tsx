// Library Imports
import axios, { AxiosError } from 'axios';
import { LocationDescriptor } from 'history';
import * as _ from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link, Route } from 'react-router-dom';
import { Grid, Header, Menu, Segment } from 'semantic-ui-react';

// Controllers Imports
import EditEvent from '@app/admin/controllers/modules/EditEvent';

interface EventProps {
  addMessage: (message: Message) => any;
  loading: (status: boolean) => any;
  push: (location: LocationDescriptor) => any;
}

interface EventState {
  events: VPEvent[];
  activeEvent: VPEvent;
}

export default class Events extends React.Component<
  EventProps & RouteComponentProps<any>,
  EventState
> {
  constructor(props: EventProps & RouteComponentProps<any>) {
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
        return axios.get('/api/event', {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        });
      })
      .then(res => {
        this.setState({
          events: _.orderBy(res.data.data, 'shifts[0].start_time', 'desc'),
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

  public render() {
    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Menu fluid vertical secondary pointing>
              <Route path="/admin/events/-1">
                {({ match }) => (
                  <Menu.Item active={!!match} onClick={() => this.props.push('/admin/events/-1')}>
                    <em>Add New Event</em>
                  </Menu.Item>
                )}
              </Route>
              {this.state.events.map(event => (
                <Route path={`/admin/events/${event.event_id}`} key={event.event_id}>
                  {({ match }) => (
                    <Menu.Item
                      active={!!match}
                      onClick={() => this.props.push(`/admin/events/${event.event_id}`)}
                    >
                      {event.name}
                    </Menu.Item>
                  )}
                </Route>
              ))}
            </Menu>
          </Grid.Column>
          <Grid.Column stretched>
            <Segment>
              <Route path="/admin/events/:id?">
                {({ match }) => {
                  // no selected event (i.e. id is not number/blank)
                  if (!+match.params.id) return <p>Please select an event to edit</p>;
                  // if can't find data deselect
                  const eventData = _.find(this.state.events, ['event_id', +match.params.id]);
                  if (!eventData && +match.params.id !== -1) {
                    this.props.push('/admin/events');
                    return null;
                  }
                  return (
                    <EditEvent
                      originalEvent={
                        +match.params.id < 0
                          ? {
                              event_id: +match.params.id,
                              name: '',
                              description: '',
                              address: '',
                              transport: '',
                              active: false,
                              shifts: [],
                              add_info: false,
                            }
                          : _.find(this.state.events, ['event_id', +match.params.id])
                      }
                      refresh={() => this.refresh()}
                      cancel={() => {
                        this.setState({ activeEvent: null });
                        this.props.push('/admin/events');
                      }}
                    />
                  );
                }}
              </Route>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
