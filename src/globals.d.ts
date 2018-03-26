declare module '*/passwords.json' {
  const mysql: {
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
  user_id?: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_1: string;
  phone_2: string;
  role_id: number;
  mail_list?: boolean; //temporary, just so things don't break just yet
  mail_lists?: MailList[];
}

interface Exec extends User {
  role_id: 3;
  bio: string;
  title: string;
}

interface MailList {
  mail_list_id: number;
  display_name: string;
  description: string;
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
  active: boolean;
}

type Meal = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Shift {
  shift_id: number;
  shift_num: number;
  start_time: string;
  end_time: string;
  date?: string;
  meals: Meal[];
  max_spots?: number;
  spots_taken?: number;
  notes: string;
  signed_up?: boolean;
}

interface UserShift {
  user_shift_id: number;
  hours: string;
  confirmLevel: ConfirmLevel;
  shift: Shift;
  parentEvent: {
    event_id: number;
    name: number;
  };
}

interface ConfirmLevel {
  id: number;
  name: string;
  description: string;
}
