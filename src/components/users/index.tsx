import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Users from './list/Users';
import CreateEditUser from "./list/CreateEditPerson/CreateEditUser";

const UserPage: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();

  return (
    <div className="user-container">
      <Switch>
        <Route exact path={path} component={Users}/>
        <Route path={`${path}/:userId`} component={CreateEditUser}/>
      </Switch> 
        
    </div>
  );
};
export default UserPage;
