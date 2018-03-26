// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import { Form, Message, TextArea, Header } from 'semantic-ui-react';

interface MailingListState {
  // tslint:disable-next-line:prefer-array-literal
  lists: Array<MailList & { members: MailListMember[] }>;
  active: number;
  loading: boolean;
  message: Message;
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
    };
  }

  public componentWillMount() {
    Promise.resolve(this.setState({ loading: true }))
      .then(() =>
        axios.get('/api/mailing-list', {
          headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
        }),
      )
      .then(res => {
        this.setState({ lists: res.data.data });
      })
      .catch((error: AxiosError) => {
        this.setState({ message: { message: 'Error loading data', severity: 'negative' } });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
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

  public render() {
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
        <Form>
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
            onChange={(e, { value }) => this.setState({ active: +value })}
          />
          <p>
            Copy paste the text below and paste into the <em>Bcc:</em> section of your favourite
            email client. Sending emails from this page is a WIP.
          </p>
          <TextArea
            disabled
            value={
              this.state.loading
                ? 'Loading...'
                : this.formatList(
                    this.state.active
                      ? _.find(this.state.lists, ['mail_list_id', this.state.active]).members
                      : null,
                  )
            }
          />
        </Form>
      </>
    );
  }
}
