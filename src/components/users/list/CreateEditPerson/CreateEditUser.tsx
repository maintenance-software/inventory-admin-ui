import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import {IUser, IUsers} from "../../../../graphql/users.type";
import EditUserForm, {UserForm} from "./CreateEditUserForm";
import {useHistory} from "react-router";
import {GET_USERS_GQL} from "../Users";

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

const SAVE_USER = gql`
  mutation savePerson(
    $personId: Int!
  , $firstName: String!
  , $lastName: String!
  , $documentType: String!
  , $documentId: String!
  , $userId: Int!
  , $username: String!
  , $password: String!
  , $email: String!
  , $status: Boolean!
  , 
  ) {
    savePerson(personId: $personId, firstName: $firstName, lastName: $lastName, documentType: $documentType, documentId: $documentId) {
       personId
       firstName
       lastName
       documentType
       documentId
       account(userId: $userId, username: $username, email: $email, password: $password, active: $status) {
         userId
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
   const history = useHistory();
   const [savePerson, mutation] = useMutation<{ savePerson: {account: IUser} }, any>(SAVE_USER);
   const [getUserById, { called, loading, data }] = useLazyQuery<{users: IUsers}, any>(GET_USER_BY_ID);
   const [hasError, setHasError] = useState(false);
   const userId = +params.userId;

  useEffect(() => {
     if(userId && userId > 0) {
        getUserById({variables: { userId: userId }});
     }
  }, []);

   useEffect(() => {
      if(mutation.data && mutation.data.savePerson) {
         if(userId <= 0) {
            getUserById({variables: { userId: mutation.data.savePerson.account.userId}});
            history.push(mutation.data.savePerson.account.userId.toString());
         }
      } else {
         // setHasError(true);
      }
   }, [mutation.data]);

   if (loading || (!data && userId > 0))
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

   const userForm: UserForm = {
      username: user.username,
      email: user.email,
      status: user.active? 'ACTIVE':'INACTIVE',
      expiration: true,
      firstName: user.person.firstName,
      lastName: user.person.lastName,
      roles: [],
      language: 'es'
   };

   const callback = (userForm: UserForm, resetForm: Function) => {
      const mutationRequest = {
         personId: user.person.personId,
         firstName: userForm.firstName,
         lastName: userForm.lastName,
         documentType: '',
         documentId: new Date().getTime().toString(),
         userId: user.userId,
         username: userForm.username,
         password: '123',
         email: userForm.email,
         status: userForm.status === 'ACTIVE',
      };
      const refetchQueries = [{query: GET_USERS_GQL, variables: {}}];
      if(user.userId > 0) {
         refetchQueries.push({query: GET_USER_BY_ID, variables: {userId: user.userId}});
      }
      savePerson({ variables: mutationRequest, refetchQueries:refetchQueries});
      resetForm({values: userForm});
   };

  return (
    <div>
      <EditUserForm userForm={userForm} callback={callback}/>
    </div>
  );
};
export default CreateEditUser;
