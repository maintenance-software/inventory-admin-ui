import React from 'react';
import './users.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const UserCard: React.FC =  () => {    
    return (
      <div className="card w-25">
        <div className="card-body">
          <h5 className="card-title">Special title treatment</h5>
          <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
          <a href="#" className="btn btn-primary">Go somewhere</a>
        </div>
      </div>
    );
};
export default UserCard;

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