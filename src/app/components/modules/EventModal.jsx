import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Modal, Item, Button, Icon, Progress, Label, Header } from 'semantic-ui-react';

class AreYouSureModal extends React.Component {
  constructor() {
    super();
    this.state = { modalOpen: false };
    this.handleOpen = this.handleOpen.bind(this);
    this.yes = this.yes.bind(this);
  }

  handleOpen() {
    this.setState({ modalOpen: true });
  }

  handleClose() {
    this.setState({ modalOpen: false });
  }

  yes() {
    this.props.yes();
    this.handleClose();
  }

  render() {
    let buttonText = 'Sign up';
    if (this.props.selected) {
      buttonText = (
        <span>
          Signed up <Icon name="check" />
        </span>
      );
    }
    if (this.props.full) buttonText = 'FULL :(';
    return (
      <Modal
        trigger={
          <Button
            animated
            disabled={this.props.full || this.props.selected}
            floated="right"
            primary={!this.props.full}
            onClick={this.handleOpen}
          >
            <Button.Content visible>{buttonText}</Button.Content>
            <Button.Content hidden>
              <Icon name="right arrow" />
            </Button.Content>
          </Button>
        }
        basic
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="small"
      >
        <Header content={`Sign Up for ${this.props.event.name} shift #${this.props.shift.num}`} />
        <Modal.Content>
          <p>Are you sure you want to sign up for this shift?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.yes}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default class EventModal extends React.Component {
  constructor() {
    super();

    this.state = {
      selectedShifts: [],
    };

    this.selectShift = this.selectShift.bind(this);
  }

  selectShift(shiftNum) {
    if (_.includes(this.state.selectedShifts, shiftNum)) {
      this.setState({ selectedShifts: _.pull(this.state.selectedShifts, shiftNum) });
    } else {
      this.setState({ selectedShifts: this.state.selectedShifts.concat(shiftNum) });
    }
  }

  render() {
    // Event is full if no shifts have spots
    const full = _.sumBy(this.props.event.shifts, 'spots') === 0;
    return (
      <Modal
        trigger={
          <Button animated disabled={full} floated="right" primary={!full}>
            <Button.Content visible>{full ? 'FULL :(' : 'Shifts'}</Button.Content>
            <Button.Content hidden>
              <Icon name="right arrow" />
            </Button.Content>
          </Button>
        }
        closeIcon
      >
        <Modal.Header>Signup - {this.props.event.name}</Modal.Header>
        <Modal.Content>
          <Item.Group>
            {_.map(this.props.event.shifts, (shift) => {
              // Calculate if event is full based on spots (sum up shift spots)
              const spotsTaken = shift.max_spots - shift.spots;
              const shiftFull = shift.spots === 0;
              // Calculate colour for progress bar.
              const colors = ['red', 'orange', 'yellow', 'olive', 'green'];
              const percentFull = shift.spots / shift.max_spots;
              // Floor multiples of 20% so full is green, 99% - 80% is olive, etc.
              // Full bars are grey (disabled)
              const color = shiftFull ? 'grey' : colors[Math.floor(percentFull / 0.2)];
              // This right here is the world's biggest hack adding birthday to time so that
              // Javascript will accept it as a datetime
              const startTime = moment(`2017-03-16 ${shift.start_time}`).format('hh:mm A');
              const endTime = moment(`2017-03-16 ${shift.end_time}`).format('hh:mm A');
              // Has shift already been signed up for
              const selected = _.includes(this.state.selectedShifts, shift.num);
              return (
                <Item key={shift.num}>
                  <Item.Content>
                    <Item.Header>
                      Shift #{shift.num}: {startTime} to {endTime}
                    </Item.Header>
                    <Item.Meta>{moment(shift.date).format('MMM D, YYYY')}</Item.Meta>
                    <Item.Description>
                      <p>{shift.notes}</p>
                      {_.map(shift.meals, meal => <Label key={meal}>{meal} provided</Label>)}
                    </Item.Description>
                    <Item.Extra>
                      <Progress
                        value={spotsTaken}
                        total={shift.max_spots}
                        label="Spots"
                        size="small"
                        color={color}
                      />
                      <AreYouSureModal
                        full={shiftFull}
                        selected={selected}
                        event={this.props.event}
                        shift={shift}
                        yes={() => this.selectShift(shift.num)}
                      />
                    </Item.Extra>
                  </Item.Content>
                </Item>
              );
            })}
          </Item.Group>
        </Modal.Content>
      </Modal>
    );
  }
}
