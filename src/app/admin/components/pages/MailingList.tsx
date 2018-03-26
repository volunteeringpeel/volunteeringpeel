// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import { Dropdown, Form, TextArea } from 'semantic-ui-react';

interface MailingListState {
  lists: { [listName: string]: string };
  active: string;
  loading: boolean;
}

export default class MailingList extends React.Component<{}, MailingListState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      lists: {},
      active: '',
      loading: false,
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
        this.setState({ active: 'Error loading data' });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  public render() {
    return (
      <>
        <p>
          Copy paste the text below and paste into the <em>Bcc:</em> section of your favourite email
          client. Sending emails from this page is a WIP.
        </p>
        <Form>
          <Dropdown
            placeholder="Select a mailing list"
            fluid
            search
            selection
            options={_.map(_.keys(this.state.lists), name => ({ value: name, text: name }))}
            value={
              this.state.active ? _.findKey(this.state.lists, x => x === this.state.active) : null
            }
            onChange={(e, { value }) => this.setState({ active: this.state.lists[String(value)] })}
          />
          <TextArea disabled value={this.state.loading ? 'Loading...' : this.state.active} />
        </Form>
      </>
    );
  }
}
