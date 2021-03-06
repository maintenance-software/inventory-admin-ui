import React, { useEffect } from 'react';
import './Users.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import UserCard from './UserCard/UserCard';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import {IUsers} from "../../../graphql/users.type";
import {Pagination, PaginationItem, PaginationLink, Table} from "reactstrap";
import {SearchInput} from "../../SearchInput/SearchInput";
import {useHistory} from "react-router";


export const GET_USERS_GQL = gql`
  query listUsers{
    users {
      list(queryString: "") {
         userId
         username
         email
         status
         person {
            personId
            firstName
            lastName
         }
      }
    }
  }
`;


const Users: React.FC =  () => {
  const [t, i18n] = useTranslation();
   const history = useHistory();
   const userQL = useQuery<{users: IUsers}, any>(GET_USERS_GQL);
   if (userQL.loading || !userQL.data) return <div>Loading</div>;

   const users = userQL.data.users.list;

  return (
    <>
       <div className="row justify-content-between p-2 align-items-center">
          <div>
             <button className="btn btn-light" onClick={() => history.push('users/0')}>
                <FontAwesomeIcon icon="user-plus"/>
                {t('user.button.add')}
             </button>
          </div>
          <SearchInput/>
       </div>

       <Table hover bordered>
          <thead>
             <tr>
                <th>User</th>
                <th>Roles</th>
                <th>Privilegios</th>
                <th>Status</th>
             </tr>
          </thead>
          <tbody>
          {users.map((u, i) => (
             <tr key={u.userId} onClick={() => history.push('users/' + u.userId)} style={{cursor:'pointer'}}>
                <td className="align-middle p-1"><UserCard key={i} user={u}/></td>
                <td className="align-middle">Admin, Anonymous</td>
                <td className="align-middle">Read, Write, Delete</td>
                <td className="align-middle">{u.status}</td>
             </tr>
          ))}
          </tbody>
       </Table>

       <Pagination aria-label="Page navigation example">
          <PaginationItem disabled>
             <PaginationLink first href="#" />
          </PaginationItem>
          <PaginationItem disabled>
             <PaginationLink previous href="#" />
          </PaginationItem>
          <PaginationItem active>
             <PaginationLink href="#">
                1
             </PaginationLink>
          </PaginationItem>
          <PaginationItem>
             <PaginationLink href="#">
                2
             </PaginationLink>
          </PaginationItem>
          <PaginationItem>
             <PaginationLink href="#">
                3
             </PaginationLink>
          </PaginationItem>
          <PaginationItem>
             <PaginationLink href="#">
                4
             </PaginationLink>
          </PaginationItem>
          <PaginationItem>
             <PaginationLink href="#">
                5
             </PaginationLink>
          </PaginationItem>
          <PaginationItem>
             <PaginationLink next href="#" />
          </PaginationItem>
          <PaginationItem>
             <PaginationLink last href="#" />
          </PaginationItem>
       </Pagination>
    </>
  );
};
export default Users;
