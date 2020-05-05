import React, {useState} from 'react';
import {HashRouter as Router, Switch, Route, Redirect, useRouteMatch, useHistory} from "react-router-dom";
import './App.scss';
import 'typeface-roboto';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ReplyIcon from '@material-ui/icons/Reply';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Home } from './home/home';
import Users from './users';
import {useTranslation} from "react-i18next";
import {fetchLocalizations} from "../api/localization.api";
import LanguageIcon from '@material-ui/icons/Language';
import {useQuery} from "@apollo/react-hooks";
import {GET_USER_SESSION_GQL, ISession} from "../graphql/session.type";
import UserProfile from "./session/profile";
import UserSettings from "./session/settings";
import {Container, Grid, FormControl, MenuItem, Select, TextField, InputAdornment, Box, Divider, IconButton} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper/Paper";
import ResourceRoutes from "./Assets/Routes";
import {InventoryRoute} from "./Inventory/Route";
import {MaintenanceResourceRoutes} from "./Maintenance/Routes";
import {CustomizedInputBase} from "./CustomizedInputBase";
import {Leftbar} from "./leftsidebar/LeftBar";
import {RouterBreadcrumbs} from "./RouterBreadcrumbs";

const useStyles = makeStyles(theme => ({
   root: {
      display: 'flex',
      flex: 1,
      paddingLeft: '.5rem',
      paddingTop: '.5rem',
      paddingBottom: '.5rem',
   },
   paper: {
      padding: theme.spacing(1),
      flex: 1,
      // textAlign: 'center',
      // color: theme.palette.text.secondary,
   },
   breadcrumbsContainer: {
      paddingBottom: theme.spacing(1),
   },
   margin: {
      marginRight: theme.spacing(2),
   }
}));

const PageNotFoundComp: React.FC =  () => {
   return (
      <div>Page Not found!!</div>
   );
};

const InvalidRoutePageComp: React.FC =  () => {
   return (
      <div>Invalid route</div>
   );
};

const App: React.FC = () => {
  // const appName = useSelector((state: IRootState) => state.appName);
  const [lang, setLang] = useState<string>('en');
  const [t, i18n] = useTranslation();
  const sessionQL = useQuery<{session: ISession}, any>(GET_USER_SESSION_GQL);
  const classes = useStyles();

   if (sessionQL.loading || !sessionQL.data) return <div>Loading</div>;

  return (
    <Router>
       <div className={classes.root}>
          <Grid container spacing={1} style={{display: 'flex'}}>
             <Grid item xs={4} md={3} lg={2}>
                <Paper className={classes.paper} style={{height: '100%'}}>
                   {/*<Leftsidebar/>*/}

                   <Leftbar session={sessionQL.data.session}/>
                </Paper>
             </Grid>
             <Grid item xs={8} md={9} lg={10}
                   container
                   direction="column"
                   spacing={1}>
                <Grid item>
                   <Paper className={classes.paper}>
                      <CustomizedInputBase session={sessionQL.data.session}/>
                   </Paper>
                </Grid>

                <Grid item container style={{flexGrow: 1}}>
                   <Paper className={classes.paper}>
                      <Box display="flex" className={classes.breadcrumbsContainer} justifyContent="space-between">
                         <Box>
                            <IconButton aria-label="reload" size="small" className={classes.margin}>
                               <ReplyIcon/>
                            </IconButton>
                            <IconButton aria-label="go-up" size="small" className={classes.margin}>
                               <ArrowUpwardIcon/>
                            </IconButton>
                         </Box>
                         <Box>
                            <RouterBreadcrumbs/>
                         </Box>
                      </Box>
                      {/*<Divider/>*/}
                      <Switch>
                         <Redirect exact from="/" to="/home"/>
                         <Route path="/home" component={Home}/>
                         <Route path="/users" component={Users}/>
                         <Route path="/assets" component={ResourceRoutes}/>
                         <Route path="/maintenances" component={MaintenanceResourceRoutes}/>
                         <Route path="/inventories" component={InventoryRoute}/>
                         <Route path="/session/profile" component={UserProfile}/>
                         <Route path="/session/settings" component={UserSettings}/>
                         <Route path="/pageNotFound" component={PageNotFoundComp}/>
                         <Route path="/invalidRoute" component={InvalidRoutePageComp}/>
                      </Switch>
                   </Paper>
                </Grid>

             </Grid>
          </Grid>
       </div>
    </Router>
  );
};

export default App;
