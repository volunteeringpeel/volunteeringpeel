import axios from 'axios';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';

import Content from '@app/components/Content';
import Footer from '@app/components/Footer';
import Header from '@app/components/Header';

import LoadingDimmer from '@app/components/modules/LoadingDimmer';

import './css/style.less';

interface AppState {
  loading: boolean;
  user?: User;
}

export default class App extends React.Component<{}, AppState> {
  constructor() {
    super();

    this.state = { loading: true };
  }

  public componentDidMount() {
    axios.get('/api/user').then(res => {
      this.setState({ loading: false, user: res.data.data });
    });
  }

  public render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" render={() => <Redirect strict from="/" to="/home" />} />
          <LoadingDimmer loading={this.state.loading}>
            <Header />
            <Content />
            <Footer />
          </LoadingDimmer>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
