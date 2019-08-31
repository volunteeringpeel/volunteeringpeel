// Library Imports
import * as React from 'react';
import { Button, Container, Header, Segment } from 'semantic-ui-react';

// Component Imports
// import FormContact from '@app/public/components/modules/FormContact';
// import FormRequest from '@app/public/components/modules/FormRequest';

export default class Contact extends React.Component {
  public render() {
    return (
      <Container style={{ padding: '4em 0em' }}>
        <Segment vertical>
          <Header as="h2">Apply to Join Our Team!</Header>
        </Segment>
        <Segment vertical>
          <p>Join our passionate team of student leaders in a youth-led organization unique to Ontario! Throughout your time here, not only will you continue our mission of connecting volunteers with volunteer organizations, but you will be looking to use your creativity to expand VP beyond its current horizons.</p>
        </Segment>
        <Segment vertical>
          <Header as="h2">Executive Leadership Team</Header>
          <p>All students grades 9-10 in or near the Peel Region can apply.</p>
          <p>Our executive team is what drives this organization forward. We each take on a diverse set of responsibilities that keeps Volunteering Peel alive and strong! Here are the benefits of taking upon this opportunity:</p>
          <ul>
            <li>💒Get volunteer hours for your service! You will receive hours for working at home and attending our biweekly meetings. Our executive members log hundreds of hours each year!</li>
            <li>👨‍💼Develop valuable leadership experience! As a part of our executive team, you will be leading volunteers and learn how to facilitate large groups of people.</li>
            <li>🌎 Gain experience in the real world! Throughout each year, we correspond with over 30 organizers across the GTA to provide volunteers for over 40 events! We also regularly work with the City, CVC, TRCA, and our other partners!</li>
            <li>🙌 Be part of a tight family! Due to our small team of executives, you’ll develop a close friendship with the rest of the team. We support each other, as well as going out to do several team bonding activities.</li>
          </ul>
          <p>To apply, you must:</p>
          <ul>
            <li>Be grade 9 or 10 in or near the Peel Region</li>
            <li>Fill out and submit the form below, before October 14th!</li>
            <li>We will get back to everyone. However, only successful candidates will be invited for an in person interview.</li>
          </ul>
          <Button primary>Coming September 14th!</Button>
        </Segment>
        <Segment vertical>
          <Header as="h2">Volunteer Full-Stack Web Developer</Header>
          <p>All students grades 9-12 in the GTA can apply.</p>
          <p>Our tech team works behind the scenes, but is vital in sustaining our website. As a Volunteer Web Developer, you will be maintaining our website as well as adding new enhancements and features. Here are the benefits of being a software developer:</p>
          <ul>
            <li>🍸Flexibility. Get volunteer hours for your service while working at home at any time during the day! Just simply log your hours and we will give you and sign an hours letter at the end of the year.</li>
            <li>👩‍💻Explore and use industry level technology! Impress future employers by gaining valuable experience even before entering the business world!</li>
            <li>🙌 Be part of a tight family! Along with the regular executives, you’ll develop a close friendship with the rest of the team. We support each other, as well as going out to do several team bonding activities.</li>
          </ul>
          <p>You will be responsible for the following::</p>
          <ul>
            <li>Be grade 9 or 10 in or near the Peel Region</li>
            <li>Working closely with the rest of the leadership team to identify areas of improvement on the website.</li>
            <li>Fix bugs, and actively maintain the website.</li>
            <li>Add new enhancements, both front-end and back-end in order to make the user experience for both our executives and volunteers better.</li>
          </ul>
          <p>The current site uses the following frameworks, and applicants are preferred if they have experience in at least some of the following:</p>
          <ul>
            <li>Tools: GitHub (and Git in general), Azure, Cloudflare, Trello/Kanban Project Management</li>
            <li>Frontend: TypeScript React-Redux SPA</li>
            <li>Backend: Azure Functions on C# .NET Core, Azure SQL Server</li>
          </ul>
          <p>If you do not have these skill sets, and you think you have valuable skills somewhere else, we encourage you to still apply!</p>
          <Button primary>Coming September 14th!</Button>
        </Segment>
      </Container>
    );
  }
}
