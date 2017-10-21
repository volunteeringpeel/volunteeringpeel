import * as React from 'react';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';

interface ConfirmModalProps {
  event: VPEvent;
  shift: Shift;
  yes: () => void;
  selected: boolean;
  full: boolean;
}

interface ConfirmModalState {
  modalOpen: boolean;
}

export default class ConfirmModal extends React.Component<ConfirmModalProps, ConfirmModalState> {
  constructor() {
    super();
    this.state = { modalOpen: false };
    this.handleOpen = this.handleOpen.bind(this);
    this.yes = this.yes.bind(this);
  }

  public render() {
    let buttonText: Renderable = 'Sign up';
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
        closeIcon
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

  private handleOpen() {
    this.setState({ modalOpen: true });
  }

  private handleClose() {
    this.setState({ modalOpen: false });
  }

  private yes() {
    this.props.yes();
    this.handleClose();
  }
}
