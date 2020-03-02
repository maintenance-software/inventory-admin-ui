import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Users from './list/Users';
import CreateEditUser from "./CreateEditPerson/CreateEditUser";
import Grid from "@material-ui/core/Grid/Grid";

const UserPage: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();

  return (
     <Switch>
        <Route exact path={path} component={Users}/>
        <Route path={`${path}/:userId`} component={CreateEditUser}/>
     </Switch>
  );
};
export default UserPage;
