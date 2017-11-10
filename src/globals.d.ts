declare module '*/passwords.json' {
  const mysql: {
    password: string;
  };

  const email: {
    password: string;
  };
}

type Renderable = JSX.Element | string;

interface APIDataSuccess<T> {
  status: 'success';
  data: T;
}

interface APIDataError {
  status: 'error';
  error: string;
  details: string;
}

type APIData<T> = APIDataSuccess<T> | APIDataError;

interface Message {
  id?: number;
  message: string;
  more?: string;
  severity: 'info' | 'warning' | 'positive' | 'negative';
}

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
  user_id: number;
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
  event_id: number;
  name: string;
  address: string;
  description: string;
  transport: string;
  shifts: Shift[];
}

type Meal = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Shift {
  shift_id: number;
  shift_num: number;
  start_time: string;
  end_time: string;
  date: string;
  meals: Meal[];
  max_spots: number;
  spots_taken: number;
  notes: string;
  signed_up: boolean;
}
