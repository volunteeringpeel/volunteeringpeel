declare module '*/passwords.json' {
  const mysql: {
    host: string;
    user: string;
    password: string;
    database: string;
    charset: string;
  };
}

type Renderable = JSX.Element | string;

interface Page {
  id: string;
  title: string;
  display?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface User {
  first_name: string;
  last_name: string;
}

interface Exec extends User {
  bio: string;
}

interface Sponsor {
  name: string;
  website?: string;
  image: string;
  priority: number;
}

interface VPEvent {
  event_id?: number;
  name: string;
  address: string;
  description: string;
  transport: string;
  shifts: Shift[];
}

type Meal = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Shift {
  shift_num: number;
  start_time: string;
  end_time: string;
  date: string;
  meals: Meal[];
  max_spots: number;
  spots: number;
  notes: string;
}
