interface UserData {
  user: User;
  new: boolean;
  events: any[];
}

interface UserState {
  status: 'in' | 'out' | 'loading';
  user: UserData;
}

interface State {
  user: UserState;
  loading: boolean;
  messages: Message[];
  router: {
    location: Location;
  };
}
