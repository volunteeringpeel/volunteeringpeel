// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import immutabilityHelper from 'immutability-helper';
import * as _ from 'lodash';
import * as React from 'react';
import { Form, Header, Message, TextArea } from 'semantic-ui-react';

interface MailingListState {
  // tslint:disable-next-line:prefer-array-literal
  lists: Array<MailList & { members: MailListMember[] }>;
  active: number;
  loading: boolean;
  message: Message;
  editedDescription: string;
  editedDisplayName: string;
}

interface MailListMember {
  first_name: string;
  last_name: string;
  email: string;
}

export default class MailingList extends React.Component<{}, MailingListState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      lists: [],
      active: null,
      loading: false,
      message: null,
      editedDescription: '',
      editedDisplayName: '',
    };
  }

  public componentWillMount() {
    this.refresh();
  }

  public formatList = (members: MailListMember[]): string => {
    const formatted = _.map(members, item =>
      // join by spaces ([John, Doe, johndoe@example.com] => John Doe <johndoe@example.com>)
      _.join(
        // remove null values (i.e. if name isn't set)
        _.remove([item.first_name, item.last_name, `<${item.email}>`]),
        ' ',
      ),
    );

    // join together each user
    const joined = _.join(formatted, ', ');

    // check null against lists (i.e. list is empty)
    if (joined === '<null>') {
      return 'Empty mailing list.';
    }

    return joined;
  };

  public handleSubmit = (shouldDelete: boolean) => () => {
    let request;
    if (shouldDelete) {
      request = axios.delete(`/api/mailing-list/${this.state.active}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
      });
    } else {
      request = axios.post(
        `/api/mailing-list/${this.state.active}`,
        {
          display_name: this.state.editedDisplayName,
          description: this.state.editedDescription,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        },
      );
    }
    request
      .then(res => {
        this.setState({ message: { message: res.data.data, severity: 'positive' } });
        this.refresh();
      })
      .catch((error: AxiosError) => {
        this.setState({
          message: {
            message: 'Error processing request',
            more: error.message,
            severity: 'negative',
          },
        });
      });
  };

  public refresh() {
    Promise.resolve(this.setState({ loading: true }))
      .then(() =>
        axios.get('/api/mailing-list', {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.setState({
          lists: [
            ...res.data.data,
            // template for new mailing lists
            {
              mail_list_id: -1,
              display_name: 'New Mailing List',
              description: 'Add a new mailing list',
              members: [],
            },
          ],
        });
      })
      .catch((error: AxiosError) => {
        this.setState({ message: { message: 'Error loading data', severity: 'negative' } });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  public selectList(id: number) {
    const list = _.find(this.state.lists, ['mail_list_id', id]);

    this.setState({
      active: id,
      editedDescription: list.description,
      editedDisplayName: list.display_name,
    });
  }

  public render() {
    const activeList = this.state.active
      ? _.find(this.state.lists, ['mail_list_id', this.state.active])
      : null;

    return (
      <>
        {this.state.message && (
          <Message
            header={this.state.message.message}
            content={this.state.message.more}
            onDismiss={() => this.setState({ message: null })}
            {...{ [this.state.message.severity]: true }}
          />
        )}
        <Form onSubmit={this.handleSubmit(false)}>
          <Form.Dropdown
            placeholder="Select a mailing list"
            fluid
            search
            selection
            options={_.map(this.state.lists, list => ({
              value: list.mail_list_id,
              text: list.display_name,
              content: (
                <Header
                  content={
                    <>
                      {list.display_name} <small>{list.members.length}</small>
                    </>
                  }
                  subheader={list.description}
                />
              ),
            }))}
            value={this.state.active}
            onChange={(e, { value }) => this.selectList(+value)}
          />
          {this.state.active && (
            <>
              <p>
                Copy paste the text below and paste into the <em>Bcc:</em> section of your favourite
                email client. Sending emails from this page is a WIP.
              </p>
              <TextArea disabled value={this.formatList(activeList.members)} />
              <Header content="Mailing List Properties" />
              <Form.Group inline>
                <Form.Input
                  name="display_name"
                  label="Display Name"
                  value={this.state.editedDisplayName}
                  onChange={(e, { value }) => this.setState({ editedDisplayName: value })}
                  required
                />
                <Form.Input
                  name="description"
                  label="Description"
                  value={this.state.editedDescription}
                  onChange={(e, { value }) => this.setState({ editedDescription: value })}
                  required
                />
                <Form.Button type="submit" content="Save" primary />
                <Form.Button content="Delete" onClick={this.handleSubmit(true)} negative />
              </Form.Group>
            </>
          )}
        </Form>
      </>
    );
  }
}
