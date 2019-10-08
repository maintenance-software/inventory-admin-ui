import React, { useEffect, useState } from 'react';
import './users.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IUser } from '../../api/users.api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersThunk } from '../../store/actions/users.action';
import { IRootState } from '../../store';
import { useTranslation } from 'react-i18next';
import UserCard from "./user-card/UserCard";

const Users: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUsersThunk)
  }, []);

  const users = useSelector((state: IRootState) => state.users);
   //  const [users, setUsers] = useState<IUser[]>([]);
   //  console.log(users);
   // const [lang, setLang] = useState<string>('en');


  return (
    <div className="user-container">
        <div className="row justify-content-between p-2 align-items-center">
            <h6 className="text-primary my-auto">User Management</h6>
            <button className="btn btn-outline-primary btn-sm">
              {t('user.button.add')}
              <FontAwesomeIcon icon="plus"/>
            </button>
        </div>
        <div className="user-card-container">
          {users.map((u, i) => (
            <UserCard key={i} user={u}/>
          ))}
        </div>
    </div>
  );
};
export default Users;

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
