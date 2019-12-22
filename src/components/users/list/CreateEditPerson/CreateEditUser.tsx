import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import {IUser, IUsers} from "../../../../graphql/users.type";
import EditUserForm from "./CreateEditUserForm";

export const GET_USER_BY_ID = gql`
  query getUserById($userId: Int!){
    users {
      user(entityId: $userId) {
         userId
         username
         email
         active
         person {
            personId
            firstName
            lastName
            documentType
            documentId
         }
      }
    }
  }
`;

interface IEditProps {
   user: IUser;
}

const CreateEditUser: React.FC<IEditProps> =  (props) => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const userId = +params.userId;
   const [getUserById, { called, loading, data }] = useLazyQuery<{users: IUsers}, any>(GET_USER_BY_ID);
  useEffect(() => {
     if(userId && userId > 0) {
        getUserById({variables: { userId: userId }});
     }
  }, []);

   if (loading)
      return <div>Loading</div>;

   let user: IUser = {
      userId: 0,
      username: '',
      email: '',
      password: '',
      active: false,
      privileges: [],
      roles: [],
      person: {
         personId: 0,
         firstName: '',
         lastName: '',
         documentType: '',
         documentId: '',
         address: '',
         contactInfo: []
      }
   };

   if(data) {
      user = data.users.user
   }
  return (
    <div>
      <EditUserForm {...user}/>
    </div>
  );
};
export default CreateEditUser;
