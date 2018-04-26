// Library Imports
import * as Promise from 'bluebird';
import * as React from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';

// Component Imports
import Modal from '@app/public/components/blocks/Modal';

interface ConfirmModalProps {
  /**
   * Modal header
   */
  header: Renderable;
  /**
   * Modal content
   */
  content: Renderable;
  /**
   * Yes/success callback
   */
  yes: () => PromiseLike<any>;
  /**
   * Trigger button
   */
  button: React.ReactElement<any>;
  /**
   * Has the modal already been confirmed (i.e. a radio with a true state)
   */
  skip?: boolean;
}

interface ConfirmModalState {
  modalOpen: boolean;
}

export default class ConfirmModal extends React.Component<ConfirmModalProps, ConfirmModalState> {
  constructor(props: ConfirmModalProps) {
    super(props);

    this.state = { modalOpen: false };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.yes = this.yes.bind(this);
  }

  public render() {
    return (
      <Modal
        trigger={React.cloneElement(this.props.button, { onClick: this.handleOpen })}
        basic
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="small"
        closeIcon
      >
        <Header content={this.props.header} />
        <Modal.Content>{this.props.content}</Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.yes}>
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }

  public yes() {
    this.handleClose();
    this.props.yes();
  }

  private handleOpen() {
    // If skip is on, resolve immediately
    if (this.props.skip) {
      this.props.yes();
    } else {
      // Otherwise, open the modal normally
      this.setState({ modalOpen: true });
    }
  }

  private handleClose() {
    this.setState({ modalOpen: false });
  }
}
