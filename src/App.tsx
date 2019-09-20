import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Button from "reactstrap/lib/Button";
import axios from 'axios';

const App: React.FC = () => {

    axios.get('/api/users')
        .then(function (response) {
            // handle success
            console.log(response);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
        <Button>Test button</Button>
    </div>
  );
};

export default App;
