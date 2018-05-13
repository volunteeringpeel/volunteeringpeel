import axios from 'axios';
// tslint:disable-next-line:import-name
import update from 'immutability-helper';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Accordion, Button, Form, Segment } from 'semantic-ui-react';

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

  public handleUpdate = (id: number, field: string) => (
    e: React.FormEvent<any>,
    { value }: any,
  ) => {
    const ix = _.findIndex(this.state.faqs, ['faq_id', id]);
    this.setState(
      update(this.state, {
        faqs: {
          [ix]: {
            [field]: {
              $set: value,
            },
          },
        },
      }),
    );
  };

  public refresh() {
    axios.get('/api/public/faq').then(res => {
      this.setState({ faqs: res.data.data });
    });
  }

  public render() {
    return (
      <>
        <Segment vertical style={{ textAlign: 'center' }}>
          <Button onClick={this.refresh} basic color="grey" loading={this.state.loading}>
            Refresh
          </Button>
        </Segment>
        <Form>
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
                content: (
                  <Form.Group widths={2}>
                    <Form.TextArea
                      label="Answer (styled in Markdown)"
                      placeholder={'Yay! **Bold** _italic_ ~~strikethrough~~\n1. numbered\n2. list'}
                      value={question.answer}
                      onChange={this.handleUpdate(question.faq_id, 'answer')}
                    />
                    <Form.Field>
                      <label>Preview</label>
                      <ReactMarkdown source={question.answer} />
                    </Form.Field>
                  </Form.Group>
                ),
                key: `content-${question.question}`,
              },
            }))}
          />
        </Form>
      </>
    );
  }
}
