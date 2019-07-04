declare module '*.docx';
declare module '*.jpg';
declare module '*.png';

type Renderable = JSX.Element | string;

declare namespace VP {
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
  type WebSocketData<T> = APIData<T> & {
    action: string;
  };

  interface WebSocketRequest<T> {
    action: string;
    key: string;
    data?: T;
  }

  interface Message {
    id?: number;
    message: string;
    more?: string | React.ReactElement<any>;
    severity: 'info' | 'warning' | 'positive' | 'negative';
  }

  interface Page {
    id: string;
    title: string;
    display?: string;
  }

  interface FAQ {
    faq_id: number;
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
    school: string;
    role_id: number;
    mail_lists?: MailList[];
    new?: boolean;
  }

  interface Exec extends User {
    role_id: 3;
    bio: string;
    title: string;
    pic: string;
    show_exec: boolean;
  }

  interface MailList {
    mail_list_id: number;
    display_name: string;
    description: string;
    subscribed: boolean;
  }

  interface Sponsor {
    sponsor_id?: number;
    name: string;
    website?: string;
    image: string;
    priority: number;
  }

  interface Event {
    event_id: number;
    name: string;
    address: string;
    description: string;
    transport: string;
    shifts: Shift[];
    active: boolean;
    add_info: boolean;
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
    start_time: string;
    end_time: string;
    hours_override: string;
    confirmLevel: ConfirmLevel;
    letter: string;
    shift: Shift;
    parentEvent: {
      event_id: number;
      name: string;
    };
  }

  interface ConfirmLevel {
    id: number;
    name: string;
    description: string;
  }
}
