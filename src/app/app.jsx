import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import Content from './components/Content';

import './css/style.less';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact path="/" render={() => <Redirect strict from="/" to="/home" />} />
          <Route path="/">
            <Header />
            {/* <Content /> */}
          </Route>
        </div>
      </BrowserRouter>
    );
  }
}

ReactDOM.render(<App />, document.getElementsByTagName('body')[0]);
