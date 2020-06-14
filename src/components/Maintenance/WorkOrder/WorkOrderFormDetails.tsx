import React, { useState, useEffect, useContext, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step, DialogTitle, DialogActions, FormLabel, MenuItem, FormControl, InputLabel, Modal} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import Radio from '@material-ui/core/Radio';
import IconButton from "@material-ui/core/IconButton/IconButton";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import {useHistory} from "react-router";
import {useParams, useRouteMatch} from 'react-router-dom';
import Select from '@material-ui/core/Select';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import {FETCH_EMPLOYEES, IEmployeesQL, PersonQL} from "../../../graphql/Person.ql";
import {buildFullName} from "../../../utils/globalUtil";
import {ISimpleSelectorOption, SimpleSelector} from "../../common/SimpleSelector";
import {IWorkOrderForm} from "./WorkOrderContainer";

const useDateStyles = makeStyles((theme: Theme) =>
   createStyles({
      container: {
         // display: 'flex',
         // flexWrap: 'wrap',
         width: '100%'
      },
      textField: {
         marginLeft: theme.spacing(1),
         marginRight: theme.spacing(1),
         width: 200,
      },
   }),
);

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

export const WorkOrderFormDetails: React.FC<{onSubmit(values: IWorkOrderForm): void, form: IWorkOrderForm}> =  ({onSubmit, form}) => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const params = useParams();
   const buttonClasses = useButtonStyles();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   // const [responsibleId, setResponsibleId] = useState(0);
   const [fetchEmployees, { called, loading, data }] = useLazyQuery<{employees: IEmployeesQL}, any>(FETCH_EMPLOYEES);


   const {getFieldProps, getFieldMeta, setFieldValue, handleSubmit, submitForm} = useFormik<IWorkOrderForm>({
      enableReinitialize: true,
      initialValues: form,
      validationSchema: Yup.object().shape({
         estimateDurationDD: Yup.number().moreThan(-1),
         estimateDurationHH: Yup.number().moreThan(-1).lessThan(24),
         estimateDurationMM: Yup.number().moreThan(-1).lessThan(60),
      }),
      onSubmit: (values, bag) => {
         onSubmit(values);
      }
   });

   useEffect(() => {
      fetchEmployees({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize}});
   }, []);

   useEffect(() => {
      fetchEmployees({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize}});
   }, [pageIndex, pageSize, searchString]);

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const handleSearch = (searchString: string) => {
      setSearchString(searchString);
      setPageIndex(0);
   };

   const fetchEmployeeOptions = (): ISimpleSelectorOption[] => {
      if(data && data.employees) {
         return data.employees.page.content.map(e => ({
            value: e.employeeId,
            label: buildFullName(e.firstName, e.lastName)
         }));
      }
      return [];
   };

   const workOrderCode = getFieldProps('workOrderCode');
   const responsible = getFieldProps('responsible');

   const estimateDurationDD = getFieldProps('estimateDurationDD');
   const estimateDurationDDField = getFieldMeta('estimateDurationDD');
   const estimateDurationHH = getFieldProps('estimateDurationHH');
   const estimateDurationHHField = getFieldMeta('estimateDurationHH');
   const estimateDurationMM = getFieldProps('estimateDurationMM');
   const estimateDurationMMField = getFieldMeta('estimateDurationMM');

   const executionDurationDD = getFieldProps('executionDurationDD');
   const executionDurationHH = getFieldProps('executionDurationHH');
   const executionDurationMM = getFieldProps('executionDurationMM');

   return (
     <>
        <Grid container>
           <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid style={{marginBottom: '1rem'}}>
                 <Grid container wrap='nowrap' style={{marginBottom: '1rem'}}>
                    <Button
                       variant="contained"
                       color="primary"
                       startIcon={<SaveIcon/>}
                       className={buttonClasses.button}
                       type="submit"
                    >
                       Save
                    </Button>
                 </Grid>
                 <Grid container  spacing={2}>
                    <Grid item xs={4}>
                       <TextField  id="workOrderCode" label="Work Order Code" InputProps={{ readOnly: true}}  style={{width: '100%'}} {...workOrderCode}/>
                    </Grid>
                    <Grid item xs={4}>
                       <Grid container  spacing={2}>
                          <Grid item xs={4} container alignItems='center' justify='flex-end'>
                             Estimate duration
                          </Grid>
                          <Grid item xs={2}>
                             <TextField  id="estimateDurationDD" label="DD" style={{width: '100%'}} error={estimateDurationDDField.touched && !!estimateDurationDDField.error} {...estimateDurationDD}/>
                          </Grid>
                          <Grid item xs={2}>
                             <TextField  id="estimateDurationHH" label="HH" style={{width: '100%'}} error={estimateDurationHHField.touched && !!estimateDurationHHField.error} {...estimateDurationHH}/>
                          </Grid>
                          <Grid item xs={2}>
                             <TextField  id="estimateDurationMM" label="MM" style={{width: '100%'}} error={estimateDurationMMField.touched && !!estimateDurationMMField.error} {...estimateDurationMM}/>
                          </Grid>
                       </Grid>
                    </Grid>

                    <Grid item xs={4}>
                       <Grid container  spacing={2}>
                          <Grid item xs={4} container alignItems='center' justify='flex-end'>
                             Execution duration
                          </Grid>
                          <Grid item xs={2}>
                             <TextField  id="executionDurationDD" label="DD" InputProps={{readOnly: true}} style={{width: '100%'}} {...executionDurationDD}/>
                          </Grid>
                          <Grid item xs={2}>
                             <TextField  id="executionDurationHH" label="HH" InputProps={{readOnly: true}} style={{width: '100%'}} {...executionDurationHH}/>
                          </Grid>
                          <Grid item xs={2}>
                             <TextField  id="executionDurationMM" label="MM" InputProps={{readOnly: true}} style={{width: '100%'}} {...executionDurationMM}/>
                          </Grid>
                       </Grid>
                    </Grid>

                    <Grid item xs={2} container alignItems='center'>Gererated By</Grid>
                    <Grid item xs={4}>{form.generatedBy.fullName}</Grid>

                    <Grid item xs={2} container alignItems='center'>
                       Responsible
                    </Grid>
                    <Grid item xs={4}>
                       <SimpleSelector
                          value={responsible.value.personId}
                          options={fetchEmployeeOptions()}
                          paging={{
                             pageIndex: data? data.employees.page.pageInfo.pageIndex : 0,
                             pageSize: data? data.employees.page.pageInfo.pageSize : 0,
                             totalCount: data? data.employees.page.totalCount : 0,
                             searchString: searchString,
                             onChangePage: handleChangePage,
                             onSearch: handleSearch,
                          }}
                          onChange={(value : number) => setFieldValue('responsible', {personId: value})}
                       />
                    </Grid>


                 </Grid>
              </Grid>
           </form>
        </Grid>
     </>
  );
};
