import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { IPerson } from '../../../api/person/persons.api';
import { getPersonByIdThunk } from '../../../store/actions/persons.action';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { useParams } from 'react-router-dom';

interface IEditProps {
  person: IPerson;
};

const EditPerson: React.FC<IEditProps> =  (props) => {
  const params = useParams();
  const [t, i18n] = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPersonByIdThunk(params.personId));
  }, []);

  const person: IPerson|null = useSelector((state: IRootState) => state.personScope.person);

  // console.log(person);
  if(!person) {
    return (<div>Loading...</div>);
  }

  return (
    <div>
      <Formik
        initialValues={person}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          // actions.setErrors(transformMyRestApiErrorsToAnObject(error));
          actions.setStatus({ msg: 'Set some arbitrary status or data' });
        }}
        render={({ errors, status, touched, isSubmitting }) => (
          <Form>
            <Field type="text" name="firstName" />
            <ErrorMessage name="firstName" component="div" />  
            <Field type="text" className="error" name="lastName" />
            <ErrorMessage name="lastName">
              {errorMessage => <div className="error">{errorMessage}</div>}
            </ErrorMessage>
            {status && status.msg && <div>{status.msg}</div>}
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </Form>
        )}
      />
    </div>
  );
};
export default EditPerson;