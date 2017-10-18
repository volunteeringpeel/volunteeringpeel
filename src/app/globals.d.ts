type Renderable = JSX.Element | string;

interface Page {
  id: string;
  title: string;
  display?: string;
}

interface FAQ {
  question: string;
  answer: JSX.Element;
}

interface User {
  first_name: string;
  last_name: string;
}

interface Exec extends User {
  bio: Renderable;
}

interface Sponsor {
  name: string;
  website?: string;
  img: string;
  priority: number;
}

interface VPEvent {
  id: number;
  name: string;
  address: string;
  description: Renderable;
  transport: string;
  shifts: Shift[];
}

type Meal = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface Shift {
  num: number;
  start_time: string;
  end_time: string;
  date: string;
  meals: Meal[];
  max_spots: number;
  spots: number;
  notes: Renderable;
}
