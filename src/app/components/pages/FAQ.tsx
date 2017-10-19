import { map } from 'lodash-es';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Container, Segment } from 'semantic-ui-react';

import testdata from '../../testdata';

export default () => (
  <div className="large text">
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Container>
        <p>
          Have a question? <a href="mailto:info@volunteeringpeel.org">Email us</a> or contact us
          through the <Link to="/contact">contact form</Link>.
        </p>
        <Accordion
          defaultActiveIndex={0}
          panels={map(testdata.faq, question => ({
            title: question.question,
            content: { content: question.answer },
          }))}
        />
      </Container>
    </Segment>
  </div>
);
