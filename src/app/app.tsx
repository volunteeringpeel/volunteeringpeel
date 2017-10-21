import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';

import Content from 'app/components/Content';
import Footer from 'app/components/Footer';
import Header from 'app/components/Header';

import './css/style.less';

export default class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" render={() => <Redirect strict from="/" to="/home" />} />
          <Header />
          <Content />
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
