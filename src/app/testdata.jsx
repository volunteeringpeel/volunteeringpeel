import React from 'react';

export default {
  pages: [
    {
      id: '/home',
      title: 'Home',
      display: 'Volunteering Peel',
    },
    {
      id: '/about',
      title: 'About',
    },
    {
      id: '/about/team',
      title: 'Team',
      display: 'Meet the Team',
    },
    {
      id: '/events',
      title: 'Events',
    },
    {
      id: '/about/sponsors',
      title: 'Sponsors',
    },
    {
      id: '/about/faq',
      title: 'FAQ',
      display: 'Frequently Asked Questions',
    },
    {
      id: '/about/contact',
      title: 'Contact',
    },
  ],
  faq: [
    {
      question: 'How old do you have to be?',
      answer: (
        <div>
          13-19 years of age. Preferably in High School (grade 9-12), though you can start
          volunteering the summer before grade 9. Peel Planet Day is always open to grade 8s as
          well!
        </div>
      ),
    },
    {
      question: 'How do I sign up?',
      answer: (
        <div>
          Visit the Events page, browse through all of our upcoming events and sign up for which
          events best interest you!
        </div>
      ),
    },
    {
      question: 'How much time does it take to get the hours letter?',
      answer: <div>On average 2-4 weeks (sometimes more and sometimes less!)</div>,
    },
    {
      question: 'How do I receive my hours?',
      answer: (
        <div>
          Please do not bring your hours letters to be signed because we send you an hours letter
          via email; all you have to do is print it out, highlight your name and the number of hours
          then hand it in to your school's guidance counselor.
        </div>
      ),
    },
    {
      question: 'Do you have regular volunteering (every Saturday or every other Sunday etc.)',
      answer: (
        <div>
          We do not have regular volunteering, our events are all on different times, locations and
          dates. Just choose whatever works best for you!
        </div>
      ),
    },
    {
      question: 'How do I become an executive? It is paid? ',
      answer: (
        <div>
          Our team at Volunteering Peel consist of members who are all contributing their time
          voluntarily towards this initiative. There is an initial application process that is open
          NOW! If you're currently in grade 9 or 10, consider applying{' '}
          <a href="https://drive.google.com/file/d/0B4u62qfSypkPeVBVNWdLYzJVUVU/view">here.</a>
        </div>
      ),
    },
    {
      question: "What do I do if I can't attend an event? Are there consequences?",
      answer: (
        <div>
          If you CANNOT attend an event, it is extremely important to CONTACT us ASAP, via email (or
          phone number if it's included in your emails)! There are no consequences if you let us
          know about your absence ahead of time, but please do not continually sign up and not show
          up. That, not only makes the event planning process harder, it restricts the opportunity
          of willing volunteers from signing up.
        </div>
      ),
    },
    {
      question: 'Can I bring my parents/friends/family? ',
      answer: (
        <div>
          If you would like to bring friends/family, please let your event executive know via
          email/phone call ahead of time so we can add their details to the list of volunteers.
          Generally speaking if they're within acceptable age (13-19 years old) then it shouldn't be
          a problem. We do not bring parents onto our buses or to the event, but if they would like
          to come with you, they must provide their own transportation, etc to go. We are not
          responsible for your parents!
        </div>
      ),
    },
    {
      question: 'What if I missed your phone call? ',
      answer: (
        <div>
          That's not a problem! If you think/know that you missed your phone call to attend the
          event, please email us ASAP and we'll make sure you can come!
        </div>
      ),
    },
    {
      question: 'What is the Waiver of Liability?',
      answer: (
        <div>
          The Waiver of Liability is a nonverbal consent that you must agree upon signing up for an
          event. By ticking the box, you willingly agree fully to all the terms in this waiver. To
          view this waiver, <a href="http://volunteeringpeel.org/waiver.php">Click Here.</a>
        </div>
      ),
    },
  ],
};
