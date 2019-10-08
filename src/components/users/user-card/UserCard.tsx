import React from 'react';
import './UserCard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {IUser} from "../../../api/users.api";

export interface IUserCardProps {
   user: IUser;
}

const UserCard: React.FC<IUserCardProps> =  (props) => {
   const {user} = props;
    return (
      <div className="user-card">
        <div className="user-card-body">
           <div className="user-avatar">
              <h6>AV</h6>
           </div>
           <div className="d-flex flex-column flex-grow-1">
              <h5 className="card-title">{user.username}</h5>
              <a href="#" className="btn btn-primary">{user.email}</a>
           </div>
           <div>
              <a href="#" className="user-options">
                 <FontAwesomeIcon icon="ellipsis-v"/>
              </a>
           </div>

        </div>
      </div>
    );
};
export default UserCard;
