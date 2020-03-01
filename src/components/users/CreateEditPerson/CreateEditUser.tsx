import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import {EntityStatus, IPrivilege, IUser, IUsers} from "../../../graphql/users.type";
import EditUserForm, {UserForm} from "./CreateEditUserForm";
import {useHistory} from "react-router";
import {GET_USERS_GQL} from "../list/Users";
import {Button, Card, CardText, CardTitle, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import classnames from 'classnames';
import UserRoleComp from "./UserRoleComp";
import UserPrivilegeComp from "./PrivilegeUserComp";

export const GET_USER_BY_ID = gql`
  query getUserById($userId: Int!){
    users {
      user(entityId: $userId) {
         userId
         username
         email
         status
         language
         expiration
         person {
            personId
            firstName
            lastName
            documentType
            documentId
         }
         
         roles {
            roleId
            key
            name
            privileges {
               privilegeId
               key
               name
            }
         }
         privileges {
               privilegeId
               key
               name
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
  , $user: UserArg!
  , $privilegeIds: [Int!]
  , $roleIds: [Int!]
  ) {
    savePerson(personId: $personId, firstName: $firstName, lastName: $lastName, documentType: $documentType, documentId: $documentId) {
       personId
       firstName
       lastName
       documentType
       documentId
       account(user: $user) {
         userId
         privileges(privilegeIds: $privilegeIds) {
            privilegeId
         }
         roles(roleIds: $roleIds) {
            roleId
         }
       }
    }
  }
`;


interface IEditProps {
   user: IUser;
}

interface PersonUserRequestMutation {
   personId: number,
   firstName: string,
   lastName: string,
   documentType: string,
   documentId: string,
   user: {
      userId: number,
      username: string,
      email: string,
      status: string,
      language: string,
      expiration: boolean
   },
   privilegeIds: number[],
   roleIds: number[],
}

const CreateEditUser: React.FC<IEditProps> =  (props) => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const [activeTab, setActiveTab] = useState('1');
   const [savePerson, mutation] = useMutation<{ savePerson: {account: IUser} }, any>(SAVE_USER);
   const [getUserById, { called, loading, data }] = useLazyQuery<{users: IUsers}, any>(GET_USER_BY_ID);
   const [hasError, setHasError] = useState(false);
   const userId = +params.userId;
   const toggle = (tab: string) => {
      if(activeTab !== tab)
         setActiveTab(tab);
   };

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
      status: EntityStatus.INACTIVE,
      language: 'es_BO',
      expiration: false,
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
      status: user.status,
      expiration: user.expiration,
      firstName: user.person.firstName,
      lastName: user.person.lastName,
      roles: [],
      language: user.language
   };

   const callback = (userForm: UserForm, resetForm: Function) => {
      const mutationRequest: PersonUserRequestMutation = {
         personId: user.person.personId,
         firstName: userForm.firstName,
         lastName: userForm.lastName,
         documentType: '',
         documentId: new Date().getTime().toString(),
         user: {
            userId: user.userId,
            username: userForm.username,
            email: userForm.email,
            status: userForm.status,
            language: userForm.language,
            expiration: userForm.expiration
         },
         privilegeIds: user.privileges.map(p => p.privilegeId),
         roleIds: user.roles.map(r => r.roleId)
      };
      onSavePersonUser(mutationRequest);
      resetForm({values: userForm});
   };

   const onSaveUserPermission = (privilegeIds: number[]) => {
      const request: PersonUserRequestMutation = {
         personId: user.person.personId,
         firstName: user.person.firstName,
         lastName: user.person.lastName,
         documentType: '',
         documentId: new Date().getTime().toString(),
         user: {
            userId: user.userId,
            username: user.username,
            email: user.email,
            status: user.status,
            language: user.language,
            expiration: user.expiration
         },
         privilegeIds: privilegeIds,
         roleIds: user.roles.map(r => r.roleId)
      };
      onSavePersonUser(request);
   };

   const onSaveUserRoles = (roleIds: number[]) => {
      const request: PersonUserRequestMutation = {
         personId: user.person.personId,
         firstName: user.person.firstName,
         lastName: user.person.lastName,
         documentType: '',
         documentId: new Date().getTime().toString(),
         user: {
            userId: user.userId,
            username: user.username,
            email: user.email,
            status: user.status,
            language: user.language,
            expiration: user.expiration
         },
         privilegeIds: user.privileges.map(p => p.privilegeId),
         roleIds: roleIds
      };
      onSavePersonUser(request);
   };


   const onSavePersonUser = (request: PersonUserRequestMutation) => {
      const refetchQueries = [{query: GET_USERS_GQL, variables: {}}];
      if(user.userId > 0) {
         refetchQueries.push({query: GET_USER_BY_ID, variables: {userId: user.userId}});
      }
      savePerson({ variables: request, refetchQueries:refetchQueries});
   };

   let userRolePrivileges:IPrivilege[] = [];
   user.roles.map(r => r.privileges).flat().forEach( t => {
      if(userRolePrivileges.findIndex(p => p.privilegeId === t.privilegeId) === -1) {
         userRolePrivileges.push(t)
      }
   });


   return (
    <div>
       <Nav tabs>
          <NavItem>
             <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => { toggle('1'); }}
             >
                User Details
             </NavLink>
          </NavItem>
          <NavItem>
             <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => { toggle('2'); }}
             >
                Roles
             </NavLink>
          </NavItem>
          <NavItem>
             <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => { toggle('3'); }}
             >
                Permissions
             </NavLink>
          </NavItem>

       </Nav>
       <TabContent activeTab={activeTab} className='py-3 px-1'>
          <TabPane tabId="1">
             <EditUserForm userForm={userForm} callback={callback}/>
          </TabPane>
          <TabPane tabId="2">
             <UserRoleComp userRoles={user.roles} onSaveUserRoles = {onSaveUserRoles}/>
          </TabPane>
          <TabPane tabId="3">
             <UserPrivilegeComp userPrivileges={user.privileges} onSaveUserPermission={onSaveUserPermission} userRolePrivileges={userRolePrivileges}/>
          </TabPane>
       </TabContent>

    </div>
  );
};
export default CreateEditUser;
