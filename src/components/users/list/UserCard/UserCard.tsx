import React from 'react';
import './UserCard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {buildFullName, buildShortName} from '../../../../utils/globalUtil';
import {IUser} from "../../../../graphql/users.type";

export interface IUserCardProps {
   user: IUser;
}

const UserCard: React.FC<IUserCardProps> =  (props) => {
   const {user} = props;
    return (
      <div className="user-card">
        <div className="user-card-body align-items-center">
           <div className="user-avatar">
              <h6>{buildShortName(user.person.firstName, user.person.lastName)}</h6>
           </div>
           <div className="d-flex flex-grow-1 px-2 align-items-center">
              <div className="d-flex flex-column">
                 <h5 className="m-0 p-0 font-weight-bold">{buildFullName(user.person.firstName, user.person.lastName)}</h5>
                 <h6 className="m-0 p-0">{user.email}</h6>
              </div>
           </div>
           <h5 className="m-0 p-0">{user.username}</h5>
        </div>
      </div>
    );
};
export default UserCard;
