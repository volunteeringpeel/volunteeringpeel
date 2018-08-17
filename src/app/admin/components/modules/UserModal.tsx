// Library Imports
import axios, { AxiosError } from 'axios';
import immutabilityHelper from 'immutability-helper';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, Image, Modal } from 'semantic-ui-react';

// Controller Imports
import MessageBox from '@app/common/controllers/MessageBox';
import ProgressColor from '@app/public/components/blocks/ProgressColor';

interface UserModalProps {
  addMessage: (message: Message) => any;
  cancel: () => void;
  refresh: () => void;
  mailListTemplate: MailList[];
  user: (User | Exec) & { shiftHistory: { [confirmLevel: number]: number } };
  confirmLevels: ConfirmLevel[];
}

type UserModalState = (User | Exec) & { pic: File };

export default class UserModal extends React.Component<UserModalProps, UserModalState> {
  constructor(props: UserModalProps) {
    super(props);

    this.state = {
      first_name: props.user.first_name || '',
      last_name: props.user.last_name || '',
      email: props.user.email || '',
      phone_1: props.user.phone_1 || '',
      phone_2: props.user.phone_2 || '',
      school: props.user.school || '',
      role_id: props.user.role_id || 1,
      mail_lists: props.user.mail_lists || props.mailListTemplate,
      title: (props.user as Exec).title || null,
      bio: (props.user as Exec).bio || null,
      show_exec: props.user.role_id === 3 ? (props.user as Exec).show_exec : 0,
      pic: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public componentWillReceiveProps(nextProps: UserModalProps) {
    if (!_.isEqual(this.props.user, nextProps.user)) {
      this.setState({
        first_name: nextProps.user.first_name || '',
        last_name: nextProps.user.last_name || '',
        email: nextProps.user.email || '',
        phone_1: nextProps.user.phone_1 || '',
        phone_2: nextProps.user.phone_2 || '',
        school: nextProps.user.school || '',
        role_id: nextProps.user.role_id || 1,
        mail_lists: nextProps.user.mail_lists || this.props.mailListTemplate,
        title: nextProps.user.role_id === 3 ? (nextProps.user as Exec).title : null,
        bio: nextProps.user.role_id === 3 ? (nextProps.user as Exec).bio : null,
        show_exec: nextProps.user.role_id === 3 ? (nextProps.user as Exec).show_exec : null,
        pic: null,
      });
    }
  }

  public handleSubmit() {
    const data = new FormData();
    _.forOwn(this.state, (value, key) => {
      if (value === null) return;
      let param: string | Blob = value.toString() || null;
      if (key === 'mail_lists') param = JSON.stringify(value);
      if (key === 'pic') param = (value || null) as File;
      if (key === 'show_exec') param = (+value).toString();
      if (param) data.append(key, param);
    });
    axios
      .post(`/api/user/${this.props.user.user_id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
      })
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.refresh();
        this.props.cancel();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error || error.name,
          more: error.response.data.details || error.message,
          severity: 'negative',
        });
      });
  }

  public handleChange = (e: React.FormEvent<any>, { name, value, checked }: any) => {
    if (name === 'pic') this.setState({ pic: (e.target as HTMLInputElement).files[0] });
    else this.setState({ [name]: typeof value === 'undefined' ? checked : value } as any);
  };

  public render() {
    return (
      <Modal open closeIcon onClose={this.props.cancel}>
        <Modal.Header>
          Edit {this.state.first_name} {this.state.last_name}
        </Modal.Header>
        <Modal.Content>
          <MessageBox />
          <br />
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths="equal">
              <Form.Input
                label="First Name"
                name="first_name"
                value={this.state.first_name}
                onChange={this.handleChange}
              />
              <Form.Input
                label="Last Name"
                name="last_name"
                value={this.state.last_name}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Input
              label="Email"
              name="email"
              value={this.state.email}
              type="email"
              onChange={this.handleChange}
            />
            <Form.Input
              label="School"
              name="school"
              value={this.state.school}
              onChange={this.handleChange}
            />
            <Form.Group widths="equal">
              <Form.Input
                label="Phone 1"
                name="phone_1"
                value={this.state.phone_1}
                placeholder="1234567890"
                onChange={this.handleChange}
              />
              <Form.Input
                label="Phone 2"
                name="phone_2"
                value={this.state.phone_2}
                placeholder="1234567890"
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Dropdown
              label="Role"
              name="role_id"
              value={this.state.role_id}
              placeholder="Select..."
              fluid
              selection
              options={[
                { text: 'Volunteer', value: 1 },
                { text: 'Organizer', value: 2 },
                { text: 'Executive', value: 3 },
              ]}
              onChange={this.handleChange}
            />
            {this.state.role_id === 3 && (
              <>
                <Form.Input
                  label="Title"
                  data-tooltip="Please don't write anything stupid (or do)."
                  name="title"
                  value={(this.state as Exec).title}
                  onChange={this.handleChange}
                  required
                />
                <Form.TextArea
                  label="Bio"
                  data-tooltip="Keep it PG."
                  name="bio"
                  value={(this.state as Exec).bio}
                  onChange={this.handleChange}
                  required
                />
                <Form.Checkbox
                  label="Should exec be shown on Team page?"
                  name="show_exec"
                  checked={(this.state as Exec).show_exec}
                  onChange={this.handleChange}
                  required
                />
                <Image src={`/upload/user/${(this.props.user as Exec).pic}`} size="tiny" />
                <Form.Input
                  label="Picture"
                  data-tooltip="Maximum size 1 MB, type PNG or JPG"
                  type="file"
                  name="pic"
                  onChange={this.handleChange}
                />
              </>
            )}

            <Form.Group inline>
              <label>Sign up for mailing lists</label>
              {_.map(this.state.mail_lists, (list, i) => (
                <Form.Checkbox
                  key={list.mail_list_id}
                  label={list.display_name}
                  checked={list.subscribed}
                  data-tooltip={list.description}
                  onChange={(e, { checked }) =>
                    this.setState(
                      immutabilityHelper(this.state, {
                        mail_lists: { [i]: { subscribed: { $set: checked } } },
                      }),
                    )
                  }
                />
              ))}
            </Form.Group>
          </Form>
          <strong />
          <ProgressColor
            value={_.sumBy(
              _.filter(_.toPairs(this.props.user.shiftHistory), i => +i[0] >= 100),
              '[1]',
            )}
            total={_.sumBy(
              _.filter(_.toPairs(this.props.user.shiftHistory), i => +i[0] < 0 || +i[0] >= 100),
              '[1]',
            )}
            label={
              <div className="label">
                Karma Bar: attended vs. missed
                <br />
                <small>
                  {_.join(
                    _.map(_.toPairs(this.props.user.shiftHistory), ([id, count]) => {
                      return `${_.find(this.props.confirmLevels, ['id', +id]).name}: ${count}`;
                    }),
                    ', ',
                  )}
                </small>
              </div>
            }
          />
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
