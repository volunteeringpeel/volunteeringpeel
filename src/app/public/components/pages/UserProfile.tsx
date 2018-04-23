// Library Imports
import axios, { AxiosError } from 'axios';
import { LocationDescriptor } from 'history';
import immutabilityHelper from 'immutability-helper';
import * as _ from 'lodash';
import * as React from 'react';
import { Redirect } from 'react-router';
import { RouterAction } from 'react-router-redux';
import { Container, Form, InputOnChangeData, Label, Segment } from 'semantic-ui-react';

interface UserProfileProps {
  user: UserState;
  push: (path: LocationDescriptor) => void;
  loadUser: () => void;
  addMessage: (message: Message) => void;
}

interface UserProfileState {
  first_name: string;
  last_name: string;
  phone_1: string;
  phone_2: string;
  mail_lists: MailList[];
  title: string;
  bio: string;
}

export default class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      phone_1: '',
      phone_2: '',
      mail_lists: [],
      title: null,
      bio: null,
    };
  }

  public componentDidMount() {
    if (this.props.user.status === 'out') this.props.push('/');

    if (this.props.user.status === 'in') {
      const user = this.props.user.user.user;

      this.setState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_1: user.phone_1 || '',
        phone_2: user.phone_2 || '',
        mail_lists: user.mail_lists || [],
        title: user.role_id === 3 ? (user as Exec).title : null,
        bio: user.role_id === 3 ? (user as Exec).bio : null,
      });
    }
  }

  public componentWillReceiveProps(nextProps: UserProfileProps) {
    if (this.props.user.status === 'in') {
      const user = nextProps.user.user.user;
      this.setState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_1: user.phone_1 || '',
        phone_2: user.phone_2 || '',
        mail_lists: user.mail_lists || [],
        title: user.role_id === 3 ? (user as Exec).title : null,
        bio: user.role_id === 3 ? (user as Exec).bio : null,
      });
    }
  }

  public handleChange = (event: React.FormEvent<any>, { name, value, checked }: any) => {
    this.setState({ [name]: checked || value });
  };

  public handleSubmit = () => {
    const data = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      phone_1: this.state.phone_1,
      phone_2: this.state.phone_2,
      mail_lists: this.state.mail_lists,
      title: this.state.title,
      bio: this.state.bio,
    };

    axios
      .post('/api/user/current', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
      })
      .then(res => {
        this.props.addMessage({ message: res.data.data, severity: 'positive' });
        this.props.loadUser();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      });
  };

  public render() {
    if (this.props.user.status === 'out') return <Redirect to="/" />;
    if (this.props.user.status === 'loading') return null;

    return (
      <Container>
        <Segment style={{ padding: '2em 0' }} vertical>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths="equal">
              <Form.Input
                label="First Name"
                data-tooltip="Please tell me know your own name"
                name="first_name"
                value={this.state.first_name}
                onChange={this.handleChange}
                required
              />
              <Form.Input
                label="Last Name"
                data-tooltip="If you spell your own name wrong..."
                name="last_name"
                value={this.state.last_name}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Input
              label="Email"
              readOnly
              data-tooltip="Can't change this yet...if you must shoot us an email."
              value={this.props.user.user.user.email}
            />
            <Form.Group widths="equal">
              <Form.Input
                label="Phone #1"
                data-tooltip="Preferably a cell phone we can contact you at."
                name="phone_1"
                value={this.state.phone_1}
                onChange={this.handleChange}
                pattern="[0-9]{10}"
                placeholder="4165555555"
                required
              />
              <Form.Input
                label="Phone #2"
                data-tooltip="Preferably a home phone we can contact your mom at."
                name="phone_2"
                placeholder="4165555555"
                value={this.state.phone_2}
                onChange={this.handleChange}
              />
            </Form.Group>
            {this.props.user.user.user.role_id === 3 && (
              <>
                <Form.Input
                  label="Title"
                  data-tooltip="Please don't write anything stupid (or do)."
                  name="title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  required
                />
                <Form.TextArea
                  label="Bio"
                  data-tooltip="Keep it PG."
                  name="bio"
                  value={this.state.bio}
                  onChange={this.handleChange}
                  required
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
            <Form.Button type="submit" content="Submit" />
          </Form>
        </Segment>
      </Container>
    );
  }
}
