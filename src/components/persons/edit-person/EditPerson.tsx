import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Field, Form, ErrorMessage, useFormik } from 'formik';
import { IPerson } from '../../../api/person/persons.api';
import { getPersonByIdThunk, savePersonThunk } from '../../../store/actions/persons.action';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { useParams } from 'react-router-dom';
import * as Yup from "yup";

interface IEditProps {
  person: IPerson;
};

const EditPersonForm: React.FC<IPerson> =  (person) => {
  const dispatch = useDispatch();
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
      dispatch(savePersonThunk(values));
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
}

const EditPerson: React.FC<IEditProps> =  (props) => {
  const params = useParams();
  const [t, i18n] = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPersonByIdThunk(params.personId));
  }, []);

  const person: IPerson = useSelector((state: IRootState) => state.personScope.person);

  console.log(person);

  
  //setValues(person);

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