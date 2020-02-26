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
import {useQuery} from "@apollo/react-hooks";
import {GET_USER_SESSION_GQL, ISession} from "../graphql/session.type";
import UserAccount from "./session/index";
import UserProfile from "./session/profile";
import UserSettings from "./session/settings";

const App: React.FC = () => {
  // const appName = useSelector((state: IRootState) => state.appName);
  const [lang, setLang] = useState<string>('en');
  const [t, i18n] = useTranslation();
  const sessionQL = useQuery<{session: ISession}, any>(GET_USER_SESSION_GQL);

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


   if (sessionQL.loading || !sessionQL.data) return <div>Loading</div>;

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
            <header className="top-header mb-2 ml-2 mr-2 px-2 bg-white d-flex justify-content-between align-items-center">
               <div>

                  <div className="input-group">
                     <input type="text" className="form-control form-control-sm bg-light border-0 small" placeholder="Search for..."
                            aria-label="Search" aria-describedby="basic-addon2"/>
                        <div className="input-group-append">
                           <button className="btn btn-primary btn-sm" type="button">
                              <FontAwesomeIcon icon='search' size='sm' fixedWidth />
                           </button>
                        </div>
                  </div>

               </div>
               <div>
                  <UserAccount firstName={sessionQL.data.session.firstName} lastName={sessionQL.data.session.lastName}/>
               </div>
            </header>
            <div className="d-flex flex-fill mt-2  ml-2 mr-2 bg-white">
                <Switch>
                  <Redirect exact from="/" to="/home"/>
                  <Route path="/home" component={Home}/>
                  <Route path="/users" component={Users}/>
                  <Route path="/items" component={ItemPage}/>
                  <Route path="/session/profile" component={UserProfile}/>
                  <Route path="/session/settings" component={UserSettings}/>
                </Switch>
            </div>
          </div>
        </div>
        
      </div>
    </Router>    
  );
};

export default App;
