import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {FormikHelpers, useFormik} from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from "yup";
import {DocumentNode, gql} from 'apollo-boost';
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import {IUser, IUsers} from "../../../../graphql/users.type";
import {Col, CustomInput, Form, FormFeedback, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import {IPerson} from "../../../../graphql/persons.type";
import {useHistory} from "react-router";
import {GET_USER_BY_ID} from "./CreateEditUser";

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

export interface UserForm {
   username: string;
   email: string;
   firstName: string;
   lastName: string;
   status: string;
   roles: string[];
   expiration: boolean;
   language: string;
}

const EditUserForm: React.FC<IUser> =  (user) => {
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

   let history = useHistory();
   const [savePerson, { error, data, loading, called }] = useMutation<{ savePerson: {account: IUser} }, any>(SAVE_USER);
   const { values, resetForm, getFieldProps, getFieldMeta, handleSubmit, errors, dirty, isValid } = useFormik<UserForm>({
    initialValues: userForm,
    validationSchema: Yup.object().shape({
       username: Yup.string().required('Username is required'),
       email: Yup.string().required('Username is required').email('Invalid email'),
       firstName: Yup.string(),
       lastName: Yup.string().required('This filed is required'),
       // documentType: Yup.string().required(),
       // documentId: Yup.number().required('Invalid entry'),
    }),
    onSubmit: (values, bag) => {
       const mutationRequest = {
          personId: user.person.personId,
          firstName: values.firstName,
          lastName: values.lastName,
          documentType: '',
          documentId: new Date().getTime().toString(),
          userId: user.userId,
          username: values.username,
          password: '123',
          email: values.email,
          status: values.status === 'ACTIVE',
       };
       // savePerson({ variables: mutationRequest, refetchQueries: ['getUserById']});

       // const test = (mutationResult): { query: DocumentNode, variables?: any} => {
       //   return {
       //      query: GET_USER_BY_ID,
       //      variables: {userId: 5}
       //   }
       // };
       // savePerson({ variables: mutationRequest, refetchQueries: ['getUserById']});

       savePerson({ variables: mutationRequest});
    }
  });

   useEffect(() => {
      if(data && data.savePerson) {
         // console.log(data.savePerson);
         // resetForm({values: data.savePerson});
         console.log(data.savePerson.account.userId.toString());
         history.push(data.savePerson.account.userId.toString());
      }
   }, [data]);

   const username = getFieldProps('username');
   const usernameField = getFieldMeta('username');

   const email = getFieldProps('email');
   const emailField = getFieldMeta('email');

  const firstName = getFieldProps("firstName");
  const firstNameField = getFieldMeta('firstName');

   const lastName = getFieldProps("lastName");
   const lastNameField = getFieldMeta("lastName");

   // const documentType = getFieldProps("documentType");
   // const documentTypeField = getFieldMeta("documentType");

   // const documentId = getFieldProps("documentId");
   // const documentIdField = getFieldMeta("documentId");

   const status = getFieldProps('status');
   // const statusField = getFieldMeta('status');

   const language = getFieldProps('language');
   // const languageField = getFieldMeta('language');

   const expiration = getFieldProps('expiration');
   // const expirationField = getFieldMeta('expiration');

   // console.log(expiration.value);
   // documentIdField.touched && documentIdField.error
  return (
    <div style={{width:'40rem'}}>
       <Form onSubmit={handleSubmit}>
          <FormGroup>
             <Label for="username">Username</Label>
             <Input name="username" invalid={usernameField.touched && !!usernameField.error} {...username}/>
             <FormFeedback>Username is invalid</FormFeedback>
          </FormGroup>
          <FormGroup>
             <Label for="email">Email</Label>
             <Input name="email" invalid={emailField.touched && !!emailField.error} {...email}/>
             <FormFeedback>email is invalid</FormFeedback>
          </FormGroup>

          <Row form>
             <Col md={6}>
                <FormGroup>
                   <Label for="firstName">First Name</Label>
                   <Input name="email" invalid={firstNameField.touched && !!firstNameField.error} {...firstName}/>
                   <FormFeedback>First Name is Invalid</FormFeedback>
                </FormGroup>
             </Col>
             <Col md={6}>
                <FormGroup>
                   <Label for="lastName">Last Name</Label>
                   <Input name="lastName" invalid={lastNameField.touched && !!lastNameField.error} {...lastName}/>
                   <FormFeedback>Last Name is Invalid</FormFeedback>
                </FormGroup>
             </Col>
          </Row>

          <FormGroup>
             <Label for="roles">Roles</Label>
             <Input type="select" name="roles" id="roles" multiple>
                <option value="admin">Admin</option>
                <option value="test">Tester</option>
                <option value="anonymous">Anonymous</option>
             </Input>
          </FormGroup>

          <Row form>
             <Col md={6}>
                <FormGroup>
                   <Label for="status">Status</Label>
                   <Input type="select" name="status" {...status}>
                      <option value='ACTIVE'>Active</option>
                      <option value='INACTIVE'>Inactive</option>
                      <option value='EXPIRED'>Expired</option>
                   </Input>
                </FormGroup>
             </Col>
             <Col md={6}>
                <FormGroup>
                   <Label for="language">Language</Label>
                   <Input type="select" name="language" {...language}>
                      <option value='en'>English</option>
                      <option value='es'>Spanish</option>
                      <option value='fr'>French</option>
                   </Input>
                </FormGroup>
             </Col>
          </Row>
          <FormGroup check>
             <Label check>
                <Input checked={expiration.value} type="checkbox" {...expiration}/>Never Expires
             </Label>
          </FormGroup>
          <div className="d-flex w-100 justify-content-center">
             <button disabled={!isValid || !dirty} type="submit" className="w-50 btn  rounded btn-success">Send</button>
          </div>

       </Form>
    </div>
  );
};

export default EditUserForm;
