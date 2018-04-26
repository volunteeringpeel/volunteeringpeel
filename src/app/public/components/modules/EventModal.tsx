// Library Imports
import axios from 'axios';
import * as Promise from 'bluebird';
import immutabilityHelper from 'immutability-helper';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Action } from 'redux-actions';
import {
  Button,
  Dimmer,
  Form,
  Header,
  Icon,
  Item,
  Label,
  Message,
  Segment,
} from 'semantic-ui-react';

// App Imports
import { listify, pluralize } from '@app/common/utilities';

// Component Imports
import Modal from '@app/public/components/blocks/Modal';
import ProgressColor from '@app/public/components/blocks/ProgressColor';
import ConfirmModal from '@app/public/components/modules/ConfirmModal';

interface EventModalProps {
  ableToRegister: React.ReactElement<any> | true;
  onSuccess: () => void;
  event: VPEvent;
  refresh: () => PromiseLike<any>;
}

interface EventModalState {
  modalOpen: boolean;
  selectedShifts: number[];
  notes: string | number;
  submitting: boolean;
  message: Message;
}

export default class EventModal extends React.Component<EventModalProps, EventModalState> {
  constructor(props: EventModalProps) {
    super(props);

    this.state = {
      modalOpen: false,
      selectedShifts: [],
      notes: '',
      submitting: false,
      message: null,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.selectShift = this.selectShift.bind(this);
    this.submit = this.submit.bind(this);
  }

  public submit(): PromiseLike<any> {
    return Promise.resolve(this.setState({ submitting: true }))
      .then(() =>
        axios.post(
          `/api/signup`,
          {
            shifts: _.map(
              this.state.selectedShifts,
              num => _.find(this.props.event.shifts, ['shift_num', num]).shift_id,
            ),
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
          },
        ),
      )
      .then(res => {
        if (res.data.status === 'success') {
          this.props.onSuccess();
          this.handleClose();
        } else {
          this.setState({
            message: { message: res.data.error, more: res.data.details, severity: 'negative' },
          });
        }
      })
      .then(this.props.refresh)
      .finally(() => {
        this.setState({ submitting: false });
      });
  }

  public render() {
    // Event is full if no shifts have spots
    const full =
      _.sumBy(this.props.event.shifts, 'max_spots') ===
      _.sumBy(this.props.event.shifts, 'spots_taken');

    // Text for confirm modal on submit (sort shift numbers first)
    const shiftsList = listify(_.sortBy(this.state.selectedShifts), '#');
    // Pluralization
    const shiftPlural = pluralize('shift', this.state.selectedShifts.length);
    // All together now
    const confirmText = (
      <>
        Are you sure you want to sign up for {shiftPlural} {shiftsList}?<br />
        By signing up for this event, you agree to the{' '}
        <Link to="/about/legal#terms">terms and conditions</Link> and{' '}
        <Link to="/about/legal#waiver">waiver of liability</Link>
      </>
    );

    const ableToRegister =
      this.props.event.notes && this.state.notes === ''
        ? 'Please fill in the additional information box with whatever is specified in the event description'
        : this.props.ableToRegister;

    return (
      <Modal
        trigger={
          <Button
            animated
            disabled={full}
            floated="right"
            primary={!full}
            onClick={this.handleOpen}
          >
            <Button.Content visible>{full ? 'FULL :(' : 'Shifts'}</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <Modal.Header>Signup - {this.props.event.name}</Modal.Header>
        <Modal.Content>
          <Segment vertical>
            {this.state.message && (
              <Message
                header={this.state.message.message}
                content={this.state.message.more}
                {...{ [this.state.message.severity]: true }}
              />
            )}
            <ReactMarkdown source={this.props.event.description} />
          </Segment>
          <Segment vertical>
            <Item.Group>
              {_.map(this.props.event.shifts, (shift: Shift) => {
                // Calculate if event is full based on spots (sum up shift spots)
                const spotsLeft = shift.max_spots - shift.spots_taken;
                const shiftFull = spotsLeft === 0;
                // Parse dates
                const startDate = moment(`${shift.start_time}`);
                const endDate = moment(`${shift.end_time}`);
                // Has shift already been signed up for
                const selected = _.includes(this.state.selectedShifts, shift.shift_num);

                // Button text for the signup
                let buttonText: Renderable = 'Select this shift';
                if (selected) {
                  buttonText = (
                    <>
                      Selected <Icon name="check" />
                    </>
                  );
                }
                if (shiftFull) buttonText = 'FULL :(';
                if (shift.signed_up) buttonText = 'Already signed up!';
                return (
                  <Item key={shift.shift_id}>
                    <Item.Content>
                      <Item.Header>
                        Shift #{shift.shift_num}{' '}
                        <small>
                          {startDate.format('hh:mm A')} - {endDate.format('hh:mm A')}
                        </small>
                      </Item.Header>
                      <Item.Meta>
                        {startDate.isSame(endDate, 'day')
                          ? startDate.format('MMM D, YYYY')
                          : `${startDate.format('MMM D, YYYY')} - ${endDate.format('MMM D, YYYY')}`}
                      </Item.Meta>
                      <Item.Description>
                        <p>{shift.notes}</p>
                        {_.map(shift.meals, meal => <Label key={meal}>{meal} provided</Label>)}
                      </Item.Description>
                      <Item.Extra>
                        <ProgressColor
                          value={shift.max_spots - shift.spots_taken}
                          total={shift.max_spots}
                          label="Spots"
                          size="small"
                        />
                        <br />
                        <Button
                          animated
                          disabled={shiftFull || shift.signed_up || this.state.submitting}
                          loading={selected && this.state.submitting}
                          floated="right"
                          primary
                          basic={!selected}
                          onClick={() => this.selectShift(shift.shift_num)}
                        >
                          <Button.Content visible>{buttonText}</Button.Content>
                          <Button.Content hidden>
                            {selected ? 'Deselect' : <Icon name="arrow right" />}
                          </Button.Content>
                        </Button>
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                );
              })}
            </Item.Group>
          </Segment>
          <Segment vertical>
            <Form>
              <Form.TextArea
                label="Additional information (check event and shift descriptions to see if you need to specify anything)"
                value={this.state.notes}
                required={this.props.event.notes}
                onChange={(e, { value }) => this.setState({ notes: value })}
              />
            </Form>
          </Segment>
        </Modal.Content>
        <Dimmer.Dimmable as={Modal.Actions}>
          <Dimmer active={ableToRegister !== true}>
            <Header as="h4" inverted>
              {ableToRegister}
            </Header>
          </Dimmer>
          <Button onClick={this.handleClose} disabled={this.state.submitting}>
            Cancel
          </Button>
          <ConfirmModal
            content={confirmText}
            header={`Sign Up for ${this.props.event.name}`}
            yes={() => this.submit()}
            button={
              <Button
                animated
                positive
                disabled={this.state.selectedShifts.length === 0 || this.state.submitting}
                loading={this.state.submitting}
              >
                <Button.Content visible>Sign up!</Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow right" />
                </Button.Content>
              </Button>
            }
          />
        </Dimmer.Dimmable>
      </Modal>
    );
  }

  private handleOpen() {
    this.setState({ modalOpen: true });
  }

  private handleClose() {
    this.setState({ modalOpen: false });
  }

  private selectShift(shiftNum: number) {
    const newState = immutabilityHelper(this.state, {
      // Is the shift is already selected?
      selectedShifts: _.includes(this.state.selectedShifts, shiftNum)
        ? // If yes remove the value
          { $apply: (oldValue: number[]) => _.pull(oldValue, shiftNum) }
        : // If no push the value
          { $push: [shiftNum] },
    });
    this.setState(newState);
  }
}
