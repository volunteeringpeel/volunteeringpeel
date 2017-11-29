interface UserState {
  status: 'in' | 'out' | 'loading';
  user: User;
}

interface State {
  user: UserState;
  messages: Message[];
  router: {
    location: Location;
  };
}
