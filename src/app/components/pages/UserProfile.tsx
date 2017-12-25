// Library Imports
import axios, { AxiosError } from 'axios';
import { LocationDescriptor } from 'history';
import * as React from 'react';
import { Redirect } from 'react-router';
import { RouterAction } from 'react-router-redux';
import { Container, Form, InputOnChangeData, Segment } from 'semantic-ui-react';

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
  verification: boolean;
}

export default class UserProfile extends React.Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      phone_1: '',
      phone_2: '',
      verification: false,
    };
  }

  public componentDidMount() {
    if (this.props.user.status !== 'in') this.props.push('/home');

    this.setState({
      first_name: this.props.user.user.user.first_name || '',
      last_name: this.props.user.user.user.last_name || '',
      phone_1: this.props.user.user.user.phone_1 || '',
      phone_2: this.props.user.user.user.phone_2 || '',
    });
  }

  public componentWillReceiveProps(nextProps: UserProfileProps) {
    this.setState({
      first_name: nextProps.user.user.user.first_name || '',
      last_name: nextProps.user.user.user.last_name || '',
      phone_1: nextProps.user.user.user.phone_1 || '',
      phone_2: nextProps.user.user.user.phone_2 || '',
    });
  }

  public handleChange = (
    event: React.SyntheticEvent<HTMLInputElement>,
    data: InputOnChangeData,
  ) => {
    this.setState({ [data.name]: data.value });
    if (this.state.first_name && this.state.last_name && this.state.phone_1 && this.state.phone_2) {
      this.setState({ verification: true });
    } else {
      this.setState({ verification: false });
    }
  };

  public handleSubmit = () =>
    axios
      .post(
        '/api/user/current',
        {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          phone_1: this.state.phone_1,
          phone_2: this.state.phone_2,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        },
      )
      .then(() => {
        this.props.addMessage({ message: 'Info changed successfully', severity: 'positive' });
        this.props.loadUser();
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      });

  public render() {
    if (this.props.user.status !== 'in') return <Redirect to="/home" />;

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
              />
              <Form.Input
                label="Last Name"
                data-tooltip="If you spell your own name wrong..."
                name="last_name"
                value={this.state.last_name}
                onChange={this.handleChange}
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
              />
              <Form.Input
                label="Phone #2"
                data-tooltip="Preferably a home phone we can contact your mom at."
                name="phone_2"
                value={this.state.phone_2}
                onChange={this.handleChange}
              />
            </Form.Group>
            <Form.Button content="Submit" disabled={!this.state.verification} />
          </Form>
        </Segment>
      </Container>
    );
  }
}
