import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {FormikHelpers, useFormik} from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from "yup";
import {Col, CustomInput, Form, FormFeedback, FormGroup, FormText, Input, Label, Row} from "reactstrap";
import { ICategory, Units } from '../../../graphql/item.type';
import { isNumber } from 'util';

export interface ItemForm {
  name: string;
  description: string;
  unit: string;
  defaultPrice: number;
  categoryId: number;
}

const EditUserForm: React.FC<{userForm: ItemForm, categories: ICategory[], callback: Function}> =  ({userForm, categories, callback}) => {
   const { values, resetForm, getFieldProps, getFieldMeta, handleSubmit, errors, dirty, isValid } = useFormik<ItemForm>({
    initialValues: userForm,
    validationSchema: Yup.object().shape({
       name: Yup.string().required('Name is required'),
       description: Yup.string(),
       unit: Yup.string().required('Unit is required'),
       defaultPrice: Yup.number().required(),
       categoryId: Yup.number().required('Category is required').moreThan(0),
    }),
    onSubmit: (values, bag) => {
       callback(values, bag.resetForm);
    }
  });

   const name = getFieldProps('name'); const nameField = getFieldMeta('name');
   const description = getFieldProps('description'); const descriptionField = getFieldMeta('description');
   const defaultPrice = getFieldProps('defaultPrice'); const defaultPriceField = getFieldMeta('defaultPrice');
   const unit = getFieldProps('unit'); const unitField = getFieldMeta('unit');
   const categoryId = getFieldProps('categoryId'); const categoryIdField = getFieldMeta('categoryId');

  return (
    <div style={{width:'40rem'}}>
       <Form onSubmit={handleSubmit}>
          <FormGroup>
             <Label for="name">Name</Label>
             <Input name="name" invalid={nameField.touched && !!nameField.error} {...name}/>
             <FormFeedback>Username is invalid</FormFeedback>
          </FormGroup>
          <FormGroup>
             <Label for="description">Description</Label>
             <Input name="description" invalid={descriptionField.touched && !!descriptionField.error} {...description}/>
             <FormFeedback>Description is invalid</FormFeedback>
          </FormGroup>

          <FormGroup>
             <Label for="defaultPrice">Default</Label>
             <Input name="defaultPrice" invalid={defaultPriceField.touched && !!defaultPriceField.error} {...defaultPrice}/>
             <FormFeedback>Default Price is invalid</FormFeedback>
          </FormGroup>


          <FormGroup>
             <Label for="unit">Unit</Label>
             <Input type="select" name="unit" id="unit" {...unit}>
               <option value="">--Select--</option>
               {Object.values(Units).filter(u => !isNumber(u)).map(u => (<option value={u}>{u}</option>))}
             </Input>
          </FormGroup>

         <FormGroup>
            <Label for="category">Category</Label>
            <Input type="select" name="category" id="category" {...categoryId}>
               <option value="">--Select--</option>
               {categories.map(c => (<option value={c.categoryId}>{c.name}</option>))}
            </Input>
         </FormGroup>
          
          <div className="d-flex w-100 justify-content-center">
             <button disabled={!isValid || !dirty} type="submit" className="w-50 btn  rounded btn-success">Send</button>
          </div>

       </Form>
    </div>
  );
};

export default EditUserForm;
