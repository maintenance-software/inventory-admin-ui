import React, {useState} from 'react';
import {HashRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import './App.scss';
import {Leftsidebar} from "./leftsidebar/Leftsidebar";
import { Home } from './home/home';
import Users from './users';
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
import ItemPage from './items';

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
      <div className="fluid-container h-100 w-100 p-0 m-0 root-app">
        <div className="row flex-nowrap h-100 w-100 m-0 p-0">
          <aside className="col-2 left-sidebar bg-white h-100">
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

          <div className="col d-flex flex-column p-0 m-0">
            <header className="top-header mb-2 ml-2 mr-2 bg-white">
              Header
            </header>
            <div className="d-flex flex-fill mt-2  ml-2 mr-2 bg-white">
                <Switch>
                  <Redirect exact from="/" to="/home"/>
                  <Route path="/home" component={Home}/>
                  <Route path="/users" component={Users}/>
                  <Route path="/items" component={ItemPage}/>
                </Switch>
            </div>
          </div>
        </div>
        
      </div>
    </Router>    
  );
};

export default App;
