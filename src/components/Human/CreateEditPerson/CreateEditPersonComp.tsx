import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import EditPersonForm, { IPersonFormProps } from "./CreateEditUserForm";
import {useHistory} from "react-router";
import Typography from "@material-ui/core/Typography/Typography";
import Box from "@material-ui/core/Box/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import Grid from "@material-ui/core/Grid/Grid";
import {ContactTypeQL, PersonQL} from "../../../graphql/Person.ql";
import {FETCH_PERSONS_GQL} from "../index";

export const GET_PERSON_BY_ID = gql`
  query getPersonById($personId: Int!) {
    persons {
      person(entityId: $personId) {
            personId
            firstName
            lastName
            documentType
            documentId
            address{
               addressId
               street1
               street2
               street3
               zip
               city
               state
               country            
            }
            contactInfo {
               contactId
               contact
               contactType
            }
      }
    }
  }
`;

const SAVE_PERSON = gql`
  mutation savePerson(
    $personId: Int!
  , $firstName: String!
  , $lastName: String!
  , $documentType: String!
  , $documentId: String!
  , $address: AddressArg
  , $contactInfo: [ContactInfoArg!]!
  ) {
    savePerson(personId: $personId, firstName: $firstName, lastName: $lastName, documentType: $documentType, documentId: $documentId) {
       personId
       firstName
       lastName
       documentType
       documentId
       address(address: $address) {
         addressId
       }
       contactInfo(contactInfo: $contactInfo) {
         contactId
       } 
    }
  }
`;


interface IEditProps {
   user: PersonQL;
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
   personId: number;
   firstName: string;
   lastName: string;
   documentType: string;
   documentId: string;
   address: {
      addressId: number;
      street1: string;
      street2: string;
      street3: string;
      zip: string;
      city: string;
      state: string;
      country: string;
   },
   contactInfo: {contactId: number; contact: string; contactType: string;}[]
}

const CreateEditPersonComp: React.FC<IEditProps> =  (props) => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const [activeTab, setActiveTab] = useState('1');
   const classes = useStyles();
   const [value, setValue] = React.useState(0);
   const [savePerson, mutation] = useMutation<{ savePerson: PersonQL }, any>(SAVE_PERSON);
   const [getUserById, { called, loading, data }] = useLazyQuery<{persons: {person: PersonQL}}, any>(GET_PERSON_BY_ID);
   const [hasError, setHasError] = useState(false);
   const personId = +params.personId;
   const toggle = (tab: string) => {
      if(activeTab !== tab)
         setActiveTab(tab);
   };

  useEffect(() => {
     if(personId && personId > 0) {
        getUserById({variables: { personId }});
     }
  }, []);

   useEffect(() => {
      if(mutation.data && mutation.data.savePerson) {
         if(personId <= 0) {
            getUserById({variables: { personId: mutation.data.savePerson.personId}});
            history.push(mutation.data.savePerson.personId.toString());
         }
      } else {
         // setHasError(true);
      }
   }, [mutation.data]);

   if (loading || (!data && personId > 0))
      return <div>Loading</div>;

   let person: PersonQL = {
      personId: 0,
      firstName: '',
      lastName: '',
      documentType: '',
      documentId: '',
      address: null,
      contactInfo: []
   };

   if(data) {
      person = data.persons.person;
   }

   if(!person.address) {
      person.address = {
         addressId: 0,
         street1: '',
         street2: '',
         street3: '',
         zip: '',
         city: '',
         state: '',
         country: ''
      }
   }

   const personForm: IPersonFormProps = {
      firstName: person.firstName,
      lastName: person.lastName,
      email: person.contactInfo
         .filter(c => c.contactType === ContactTypeQL.EMAIL)
         .map(c => c.contact)
         .find(c => true) || '',
      documentId: person.documentId,
      address: person.address.street1,
      city: person.address.city,
      state: person.address.state,
      country: person.address.country,
      workPhone: person.contactInfo
         .filter(c => c.contactType === ContactTypeQL.WORK_PHONE)
         .map(c => c.contact)
         .find(c => true) || '',
      cellPhone: person.contactInfo
         .filter(c => c.contactType === ContactTypeQL.CELL_PHONE)
         .map(c => c.contact)
         .find(c => true) || '',
      whatsapp: person.contactInfo
         .filter(c => c.contactType === ContactTypeQL.WHATSAPP)
         .map(c => c.contact)
         .find(c => true) || '',
      onSavePersonCallback: (personForm: IPersonFormProps, resetForm: Function) => {
         const mutationRequest: PersonUserRequestMutation = {
            personId: person.personId,
            firstName: personForm.firstName,
            lastName: personForm.lastName,
            documentType: '',
            documentId: personForm.documentId,
            address: {
               addressId: !person.address? 0 : person.address.addressId,
               street1: personForm.address,
               street2: '',
               street3: '',
               zip: '',
               city: personForm.city,
               state: personForm.state,
               country: personForm.country
            },
            contactInfo: [{
                          contactId: person.contactInfo.filter(c => c.contactType === ContactTypeQL.EMAIL).map(c => c.contactId).find(c =>true) || 0,
                          contact: personForm.email,
                          contactType: ContactTypeQL.EMAIL
                        }].concat([{
                           contactId: person.contactInfo.filter(c => c.contactType === ContactTypeQL.WORK_PHONE).map(c => c.contactId).find(c =>true) || 0,
                           contact: personForm.workPhone,
                           contactType: ContactTypeQL.WORK_PHONE
                        }]).concat([{
                           contactId: person.contactInfo.filter(c => c.contactType === ContactTypeQL.CELL_PHONE).map(c => c.contactId).find(c =>true) || 0,
                           contact: personForm.cellPhone,
                           contactType: ContactTypeQL.CELL_PHONE
                        }]).concat([{
                           contactId: person.contactInfo.filter(c => c.contactType === ContactTypeQL.WHATSAPP).map(c => c.contactId).find(c =>true) || 0,
                           contact: personForm.whatsapp,
                           contactType: ContactTypeQL.WHATSAPP
                        }])
         };
         onSavePerson(mutationRequest);
         resetForm({values: personForm});
      }
   };

   /*const callback = (userForm: UserForm, resetForm: Function) => {
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
   };*/

   const onSavePerson = (request: PersonUserRequestMutation) => {
      const refetchQueries = [{query: FETCH_PERSONS_GQL, variables: {}}];
      if(person.personId > 0) {
         refetchQueries.push({query: GET_PERSON_BY_ID, variables: {personId: person.personId}});
      }
      savePerson({ variables: request, refetchQueries:refetchQueries});
   };

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
            <Tab label="GENERAL" {...a11yProps(0)} />
            <Tab label="ASSIGNMENT" {...a11yProps(1)} />
            <Tab label="PERMISSION" {...a11yProps(2)} />
            <Tab label="SETTINGS" {...a11yProps(3)} />
         </Tabs>
         <TabPanel value={value} index={0}>
            <EditPersonForm {...personForm}/>
         </TabPanel>
         <TabPanel value={value} index={1}>
            {/*<UserRoleComp userRoles={user.roles} onSaveUserRoles = {onSaveUserRoles}/>*/}
         </TabPanel>
         <TabPanel value={value} index={2}>
            In develop 1
         </TabPanel>
         <TabPanel value={value} index={3}>
            In develop 2
         </TabPanel>
      </Grid>
  );
};
export default CreateEditPersonComp;
