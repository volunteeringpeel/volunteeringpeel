// Library Imports
import * as React from 'react';
import { Modal as SemanticModal } from 'semantic-ui-react';

export default class Modal extends SemanticModal {
  constructor(props: any) {
    super(props);

    this.fixBody.bind(this);
  }

  public render() {
    return (
      <SemanticModal onUnmount={this.fixBody} {...this.props}>
        {this.props.children}
      </SemanticModal>
    );
  }

  private fixBody() {
    const anotherModal = document.getElementsByClassName('ui page modals').length;
    if (anotherModal > 0) document.body.classList.add('scrolling', 'dimmable', 'dimmed');
  }
}
