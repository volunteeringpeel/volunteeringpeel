use volunteeringpeel;

set foreign_key_checks = 0;
truncate table sponsor;
truncate table contact;
truncate table request;
truncate table faq;
truncate table user_shift;
truncate table confirm_level;
truncate table user_mail_list;
truncate table mail_list;
truncate table user;
truncate table role;
truncate table shift;
truncate table event;
set foreign_key_checks = 1;

insert into role (role_id, name) values
	(1, "Volunteer"),
	(2, "Event Organizer"),
	(3, "Executive");

insert into confirm_level (confirm_level_id, name, description) values
	-- Standard levels
    -- <0: something bad
    -- =0: default
    -- >0: something good
    -- >100: confirm and count hours
	(0, "Signed Up", "Just signed up"),
	(1, "Confirmed", "Confirmation complete"),
	(100, "Attended", "Event attended"),
	(-1, "Cancelled", "Volunteer cancelled"),
	(-2, "Ghosted", "Volunteer did not respond to confirmation"),
	(-3, "Missed", "Volunteer was absent from shift");

insert into mail_list (display_name, description, system) values
	("Newsletter", "Our weekly newsletter", 1),
	("Event Notifications", "Get notified when an event is posted!", 1);

insert into user (email, role_id, first_name, last_name) values
	("volunteer@mailinator.com", 1, "Volunteer", "Test"),
	("organizer@mailinator.com", 2, "Organizer", "Test"),
	("executive@mailinator.com", 3, "Executive", "Test");
-- Execs
insert into user (email, role_id, first_name, last_name, bio) values
  ("lotsofapples369@gmail.com", 3, "Eric", "Zhang", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("billsong1201@gmail.com", 3, "Bill", "Song", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("ethanwang422@gmail.com", 3, "Ethan", "Wang", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("huirene2012@gmail.com", 3, "Irene", "Hu", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("ariana.ghavami@gmail.com", 3, "Ariana", "Ghavami", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("alfredwong5336@gmail.com", 3, "Alfred", "Wong", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("yangjohn0712@gmail.com", 3, "John", "Yang", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("xueqilin@gmail.com", 3, "QiLin", "Xue", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("Hamzahmad2003@gmail.com", 3, "Hamza", "Ahmad", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("aleezaqayyum@gmail.com", 3, "Aleeza", "Qayyum", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("dinu.wijetunga@gmail.com", 3, "Dinu", "Wijetunga", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("7jeffreyl@gmail.com", 3, "Jeffrey", "Lin", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("a.zhou.my@gmail.com", 3, "Amy", "Zhou", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis."),
  ("nouraalmawi@gmail.com", 3, "Noura", "Almawi", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur odio, aperiam molestias laboriosam suscipit sed consectetur quaerat voluptatum aliquid esse veniam sunt deserunt unde cupiditate, temporibus laudantium, placeat dicta omnis.");

insert into faq (question, answer) values
	("How old do you have to be?", "13-19 years of age. Preferably in High School (grade 9-12), though you can start volunteering the summer before grade 9. Peel Planet Day is always open to grade 8s as well!"),
	("How do I sign up?", "Visit the Events page, browse through all of our upcoming events and sign up for which events best interest you!"),
	("How much time does it take to get the hours letter?", "On average 2-4 weeks (sometimes more and sometimes less!)"),
	("How do I receive my hours?", "Please do not bring your hours letters to be signed because we send you an hours letter via email; all you have to do is print it out, highlight your name and the number of hours then hand it in to your school's guidance counselor."),
	("Do you have regular volunteering (every Saturday or every other Sunday etc.)", "We do not have regular volunteering, our events are all on different times, locations and dates. Just choose whatever works best for you!"),
	("How do I become an executive? It is paid? ", "Our team at Volunteering Peel consist of members who are all contributing their time voluntarily towards this initiative. There is an initial application process that is open NOW! If you're currently in grade 9 or 10, consider applying [here](https://drive.google.com/file/d/0B4u62qfSypkPeVBVNWdLYzJVUVU/view)."),
	("What do I do if I can't attend an event? Are there consequences?", "If you CANNOT attend an event, it is extremely important to CONTACT us ASAP, via email (or phone number if it's included in your emails)! There are no consequences if you let us know about your absence ahead of time, but please do not continually sign up and not show up. That, not only makes the event planning process harder, it restricts the opportunity of willing volunteers from signing up."),
	("Can I bring my parents/friends/family? ", "If you would like to bring friends/family, please let your event executive know via email/phone call ahead of time so we can add their details to the list of volunteers. Generally speaking if they're within acceptable age (13-19 years old) then it shouldn't be a problem. We do not bring parents onto our buses or to the event, but if they would like to come with you, they must provide their own transportation, etc to go. We are not responsible for your parents!"),
	("What if I missed your phone call? ", "That's not a problem! If you think/know that you missed your phone call to attend the event, please email us ASAP and we'll make sure you can come!"),
	("What is the Waiver of Liability?", "The Waiver of Liability is a nonverbal consent that you must agree upon signing up for an event. By ticking the box, you willingly agree fully to all the terms in this waiver. To view this waiver, [Click Here](http://volunteeringpeel.org/waiver.php).");
    
insert into sponsor (name, website, image, priority) values
	("Lions Club of Mississauga Credit Valley", "http://www.mississaugacreditvalleylionsclub.com/", "images/spnsrs/lionsclub.jpg", 0),
	("Bonnie Crombie", "http://www.mayorcrombie.ca/", "images/spnsrs/bcroms.jpg", 100),
	("Councillor Doug Whillans", "http://www.dougwhillans.com/", "images/spnsrs/DougWhillans.jpg", 200),
	("Councillor Frank Dale", "http://www.peelregion.ca/council/councill/dale.htm", "images/spnsrs/FrankDale.jpg", 300),
	("Brampton Transit", "http://www.brampton.ca/EN/residents/transit/zum/Pages/welcome.aspx", "images/spnsrs/zum.png", 400),
	("Krispy Kreme", "http://www.krispykreme.ca/", "images/spnsrs/krispykreme.png", 500),
	("Michael Angelos (Sandra Berardi)", "undefined", "images/spnsrs/MichaelAngelos.jpg", 600),
	("Roots", "http://www.roots.com/", "images/spnsrs/roots.png", 700),
	("Toronto and Region Conservation", "https://trca.ca/", "images/spnsrs/trca.jpg", 800),
	("MP Raj Grewal", "http://rgrewal.liberal.ca/", "images/spnsrs/RajGrewal.jpg", 900),
	("Councillor Matt Mahoney", "http://www.mississauga.ca/portal/cityhall/ward8", "images/spnsrs/mattmahoney.jpg", 1000),
	("Mississauga Environment Division", "http://www.mississauga.ca/portal/residents/environment", "images/spnsrs/saugaenvironment.png", 1100),
	("Starbucks", "http://www.starbucks.ca/", "images/spnsrs/starbucks.jpg", 1200),
	("Cineplex", "http://www.cineplex.com/", "images/spnsrs/cineplex.jpg", 1300),
	("Tim Horton's", "http://www.timhortons.com/ca/en/index.php", "images/spnsrs/timmies.jpg", 1400),
	("Councillor Pat Saito", "http://www.ward9.ca/", "images/spnsrs/patsaito.jpg", 1500);

insert into event (event_id, name, address, transport, description, active) values
	(1, "Diwalicious", "Markham Civic Centre, 101 Town Centre Blvd, Markham, ON", "John Fraser Secondary School", "Help out at this free community festival with many vendors and extensive programs! Jobs include stage help, onsite runners, booth managers, and more!\n\n**NOTE: THERE HAS BEEN A CHANGE OF DATE. THE EVENT IS NOW ON OCTOBER 21ST, 2017 INSTEAD OF SEPTEMBER 30TH, 2017. WE APOLOGIZE FOR THE SUDDEN CHANGE OF DATE.**", 1),
	(2, "Scotiabank Toronto Waterfront Marathon", "Ontario Place Parking Lot 2, 955 Lake Shore Blvd W, Toronto, ON, M6K 3B9", "John Fraser Secondary School", "Come help out at the Scotiabank Toronto Waterfront Marathon! Volunteers will receive snacks and beverages, a volunteer tshirt, a community service hours letter, and a memorable volunteer experience!\n\nVolunteer jobs include: All 5k Start positions – Start Line, Water Station, Greeters, & Green Team.\n\nNOTE: The event will be held outdoors! Please dress accordingly to the weather.", 1);

insert into shift (event_id, shift_num, start_time, end_time, meals, max_spots, notes) values
	(1, "1", "2017-10-21 09:30:00", "2017-10-21 17:00:00", "lunch", 50, "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et est fugiat voluptatibus magnam. Eligendi, quae perspiciatis. Vitae, itaque molestiae architecto, facilis assumenda earum officia quas, aspernatur porro quaerat mollitia?"),
	(1, "2", "2017-10-22 15:00:00", "2017-10-22 23:00:00", "dinner", 50, "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et est fugiat voluptatibus magnam. Eligendi, quae perspiciatis. Vitae, itaque molestiae architecto, facilis assumenda earum officia quas, aspernatur porro quaerat mollitia?"),
	(2, "1", "2017-10-22 05:00:00", "2017-10-22 10:30:00", "snack", 50, "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque et est fugiat voluptatibus magnam. Eligendi, quae perspiciatis. Vitae, itaque molestiae architecto, facilis assumenda earum officia quas, aspernatur porro quaerat mollitia?");
