// Library Imports
import axios from 'axios';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Accordion, Container, Segment } from 'semantic-ui-react';

interface FAQProps {
  loading: (status: boolean) => any;
}

interface FAQState {
  faqs: VP.FAQ[];
}

export default class FAQPage extends React.Component<FAQProps, FAQState> {
  constructor(props: FAQProps) {
    super(props);

    this.state = {
      faqs: [],
    };
  }

  public componentDidMount() {
    Promise.resolve(() => this.props.loading(true))
      .then(() => axios.get('/api/public/faq'))
      .then(res => {
        this.props.loading(false);
        this.setState({ faqs: res.data.data });
      });
  }

  public render() {
    return (
      <div className="large text">
        <Segment style={{ padding: '4em 0em' }} vertical>
          <Container>
            <p>
              Have a question? <a href="mailto:info@volunteeringpeel.org">Email us</a> or contact us
              through the <Link to="/contact">contact form</Link>.
            </p>
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
          </Container>
        </Segment>
      </div>
    );
  }
}
