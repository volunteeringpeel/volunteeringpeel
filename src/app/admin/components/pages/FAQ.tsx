import axios, { AxiosError } from 'axios';
import * as Bluebird from 'bluebird';
// tslint:disable-next-line:import-name
import update from 'immutability-helper';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Accordion, Button, Form, Segment } from 'semantic-ui-react';

interface FAQProps {
  addMessage: (message: Message) => any;
}

interface FAQState {
  faqs: FAQ[];
  states: { state: 'positive' | 'negative'; faq_id: number }[];
  loading: boolean;
}

export default class AdminFAQ extends React.Component<FAQProps, FAQState> {
  constructor(props: FAQProps) {
    super(props);

    this.state = {
      faqs: [],
      states: [],
      loading: false,
    };

    this.refresh = this.refresh.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  public handleSubmit = (id: number) => () => {
    this.setState({ loading: true });
    Bluebird.resolve(
      axios.post(`/api/faq/${id}`, _.find(this.state.faqs, ['faq_id', id]), {
        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
      }),
    )
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => {
        this.refresh();
      });
  };

  public refresh() {
    this.setState({ loading: true });
    axios.get('/api/public/faq').then(res => {
      this.setState({ faqs: res.data.data, loading: false });
    });
  }

  public render() {
    return (
      <>
        <Segment vertical style={{ textAlign: 'center' }}>
          <Button onClick={this.refresh} basic color="grey" loading={this.state.loading}>
            Refresh/Reset
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
                key: `title-${question.faq_id}`,
              },
              content: {
                content: (
                  <>
                    <Form.Input
                      label="Question"
                      value={question.question}
                      onChange={this.handleUpdate(question.faq_id, 'question')}
                      type="text"
                      key={`field-question-${question.faq_id}`}
                    />
                    <Form.Group widths={2}>
                      <Form.TextArea
                        label="Answer (styled in Markdown)"
                        placeholder={
                          'Yay! **Bold** _italic_ ~~strikethrough~~\n1. numbered\n2. list'
                        }
                        value={question.answer}
                        onChange={this.handleUpdate(question.faq_id, 'answer')}
                        key={`field-answer-${question.faq_id}`}
                      />
                      <Form.Field>
                        <label>Preview</label>
                        <Segment>
                          <ReactMarkdown source={question.answer} />
                        </Segment>
                      </Form.Field>
                    </Form.Group>
                    <Form.Button
                      positive
                      content="Save"
                      loading={this.state.loading}
                      onClick={this.handleSubmit(question.faq_id)}
                    />
                  </>
                ),
                key: `content-${question.faq_id}`,
              },
            }))}
          />
          <Form.Button
            content="+ Add"
            onClick={() => {
              const minId = _.minBy(this.state.faqs, 'faq_id').faq_id;
              const newId = minId < 0 ? minId - 1 : -1;
              this.setState(
                update(this.state, {
                  faqs: {
                    $push: [{ faq_id: newId, question: 'Question', answer: 'Answer' }],
                  },
                }),
              );
            }}
          />
        </Form>
      </>
    );
  }
}
