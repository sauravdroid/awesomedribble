import * as React from 'react';
import {AppBar} from './components';
import './App.css';

const logo = require('./logo.svg');

class App extends React.Component {

  navigationLink = (): JSX.Element => {
    return (
        <h1>This is the navigation</h1>
    );
  }

  render() {
    return (
      <div className='App'>
        <AppBar title='Awesome Dribble' navigationLinks={this.navigationLink}/>
      </div>
    );
  }
}

export default App;
