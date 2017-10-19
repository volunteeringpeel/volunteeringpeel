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

const faq: FAQ[] = [
  {
    question: 'How old do you have to be?',
    answer: (
      <div>
        13-19 years of age. Preferably in High School (grade 9-12), though you can start
        volunteering the summer before grade 9. Peel Planet Day is always open to grade 8s as well!
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
        Please do not bring your hours letters to be signed because we send you an hours letter via
        email; all you have to do is print it out, highlight your name and the number of hours then
        hand it in to your school's guidance counselor.
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
        phone number if it's included in your emails)! There are no consequences if you let us know
        about your absence ahead of time, but please do not continually sign up and not show up.
        That, not only makes the event planning process harder, it restricts the opportunity of
        willing volunteers from signing up.
      </div>
    ),
  },
  {
    question: 'Can I bring my parents/friends/family? ',
    answer: (
      <div>
        If you would like to bring friends/family, please let your event executive know via
        email/phone call ahead of time so we can add their details to the list of volunteers.
        Generally speaking if they're within acceptable age (13-19 years old) then it shouldn't be a
        problem. We do not bring parents onto our buses or to the event, but if they would like to
        come with you, they must provide their own transportation, etc to go. We are not responsible
        for your parents!
      </div>
    ),
  },
  {
    question: 'What if I missed your phone call? ',
    answer: (
      <div>
        That's not a problem! If you think/know that you missed your phone call to attend the event,
        please email us ASAP and we'll make sure you can come!
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
];

const execs: Exec[] = [
  {
    first_name: 'Leigh-Ann',
    last_name: 'Lee',
    bio:
      'Bonjour! Je m’appelle Leigh-Ann and I’m super excited to start my third year with Volunteering Peel as this year’s Chairperson and one of the Heads of Events Requests.  It makes me so happy to see volunteers coming together from all over Peel. They say in life, it’s the little things that really count, and to me, volunteering makes up a lot of those little moments. From getting lost to running around, I would never give up my volunteering experiences for anything. They have given me so many great memories, experiences and life lessons. When I’m not volunteering, I love reading, attempting to memorize musical lyrics, and repping TEAM CAP. If you ever see me around at events or just in general, let’s have a conversation! ',
  },
  {
    first_name: 'Mahima',
    last_name: 'Siali',
    bio:
      'Hi everyone! I’m Mahima Siali, a grade 11 student at Mississauga Secondary School, and I’m thrilled to be a part of Volunteering Peel this year as Vice-Chair and Head of Human Resources. I love volunteering because, honestly, next to no events could ever happen without a dedicated group of individuals putting in time to help them run smoothly, and it’s always an honour to be part of one of those groups. It’s also a great chance to meet new people and is really the only way you can get me to wake up early on a weekend. Aside from volunteering, I sometimes also read or hang out with friends. Tired of hearing me drone on about myself? Come to an event and tell me all about yourself instead!',
  },
  {
    first_name: 'Alfred',
    last_name: 'Wong',
    bio:
      'Hey Everyone! My name is Alfred Wong and I am currently a grade 11 student attending John Fraser Secondary School. I am psyched to start off my second year as one of the Heads of Events Request! Being a part of Volunteering Peel has allowed me to participate in many different experiences, meeting many new people in the process. When I’m not preoccupied with life, I enjoy watching anime, and procrastinating or almost not doing my homework. If you ever see me at one of our events, don’t be afraid to say hello!',
  },
  {
    first_name: 'Catherine',
    last_name: 'Botros',
    bio:
      "Hi! My name is Catherine Botros, and I'm a Grade 11 IB student at Glenforest Secondary School. I am super excited to be a part of Volunteering Peel for my second year! I am a passionate individual, and volunteering is one the many things I love to do. Through my experiences I have been able to meet great people, travel to places and learn new things! I believe that Volunteering Peel has made volunteering a whole lot more fun and exciting for students who want to give back to their communities. During my free time, I like to read, write short stories, play instruments, listen to music, watch anime, hang out with friends and family and go stargazing. If you ever see me roaming around, don't hesitate to come and introduce yourself; it would be a pleasure to meet you!",
  },
  {
    first_name: 'Emily',
    last_name: 'Wang',
    bio:
      "Hey there! I'm Emily Wang. I am a grade 11 student at John Fraser Secondary School. I am thrilled to be on the Volunteering Peel team for the second year as one of the Heads of Public Relations. Volunteering Peel not only connects students to volunteer opportunities, but also connects students to students. As cliché as it sounds, my favourite part about volunteering is definitely all the people I have met through it. It’s amazing what a simple conversation with the volunteer next to you can become.  In my free time I love to listen to Shawn Mendes and Hamilton, play with my dog, binge watch Netflix/Youtube videos, and read. If you ever see me at an event, don't hesitate to introduce yourself and start up a conversation. It would be a pleasure to meet you!",
  },
  {
    first_name: 'Faiza',
    last_name: 'Haidry',
    bio:
      "Hi! My name is Faiza Haidry and I am a grade 11 student at John Fraser Secondary School. I'm super excited to start my second year with Volunteering Peel as one of the Heads of Events Requests.  To me, volunteering is not only about helping others or the community, but also myself. It means leaving and thinking that somebody in this world is happier or better off because of something you did. Other than volunteering, I love to procrastinate! I never have time to sleep but I somehow always make time to read, eat and watch TV (homework gets squished in between). So if you ever see me at an event and want to talk about Harry Potter, Once Upon A Time, Doritos or other random stuff, don't hesitate to introduce yourself!",
  },
  {
    first_name: 'Jenny',
    last_name: 'Zhang',
    bio:
      'Greetings to all! My name is Jenny Zhang. I’m in Grade 11, attending the IB program at Harold M. Brathwaite S.S. in Brampton. I’m the Head of Marketing for Volunteering Peel along with Rebecca. It has been a pleasure to be a part of Volunteering Peel because I get the chance not only to work with an amazing team of individuals who are motivated and self-driven, but also to meet all of you passionate volunteers who are dedicated to helping the community!  Aside from volunteering, I love doing art in all forms of media; it could be anything from painting to drawing to sculpting. Now that you know a little about me, it is only fair to say that I’m open to learning more about you. So, if you ever see me around at events, don’t be afraid to start a conversation!',
  },
  {
    first_name: 'Rashi',
    last_name: 'Ramchandani',
    bio:
      "Hey! My name is Rashi Ramchandani and I excited to be one of the heads of Public Relations for Volunteering Peel this year. I am a grade 10 student in the IB Programme at Turner Fenton Secondary School. Since I was a child, volunteering has been my passion. Volunteering not only gives me happiness but also allows me to spread my passion of volunteering with others around me. When volunteering, I enjoy meeting new people and getting to know them. It astonishes me what great friends can be made at volunteering events. Aside from volunteering I enjoy swimming, playing the piano and playing badminton. If you see me around, don't hesitate to introduce yourself, I don’t bite.",
  },
  {
    first_name: 'Rebecca',
    last_name: 'Ma',
    bio:
      "Hallo! I'm Rebecca Ma and I'm looking forward to my second year with Volunteering Peel and I will be one of your Heads of Marketing with Jenny. To me, volunteering means meeting new people and learning new things while helping out the community and I feel that Volunteering Peel has done a great job highlighting these experiences. Apart from helping out, I also enjoy spending my free time reading, collecting random facts, cleaning, and doing origami. Please don't hesitate to introduce yourself if you see me at events. I would love to meet you!",
  },
  {
    first_name: 'Tony',
    last_name: 'Han',
    bio:
      "Namaste! Mera naam Tony hain. I'm a Grade 11 IB student at Glenforest, and I'm glad to be the Head of Organizational Relations in my second year of VP. I'm grateful for being part of such an awesome youth-led group in the GTA and working for an even more awesome cause. VP and volunteering have opened many doors for me, and I'm happy to continue opening doors for future generations of students. Some of my interests are food, anime, Marvel, Indian cuisine and culture, and Hearthstone (though I suck at it). If you have any questions about volunteering, high school, or life in general, I'd be happy to help! I love talking with new people!",
  },
  {
    first_name: 'Aleeza',
    last_name: 'Qayyum',
    bio:
      'Hola! I’m Aleeza and I’m really ecstatic to be part of Volunteering Peel as a first year committee member! I’m a grade 10 student attending Stephen Lewis Secondary School and I love volunteering because it gives you satisfaction while you’re benefitting the community. The wise Meredith Grey once said, “Being grateful means recognizing what you have for what it is, appreciating small victories.” Just as Meredith said it, happiness comes from appreciating the little things in life and the tiny actions you make that create a difference in the world… such as volunteering! As you can probably tell, in my free time I like to watch Grey’s Anatomy and pretty much every other TV show on Netflix. I’m also a huge bubble tea enthusiast and play trumpet in my free time. If you ever see me at an event, feel free to holler at me and we can have a deep talk about the best bubble tea flavours or newest TV shows.',
  },
  {
    first_name: 'Amy',
    last_name: 'Zhou',
    bio:
      'Hello there! My name is Amy, I am a grade 10 student attending John Fraser Secondary School and it is a great pleasure to be a part of Volunteering Peel as a first year committee member! Volunteering is one of my favourite things to do. Saying that it has become a big part in my life is an understatement at this point. My goal is to bring other high school students the same rewarding experiences that volunteering can provide to the community and to ourselves. Come and talk to me about books, cats, science facts, music, or just to strike a conversation. I’ll hope to see all of you soon at future events!',
  },
  {
    first_name: 'Andy',
    last_name: 'Zhao',
    bio:
      'Hello! My name is Andy Zhao, and I’m a Grade 9 IB student at Glenforest Secondary School. I am incredibly excited to be part of Volunteering Peel as a first year committee member. As something that I am very passionate about, volunteering is a great way to meet new and awesome people, help out the community, learn and experience new things that you would never have anywhere else. Outside of Volunteering Peel, I enjoy playing sports, listening to music, and spending my time outdoors. If you see me, come and say hi! I hope to see you soon! ',
  },
  {
    first_name: 'Ariana',
    last_name: 'Ghavami',
    bio:
      "Hello beautiful people! My name is Ariana and I'm in 9th grade at John Fraser Secondary School. This is my first year on the Volunteering Peel team as a committee member and I’m loving it! Volunteering has become such a big part of my life in the past few months, as there is nothing more fulfilling than spending a day helping your community alongside your peers. Additionally volunteering, both in and outside my community has allowed to me meet so many new and interesting people that I would have never had the opportunity to meet otherwise. Outside of school work and studying I spend my time reading, cooking, gaming and watching excessive amounts of Game of Thrones. If you see me at an event don't be afraid to come and say hi. I hope to meet you all at future events!",
  },
  {
    first_name: 'Jennifer',
    last_name: 'Khuu',
    bio:
      'Hello there! My name is Jennifer Khuu and I am a grade 9 student at Gordon Graydon Memorial Secondary School currently in the IBT program. I’m beyond stoked to join the Volunteering Peel team as a first year committee member, even more stoked than I am when a new episode of one of my Asian dramas comes out. While I haven’t been volunteering for too long, every one of my experiences has inevitably led me to become more happy and grateful for things in life. I’ve gotten the chance to try a ton of new things and make instant friends. Asides from volunteering and doing my homework, you can find me using my spare time learning Mandarin, reading, bullet journaling, hanging out with my family, or practicing the piano. I cannot wait to meet you all at future events; come up and say hi!',
  },
  {
    first_name: 'QiLin',
    last_name: 'Xue',
    bio:
      'Hi, my name is QiLin and I’m a grade 9 student at John Fraser Secondary School. I’m very enthusiastic to be a committee member in the Volunteering Peel team. Volunteering can give you so much more in life than just community hours. You can develop new skills, meet new people, and give back to the community, all while spending time with friends and family. Remember, there may not be “I” in team, but there’s definitely “U” in volunteer, so don’t be afraid to come out and join us! During my free time, I enjoy spending time with friends and family, playing sports, cubing, and reading all sorts of books. If you see me at an event, don’t be shy to say hello. I look forward to meeting you all!',
  },
  {
    first_name: 'Yass',
    last_name: 'Hatahet',
    bio:
      "Greetings fellow audience. The name is Yass Hatahet and I currently attend my 10th year at Glenforest Secondary School for the International Baccalaureate program (very deadly). I am very grateful that I have had the opportunity to be a part of such a wonderful atmosphere compiled of great individuals. This is my first year at Volunteering Peel as a committee member but I feel like I’ve been here for a while thanks to everyone's warm welcomes. Volunteering to me has a very significant value in my heart. I volunteer in hope that I create a sort of change in my community, a positive change. I get to see and meet wonderful new faces who provide me with the experience that allows me to grow as an individual. I am truly grateful for the impacts volunteering has had on my life. My goal is to make you feel what I experience when I deliver assistance partaking in a specific volunteering activity. In terms of what I do, I spend most of my time studying and working my butt off for the perfect grades. When I am not doing that, I enjoy playing football (soccer), spending time with my friends and family, as well as squeeze in a little time for some video games. Please do not hesitate to smile and say hello when you see me at our future events. Can’t wait to meet you!",
  },
  {
    first_name: 'Zuhayr',
    last_name: 'Shaikh',
    bio:
      'Aloha! My name is Zuhayr and I’m a grade 10 at Stephen Lewis Secondary School. I’m hyped to be a first year committee member at Volunteering Peel, as I find deep satisfaction in helping others. In fact, according to Harvard Health, it has been proven (through the measure of hormones and brain activity) that volunteering actually makes you happier and counteracts the effects of stress, anger, and anxiety! I also have a passion for photography and mainly take pictures of exotic cars, as I’m a huge car enthusiast. Feel free to show me exuberant memes, artsy pictures or even start up a conversation on your favourite cars if you ever see me at an event!',
  },
];

const sponsors: Sponsor[] = [
  {
    img: 'images/spnsrs/lionsclub.jpg',
    website: 'http://www.mississaugacreditvalleylionsclub.com/',
    name: 'Lions Club of Mississauga Credit Valley ',
    priority: 0,
  },
  {
    img: 'images/spnsrs/bcroms.jpg',
    website: 'http://www.mayorcrombie.ca/',
    name: 'Bonnie Crombie',
    priority: 100,
  },
  {
    img: 'images/spnsrs/DougWhillans.jpg',
    website: 'http://www.dougwhillans.com/',
    name: 'Councillor Doug Whillans',
    priority: 200,
  },
  {
    img: 'images/spnsrs/FrankDale.jpg',
    website: 'http://www.peelregion.ca/council/councill/dale.htm',
    name: 'Councillor Frank Dale',
    priority: 300,
  },
  {
    img: 'images/spnsrs/zum.png',
    website: 'http://www.brampton.ca/EN/residents/transit/zum/Pages/welcome.aspx',
    name: 'Brampton Transit',
    priority: 400,
  },
  {
    img: 'images/spnsrs/krispykreme.png',
    website: 'http://www.krispykreme.ca/',
    name: 'Krispy Kreme',
    priority: 500,
  },
  {
    img: 'images/spnsrs/MichaelAngelos.jpg',
    name: 'Michael Angelos (Sandra Berardi)',
    priority: 600,
  },
  {
    img: 'images/spnsrs/roots.png',
    website: 'http://www.roots.com/',
    name: 'Roots',
    priority: 700,
  },
  {
    img: 'images/spnsrs/trca.jpg',
    website: 'https://trca.ca/',
    name: 'Toronto and Region Conservation',
    priority: 800,
  },
  {
    img: 'images/spnsrs/RajGrewal.jpg',
    website: 'http://rgrewal.liberal.ca/',
    name: 'MP Raj Grewal',
    priority: 900,
  },
  {
    img: 'images/spnsrs/mattmahoney.jpg',
    website: 'http://www.mississauga.ca/portal/cityhall/ward8',
    name: 'Councillor Matt Mahoney',
    priority: 1000,
  },
  {
    img: 'images/spnsrs/saugaenvironment.png',
    website: 'http://www.mississauga.ca/portal/residents/environment',
    name: 'Mississauga Environment Division',
    priority: 1100,
  },
  {
    img: 'images/spnsrs/starbucks.jpg',
    website: 'http://www.starbucks.ca/',
    name: 'Starbucks',
    priority: 1200,
  },
  {
    img: 'images/spnsrs/cineplex.jpg',
    website: 'http://www.cineplex.com/',
    name: 'Cineplex',
    priority: 1300,
  },
  {
    img: 'images/spnsrs/timmies.jpg',
    website: 'http://www.timhortons.com/ca/en/index.php',
    name: "Tim Horton's",
    priority: 1400,
  },
  {
    img: 'images/spnsrs/patsaito.jpg',
    website: 'http://www.ward9.ca/',
    name: 'Councillor Pat Saito',
    priority: 1500,
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
        spots: 5,
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
  execs,
  faq,
  pages,
  sponsors,
};
