import axios from 'axios';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Accordion, Button, Form } from 'semantic-ui-react';

interface FAQState {
  faqs: FAQ[];
  loading: boolean;
}

export default class AdminFAQ extends React.Component<{}, FAQState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      faqs: [],
      loading: false,
    };
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    axios.get('/api/public/faq').then(res => {
      this.setState({ faqs: res.data.data });
    });
  }

  public render() {
    return (
      <>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={this.refresh} basic color="grey" loading={this.state.loading}>
            Refresh
          </Button>
        </div>
        <Accordion
          styled
          fluid
          defaultActiveIndex={0}
          panels={_.map(this.state.faqs, question => ({
            title: {
              content: question.question,
              key: `title-${question.question}`,
            },
            content: {
              content: <ReactMarkdown source={question.answer} />,
              key: `content-${question.question}`,
            },
          }))}
        />
      </>
    );
  }
}
