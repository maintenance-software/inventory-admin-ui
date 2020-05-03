import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {FormikHelpers, useFormik} from 'formik';
import { useParams } from 'react-router-dom';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import Paper from "@material-ui/core/Paper/Paper";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import Button from "@material-ui/core/Button/Button";
import AddIcon from "@material-ui/core/SvgIcon/SvgIcon";
import CancelIcon from '@material-ui/icons/Cancel';
import SaveIcon from '@material-ui/icons/Save';
const useFormStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         // backgroundColor: 'blue',
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

export interface IPersonFormProps {
   firstName: string;
   lastName: string;
   email: string;
   documentId: string;
   address: string;
   city: string;
   state: string;
   country: string;
   workPhone: string;
   cellPhone: string;
   whatsapp: string;
   onSavePersonCallback: Function;
}

const EditPersonForm: React.FC<IPersonFormProps> =  (props) => {
   const formClasses = useFormStyles();
   const selectFormClasses = useSelectFormStyles();
   const buttonClasses = useButtonStyles();
   const [age, setAge] = React.useState('CI');
   const { values, resetForm, getFieldProps, getFieldMeta, handleSubmit, errors, dirty, isValid } = useFormik<IPersonFormProps>({
    initialValues: props,
    validationSchema: Yup.object().shape({
       firstName: Yup.string(),
       lastName: Yup.string().required('This filed is required'),
       email: Yup.string().required('Username is required').email('Invalid email'),
       documentId: Yup.number().required('This filed is required')
    }),
    onSubmit: (values, bag) => {
       props.onSavePersonCallback(values, bag.resetForm);
    }
  });

  const firstName = getFieldProps("firstName");
  const firstNameField = getFieldMeta('firstName');

   const lastName = getFieldProps("lastName");
   const lastNameField = getFieldMeta("lastName");

   const email = getFieldProps('email');
   const emailField = getFieldMeta('email');

   const documentId = getFieldProps("documentId");
   const documentIdField = getFieldMeta("documentId");

   const address = getFieldProps("address");
   const addressField = getFieldMeta("address");

   const city = getFieldProps("city");
   const cityField = getFieldMeta("city");

   const state = getFieldProps("state");
   const stateField = getFieldMeta("state");

   const country = getFieldProps("country");
   const countryField = getFieldMeta("country");

   const workPhone = getFieldProps("workPhone");
   const workPhoneField = getFieldMeta("workPhone");

   const cellPhone = getFieldProps("cellPhone");
   const cellPhoneField = getFieldMeta("cellPhone");

   const whatsapp = getFieldProps("whatsapp");
   const whatsappField = getFieldMeta("whatsapp");


   const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setAge(event.target.value as string);
   };

  return (
    <Grid container>
       <form className={formClasses.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container wrap='nowrap'>
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
             <Grid item container xs={6} spacing={2}>
                <Grid item xs={12}><TextField style={{width: '100%'}} error={firstNameField.touched && !!firstNameField.error} id="first-name" label="First Name" {...firstName}/></Grid>
                <Grid item xs={12}><TextField style={{width: '100%'}} required error={lastNameField.touched && !!lastNameField.error} id="last-name" label="Last Name" {...lastName}/></Grid>
                <Grid item xs={12}><TextField style={{width: '100%'}} required error={emailField.touched && !!emailField.error} id="email" label="Email" {...email}/></Grid>
             </Grid>
             <Grid item xs={6}></Grid>
          </Grid>
          <Grid container  spacing={2}>
             <Grid item xs={4}>
                <TextField  id="document-id" label="Document Id" required error={documentIdField.touched && !!documentIdField.error} {...documentId}/>
             </Grid>
             <Grid item xs={8}>
                <TextField  id="address" label="Address" style={{width: '100%'}} {...address}/>
             </Grid>
          </Grid>
          <Grid container spacing={2}>
             <Grid item xs={4}><TextField  id="city" label="City" {...city}/></Grid>
             <Grid item xs={4}><TextField  id="state" label="State" {...state}/></Grid>
             <Grid item xs={4}><TextField  id="country" label="Country" {...country}/></Grid>
          </Grid>

          <Grid container spacing={2}>
             <Grid item xs={4}><TextField  id="work-phone" label="Work Phone" {...workPhone}/></Grid>
             <Grid item xs={4}><TextField  id="cell-phone" label="Cell Phone" {...cellPhone}/></Grid>
             <Grid item xs={4}><TextField  id="whatsapp" label="Whatsapp" {...whatsapp}/></Grid>
          </Grid>

       </form>
    </Grid>
  );
};

export default EditPersonForm;
