import axios from 'axios';
import { map } from 'lodash-es';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Container, Segment } from 'semantic-ui-react';

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
    axios.get('/api/faq').then(res => {
      this.setState({ loading: false, faqs: res.data.data });
    });
  }

  public render() {
    if (this.state.loading) return null;
    return (
      <div className="large text">
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Container>
            <p>
              Have a question? <a href="mailto:info@volunteeringpeel.org">Email us</a> or contact us
              through the <Link to="/contact">contact form</Link>.
            </p>
            <Accordion
              defaultActiveIndex={0}
              panels={map(this.state.faqs, question => ({
                title: question.question,
                content: { content: question.answer },
              }))}
            />
          </Container>
        </Segment>
      </div>
    );
  }
}
