import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {FormikHelpers, useFormik} from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from "yup";
import {Col, CustomInput, Form, FormFeedback, FormGroup, FormText, Input, Label, Row} from "reactstrap";

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

const EditUserForm: React.FC<{userForm: UserForm, callback: Function}> =  ({userForm, callback}) => {
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
       callback(values, bag.resetForm);
    }
  });
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
