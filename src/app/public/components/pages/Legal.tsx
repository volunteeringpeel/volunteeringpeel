// Library Imports
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Segment } from 'semantic-ui-react';

export default class Contact extends React.Component {
  public render() {
    return (
      <Container>
        <Segment vertical>
          <Header as="h2" id="terms">
            Terms and Conditions
          </Header>
          <p>
            <em>Last Updated: March 20, 2018</em>
          </p>
          <Header as="h3">Acceptance</Header>
          <p>
            By accessing, viewing, or otherwise using the Volunteering Peel Website ("Website") you
            agree to the Terms and Conditions ("Terms"), as described here, the Privacy Policy, and
            Waiver of Liability, as described below. Volunteering Peel may alter and amend the Terms
            without notice, however the latest version of the Terms will always reside on the
            Website.
          </p>
          <Header as="h3">User Accounts</Header>
          <p>
            To use the full functionality of the Website, you will have to register for an account.
            When registering for your user account, you must provide accurate and complete
            information. You are solely responsible for the activity that occurs on your user
            account, and you must keep your account secure.
          </p>
          <p>
            Volunteering Peel reserves the right to suspend or delete your account at any time, for
            any reason, without notice.
          </p>
          <Header as="h3">Disclaimer</Header>
          <p>
            Your use of the Website is entirely at your own risk. The Website is provided "as is"
            and without warranties or conditions of any kind, either expressed or implied, including
            any implied warranties of merchantability, merchantable quality, fitness for a
            particular purpose, title, or non-infringement. Volunteering Peel does not warrant that
            the website or content contained in this website will be uninterrupted or error-free,
            that defects will be corrected, or that this website or the server that makes it
            available are free of viruses or other harmful components.
          </p>
          <p>
            Without limiting the foregoing, Volunteering Peel does not warrant or make any
            representation regarding use, the ability to use, or the result of use of the content in
            terms of accuracy, reliability, or otherwise. The content may include technical
            inaccuracies or typographical errors. Volunteering Peel may make changes or improvements
            to the content or the Website at any time. Volunteering Peel makes no warranties that
            your use of the content will not infringe the rights of others and assumes no liability
            or responsibility for errors or omissions in such content.
          </p>
          <Header as="h3">Limitation of Liability</Header>
          <p>
            Volunteering Peel, its Executives and Committee Members will not be liable for any
            direct, indirect, incidental, punitive, consequential, special, exemplary, or other
            damages, including, without limitation, loss of revenue or income, pain and suffering,
            emotional distress, or similar damages, or damages resulting from any (i) errors or
            omissions in content, (ii) any unauthorized access to or use of our servers and/or any
            and all personal information, (iii) any interruption or cessation of transmission to or
            from our website, (iv) any bugs, viruses, Trojan horses, or the like, which may be
            transmitted to or through our website by any third party, or (v) for any loss or damage
            of any kind incurred as a result of your use of any content posted, emailed,
            transmitted, or otherwise made available via the website. This Limitation of Liability
            applies regardless of the legal theory giving rise to the damages, and even if
            Volunteering Peel has been advised of the possibility of such damages. The foregoing
            limitation of liability shall apply to the fullest extent permitted by law in the
            applicable jurisdiction.
          </p>
          <Header as="h3">Indemnity</Header>
          <p>
            You agree to defend, indemnify and hold harmless Volunteering Peel, its Executives and
            Committee Members from and against any and all claims, damages, obligations, judgments,
            losses, liabilities, costs or debt, attorney's fees and other expenses arising from: (i)
            your use of and access to the website; (ii) your violation of any third party right,
            including without limitation any copyright, property, or privacy right; or (iii) any
            claim that you did not have the right to provide any user content or that your user
            content caused damage to a third party. This defense and indemnification obligation will
            survive these terms and your use of the website. In such a case, Volunteering Peel will
            provide you with written notice of such claim, suit or action.
          </p>
          <Header as="h3">Miscellaneous</Header>
          <p>
            You affirm that you are either more than 18 years of age, or possess parental or
            guardian consent to agree to these Terms and access and use the Website, and are
            otherwise fully able and competent to enter into the terms, conditions, obligations,
            affirmations, representations, and warranties set forth in these Terms, and to abide by
            and comply with these Terms.
          </p>
          <p>
            You agree that you are responsible for your own conduct and communications while using
            the Website and for any consequences of that use. By way of example, and not as a
            limitation, you agree that when using the Website, you will not:
            <ul>
              <li>impersonate another person, or falsify any information;</li>
              <li>
                disrupt or threaten the integrity, operation or security of any Website, any
                computer or any Internet system;
              </li>
              <li>
                defame, abuse, harass, stalk, threaten or otherwise violate the legal rights (such
                as rights of privacy and publicity) of others.
              </li>
            </ul>
          </p>
        </Segment>
        <Segment vertical>
          <Header as="h2" id="privacy">
            Privacy Policy
          </Header>
          <p>
            <em>Last Updated: March 20, 2018</em>
          </p>
          <p>
            To do what we do best, Volunteering Peel ("we", "us", "our") has to collect and use your
            data. The Volunteering Peel Website ("Website") therefore performs data collection,
            processing, and storage. By law, we must disclose what data we collect, and how we use
            that data. This Privacy Policy may be amended from time to time, but the latest amended
            version located on the Webiste will always be in effect.
          </p>
          <Header as="h3">Information You Provide</Header>
          <p>
            The Website collects and uses the following personal information provided by users of
            the Website:
            <ul>
              <li>
                <em>First and Last Names:</em> We use these to identify you in our database and at
                events.
              </li>
              <li>
                <em>Email Addresses:</em> We use these to contact you before, during, and after
                events, depending on if you are signed up for such communication. They also serve as
                login credentials. By providing an email address to us, you agree to receive any and
                all communication sent by us or on our behalf.
              </li>
              <li>
                <em>Phone Numbers:</em> We use these to contact you before, during, and after
                events, depending on if you are signed up for such communication. You may provide
                either one or two phone numbers. By providing a phone number to us, you agree to
                receive any and all communication sent by us or on our behalf.
              </li>
            </ul>
          </p>
          <p>
            All information described above may be viewed and edited on the{' '}
            <Link to="/user/profile">profile page</Link>. It is also acessible and editable by all
            executives and committee members. For any questions, concerns, or requests, including a
            request for the deletion of data, please contact us through the{' '}
            <Link to="/contact">contact page</Link> or by email at{' '}
            <a href="mailto:info@volunteeringpeel.org">info@volunteeringpeel.org</a>
          </p>
          <Header as="h3">Information We Collect</Header>
          <p>
            The Website also makes use of "cookies". Cookies are small, text-only pieces of
            information that are stored on a user's hard drive, for the purpose of record-keeping.
            We use cookies on the Website for the following functions:
            <ul>
              <li>
                <em>Preferences:</em> We use cookies to store user preferences, specifically the
                login state of the user. This is done for the convenience of the user.
              </li>
              <li>
                <em>Analytics:</em> We use cookies to analyze user activity in order to improve the
                Website. For example, using cookies we can look at when the largest load is on the
                site. We can use such data to gain insights about how to improve the reliability,
                functionality, and experience of the website. These analytics are provided by{' '}
                <a href="https://www.google.com/analytics/">Google Analytics</a>, and record data
                such as the time spent on each page.
              </li>
            </ul>
          </p>
        </Segment>
        <Segment vertical>
          <Header as="h2" id="waiver">
            Waiver of Liability
          </Header>
          <p>
            <em>Last Updated: March 20, 2018</em>
          </p>
          <p>
            I recognize and understand that there are risks associated with being a volunteer for
            Volunteering Peel. I hereby waive and release any and all claims for injuries or damages
            I have against Volunteering Peel, its executives, committee members, and other
            volunteers caused by the negligence of any of them arising out of my participation as a
            volunteer. I understand that I will not receive remuneration for the time or services I
            provide to Volunteering Peel. I understand that Volunteering Peel is not accountable for
            any financial losses or theft incurred during our events. I understand that photographs
            or videos will be taken of me at the events and that I will not receive any compensation
            for photographs taken of the participation at the event. I take full responsibility
            towards any and all actions and decisions that I make while volunteering, and accept all
            consequences that may occur. I hereby willingly consent to release Volunteering Peel,
            and all of its partners, from all liabilities and waive all claims and demands arising
            from personal injuries or loss of life incurred while participating at any event.
          </p>
        </Segment>
      </Container>
    );
  }
}
