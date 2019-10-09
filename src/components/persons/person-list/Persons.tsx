import React, { useEffect, useState } from 'react';
import './Persons.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { useTranslation } from 'react-i18next';
import { fetchPersonsThunk } from '../../../store/actions/persons.action';
import { IPerson } from '../../../api/person/persons.api';
import PersonCard from './person-card/PersonCard';

const Persons: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPersonsThunk)
  }, []);

  const persons: IPerson[] = useSelector((state: IRootState) => state.personScope.persons);
   //  const [users, setUsers] = useState<IUser[]>([]);
   //  console.log(users);
   // const [lang, setLang] = useState<string>('en');


  return (
    <>
            <div className="row justify-content-between p-2 align-items-center">
                <h6 className="text-primary my-auto">User Management</h6>
                <button className="btn btn-outline-primary btn-sm">
                  {t('user.button.add')}
                  <FontAwesomeIcon icon="plus"/>
                </button>
            </div>
            <div className="user-card-container">
              {persons.map((u, i) => (
                <PersonCard key={i} person={u}/>
              ))}
            </div>            
    </>
  );
};
export default Persons;

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
