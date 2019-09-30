import React from 'react';
import { useSelector } from 'react-redux';
import logo from './logo.svg';
import './App.scss';
import {Container, Row, Col} from "reactstrap";
import axios from 'axios';
import Users from './Users';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faChartArea, faEnvelope, faBars, faTasks, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RootState } from '../store';
import {Leftsidebar} from "./leftsidebar/leftsidebar";

library.add(faEnvelope, faKey);
library.add(faBars, faKey);
library.add(faTasks, faKey);
library.add(faHome, faKey);
library.add(faUser, faKey);
library.add(faChartArea, faKey);

const App: React.FC = () => {
  const appName = useSelector((state: RootState) => state.appName);
  return (
    <div className='container-fluid d-flex p-0 m-0 App'>
        <aside className='left-sidebar bg-white h-100'>
            <Leftsidebar/>
        </aside>

        <div className='d-flex flex-fill flex-column'>
            <header className='d-flex top-header mb-2 ml-4 mr-4 bg-white'>header</header>
            <header className='d-flex flex-fill mt-3  ml-4 mr-4 bg-white'>body</header>
        </div>
    </div>
  );
};

export default App;
