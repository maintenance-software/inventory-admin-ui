import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from "yup";
import {IPerson, IPersons} from "../../../graphql/persons.type";
import { gql } from 'apollo-boost';
import {useMutation, useQuery} from "@apollo/react-hooks";

export const GET_PERSON_BY_ID = gql`
  query ($personId: Int!){
    persons {
      person(entityId: $personId) {
         personId
         firstName
         lastName
         documentType
         documentId
         account {
            userId
            username
            email
         }
      }
    }
  }
`;

const SAVE_PERSON = gql`
  mutation savePerson($personId: Int!, $firstName: String!, $lastName: String!, $documentType: String!, $documentId: String!) {
    savePerson(personId: $personId, firstName: $firstName, lastName: $lastName, documentType: $documentType, documentId: $documentId) {
       personId
       firstName
       lastName
       documentType
       documentId
    }
  }
`;

interface IEditProps {
  person: IPerson;
}

const EditPersonForm: React.FC<IPerson> =  (person) => {
  const [savePerson, { error, data }] = useMutation<{ savePerson: IPerson }, IPerson>(SAVE_PERSON);
  const { values, getFieldProps, getFieldMeta, handleSubmit, errors, touched, isValid } = useFormik<IPerson>({
    initialValues: person,
    isInitialValid: true,
    validationSchema: Yup.object().shape({
      firstName: Yup.string(),
      lastName: Yup.string().required('This filed is required'),
      documentType: Yup.string().required(),
      documentId: Yup.number().required('Invalid entry'),
    }),
    onSubmit: (values, bag) => {
       savePerson({ variables: values });
    }
  });

  const firstName = getFieldProps("firstName");
  const firstNameField = getFieldMeta('firstName');

   const lastName = getFieldProps("lastName");
   const lastNameField = getFieldMeta("lastName");

   const documentType = getFieldProps("documentType");
   const documentTypeField = getFieldMeta("documentType");

   const documentId = getFieldProps("documentId");
   const documentIdField = getFieldMeta("documentId");

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name: </label>
          <input placeholder="first name" {...firstName} />
          {firstNameField.touched && firstNameField.error && (<span>{firstNameField.error}</span>)}
        </div>
        <div>
          <label>Last Name: </label>
          <input placeholder="last name" {...lastName} />
          {lastNameField.touched && lastNameField.error && (<span>{lastNameField.error}</span>)}
        </div>

        <div>
          <label>Document Type </label>
          <input placeholder="Document Type" {...documentType} />
          {documentTypeField.touched && documentTypeField.error && (<span>{documentTypeField.error}</span>)}
        </div>

        <div>
          <label>Document Id </label>
          <input placeholder="Document Id" {...documentId} />
          {documentIdField.touched && documentIdField.error && (<span>{documentIdField.error}</span>)}
        </div>

        <button disabled={!isValid} type="submit">Enviar</button>
      </form>
    </div>
  );
};

const EditPerson: React.FC<IEditProps> =  (props) => {
  const params = useParams();
  const [t, i18n] = useTranslation();
  useEffect(() => {

  }, []);
   const personQL = useQuery<{persons: IPersons}, any>(GET_PERSON_BY_ID, {variables: { personId: +params.personId }});
   if (personQL.loading || !personQL.data) return <div>Loading</div>;
   const person = personQL.data.persons.person;

  if(person.personId === 0) {
    return (<div>Loading...</div>);
  }

  return (
    <div>
      <EditPersonForm {...person}/>
    </div>
  );
};
export default EditPerson;
