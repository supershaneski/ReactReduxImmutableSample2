import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NavHead from './NavHead';
import Home from './Home';
import Shop from './Shop';
import Cart from './Cart';
import Item from './Item';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <header>
            <h1 className="site-title">SITENAME&reg;</h1>
            <NavHead selected="home" />
          </header>
          <main>
            <Switch>
              <Route exact path='/' component={ Home }/>
              <Route exact path='/shop' component={ Shop }/>
              <Route path='/shop/:id' component={ Item }/>
              <Route path='/cart' component={ Cart }/>
            </Switch>
          </main>
        </div>
      </BrowserRouter>    
    )
  }
}

export default App;
