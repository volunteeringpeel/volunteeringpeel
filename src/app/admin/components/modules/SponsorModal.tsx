// Library Imports
import axios, { AxiosError } from 'axios';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, Image, Modal } from 'semantic-ui-react';

// Controller Imports
import MessageBox from '@app/common/controllers/MessageBox';

interface SponsorModalProps {
  addMessage: (message: VP.Message) => any;
  cancel: () => void;
  refresh: () => void;
  sponsor: VP.Sponsor;
}
type SponsorModalState = VP.Sponsor & { pic: File };
export default class SponsorModal extends React.Component<SponsorModalProps, SponsorModalState> {
  constructor(props: SponsorModalProps) {
    super(props);
    this.state = {
      name: props.sponsor.name || '',
      website: props.sponsor.website || '',
      priority: props.sponsor.priority || 100,
      image: props.sponsor.image || '',
      pic: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  public componentWillReceiveProps(nextProps: SponsorModalProps) {
    if (!_.isEqual(this.props.sponsor, nextProps.sponsor)) {
      this.setState({
        name: nextProps.sponsor.name || '',
        website: nextProps.sponsor.website || '',
        priority: nextProps.sponsor.priority || 100,
        image: nextProps.sponsor.image || '',
        pic: null,
      });
    }
  }
  public handleSubmit() {
    const data = new FormData();
    _.forOwn(this.state, (value, key) => {
      if (value === null) return;
      let param: string | Blob = value.toString() || null;
      if (key === 'pic') param = (value || null) as File;
      if (param) data.append(key, param);
    });
    axios
      .post(`/api/sponsor/${this.props.sponsor.sponsor_id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
      })
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
        this.props.cancel();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.message || error.name,
          more: error.response.data.details || error.message,
          severity: 'negative',
        });
      });
  }
  public handleChange = (e: React.FormEvent<any>, { name, value, checked }: any) => {
    if (name === 'pic') this.setState({ pic: (e.target as HTMLInputElement).files[0] });
    else this.setState({ [name]: value || checked } as any);
  };
  public render() {
    return (
      <Modal open closeIcon onClose={this.props.cancel}>
        <Modal.Header>Edit {this.state.name}</Modal.Header>
        <Modal.Content>
          <MessageBox />
          <br />
          <Form onSubmit={this.handleSubmit}>
            <Form.Input
              label="Name"
              name="name"
              value={this.state.name}
              type="text"
              onChange={this.handleChange}
            />
            <Form.Input
              label="Website"
              name="website"
              value={this.state.website}
              type="url"
              onChange={this.handleChange}
            />
            <Image src={`/upload/sponsor/${this.props.sponsor.image}`} size="tiny" />
            <Form.Input
              label="Picture"
              data-tooltip="Maximum size 1 MB, type PNG or JPG"
              type="file"
              name="pic"
              onChange={this.handleChange}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button positive icon="save" content="Save" onClick={this.handleSubmit} />
            <Button basic icon="delete" content="Cancel" onClick={this.props.cancel} />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }
}
