interface UserState {
  status: 'in' | 'out' | 'loading';
  user: User;
}

interface State {
  user: UserState;
  loading: boolean;
  messages: Message[];
  router: {
    location: Location;
  };
}
