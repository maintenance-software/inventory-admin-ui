import React from 'react';
import { useSelector } from 'react-redux';
import logo from './logo.svg';
import './App.scss';
import {Container, Row, Col} from "reactstrap";
import axios from 'axios';
import Users from './Users';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RootState } from '../store';
library.add(faEnvelope, faKey);

const App: React.FC = () => {
  const appName = useSelector((state: RootState) => state.appName);
  return (
    <div className='container-fluid bg-light' style={{height: '100vh'}}>
        <h5>
          {appName}
        </h5>
    </div>
  );
};

export default App;
