// Library Imports
import axios, { AxiosError } from 'axios';
import * as Bluebird from 'bluebird';
import update, { Query } from 'immutability-helper'; // tslint:disable-line:import-name
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import 'react-widgets/dist/css/react-widgets.css';
import * as DateTimePicker from 'react-widgets/lib/DateTimePicker';
import { Button, Form, Icon, Menu, Segment } from 'semantic-ui-react';

// App Imports
import { formatDateForMySQL } from '@app/common/utilities';

interface EditEventProps {
  addMessage: (message: Message) => any;
  cancel: () => void;
  loading: (status: boolean) => any;
  originalEvent: VPEvent;
  refresh: () => Promise<void>;
  push: (path: string) => void;
}

interface EditEventState {
  name: string;
  description: string;
  address: string;
  transport: string;
  active: boolean;
  add_info: boolean;
  shifts: Shift[];
  selectedShiftNum: number;
  deleteShifts: number[];
  letter: File;
}

export default class EditEvent extends React.Component<EditEventProps, EditEventState> {
  constructor(props: EditEventProps) {
    super(props);

    this.state = {
      name: props.originalEvent.name,
      description: props.originalEvent.description,
      address: props.originalEvent.address,
      transport: props.originalEvent.transport,
      active: props.originalEvent.active,
      shifts: props.originalEvent.shifts,
      add_info: props.originalEvent.add_info,
      selectedShiftNum: null,
      deleteShifts: [],
      letter: null,
    };
  }

  public componentWillReceiveProps(nextProps: EditEventProps) {
    if (!_.isEqual(this.props.originalEvent, nextProps.originalEvent)) {
      this.setState({
        name: nextProps.originalEvent.name,
        description: nextProps.originalEvent.description,
        address: nextProps.originalEvent.address,
        transport: nextProps.originalEvent.transport,
        active: nextProps.originalEvent.active,
        shifts: nextProps.originalEvent.shifts,
        add_info: nextProps.originalEvent.add_info,
        selectedShiftNum: null,
        deleteShifts: [],
      });
    }
  }

  public handleChange = (e: React.FormEvent<any>, { name, value, checked }: any) => {
    if (name === 'letter') this.setState({ letter: (e.target as HTMLInputElement).files[0] });
    else this.setState({ [name]: value || checked });
  };

  public handleAddShift = () => {
    // find maximum shift_num, 0 if not exist, and add 1
    const newShiftNum = (_.max(_.map(this.state.shifts, 'shift_num')) || 0) + 1;
    this.setState({
      shifts: this.state.shifts.concat([
        {
          shift_id: -1,
          shift_num: newShiftNum,
          start_time: new Date().toISOString(),
          end_time: new Date().toISOString(),
          max_spots: 0,
          meals: [],
          notes: '',
        },
      ]),
      selectedShiftNum: newShiftNum,
    });
  };

  public handleShiftChange = (e: React.FormEvent<any>, { name, value, checked }: any) => {
    const selectedShiftIndex = _.findIndex(this.state.shifts, [
      'shift_num',
      this.state.selectedShiftNum,
    ]);
    let newState: Query<any> = {
      [name]: {
        $set: value,
      },
    };
    // add/remove meal from meals array
    if (name.startsWith('meals-')) {
      // .substr(6) removes 'meals-' from name
      const meals = checked
        ? this.state.shifts[selectedShiftIndex].meals.concat([name.substr(6)])
        : _.filter(this.state.shifts[selectedShiftIndex].meals, x => x !== name.substr(6));
      newState = {
        meals: {
          $set: meals,
        },
      };
    }
    // save date as a string
    if (name.endsWith('_date')) {
      newState = {
        shifts: {
          [selectedShiftIndex]: {
            [name]: {
              $set: value.toISOString(),
            },
          },
        },
      };
    }
    this.setState(update(this.state, { shifts: { [selectedShiftIndex]: newState } }));
  };

  public handleShiftDelete = () => {
    const selectedShift = _.find(this.state.shifts, ['shift_num', this.state.selectedShiftNum]);

    // shift is not newly created, so mark for deletion on server
    if (selectedShift.shift_id !== -1) {
      this.setState({ deleteShifts: this.state.deleteShifts.concat([selectedShift.shift_id]) });
    }

    // delete shift from client
    this.setState({
      shifts: _.filter(this.state.shifts, shift => shift.shift_num !== this.state.selectedShiftNum),
      selectedShiftNum: null,
    });
  };

  public handleSubmit = () => {
    const data = new FormData();
    const values: any = {
      name: this.state.name,
      description: this.state.description,
      address: this.state.address,
      transport: this.state.transport,
      active: this.state.active,
      add_info: this.state.add_info,
      deleteShifts: this.state.deleteShifts,
      shifts: _.map(this.state.shifts, shift => ({
        ...shift,
        // format start and end times for MySQL insertion (should probably be done on backend but oh well)
        start_time: formatDateForMySQL(new Date(shift.start_time)),
        end_time: formatDateForMySQL(new Date(shift.end_time)),
      })),
    };
    for (const value in values) data.append(value, JSON.stringify(values[value]));
    if (this.state.letter) data.append('letter', this.state.letter);
    Bluebird.resolve(this.props.loading(true))
      .then(() =>
        axios.post(`/api/event/${this.props.originalEvent.event_id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        // redirect to new event id if changed/created (-1 => whatever)
        this.props.refresh().then(() => this.props.push(`/admin/events/${res.data.data.event_id}`));
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  };

  public handleDelete = () => {
    Bluebird.resolve(this.props.loading(true))
      .then(() =>
        axios.delete(`/api/event/${this.props.originalEvent.event_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
        // deselect event (cause it's gone)
        this.props.cancel();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => this.props.loading(false));
  };

  public render() {
    const {
      name,
      description,
      address,
      transport,
      active,
      add_info,
      shifts,
      selectedShiftNum,
    } = this.state;
    const selectedShift = _.find(shifts, ['shift_num', selectedShiftNum]);

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          fluid
          label="Name"
          name="name"
          value={name}
          placeholder="A Super Cool Event"
          onChange={this.handleChange}
          required
        />
        <Form.Checkbox
          label="Show event on Events page?"
          name="active"
          checked={active}
          onChange={this.handleChange}
        />
        <Form.Checkbox
          label="Is the additional information box required? If checked, ensure that you mention what you want in the description"
          name="add_info"
          checked={add_info}
          onChange={this.handleChange}
        />
        <Form.TextArea
          label="Description"
          name="description"
          value={description}
          placeholder="This is gonna be super cool. Sign up please my life depends on it."
          onChange={this.handleChange}
          required
        />
        <Segment>
          <ReactMarkdown source={description} />
        </Segment>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Address"
            name="address"
            value={address}
            placeholder="1234 Sesame Street"
            onChange={this.handleChange}
            required
          />
          <Form.Input
            fluid
            label="Transportation provided from"
            name="transport"
            value={transport}
            placeholder="None provided"
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Input
          fluid
          label="Upload hours letter"
          name="letter"
          type="file"
          onChange={this.handleChange}
        />
        <Menu attached="top" tabular>
          {_.map(shifts, shift => (
            <Menu.Item
              name={`shift-${shift.shift_num}`}
              key={shift.shift_num}
              active={shift.shift_num === selectedShiftNum}
              onClick={() => this.setState({ selectedShiftNum: shift.shift_num })}
            />
          ))}
          <Menu.Menu position="right">
            <Menu.Item name="shift-add" content="+" onClick={this.handleAddShift} />
          </Menu.Menu>
        </Menu>
        <Segment attached="bottom">
          {_.isFinite(selectedShiftNum) ? (
            <>
              <Form.Group widths="equal">
                <Form.Field
                  fluid
                  label="Start"
                  control={DateTimePicker}
                  name="start_time"
                  value={new Date(selectedShift.start_time)}
                  // hardcode in a null event and value/name because react-widgets
                  // doesn't follow normal form event rules
                  onChange={(value: Date) =>
                    this.handleShiftChange(null, { value, name: 'start_time' })
                  }
                  required
                />
                <Form.Field
                  fluid
                  label="End"
                  control={DateTimePicker}
                  name="end_time"
                  value={new Date(selectedShift.end_time)}
                  onChange={(value: Date) =>
                    this.handleShiftChange(null, { value, name: 'end_time' })
                  }
                  required
                />
              </Form.Group>
              <Form.Input
                inline
                label="Spots"
                name="max_spots"
                value={selectedShift.max_spots}
                type="number"
                required
                onChange={this.handleShiftChange}
              />
              <Form.Group inline>
                <label>Food provided:</label>
                <Form.Checkbox
                  label="Breakfast"
                  name="meals-breakfast"
                  checked={_.includes(selectedShift.meals, 'breakfast')}
                  onChange={this.handleShiftChange}
                />
                <Form.Checkbox
                  label="Lunch"
                  name="meals-lunch"
                  checked={_.includes(selectedShift.meals, 'lunch')}
                  onChange={this.handleShiftChange}
                />
                <Form.Checkbox
                  label="Dinner"
                  name="meals-dinner"
                  checked={_.includes(selectedShift.meals, 'dinner')}
                  onChange={this.handleShiftChange}
                />
                <Form.Checkbox
                  label="Snack"
                  name="meals-snack"
                  checked={_.includes(selectedShift.meals, 'snack')}
                  onChange={this.handleShiftChange}
                />
              </Form.Group>
              <Form.TextArea
                label="Notes"
                name="notes"
                value={selectedShift.notes}
                placeholder="Shift specific notes. Please, please sign up; my resumé depends on it."
                required
                onChange={this.handleShiftChange}
              />
              <Segment>
                <ReactMarkdown source={selectedShift.notes} />
              </Segment>
              <Button negative size="tiny" fluid animated="fade" onClick={this.handleShiftDelete}>
                <Button.Content visible>Delete Shift</Button.Content>
                <Button.Content hidden>
                  <small>don't forget to save!</small>
                </Button.Content>
              </Button>
            </>
          ) : (
            <p>Please select a shift to edit, or add a shift by clicking the plus button.</p>
          )}
        </Segment>
        <Form.Group>
          <Button.Group fluid>
            <Button type="submit" animated="fade" positive>
              <Button.Content hidden>Save</Button.Content>
              <Button.Content visible>
                <Icon name="save" />
              </Button.Content>
            </Button>
            <Button onClick={this.handleDelete} animated="fade" negative>
              <Button.Content hidden>Delete</Button.Content>
              <Button.Content visible>
                <Icon name="trash" />
              </Button.Content>
            </Button>
            <Button onClick={this.props.cancel} animated="fade">
              <Button.Content hidden>Cancel</Button.Content>
              <Button.Content visible>
                <Icon name="delete" />
              </Button.Content>
            </Button>
          </Button.Group>
        </Form.Group>
      </Form>
    );
  }
}
