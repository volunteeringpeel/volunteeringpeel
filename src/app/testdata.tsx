import * as React from 'react';

const pages: Page[] = [
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
];

const events: VPEvent[] = [
  {
    id: 123,
    name: 'Diwalicious',
    address: 'Markham Civic Centre, 101 Town Centre Blvd, Markham, ON',
    transport: 'John Fraser Secondary School',
    description: (
      <span>
        Help out at this free community festival with many vendors and extensive programs! Jobs
        include stage help, onsite runners, booth managers, and more!<br />
        **NOTE: THERE HAS BEEN A CHANGE OF DATE. THE EVENT IS NOW ON OCTOBER 21ST, 2017 INSTEAD OF
        SEPTEMBER 30TH, 2017. WE APOLOGIZE FOR THE SUDDEN CHANGE OF DATE.
      </span>
    ),
    shifts: [
      {
        num: 1,
        start_time: '09:30:00',
        end_time: '17:00:00',
        date: 'October 21, 2017',
        meals: ['lunch'],
        max_spots: 50,
        spots: 0,
        notes:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et est fugiat voluptatibus magnam. Eligendi, quae perspiciatis. Vitae, itaque molestiae architecto, facilis assumenda earum officia quas, aspernatur porro quaerat mollitia?',
      },
      {
        num: 2,
        start_time: '15:00:00',
        end_time: '23:00:00',
        date: 'October 21, 2017',
        meals: ['dinner'],
        max_spots: 50,
        spots: 25,
        notes:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et est fugiat voluptatibus magnam. Eligendi, quae perspiciatis. Vitae, itaque molestiae architecto, facilis assumenda earum officia quas, aspernatur porro quaerat mollitia?',
      },
    ],
  },
  {
    id: 345,
    name: 'Scotiabank Toronto Waterfront Marathon',
    address: 'Ontario Place Parking Lot 2, 955 Lake Shore Blvd W, Toronto, ON, M6K 3B9',
    transport: 'John Fraser Secondary School',
    description: (
      <span>
        Come help out at the Scotiabank Toronto Waterfront Marathon! Volunteers will receive snacks
        and beverages, a volunteer tshirt, a community service hours letter, and a memorable
        volunteer experience!<br />
        Volunteer jobs include: All 5k Start positions – Start Line, Water Station, Greeters, &amp;
        Green Team.<br />
        NOTE: The event will be held outdoors! Please dress accordingly to the weather.
      </span>
    ),
    shifts: [
      {
        num: 1,
        start_time: '05:00:00',
        end_time: '10:30:00',
        date: 'October 22, 2017',
        meals: ['snack'],
        max_spots: 50,
        spots: 0,
        notes:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et est fugiat voluptatibus magnam. Eligendi, quae perspiciatis. Vitae, itaque molestiae architecto, facilis assumenda earum officia quas, aspernatur porro quaerat mollitia?',
      },
    ],
  },
];

export default {
  events,
  pages,
};
