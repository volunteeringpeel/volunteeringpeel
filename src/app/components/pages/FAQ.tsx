import axios from 'axios';
import { map } from 'lodash-es';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Accordion, Container, Segment } from 'semantic-ui-react';

import LoadingDimmer from '@app/components/modules/LoadingDimmer';

interface FAQState {
  loading: boolean;
  faqs: FAQ[];
}

export default class FAQPage extends React.Component<{}, FAQState> {
  constructor() {
    super();

    this.state = {
      loading: true,
      faqs: [],
    };
  }

  public componentDidMount() {
    axios.get('/api/public/faq').then(res => {
      this.setState({ loading: false, faqs: res.data.data });
    });
  }

  public render() {
    return (
      <div className="large text">
        <LoadingDimmer loading={this.state.loading}>
          <Segment style={{ padding: '4em 0em' }} vertical>
            <Container>
              <p>
                Have a question? <a href="mailto:info@volunteeringpeel.org">Email us</a> or contact
                us through the <Link to="/contact">contact form</Link>.
              </p>
              <Accordion
                defaultActiveIndex={0}
                panels={map(this.state.faqs, question => ({
                  title: question.question,
                  content: {
                    content: <ReactMarkdown source={question.answer} />,
                  },
                }))}
              />
            </Container>
          </Segment>
        </LoadingDimmer>
      </div>
    );
  }
}
