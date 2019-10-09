import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { useTranslation } from 'react-i18next';
import { fetchPersonsThunk } from '../../store/actions/persons.action';
import { IPerson } from '../../api/person/persons.api';
import PersonCard from './person-list/person-card/PersonCard';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Persons from './person-list/Persons';
import EditPerson from './edit-person/EditPerson';

const PersonPage: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPersonsThunk)
  }, []);

  const { path, url } = useRouteMatch();
   //  const [users, setUsers] = useState<IUser[]>([]);
   //  console.log(users);
   // const [lang, setLang] = useState<string>('en');


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

/*
const Users = () => {
  const [data, loading] = useFetch('/api/users');
  const datas = data as any[];
  return (
    <>
    <div>
      <h1>Users</h1>{loading ? ("Loading...") : 
      (
        <ul>
          {
              datas.map(({ userId, username, password }) => 
                (<li key={`user-${userId}`}>{username}</li>)
              )
          }
        </ul>
      )}
    </div>
    </>
  );
};

export default Users;
*/
