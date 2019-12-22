import React, { useEffect } from 'react';
import './Users.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import UserCard from './UserCard/UserCard';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import {IUsers} from "../../../graphql/users.type";
import {Table} from "reactstrap";
import {SearchInput} from "../../SearchInput/SearchInput";


export const GET_USERS_GQL = gql`
  query {
    users {
      list(queryString: "") {
         userId
         username
         email
         active
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
  // const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(fetchPersonsThunk)
  }, []);

  // const persons: IPerson[] = useSelector((state: IRootState) => state.personScope.persons);
   //  const [users, setUsers] = useState<IUser[]>([]);
   //  console.log(users);
   // const [lang, setLang] = useState<string>('en');
   const userQL = useQuery<{users: IUsers}, any>(GET_USERS_GQL);
   if (userQL.loading || !userQL.data) return <div>Loading</div>;

   const users = userQL.data.users.list;

  return (
    <>
       <div className="row justify-content-between p-2 align-items-center">
          <div>
             <button className="btn btn-light">
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
             <tr style={{cursor:'pointer'}}>
                <td className="align-middle p-1"><UserCard key={i} user={u}/></td>
                <td className="align-middle">Admin, Anonymous</td>
                <td className="align-middle">Read, Write, Delete</td>
                <td className="align-middle">{u.active? 'ACTIVE': 'INACTIVE'}</td>
             </tr>
          ))}
          </tbody>
       </Table>
    </>
  );
};
export default Users;
