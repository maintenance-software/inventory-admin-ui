import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import './App.scss';
import { IRootState } from '../store';
import {Leftsidebar} from "./leftsidebar/Leftsidebar";
import { Home } from './home/home';
import Persons from './persons';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  UncontrolledDropdown
} from "reactstrap";
import {useTranslation} from "react-i18next";
import {fetchLocalizations} from "../api/localization.api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const App: React.FC = () => {
  // const appName = useSelector((state: IRootState) => state.appName);
  const [lang, setLang] = useState<string>('en');
  const [t, i18n] = useTranslation();

  const onChangeLang = async (newLang: string) => {
    try {
      const localizations = await fetchLocalizations(newLang);
      for (const key in localizations) {
        // @ts-ignore
        i18n.addResource(newLang, 'translation', key, localizations[key]);
      }
    } catch (e) {
      console.error(e);
    }
    await i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  return (
    <Router>
      <div className='container-fluid d-flex p-0 m-0 App'>
        <aside className='left-sidebar bg-white h-100'>
          <Navbar color="light" light expand="md" className="d-flex justify-content-between">
            <UncontrolledDropdown setActiveFromChild size="sm">
              <DropdownToggle caret color="light">{lang.toUpperCase()}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem active={lang === 'en'} onClick={() => onChangeLang('en')}>English</DropdownItem>
                <DropdownItem active={lang === 'es'} onClick={() => onChangeLang('es')}>Español</DropdownItem>
                <DropdownItem active={lang === 'fr'} onClick={() => onChangeLang('fr')}>Frances</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <Button color="ligth" size="sm">
              <FontAwesomeIcon icon="bars"/>
            </Button>
          </Navbar>
          <Leftsidebar/>
        </aside>

        <div className='d-flex flex-fill flex-column'>
            <header className='d-flex top-header mb-2 ml-4 mr-4 bg-white'>header</header>
            <div className='d-flex flex-fill mt-3  ml-4 mr-4 bg-white'>
              <Switch>
                <Redirect exact from="/" to="/home"/>
                <Route path="/home" component={Home}/>
                <Route path="/persons" component={Persons}/>
              </Switch>            
            </div>
        </div>
      </div>
    </Router>    
  );
};

export default App;
