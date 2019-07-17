declare namespace VP {
  interface UserData {
    user: User | Exec;
    new: boolean;
    userShifts: UserShift[];
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
      location: Location | unknown;
    };
  }
}
