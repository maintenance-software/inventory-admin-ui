import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {FormikHelpers, useFormik} from 'formik';
import { useParams, useHistory } from 'react-router-dom';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import * as Yup from "yup";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField/TextField";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import { createStyles, Theme, MenuItem, Grid, IconButton, Button } from "@material-ui/core";

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

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

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

export const EditUserForm: React.FC<{userForm: UserForm, callback: Function}> =  ({userForm, callback}) => {
   const formClasses = useFormStyles();
   const buttonClasses = useButtonStyles();
   const history = useHistory();
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
     <>
        <Container maxWidth="sm">
           <Paper elevation={0}>
              <form className={formClasses.root}>
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

                 <Grid container  spacing={2}>
                    <Grid item xs={8}>
                       <TextField  id="username" name="username" label="Username" style={{width: '100%'}} required error={usernameField.touched && !!usernameField.error} {...username}/>
                    </Grid>
                    <Grid item xs={4}>
                       <TextField  id="email" name="email" label="Email" style={{width: '100%'}} required error={emailField.touched && !!emailField.error} {...email}/>
                    </Grid>
                    <Grid item xs={4}>
                       <TextField  id="firstName" name="firstName" label="First Name" style={{width: '100%'}} required error={firstNameField.touched && !!firstNameField.error} {...firstName}/>
                    </Grid>
                    <Grid item xs={4}>
                       <TextField  id="lastName" name="lastName" label="Last Name" style={{width: '100%'}} required error={lastNameField.touched && !!lastNameField.error} {...lastName}/>
                    </Grid>

                    <Grid item xs={3}>
                       <TextField
                          style={{width: '100%'}}
                          id="status"
                          select
                          label="Stataus"
                          {...status}
                       >
                          <MenuItem key="ACTIVE" value="ACTIVE">Active</MenuItem>
                          <MenuItem key="INACTIVE" value="INACTIVE">Inactive</MenuItem>
                          <MenuItem key="EXPIRED" value="EXPIRED">Expired</MenuItem>
                       </TextField>
                    </Grid>

                    <Grid item xs={3}>
                       <TextField
                          style={{width: '100%'}}
                          id="language"
                          select
                          label="Language"
                          {...language}
                       >
                          <MenuItem key="es_BO" value="es_BO">Español Bolivia</MenuItem>
                          <MenuItem key="en_US" value="en_US">English USA</MenuItem>
                          <MenuItem key="es_US" value="es_US">Español USA</MenuItem>
                       </TextField>
                    </Grid>

                    <Grid item xs={6}>
                       <FormControlLabel
                          control={<Checkbox {...expiration}/>}
                          label="Never Expires"
                       />
                    </Grid>

                 </Grid>
              </form>

           </Paper>
        </Container>
     </>
  );
};

