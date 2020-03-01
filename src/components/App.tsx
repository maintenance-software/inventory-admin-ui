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
import {Container, Grid} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper/Paper";

const useStyles = makeStyles(theme => ({
   root: {
      display: 'flex',
      flex: 1,
      paddingLeft: '.5rem',
      paddingTop: '.5rem',
      paddingBottom: '.5rem',
   },
   paper: {
      padding: theme.spacing(2),
      // textAlign: 'center',
      // color: theme.palette.text.secondary,
   }
}));

const App: React.FC = () => {
  // const appName = useSelector((state: IRootState) => state.appName);
  const [lang, setLang] = useState<string>('en');
  const [t, i18n] = useTranslation();
  const sessionQL = useQuery<{session: ISession}, any>(GET_USER_SESSION_GQL);
   const classes = useStyles();
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
       <div className={classes.root}>
          <Grid container spacing={1} style={{display: 'flex'}}>
             <Grid item xs={2}>
                <Paper className={classes.paper} style={{height: '100%'}}>
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
                </Paper>
             </Grid>
             <Grid item xs={10}
                   container
                   direction="column"
                   spacing={1}>
                <Grid item>
                   <Paper className={classes.paper} style={{width: '100%', flexDirection:'row', display: 'flex'}}>
                      <div className="input-group">
                         <input type="text" className="form-control form-control bg-light border-0 small" placeholder="Search for..."
                                aria-label="Search" aria-describedby="basic-addon2"/>
                         <div className="input-group-append">
                            <button className="btn btn-primary btn" type="button">
                               <FontAwesomeIcon icon='search' fixedWidth />
                            </button>
                         </div>
                      </div>
                      <div>
                         <UserAccount firstName={sessionQL.data.session.firstName} lastName={sessionQL.data.session.lastName}/>
                      </div>
                   </Paper>
                </Grid>

                <Grid item container style={{flexGrow: 1}}>
                   <Paper className={classes.paper} style={{flex: 1}}>
                      <Switch>
                         <Redirect exact from="/" to="/home"/>
                         <Route path="/home" component={Home}/>
                         <Route path="/users" component={Users}/>
                         <Route path="/items" component={ItemPage}/>
                         <Route path="/session/profile" component={UserProfile}/>
                         <Route path="/session/settings" component={UserSettings}/>
                      </Switch>
                   </Paper>
                </Grid>

             </Grid>
          </Grid>
       </div>

      {/*<Container style={{height: 'inherit'}}>
        <Grid  container spacing={3}>
          <Grid item xs={3} style={{backgroundColor: 'white'}}>
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
          </Grid>

          <Grid item xs={9} style={{backgroundColor: 'white'}}  className="col d-flex flex-column p-0 m-0">
            <header className="top-header mb-2 ml-2 mr-2 px-2 bg-white d-flex justify-content-between align-items-center">
               <div>

                  <div className="input-group">
                     <input type="text" className="form-control form-control bg-light border-0 small" placeholder="Search for..."
                            aria-label="Search" aria-describedby="basic-addon2"/>
                        <div className="input-group-append">
                           <button className="btn btn-primary btn" type="button">
                              <FontAwesomeIcon icon='search' fixedWidth />
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
          </Grid>
        </Grid>
        
      </Container>*/}
    </Router>    
  );
};

export default App;
