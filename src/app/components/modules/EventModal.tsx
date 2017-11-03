import * as update from 'immutability-helper';
import { includes, map, pull, sortBy, sumBy } from 'lodash-es';
import * as moment from 'moment';
import * as React from 'react';
import { Button, Dimmer, Header, Icon, Item, Label } from 'semantic-ui-react';

import Modal from '@app/components/blocks/Modal';
import ProgressColor from '@app/components/blocks/ProgressColor';
import ConfirmModal from '@app/components/modules/ConfirmModal';

import Utilities from '@app/Utilities';

interface EventModalProps {
  event: VPEvent;
}

interface EventModalState {
  selectedShifts: number[];
}

export default class EventModal extends React.Component<EventModalProps, EventModalState> {
  constructor() {
    super();

    this.state = {
      selectedShifts: [],
    };

    this.selectShift = this.selectShift.bind(this);
  }

  public render() {
    // Event is full if no shifts have spots
    const full =
      sumBy(this.props.event.shifts, 'max_spots') === sumBy(this.props.event.shifts, 'spots_taken');

    // Text for confirm modal on submit (sort shift numbers first)
    const shiftsList = Utilities.listify(sortBy(this.state.selectedShifts), '#');
    // Pluralization
    const shiftPlural = Utilities.pluralize('shift', this.state.selectedShifts.length);
    // All together now
    const confirmText = `Are you sure you want to sign up for ${shiftPlural} ${shiftsList}?`;
    return (
      <Modal
        trigger={
          <Button animated disabled={full} floated="right" primary={!full}>
            <Button.Content visible>{full ? 'FULL :(' : 'Shifts'}</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        }
        closeIcon
      >
        <Modal.Header>Signup - {this.props.event.name}</Modal.Header>
        <Modal.Content scrolling>
          <Item.Group>
            {map(this.props.event.shifts, (shift: Shift) => {
              // Calculate if event is full based on spots (sum up shift spots)
              const spotsLeft = shift.max_spots - shift.spots_taken;
              const shiftFull = spotsLeft === 0;
              // This right here is the world's biggest hack adding birthday to time so that
              // Javascript will accept it as a datetime
              const startTime = moment(`2017-03-16 ${shift.start_time}`).format('hh:mm A');
              const endTime = moment(`2017-03-16 ${shift.end_time}`).format('hh:mm A');
              // Has shift already been signed up for
              const selected = includes(this.state.selectedShifts, shift.shift_num);

              // Button text for the signup
              let buttonText: Renderable = 'Select this shift';
              if (selected) {
                buttonText = (
                  <span>
                    Selected <Icon name="check" />
                  </span>
                );
              }
              if (shiftFull) buttonText = 'FULL :(';
              if (shift.signed_up) buttonText = 'Already signed up!';
              return (
                <Item key={shift.shift_id}>
                  <Item.Content>
                    <Item.Header>
                      Shift #{shift.shift_num}: {startTime} to {endTime}
                    </Item.Header>
                    <Item.Meta>{moment(shift.date).format('MMM D, YYYY')}</Item.Meta>
                    <Item.Description>
                      <p>{shift.notes}</p>
                      {map(shift.meals, meal => <Label key={meal}>{meal} provided</Label>)}
                    </Item.Description>
                    <Item.Extra>
                      <ProgressColor
                        value={shift.spots_taken}
                        total={shift.max_spots}
                        label="Spots"
                        size="small"
                      />

                      <Button
                        animated
                        disabled={shiftFull || shift.signed_up}
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
        </Modal.Content>
        <Modal.Actions>
          <ConfirmModal
            content={confirmText}
            header={`Sign Up for ${this.props.event.name}`}
            yes={this.submit}
            button={
              <Button animated positive>
                <Button.Content visible>Sign up!</Button.Content>
                <Button.Content hidden>
                  <Icon name="arrow right" />
                </Button.Content>
              </Button>
            }
          />
        </Modal.Actions>
      </Modal>
    );
  }

  private selectShift(shiftNum: number) {
    const newState = update(this.state, {
      // Is the shift is already selected?
      selectedShifts: includes(this.state.selectedShifts, shiftNum)
        ? // If yes remove the value
          { $apply: (oldValue: number[]) => pull(oldValue, shiftNum) }
        : // If no push the value
          { $push: [shiftNum] },
    });
    this.setState(newState);
  }

  private submit() {
    return;
  }
}
