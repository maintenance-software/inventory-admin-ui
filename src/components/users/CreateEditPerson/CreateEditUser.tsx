import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {EntityStatusQL, GET_USERS_GQL, PrivilegeQL, UserQL, UsersQL} from "../../../graphql/User.ql";
import {EditUserForm, UserForm} from "./CreateEditUserForm";
import {useHistory} from "react-router";
import UserRoleComp from "./UserRoleComp";
import UserPrivilegeComp from "./PrivilegeUserComp";
import Typography from "@material-ui/core/Typography/Typography";
import Box from "@material-ui/core/Box/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import Grid from "@material-ui/core/Grid/Grid";

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
   user: UserQL;
}

interface TabPanelProps {
   children?: React.ReactNode;
   index: any;
   value: any;
}

const TabPanel = (props: TabPanelProps) => {
   const { children, value, index, ...other } = props;

   return (
      <Typography
         component="div"
         role="tabpanel"
         hidden={value !== index}
         id={`vertical-tabpanel-${index}`}
         aria-labelledby={`vertical-tab-${index}`}
         style={{display: 'flex', flex: 1}}
         {...other}
      >
         {value === index && <Box display='flex' flexGrow={1} p={1}>{children}</Box>}
      </Typography>
   );
};

const a11yProps = (index: any) => {
   return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
   };
};

const useStyles = makeStyles((theme: Theme) => ({
   root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexWrap: 'nowrap',
      height: '100%!important',
      width: '100%!important'
   },
   tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
   },
}));


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
   const classes = useStyles();
   const [value, setValue] = React.useState(0);
   const [savePerson, mutation] = useMutation<{ savePerson: {account: UserQL} }, any>(SAVE_USER);
   const [getUserById, { called, loading, data }] = useLazyQuery<{users: UsersQL}, any>(GET_USER_BY_ID);
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

   let user: UserQL = {
      userId: 0,
      username: '',
      email: '',
      password: '',
      status: EntityStatusQL.INACTIVE,
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
         address: null,
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

   let userRolePrivileges:PrivilegeQL[] = [];
   user.roles.map(r => r.privileges).flat().forEach( t => {
      if(userRolePrivileges.findIndex(p => p.privilegeId === t.privilegeId) === -1) {
         userRolePrivileges.push(t)
      }
   });

   const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
   };

   return (
      <Grid container className={classes.root}>
         <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
         >
            <Tab label="USER DETAILS" {...a11yProps(0)} />
            <Tab label="ROLES" {...a11yProps(1)} />
            <Tab label="PERMISSION" {...a11yProps(2)} />
            <Tab label="SETTINGS" {...a11yProps(3)} />
         </Tabs>
         <TabPanel value={value} index={0}>
            <EditUserForm userForm={userForm} callback={callback}/>
         </TabPanel>
         <TabPanel value={value} index={1}>
            <UserRoleComp userRoles={user.roles} onSaveUserRoles = {onSaveUserRoles}/>
         </TabPanel>
         <TabPanel value={value} index={2}>
            <UserPrivilegeComp userPrivileges={user.privileges} onSaveUserPermission={onSaveUserPermission} userRolePrivileges={userRolePrivileges}/>
         </TabPanel>
         <TabPanel value={value} index={3}>
            In develop
         </TabPanel>
      </Grid>
  );
};
export default CreateEditUser;
