// Library Imports
import axios, { AxiosError } from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import { Form, TextArea } from 'semantic-ui-react';

interface MailingListState {
  emails: string[];
  loading: boolean;
}

export default class MailingList extends React.Component<{}, MailingListState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      emails: [],
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
        this.setState({ emails: res.data.data });
      })
      .catch((error: AxiosError) => {
        this.setState({ emails: ['Error loading data'] });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  public render() {
    return (
      <>
        <p>
          Copy paste the text below and paste into the <em>To:</em> section of your favourite email
          client. Sending emails from this page is a WIP.
        </p>
        <Form>
          <TextArea
            disabled
            value={this.state.loading ? 'Loading...' : _.join(this.state.emails, '; ')}
          />
        </Form>
      </>
    );
  }
}
