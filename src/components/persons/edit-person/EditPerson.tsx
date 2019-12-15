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
  const { getFieldProps, handleSubmit, errors, touched, isValid } = useFormik<IPerson>({
    initialValues: person,
    isInitialValid: true,
    validationSchema: Yup.object().shape({
      firstName: Yup.string(),
      lastName: Yup.string().required('This filed is required'),
      documentType: Yup.string().required(),
      documentId: Yup.number().required('Invalid entry'),
    }),
    onSubmit: (values, bag) => {
      console.log(values);
       savePerson({ variables: values });
    }
  });
  const [firstName, firstNameField] = getFieldProps("firstName", "text");
  const [lastName, lastNameField] = getFieldProps("lastName", "text");
  const [documentType, documentTypeField] = getFieldProps("documentType", "text");
  const [documentId, documentIdField] = getFieldProps("documentId", "number");
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name: </label>
          <input placeholder="first name" {...firstName} />
          {firstNameField.touch && firstNameField.error && (<span>{firstNameField.error}</span>)}
        </div>
        <div>
          <label>Last Name: </label>
          <input placeholder="last name" {...lastName} />
          {lastNameField.touch && lastNameField.error && (<span>{lastNameField.error}</span>)}
        </div>

        <div>
          <label>Document Type </label>
          <input placeholder="Document Type" {...documentType} />
          {documentTypeField.touch && documentTypeField.error && (<span>{documentTypeField.error}</span>)}
        </div>

        <div>
          <label>Document Id </label>
          <input placeholder="Document Id" {...documentId} />
          {documentIdField.touch && documentIdField.error && (<span>{documentIdField.error}</span>)}
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
