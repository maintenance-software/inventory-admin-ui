import React from 'react';
import { useSelector } from 'react-redux';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import './App.scss';
import Users from './Users';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome
  , faUser
  , faChartArea
  , faEnvelope
  , faBars
  , faTasks
  , faKey 
} from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../store';
import {Leftsidebar} from "./leftsidebar/leftsidebar";
import { Home } from './home';

library.add(faEnvelope, faKey);
library.add(faBars, faKey);
library.add(faTasks, faKey);
library.add(faHome, faKey);
library.add(faUser, faKey);
library.add(faChartArea, faKey);

const App: React.FC = () => {
  const appName = useSelector((state: RootState) => state.appName);
  return (
    <Router>
      <div className='container-fluid d-flex p-0 m-0 App'>
        <aside className='left-sidebar bg-white h-100'>
            <Leftsidebar/>
        </aside>

        <div className='d-flex flex-fill flex-column'>
            <header className='d-flex top-header mb-2 ml-4 mr-4 bg-white'>header</header>
            <div className='d-flex flex-fill mt-3  ml-4 mr-4 bg-white'>
              <Switch>
                <Route path="/home">
                  <Home/>
                </Route>
                <Route path="/users">
                  <Users/>
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>            
            </div>
        </div>
      </div>
    </Router>    
  );
};

export default App;
