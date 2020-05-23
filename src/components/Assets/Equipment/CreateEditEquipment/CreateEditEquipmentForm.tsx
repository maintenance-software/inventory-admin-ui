import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { createStyles, Theme, FormControlLabel, Checkbox } from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import {useHistory} from "react-router";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {EntityStatus} from "../../../../graphql/users.type";
const useFormStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         height: '50%',
         width: '100%',
         '& > *': {
            margin: theme.spacing(1),
            // width: 200,
         },
      },
   }),
);

const useSelectFormStyles = makeStyles((theme: Theme) =>
   createStyles({
      formControl: {
         margin: theme.spacing(1),
         minWidth: 120,
      },
      selectEmpty: {
         marginTop: theme.spacing(2),
      },
   }),
);

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

export interface IEquipmentFormProps {
   equipmentForm: IEquipmentForm;
   onSaveEquipmentCallback: Function;
}

export interface IEquipmentForm {
   name: string;
   description: string;
   code: string;
   partNumber: string;
   manufacturer: string;
   model: string;
   notes: string;
   status: EntityStatus;
   images: string[];
   priority: number;
   hoursAverageDailyUse: number;
   outOfService: boolean;
   purchaseDate: string;
}

export const EditEquipmentForm: React.FC<IEquipmentFormProps> =  ({equipmentForm, onSaveEquipmentCallback}) => {
   const history = useHistory();
   const formClasses = useFormStyles();
   const buttonClasses = useButtonStyles();
   const { values, setFieldValue, resetForm, getFieldProps, getFieldMeta, handleSubmit, errors, dirty, isValid } = useFormik<IEquipmentForm>({
      enableReinitialize: true,
      initialValues: equipmentForm,
       validationSchema: Yup.object().shape({
          name: Yup.string().required('This filed is required'),
          code: Yup.string().required('code requiresd'),
          priority: Yup.number(),
          hoursAverageDailyUse: Yup.number()
       }),

       onSubmit: (values, bag) => {
          onSaveEquipmentCallback(values, bag.resetForm);
       }
   });

   const name = getFieldProps("name");
   const nameField = getFieldMeta('name');
   const code = getFieldProps("code");
   const codeField = getFieldMeta('code');
   const description = getFieldProps("description");
   const manufacturer = getFieldProps("manufacturer");
   const model = getFieldProps("model");
   const partNumber = getFieldProps("partNumber");
   const priority = getFieldProps("priority");
   const hoursAverageDailyUse = getFieldProps("hoursAverageDailyUse");
   const outOfService = getFieldProps("outOfService");
   const purchaseDate = getFieldProps("purchaseDate");
   const parentName = getFieldProps("parentName");

   return (
      <Grid container>
         <form className={formClasses.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container wrap='nowrap'>
               <IconButton aria-label="go-back" size="small" className={buttonClasses.button} onClick={() => history.goBack()}>
                  <ArrowBackIcon/>
               </IconButton>
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<SaveIcon/>}
                  className={buttonClasses.button}
                  disabled={!isValid || !dirty}
                  type="submit"
               >
                  Save
               </Button>
               <Button
                  variant="contained"
                  color="secondary"
                  size='small'
                  startIcon={<CancelIcon/>}
                  className={buttonClasses.button}
                  onClick={() => resetForm()}
                  disabled={!dirty}
               >
                  Reset
               </Button>
            </Grid>

            <Grid container>
               <Grid container  spacing={2}>
                  <Grid item xs={8}>
                     <TextField  id="name" label="Name" style={{width: '100%'}} required error={nameField.touched && !!nameField.error} {...name}/>
                  </Grid>
                  <Grid item xs={4}>
                     <TextField  id="code" label="Code" style={{width: '100%'}} required error={codeField.touched && !!codeField.error} {...code}/>
                  </Grid>
                  <Grid item xs={12}>
                     <TextField  id="description" label="Description" style={{width: '100%'}} {...description}/>
                  </Grid>
               </Grid>
            </Grid>

            <Grid container spacing={2}>
               <Grid item xs={4}><TextField  id="manufacturer" label="Manufacturer" {...manufacturer}/></Grid>
               <Grid item xs={4}><TextField  id="model" label="Model" {...model}/></Grid>
               <Grid item xs={4}><TextField  id="partNumber" label="Part Number" {...partNumber}/></Grid>
            </Grid>

            <Grid container spacing={2}>
               <Grid item xs={4}>
                  <FormControlLabel
                     control={<Checkbox color="primary" checked={outOfService.value} name="outOfService" {...outOfService}/>}
                     label="Out of service"
                  />
               </Grid>
               <Grid item xs={4}>
                  <TextField
                     id="date"
                     label="Purchase Date"
                     type="date"
                     InputLabelProps={{
                        shrink: true,
                     }}
                     {...purchaseDate}
                  />
               </Grid>
               <Grid item xs={2}><TextField  id="priority" label="Priority" {...priority}/></Grid>
               <Grid item xs={2}><TextField  id="hoursAverageDailyUse" label="Average daily use" {...hoursAverageDailyUse}/></Grid>
            </Grid>
         </form>
      </Grid>
   );
};
