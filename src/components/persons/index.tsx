import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import PersonCard from './person-list/person-card/PersonCard';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Persons from './person-list/Persons';
import EditPerson from './edit-person/EditPerson';

const PersonPage: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();

  return (
    <div className="user-container">
      <Switch>
        <Route exact path={path} component={Persons}/>
        <Route path={`${path}/:personId`} component={EditPerson}/>        
      </Switch> 
        
    </div>
  );
};
export default PersonPage;
