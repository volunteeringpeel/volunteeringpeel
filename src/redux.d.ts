interface UserState {
  status: 'in' | 'out' | 'loading';
  user: User;
}

interface State {
  authToken: string;
  user: UserState;
  messages: Message[];
}
